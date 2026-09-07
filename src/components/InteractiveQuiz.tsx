import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2, Zap } from 'lucide-react';
import { QUIZ_QUESTIONS, HOUSES } from '../data/tournamentData';
import type { House } from '../data/tournamentData';

interface InteractiveQuizProps {
  onSelectHouse: (houseId: string) => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ onSelectHouse }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [calculatedHouse, setCalculatedHouse] = useState<House | null>(null);

  const handleSelectOption = (houseId: string) => {
    const updated = [...selectedAnswers, houseId];
    setSelectedAnswers(updated);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate majority or fallback
      const counts: Record<string, number> = {};
      updated.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });
      let bestHouseId = updated[0];
      let maxCount = 0;
      Object.entries(counts).forEach(([id, count]) => {
        if (count > maxCount) {
          maxCount = count;
          bestHouseId = id;
        }
      });
      const found = HOUSES.find((h) => h.id === bestHouseId) || HOUSES[0];
      setCalculatedHouse(found);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setCalculatedHouse(null);
  };

  return (
    <section id="test-casa" className="relative py-20 bg-[#090a16] border-t border-b border-purple-500/20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-cyber tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ORÁCULO GAMER • SAN BENITO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-cyber text-white tracking-tight uppercase mb-3">
            DESCUBRÍ TU <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">ESCUELA AFÍN</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Respondé 3 preguntas sobre tu estilo de juego y nuestra IA de combate calculará tu escuela compatible.
          </p>
        </div>

        {/* Quiz Container */}
        <div className="bg-[#0e1022]/90 rounded-3xl border border-purple-500/30 p-6 sm:p-10 shadow-2xl shadow-purple-950/40 relative">
          {!calculatedHouse ? (
            <div>
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs font-mono text-purple-300 mb-3">
                <span>PREGUNTA 0{currentStep + 1} DE 0{QUIZ_QUESTIONS.length}</span>
                <span>{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full mb-8 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>

              {/* Question */}
              <h3 className="text-xl sm:text-2xl font-cyber font-bold text-white mb-6 text-center">
                {QUIZ_QUESTIONS[currentStep].question}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUIZ_QUESTIONS[currentStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.houseId)}
                    className="text-left p-4 rounded-2xl bg-slate-900/90 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-400 text-slate-200 hover:text-white transition-all duration-200 flex items-center justify-between gap-3 group"
                  >
                    <span className="text-xs sm:text-sm font-medium leading-snug">
                      {opt.text}
                    </span>
                    <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Result Card / Gamer Badge */
            <div className="text-center animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase mb-4">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AFINIDAD DEL 98.7% ENCONTRADA</span>
              </div>

              <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                TU ESCUELA ASIGNADA ES
              </div>
              <h3 className="text-3xl sm:text-4xl font-cyber font-black text-white mb-2">
                {calculatedHouse.name}
              </h3>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 max-w-md mx-auto text-left text-xs text-slate-300 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">XP Inicial:</span>
                  <span className="text-amber-400 font-mono font-bold">+500 XP</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => onSelectHouse(calculatedHouse.id)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-cyber text-xs uppercase tracking-widest font-black text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:shadow-lg hover:shadow-cyan-400/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Inscribirme por {calculatedHouse.name}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir Test</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
