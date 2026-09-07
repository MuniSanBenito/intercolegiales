import React from 'react';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { SCHEDULE_EVENTS } from '../data/tournamentData';

export const ScheduleSection: React.FC = () => {
  return (
    <section id="cronograma" className="relative py-20 bg-[#08090e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-cyber tracking-widest uppercase mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>MAPA DE NIVELES & ROADMAP</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-cyber text-white tracking-tight uppercase mb-4">
            CRONOGRAMA DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">BATALLA</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Seguí la progresión del torneo paso a paso desde el desbloqueo del servidor 
            hasta el enfrentamiento final de la Copa San Benito 2026.
          </p>
        </div>

        {/* Timeline Map */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Glowing Line */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-amber-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]"></div>

          <div className="space-y-12">
            {SCHEDULE_EVENTS.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Center Node / Level Icon */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-slate-950 border-2 border-cyan-400 text-cyan-300 items-center justify-center font-cyber font-black text-sm z-20 shadow-lg shadow-cyan-500/30">
                    {event.levelNumber === 4 ? (
                      <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
                    ) : (
                      <span>0{event.levelNumber}</span>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-10' : 'md:pr-10'}`}>
                    <div className="bg-[#0d0f1e]/90 rounded-2xl border border-slate-800 hover:border-cyan-500/50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/40 relative group">
                      {/* Level Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-cyber font-black tracking-widest px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {event.stage}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{event.time}</span>
                        </div>
                      </div>

                      {/* Event Title */}
                      <h3 className="text-lg sm:text-xl font-cyber font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Location & Date Footer */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                        <div className="flex items-center gap-1.5 text-cyan-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{event.location}</span>
                        </div>
                        <div className="text-slate-300">
                          {event.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
