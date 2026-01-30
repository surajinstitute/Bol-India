
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { AppView, UserProgress, Lesson, Phrase } from './types';
import { LESSONS, VOCABULARY } from './constants';
import SpeakingPractice from './components/SpeakingPractice';
import AIConversation from './components/AIConversation';
import { speakText } from './services/audioService';
import { Play, CheckCircle, ChevronRight, MessageSquare, Award, BookOpen, Volume2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [progress, setProgress] = useState<UserProgress>({
    completedLessons: [],
    totalPoints: 0,
    streak: 1
  });
  const [activePhrase, setActivePhrase] = useState<Phrase | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('bol_india_progress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('bol_india_progress', JSON.stringify(newProgress));
  };

  const completePhrase = () => {
    const newProgress = {
      ...progress,
      totalPoints: progress.totalPoints + 10,
    };
    saveProgress(newProgress);
    setActivePhrase(null);
  };

  const renderDashboard = () => (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-100">
        <h2 className="text-2xl font-bold mb-1 hindi">नमस्ते! आज कुछ नया सीखें</h2>
        <p className="opacity-90 mb-6">Master daily English conversations.</p>
        <div className="flex gap-4">
          <div className="bg-white/20 p-3 rounded-2xl flex-1 backdrop-blur-sm">
            <p className="text-xs uppercase font-bold opacity-75 mb-1">Total Points</p>
            <p className="text-2xl font-bold">{progress.totalPoints}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl flex-1 backdrop-blur-sm">
            <p className="text-xs uppercase font-bold opacity-75 mb-1">Streak</p>
            <p className="text-2xl font-bold">{progress.streak} Day</p>
          </div>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-slate-800">Quick Practice</h3>
          <button onClick={() => setView(AppView.LESSONS)} className="text-orange-600 text-sm font-semibold flex items-center">
            See All <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {LESSONS.slice(0, 4).map(lesson => (
            <button 
              key={lesson.id}
              onClick={() => setView(AppView.LESSONS)}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left hover:border-orange-200 transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{lesson.icon}</div>
              <p className="font-bold text-slate-900 leading-tight mb-1">{lesson.title}</p>
              <p className="text-xs text-slate-500 hindi">{lesson.hindiTitle}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">AI Speaking Partner</h3>
          <p className="text-blue-100 text-sm mb-4">Practice real-life conversations with our AI teacher. It's safe and helpful!</p>
          <button 
            onClick={() => setView(AppView.CONVERSATION)}
            className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-blue-50 transition-colors"
          >
            Start Talking
          </button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-10 opacity-20">
          <MessageSquare size={80} />
        </div>
      </section>
    </div>
  );

  const renderLessons = () => (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="text-orange-600" />
        <h2 className="text-xl font-bold">Daily Lessons</h2>
      </div>
      {LESSONS.map((lesson) => (
        <div key={lesson.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900">{lesson.title}</h3>
              <p className="text-xs text-slate-500 hindi">{lesson.hindiTitle}</p>
            </div>
            <span className="text-2xl">{lesson.icon}</span>
          </div>
          <div className="p-2">
            {lesson.phrases.map((phrase) => (
              <div key={phrase.id} className="p-3 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{phrase.english}</p>
                  <p className="text-xs text-slate-500 hindi">{phrase.hindi}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => speakText(phrase.english)}
                    className="p-2 text-slate-400 hover:text-orange-500"
                  >
                    <Volume2 size={18} />
                  </button>
                  <button 
                    onClick={() => setActivePhrase(phrase)}
                    className="p-2 bg-orange-50 text-orange-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderVocabulary = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Award className="text-orange-600" />
        <h2 className="text-xl font-bold">Daily Vocabulary</h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {VOCABULARY.map(v => (
          <div key={v.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-xl uppercase">
              {v.english[0]}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-slate-900">{v.english}</h3>
                <button onClick={() => speakText(v.english)} className="text-slate-300 hover:text-orange-500 transition-colors">
                  <Volume2 size={18} />
                </button>
              </div>
              <p className="text-sm text-slate-600 hindi mb-2">{v.hindi}</p>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/50">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-1">Example</p>
                <p className="text-sm italic text-slate-700">"{v.example}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderView = () => {
    switch(view) {
      case AppView.LESSONS: return renderLessons();
      case AppView.VOCABULARY: return renderVocabulary();
      case AppView.CONVERSATION: return <AIConversation onBack={() => setView(AppView.DASHBOARD)} />;
      default: return renderDashboard();
    }
  };

  return (
    <Layout currentView={view} setView={setView} points={progress.totalPoints}>
      {renderView()}
      {activePhrase && (
        <SpeakingPractice 
          phrase={activePhrase} 
          onClose={() => setActivePhrase(null)}
          onComplete={completePhrase}
        />
      )}
    </Layout>
  );
};

export default App;
