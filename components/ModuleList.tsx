import React from 'react';
import { SubjectType, Module } from '../types';
import { CheckCircle, Circle, Play, Lock } from 'lucide-react';

interface ModuleListProps {
  subject: SubjectType;
  onSelectModule: (module: Module) => void;
  onBack: () => void;
}

const mockModules: Record<string, Module[]> = {
  [SubjectType.MATH]: [
    { id: 'm1', title: 'Fundamentos de Álgebra', description: 'Ecuaciones lineales y variables.', difficulty: 'Fácil', completed: true, score: 90 },
    { id: 'm2', title: 'Geometría Plana', description: 'Áreas, perímetros y triángulos.', difficulty: 'Medio', completed: false },
    { id: 'm3', title: 'Cálculo Diferencial', description: 'Introducción a derivadas.', difficulty: 'Difícil', completed: false },
  ],
  [SubjectType.SCIENCE]: [
    { id: 's1', title: 'Biología Celular', description: 'Estructura y función de la célula.', difficulty: 'Fácil', completed: true, score: 85 },
    { id: 's2', title: 'Química Básica', description: 'Tabla periódica y enlaces.', difficulty: 'Medio', completed: false },
  ],
  [SubjectType.HISTORY]: [
    { id: 'h1', title: 'Revolución Industrial', description: 'Impacto social y económico.', difficulty: 'Medio', completed: false },
    { id: 'h2', title: 'Guerra Fría', description: 'Conflictos geopolíticos del siglo XX.', difficulty: 'Difícil', completed: false },
  ],
  [SubjectType.LANGUAGE]: [
    { id: 'l1', title: 'Gramática Avanzada', description: 'Sintaxis y morfología.', difficulty: 'Difícil', completed: false },
  ]
};

const ModuleList: React.FC<ModuleListProps> = ({ subject, onSelectModule, onBack }) => {
  const modules = mockModules[subject] || [];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={onBack} className="text-slate-500 hover:text-indigo-600 mb-6 font-medium text-sm flex items-center">
        ← Volver al Tablero
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{subject}</h1>
          <p className="text-slate-500 mt-1">Selecciona un módulo para comenzar tu práctica.</p>
        </div>
        <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
            {subject.charAt(0)}
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((mod) => (
          <div 
            key={mod.id}
            onClick={() => onSelectModule(mod)}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${mod.completed ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-600'}`}>
                {mod.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{mod.title}</h3>
                <p className="text-slate-500 text-sm">{mod.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
               <div className="text-right hidden sm:block">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      mod.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                      mod.difficulty === 'Medio' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                  }`}>
                      {mod.difficulty}
                  </span>
               </div>
               
               {mod.completed && mod.score ? (
                   <span className="text-lg font-bold text-slate-800">{mod.score}%</span>
               ) : (
                   <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                       <Play size={20} className="ml-1" />
                   </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleList;
