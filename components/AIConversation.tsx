
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Volume2, ArrowLeft, Loader2, Sparkles, GraduationCap, Info, HelpCircle } from 'lucide-react';
import { speakText, getChatResponse } from '../services/audioService';

interface Message {
  role: 'user' | 'model';
  english: string;
  hindi?: string;
  explanation?: string;
}

interface Props {
  onBack: () => void;
}

const TUTOR_SUGGESTIONS = [
  "What does 'Beautiful' mean?",
  "How to use 'have' and 'has'?",
  "Correct my grammar",
  "Explain 'Past Tense'"
];

const AIConversation: React.FC<Props> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isTutorMode, setIsTutorMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Initial greeting
  useEffect(() => {
    const greet = async () => {
      setIsThinking(true);
      const history = [
        { role: 'user', parts: [{ text: "Start our conversation with a warm greeting." }] }
      ];
      const response = await getChatResponse(history, isTutorMode);
      const aiMsg: Message = { 
        role: 'model', 
        english: response.english, 
        hindi: response.hindi,
        explanation: response.explanation 
      };
      setMessages([aiMsg]);
      speakText(response.english);
      setIsThinking(false);
    };
    greet();
  }, []);

  const handleUserInput = async (text: string) => {
    const userMsg: Message = { role: 'user', english: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    
    setIsThinking(true);
    
    const history = updatedMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.english }]
    }));

    try {
      const response = await getChatResponse(history, isTutorMode);
      const aiMsg: Message = { 
        role: 'model', 
        english: response.english, 
        hindi: response.hindi,
        explanation: response.explanation 
      };
      setMessages(prev => [...prev, aiMsg]);
      speakText(response.english);
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleUserInput(transcript);
    };
    recognition.start();
  }, [messages, isTutorMode]);

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col max-w-md mx-auto">
      <div className="p-4 flex flex-col gap-2 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Bol India AI <Sparkles size={16} className="text-orange-500 fill-orange-500" />
              </h2>
            </div>
          </div>
          
          <button 
            onClick={() => setIsTutorMode(!isTutorMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              isTutorMode 
                ? 'bg-purple-100 text-purple-700 border-purple-200' 
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <GraduationCap size={14} />
            {isTutorMode ? "TUTOR MODE ON" : "CONVERSATION"}
          </button>
        </div>
        {isTutorMode && (
          <p className="text-[10px] text-purple-600 font-medium px-2 flex items-center gap-1">
            <Info size={10} /> Speak to ask about words or grammar!
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-orange-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-100 rounded-bl-none text-slate-800'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-base font-medium leading-relaxed">{msg.english}</p>
                {msg.role === 'model' && (
                  <button 
                    onClick={() => speakText(msg.english)}
                    className="shrink-0 p-1 text-slate-400 hover:text-orange-500"
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
              {msg.hindi && (
                <p className="mt-2 text-sm text-slate-500 hindi border-t border-slate-100 pt-2 opacity-90 leading-relaxed">
                  {msg.hindi}
                </p>
              )}
              {msg.explanation && (
                <div className="mt-3 bg-purple-50 p-3 rounded-xl border border-purple-100 flex gap-2">
                  <GraduationCap size={16} className="text-purple-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Teacher's Note</p>
                    <p className="text-xs text-purple-700 hindi leading-relaxed">
                      {msg.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-2 text-slate-400 shadow-sm">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm font-medium">{isTutorMode ? "Teacher is explaining..." : "AI is thinking..."}</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        {isTutorMode && !isListening && !isThinking && (
          <div className="flex flex-wrap gap-2 mb-2 justify-center">
            {TUTOR_SUGGESTIONS.map((suggestion, i) => (
              <button 
                key={i}
                onClick={() => handleUserInput(suggestion)}
                className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-purple-50 hover:text-purple-600 border border-slate-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex flex-col items-center gap-3">
          <button 
            disabled={isThinking || isListening}
            onClick={startListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-500 scale-110 shadow-xl shadow-red-200' 
                : 'bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-100 disabled:opacity-50'
            }`}
          >
            {isListening ? (
              <div className="relative">
                <div className="absolute inset-0 animate-ping bg-white/30 rounded-full"></div>
                <Mic className="text-white relative z-10" size={28} />
              </div>
            ) : (
              <Mic className="text-white" size={28} />
            )}
          </button>
          <div className="text-center">
            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-[0.2em] mb-1">
              {isListening ? "Listening..." : "Tap and ask a question"}
            </p>
            {isTutorMode && (
              <p className="text-[10px] text-purple-400 hindi italic">
                पूछें: "What is the meaning of 'Excellent'?"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConversation;
