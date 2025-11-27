import React, { useState, useEffect, useRef } from 'react';
import { SubjectType, Module, Question } from '../types';
import { generateQuizQuestions, askTutor } from '../services/geminiService';
import { Check, X, MessageCircle, HelpCircle, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';

interface ExerciseSessionProps {
  subject: SubjectType;
  moduleData: Module;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const ExerciseSession: React.FC<ExerciseSessionProps> = ({ subject, moduleData, onComplete, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<{role: 'user'|'ai', text: string}[]>([
      {role: 'ai', text: `Hola, soy tu tutor de IA. Estoy aquí para ayudarte con "${moduleData.title}". ¡Pregúntame si te atascas!`}
  ]);
  const [tutorInput, setTutorInput] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      // Generate dynamic content using Gemini based on the module title
      const generated = await generateQuizQuestions(subject, moduleData.title, 5);
      setQuestions(generated);
      setLoading(false);
    };
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleData]);

  useEffect(() => {
    // Scroll tutor chat to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tutorMessages, tutorOpen]);

  const handleOptionSelect = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
  };

  const checkAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);
    if (selectedOption === questions[currentQIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      // Finish
      const finalPercentage = Math.round((score + (selectedOption === questions[currentQIndex].correctAnswerIndex ? 1 : 0)) / questions.length * 100);
      onComplete(finalPercentage);
    }
  };

  const handleAskTutor = async () => {
      if (!tutorInput.trim()) return;
      const userText = tutorInput;
      setTutorInput('');
      setTutorMessages(prev => [...prev, {role: 'user', text: userText}]);
      setTutorLoading(true);

      const currentQuestionText = questions[currentQIndex]?.text || "General Context";
      const answer = await askTutor(currentQuestionText, userText);
      
      setTutorMessages(prev => [...prev, {role: 'ai', text: answer}]);
      setTutorLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-700">Generando ejercicios personalizados...</h2>
        <p className="text-slate-500 mt-2">La IA está preparando tu sesión de {moduleData.title}</p>
      </div>
    );
  }

  if (questions.length === 0) {
      return (
        <div className="text-center p-10">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Error cargando contenido</h3>
            <p className="mb-6">No pudimos generar preguntas. Por favor verifica tu conexión o API Key.</p>
            <button onClick={onExit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Volver</button>
        </div>
      );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      {/* Main Exercise Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
            <div 
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${((currentQIndex) / questions.length) * 100}%` }}
            />
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Pregunta {currentQIndex + 1} de {questions.length}</span>
                <button onClick={() => setTutorOpen(!tutorOpen)} className="lg:hidden p-2 bg-indigo-50 text-indigo-600 rounded-full">
                    <MessageCircle size={20} />
                </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                {currentQ.text}
            </h2>

            <div className="space-y-4 max-w-2xl">
                {currentQ.options.map((option, idx) => {
                    let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ";
                    
                    if (isAnswerChecked) {
                        if (idx === currentQ.correctAnswerIndex) {
                            btnClass += "border-green-500 bg-green-50 text-green-800";
                        } else if (selectedOption === idx) {
                            btnClass += "border-red-500 bg-red-50 text-red-800";
                        } else {
                            btnClass += "border-slate-100 opacity-50";
                        }
                    } else {
                        if (selectedOption === idx) {
                            btnClass += "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md transform scale-[1.01]";
                        } else {
                            btnClass += "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
                        }
                    }

                    return (
                        <button 
                            key={idx} 
                            onClick={() => handleOptionSelect(idx)}
                            disabled={isAnswerChecked}
                            className={btnClass}
                        >
                            <span className="font-medium text-lg">{option}</span>
                            {isAnswerChecked && idx === currentQ.correctAnswerIndex && <Check className="text-green-600" />}
                            {isAnswerChecked && selectedOption === idx && idx !== currentQ.correctAnswerIndex && <X className="text-red-600" />}
                            {!isAnswerChecked && selectedOption === idx && <div className="w-4 h-4 bg-indigo-600 rounded-full" />}
                        </button>
                    );
                })}
            </div>

            {isAnswerChecked && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-fade-in">
                    <div className="flex items-start gap-3">
                        <HelpCircle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                            <p className="font-bold text-blue-800 mb-1">Explicación:</p>
                            <p className="text-blue-700 leading-relaxed">{currentQ.explanation}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <button onClick={onExit} className="text-slate-500 hover:text-slate-700 font-medium">
                Salir
            </button>
            
            {!isAnswerChecked ? (
                <button 
                    onClick={checkAnswer}
                    disabled={selectedOption === null}
                    className={`px-8 py-3 rounded-xl font-bold shadow-md transition-all ${
                        selectedOption === null 
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                >
                    Comprobar
                </button>
            ) : (
                <button 
                    onClick={nextQuestion}
                    className="px-8 py-3 rounded-xl font-bold shadow-md transition-all bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
                >
                    {currentQIndex < questions.length - 1 ? 'Siguiente' : 'Ver Resultados'} <ArrowRight size={18} />
                </button>
            )}
        </div>
      </div>

      {/* AI Tutor Sidebar */}
      <div className={`
          fixed inset-0 z-50 lg:static lg:z-auto lg:w-96 bg-white shadow-xl lg:shadow-sm border-l border-slate-200 flex flex-col transition-transform duration-300
          ${tutorOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
          <div className="p-4 border-b border-slate-200 bg-indigo-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                  <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                      <h3 className="font-bold text-indigo-900">Tutor Virtual</h3>
                      <p className="text-xs text-indigo-600">Impulsado por Gemini 2.5</p>
                  </div>
              </div>
              <button onClick={() => setTutorOpen(false)} className="lg:hidden p-1 hover:bg-indigo-100 rounded">
                  <X size={20} className="text-indigo-600" />
              </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {tutorMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                          msg.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                      }`}>
                          {msg.text}
                      </div>
                  </div>
              ))}
              {tutorLoading && (
                  <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                  <input 
                      type="text" 
                      value={tutorInput}
                      onChange={(e) => setTutorInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
                      placeholder="Pregunta sobre el ejercicio..."
                      className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button 
                      onClick={handleAskTutor}
                      disabled={tutorLoading || !tutorInput.trim()}
                      className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <ArrowRight size={20} />
                  </button>
              </div>
              <p className="text-xs text-center text-slate-400 mt-2">
                  La IA puede cometer errores. Verifica la información.
              </p>
          </div>
      </div>
    </div>
  );
};

export default ExerciseSession;
