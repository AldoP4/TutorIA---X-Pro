import React from 'react';
import { BookOpen, BarChart2, User, GraduationCap } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setView: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Tablero', icon: BarChart2 },
    { id: 'subjects', label: 'Materias', icon: BookOpen },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <GraduationCap size={20} />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">TutorIA</span>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  currentView === item.id || (currentView === 'exercise' && item.id === 'subjects')
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <item.icon size={16} className="mr-2" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
