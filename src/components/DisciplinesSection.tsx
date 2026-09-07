import React, { useState } from 'react';
import { Gamepad2, MapPin, Calendar, Search, Swords, Zap, Trophy, Music } from 'lucide-react';
import { DISCIPLINES } from '../data/tournamentData';
import { sound } from '../lib/sound';


interface DisciplinesSectionProps {
  onRegisterDiscipline: (disciplineName: string) => void;
}

export const DisciplinesSection: React.FC<DisciplinesSectionProps> = ({ onRegisterDiscipline }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'deportes' | 'cultural' | 'futbol' | 'voley' | 'atletismo'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDisciplines = DISCIPLINES.filter((disc) => {
    let matchesCategory = true;
    if (activeFilter === 'deportes') matchesCategory = disc.type === 'deportivo';
    else if (activeFilter === 'cultural') matchesCategory = disc.type === 'cultural';
    else if (activeFilter === 'futbol') matchesCategory = disc.category === 'futbol';
    else if (activeFilter === 'voley') matchesCategory = disc.category === 'voley';
    else if (activeFilter === 'atletismo') matchesCategory = disc.category === 'atletismo';

    const matchesSearch = disc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          disc.rulesSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          disc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          disc.format.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="disciplinas" className="relative py-24 bg-[#08090e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-cyber tracking-widest uppercase mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>DISCIPLINAS DEPORTIVAS & ÁREA CULTURAL 2026</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-cyber text-white tracking-tight uppercase mb-4">
            COMPETENCIAS EN <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">DISPUTA</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Explorá el cuadro completo de deportes físicos de campo y las competencias del área cultural, 
            mente y gaming para la tabla general de posiciones.
          </p>
        </div>

        {/* Filters & Search Box */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 w-full lg:w-auto">
            <button
              onClick={() => { sound.click(); setActiveFilter('all'); }}
              onMouseEnter={() => sound.hover()}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                activeFilter === 'all'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas ({DISCIPLINES.length})
            </button>
            <button
              onClick={() => { sound.click(); setActiveFilter('deportes'); }}
              onMouseEnter={() => sound.hover()}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                activeFilter === 'deportes'
                  ? 'bg-emerald-400 text-black shadow-md shadow-emerald-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚽ Deportes (6)</span>
            </button>
            <button
              onClick={() => { sound.click(); setActiveFilter('cultural'); }}
              onMouseEnter={() => sound.hover()}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                activeFilter === 'cultural'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Área Cultural (4)</span>
            </button>
            <button
              onClick={() => { sound.click(); setActiveFilter('futbol'); }}
              onMouseEnter={() => sound.hover()}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                activeFilter === 'futbol'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fútbol
            </button>
            <button
              onClick={() => { sound.click(); setActiveFilter('voley'); }}
              onMouseEnter={() => sound.hover()}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                activeFilter === 'voley'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vóley
            </button>
            <button
              onClick={() => { sound.click(); setActiveFilter('atletismo'); }}
              onMouseEnter={() => sound.hover()}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                activeFilter === 'atletismo'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Atletismo
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar deporte o actividad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
            />
          </div>
        </div>

        {/* Disciplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDisciplines.map((item) => {
            const isCultural = item.type === 'cultural';
            return (
              <div
                key={item.id}
                className={`rounded-3xl border p-6 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl ${
                  isCultural
                    ? 'bg-[#100d1d]/95 border-purple-500/30 hover:border-purple-400 shadow-purple-950/20'
                    : 'bg-[#0d0f1c]/95 border-slate-800 hover:border-cyan-400/60 shadow-cyan-950/20'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        isCultural
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/40'
                          : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                      }`}
                    >
                      {item.typeLabel} • {item.categoryLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-cyber font-black text-white group-hover:text-cyan-300 transition-colors mb-2.5">
                    {item.name}
                  </h3>

                  {/* Detailed Explanation / Summary */}
                  <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                    {item.rulesSummary}
                  </p>

                  {/* Meta Details Box */}
                  <div className="space-y-2 text-xs font-mono text-slate-300 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 mb-5">
                    <div className="flex items-start gap-2">
                      <Swords className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-slate-400">Formato: </span>
                        <span className="text-white font-semibold">{item.format}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-slate-400">Sede: </span>
                        <span className="text-slate-200">{item.location}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-slate-400">Fecha: </span>
                        <span className="text-amber-300">{item.dates}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => { sound.click(); onRegisterDiscipline(item.name); }}
                  onMouseEnter={() => sound.hover()}
                  className={`w-full py-3 rounded-xl font-cyber text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${
                    isCultural
                      ? 'bg-purple-950/80 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-purple-200 hover:text-white border border-purple-500/40 hover:border-transparent'
                      : 'bg-slate-900 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-teal-400 text-slate-200 hover:text-black border border-slate-700 hover:border-transparent'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Inscribirme en esta Disciplina</span>
                </button>
              </div>
            );
          })}
        </div>

        {filteredDisciplines.length === 0 && (
          <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 max-w-xl mx-auto">
            <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-mono text-sm">
              No se encontraron disciplinas que coincidan con "{searchQuery}".
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
