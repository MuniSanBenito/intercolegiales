import { Trophy, Clock, School } from 'lucide-react';
import { HOUSES } from '../data/tournamentData';
import { sound } from '../lib/sound';

export function ScoreboardSection() {
  return (
    <section id="posiciones" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Trophy className="w-3.5 h-3.5" />
            Tabla de Posiciones
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-cyber tracking-tight text-white mb-3">
            Posiciones{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
              Actuales
            </span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Seguí el ranking de las 5 escuelas en competencia. Los puntajes se actualizarán según los resultados de cada disciplina.
          </p>
        </div>

        {/* Pending Notice */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-amber-500/20 p-6 md:p-8 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <Clock className="w-7 h-7 text-amber-400 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-cyber font-bold text-white mb-2">
            ¡Los puntajes se actualizarán pronto!
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Las posiciones se definirán a medida que se realicen las actividades del torneo.
            ¡Volvé a consultar para ver los resultados en vivo!
          </p>
        </div>

        {/* Schools List - Alphabetical */}
        <div className="space-y-3">
          {HOUSES.map((house, index) => (
            <div
              key={house.id}
              className="relative rounded-xl border bg-slate-950/60 border-slate-800/50 transition-all duration-300 hover:scale-[1.01] hover:border-slate-700/60"
            >
              <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5">
                {/* Position Placeholder */}
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
                  <span className="text-xs font-mono text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* School Logo */}
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <img
                    src={house.logo}
                    alt={`Escudo de ${house.name}`}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>

                {/* Name & Tag */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm md:text-base font-cyber font-bold text-white truncate">
                      {house.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                      {house.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Pendiente de resultados</p>
                </div>

                {/* Pending Badge */}
                <div className="flex-shrink-0 text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
                    <School className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-mono text-slate-400">—</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <a
            href="#inscripciones"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-cyber font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20"
          >
            Sumá puntos para tu escuela
          </a>
        </div>
      </div>
    </section>
  );
}
