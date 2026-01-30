
import React, { useState, useEffect, useCallback } from 'react';
import { Phrase } from '../types';
import { Mic, Volume2, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { speakText, analyzeSpeech } from '../services/audioService';

interface Props {
  phrase: Phrase;
  onClose: () => void;
  onComplete: () => void;
}

const SpeakingPractice: React.FC<Props> = ({ phrase, onClose, onComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize Speech Recognition
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserTranscript(transcript);
      handleAnalysis(transcript);
    };
    recognition.onerror = () => setIsListening(false);

    recognition.start();
  }, [phrase.english]);

  const handleAnalysis = async (transcript: string) => {
    setIsLoading(true);
    try {
      const fb = await analyzeSpeech(transcript, phrase.english);
      setFeedback(fb || "बहुत अच्छे!");
      if (fb?.includes('100') || fb?.toLowerCase().includes('good') || transcript.toLowerCase() === phrase.english.toLowerCase()) {
        setIsSuccess(true);
        setTimeout(onComplete, 3000);
      }
    } catch (e) {
      setFeedback("फिर से कोशिश करें।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-md mx-auto">
      <div className="p-4 flex items-center gap-4 border-b">
        <button onClick={onClose}><ArrowLeft /></button>
        <h2 className="text-lg font-bold">Speaking Practice</h2>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-8 justify-center items-center text-center">
        <div className="space-y-4">
          <p className="text-2xl text-slate-500 hindi">{phrase.hindi}</p>
          <div className="flex items-center justify-center gap-3">
            <h3 className="text-3xl font-bold text-slate-900">{phrase.english}</h3>
            <button 
              onClick={() => speakText(phrase.english)}
              className="p-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200"
            >
              <Volume2 size={24} />
            </button>
          </div>
          <p className="text-sm text-slate-400 hindi italic bg-slate-100 p-2 rounded">{phrase.explanation}</p>
        </div>

        {userTranscript && (
          <div className="w-full space-y-2 animate-in fade-in slide-in-from-bottom-4">
            <p className="text-xs uppercase text-slate-400 font-bold tracking-widest">You said:</p>
            <p className="text-xl font-semibold text-blue-600">"{userTranscript}"</p>
          </div>
        )}

        {feedback && (
          <div className={`p-4 rounded-xl w-full hindi flex items-start gap-3 ${isSuccess ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
            {isSuccess ? <CheckCircle2 className="shrink-0" /> : <AlertCircle className="shrink-0" />}
            <p className="text-left">{feedback}</p>
          </div>
        )}

        <div className="mt-auto pb-12 w-full flex flex-col items-center gap-6">
          <button 
            disabled={isLoading}
            onClick={startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-500 scale-110 shadow-xl shadow-red-200' 
                : 'bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-100'
            }`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-white" size={40} />
            ) : (
              <Mic className={`text-white ${isListening ? 'animate-pulse' : ''}`} size={40} />
            )}
          </button>
          <p className="font-medium text-slate-500">
            {isListening ? "Listening..." : "Tap to Speak"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPractice;
