
import { GoogleGenAI, Modality, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const speakText = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("Speech generation failed:", error);
    // Fallback to web speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const analyzeSpeech = async (userSpeech: string, targetText: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Compare the user's spoken text: "${userSpeech}" with the target text: "${targetText}". 
    Provide feedback in simple Hindi (written in Hindi script). 
    Focus on encouraging the user. 
    1. Accuracy percentage.
    2. One tip for improvement in easy Hindi.
    Keep the feedback very short and beginner-friendly.`,
  });
  return response.text;
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], isTutorMode: boolean = false) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: history,
    config: {
      systemInstruction: `You are an English speaking partner and teacher for beginners in India. 
      ${isTutorMode ? 
        `You are in TUTOR MODE. Your primary goal is to teach:
        1. If the user makes a grammar mistake in their English input, correct it and explain the grammatical rule in simple Hindi.
        2. If the user asks "What does [word] mean?" or similar vocabulary questions using voice, provide a clear meaning, usage example, and Hindi explanation.
        3. If asked about grammar (e.g., "When to use 'have'?"), provide a structured explanation in Hindi.
        4. Always maintain a friendly, encouraging tone.
        5. Use simple Hindi script for all teaching points.` : 
        `You are in CONVERSATION MODE. Focus on keeping a natural flow. Respond in simple English and provide a direct Hindi translation.`
      }
      Format your response as a JSON object with keys "english", "hindi", and "explanation".
      "english": Your conversational response or direct answer in English.
      "hindi": The Hindi translation of your English response.
      "explanation": In Tutor Mode, use this for the grammatical correction or word meaning in Hindi. In Conversation Mode, leave this empty.
      Example Tutor Response: {"english": "The correct sentence is 'He goes to school' because 'He' is third person singular.", "hindi": "सही वाक्य 'He goes to school' है क्योंकि 'He' के साथ 'goes' का प्रयोग होता है।", "explanation": "Grammar Tip: Third person singular (He/She/It) के साथ verb में 's' या 'es' लगता है।" }`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          english: { type: Type.STRING },
          hindi: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["english", "hindi", "explanation"]
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("JSON parse error", e);
    return { english: response.text, hindi: "", explanation: "" };
  }
};
