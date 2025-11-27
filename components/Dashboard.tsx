import React from 'react';
import { SubjectProgress, SubjectType } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Clock, Target, ArrowRight } from 'lucide-react';

interface DashboardProps {
  progressData: SubjectProgress[];
  onStartSubject: (subject: SubjectType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ progressData, onStartSubject }) => {
  
  // Flatten data for chart
  const chartData = [
    { name: 'Sem 1', Math: 65, Science: 40, Hist: 50 },
    { name: 'Sem 2', Math: 70, Science: 55, Hist: 60 },
    { name: 'Sem 3', Math: 68, Science: 70, Hist: 65 },
    { name: 'Sem 4', Math: 85, Science: 75, Hist: 70 },
    { name: 'Actual', Math: 90, Science: 82, Hist: 75 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">¡Hola, Estudiante!</h1>
          <p className="text-indigo-100 max-w-xl">
            Has completado el 80% de tus objetivos semanales. Sigue así para dominar tus materias.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Puntaje Total</p>
            <p className="text-2xl font-bold text-slate-800">1,240 XP</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Tiempo de Estudio</p>
            <p className="text-2xl font-bold text-slate-800">12h 30m</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Precisión Promedio</p>
            <p className="text-2xl font-bold text-slate-800">84%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Rendimiento Académico</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMath" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="Math" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorMath)" />
                <Area type="monotone" dataKey="Science" stroke="#0ea5e9" strokeWidth={3} fillOpacity={0} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Subjects */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Continuar Aprendiendo</h2>
          <div className="space-y-4">
            {progressData.map((prog, idx) => (
              <div key={idx} className="group p-4 border border-slate-100 rounded-lg hover:border-indigo-100 hover:bg-indigo-50 transition-all cursor-pointer" onClick={() => onStartSubject(prog.subject)}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700">{prog.subject}</span>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full group-hover:bg-white">
                    {prog.completedModules}/{prog.totalModules} Módulos
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(prog.completedModules / prog.totalModules) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-3 flex justify-end">
                   <span className="text-indigo-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Ir a clases <ArrowRight size={14} className="ml-1" />
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
