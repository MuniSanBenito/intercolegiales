import React, { useState } from 'react';
import { Shield, Eye, Zap, ArrowUpRight } from 'lucide-react';
import { HOUSES } from '../data/tournamentData';
import type { House } from '../data/tournamentData';
import { HouseModal } from './HouseModal';

interface HousesSectionProps {
  onSelectSchool: (schoolId: string) => void;
}

export const HousesSection: React.FC<HousesSectionProps> = ({ onSelectSchool }) => {
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  return (
    <section id="casas" className="relative py-20 bg-[#090a12] border-t border-b border-cyan-500/10">
      {/* Background accents */}
      <div className="absolute inset-0 cyber-dots-bg opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-cyber tracking-widest uppercase mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>DELEGACIONES & ESCUELAS PARTICIPANTES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-cyber text-white tracking-tight uppercase mb-4">
            LAS 5 ESCUELAS DEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">TORNEO</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Conocé a las 5 instituciones que competirán del 5 al 9 de Octubre (10:00 a 15:00 hs) por la Copa San Benito 2026.
          </p>
        </div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOUSES.map((house) => {
            return (
              <div
                key={house.id}
                className="group relative bg-[#0d0f1c]/90 rounded-2xl border border-slate-800 hover:border-cyan-400/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col justify-between"
              >
                {/* Glow bar on top of the card */}
                <div
                  className={`absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r ${house.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                ></div>

                <div>
                  {/* Top card info */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          [{house.tag}]
                        </span>
                        <h3 className="text-xl font-cyber font-black text-white group-hover:text-cyan-300 transition-colors">
                          {house.name}
                        </h3>
                      </div>
                    </div>


                  </div>

                {/* Footer buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedHouse(house)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-xs font-cyber text-slate-200 hover:text-cyan-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Ficha</span>
                  </button>

                  <button
                    onClick={() => onSelectSchool(house.id)}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500 hover:to-purple-500 text-cyan-300 hover:text-black border border-cyan-500/40 text-xs font-cyber font-bold transition-all flex items-center justify-center gap-1 group/btn"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Inscribirme</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* House Full Detail Modal */}
      <HouseModal
        house={selectedHouse}
        onClose={() => setSelectedHouse(null)}
        onJoinHouse={(houseId) => {
          onSelectSchool(houseId);
        }}
      />
    </section>
  );
};
