import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ModuleList from './components/ModuleList';
import ExerciseSession from './components/ExerciseSession';
import { SubjectType, SubjectProgress, Module } from './types';
import { Award, RefreshCcw } from 'lucide-react';

// Mock Progress Data
const initialProgress: SubjectProgress[] = [
  { subject: SubjectType.MATH, completedModules: 5, totalModules: 12, averageScore: 85, recentActivity: [70, 80, 90] },
  { subject: SubjectType.SCIENCE, completedModules: 3, totalModules: 10, averageScore: 78, recentActivity: [60, 75, 82] },
  { subject: SubjectType.HISTORY, completedModules: 2, totalModules: 8, averageScore: 92, recentActivity: [85, 90, 95] },
  { subject: SubjectType.LANGUAGE, completedModules: 4, totalModules: 10, averageScore: 88, recentActivity: [80, 85, 88] },
];

const App: React.FC = () => {
  const [view, setView] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const handleStartSubject = (subject: SubjectType) => {
    setSelectedSubject(subject);
    setView('subject-detail');
  };

  const handleSelectModule = (moduleData: Module) => {
    setSelectedModule(moduleData);
    setView('exercise');
  };

  const handleExerciseComplete = (score: number) => {
    setLastScore(score);
    setView('result');
  };

  const resetFlow = () => {
    setView('dashboard');
    setSelectedSubject(null);
    setSelectedModule(null);
    setLastScore(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard progressData={initialProgress} onStartSubject={handleStartSubject} />;
      
      case 'subjects':
        // Reuse Dashboard for simplicity in this demo, but filtered or different view
        return <Dashboard progressData={initialProgress} onStartSubject={handleStartSubject} />;

      case 'subject-detail':
        if (!selectedSubject) return resetFlow();
        return (
          <ModuleList 
            subject={selectedSubject} 
            onSelectModule={handleSelectModule} 
            onBack={resetFlow} 
          />
        );

      case 'exercise':
        if (!selectedSubject || !selectedModule) return resetFlow();
        return (
          <ExerciseSession 
            subject={selectedSubject} 
            moduleData={selectedModule} 
            onComplete={handleExerciseComplete}
            onExit={() => setView('subject-detail')}
          />
        );

      case 'result':
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in text-center px-4">
             <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Award size={48} />
             </div>
             <h1 className="text-4xl font-bold text-slate-800 mb-2">¡Módulo Completado!</h1>
             <p className="text-xl text-slate-500 mb-8">Has terminado "{selectedModule?.title}"</p>
             
             <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 w-full max-w-sm mb-8">
                 <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Tu Puntuación</p>
                 <div className="text-6xl font-bold text-indigo-600 mb-2">{lastScore}%</div>
                 <p className="text-slate-500 text-sm">
                    {lastScore && lastScore > 80 ? '¡Excelente trabajo! Dominas el tema.' : 'Buen esfuerzo. Sigue practicando.'}
                 </p>
             </div>

             <div className="flex gap-4">
                 <button onClick={() => setView('subject-detail')} className="px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors">
                    Volver a la Lista
                 </button>
                 <button onClick={() => setView('exercise')} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <RefreshCcw size={18} /> Repetir
                 </button>
             </div>
          </div>
        );

      default:
        return <Dashboard progressData={initialProgress} onStartSubject={handleStartSubject} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Do not show nav inside active exercise to minimize distractions */}
      {view !== 'exercise' && <Navigation currentView={view} setView={setView} />}
      
      <main className={`${view !== 'exercise' ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : 'h-screen p-4'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
