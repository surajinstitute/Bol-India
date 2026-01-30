
import React from 'react';
import { AppView } from '../types';
import { Home, BookOpen, MessageCircle, Star, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  points: number;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, points }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 relative border-x border-slate-200">
      {/* Header */}
      <header className="bg-orange-600 text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-lg">
            <span className="text-xl">🇮🇳</span>
          </div>
          <h1 className="text-xl font-bold">Bol India</h1>
        </div>
        <div className="flex items-center bg-orange-700/50 px-3 py-1 rounded-full gap-1">
          <Star size={16} fill="white" />
          <span className="font-semibold">{points}</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 py-3 px-6 flex justify-between items-center z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <NavButton 
          active={currentView === AppView.DASHBOARD} 
          onClick={() => setView(AppView.DASHBOARD)} 
          icon={<Home size={22} />} 
          label="Home" 
        />
        <NavButton 
          active={currentView === AppView.LESSONS} 
          onClick={() => setView(AppView.LESSONS)} 
          icon={<BookOpen size={22} />} 
          label="Lessons" 
        />
        <NavButton 
          active={currentView === AppView.CONVERSATION} 
          onClick={() => setView(AppView.CONVERSATION)} 
          icon={<MessageCircle size={22} />} 
          label="Speak" 
        />
        <NavButton 
          active={currentView === AppView.VOCABULARY} 
          onClick={() => setView(AppView.VOCABULARY)} 
          icon={<Star size={22} />} 
          label="Vocab" 
        />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-orange-600' : 'text-slate-400 hover:text-orange-400'}`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);

export default Layout;
