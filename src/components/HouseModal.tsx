import React, { useEffect } from 'react';
import { X, ChevronRight, Zap } from 'lucide-react';
import { sound } from '../lib/sound';
import type { House } from '../data/tournamentData';

interface HouseModalProps {
  house: House | null;
  onClose: () => void;
  onJoinHouse: (houseId: string) => void;
}

export const HouseModal: React.FC<HouseModalProps> = ({ house, onClose, onJoinHouse }) => {
  useEffect(() => {
    if (!house) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [house, onClose]);

  if (!house) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-[#0d0e1a] border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="house-modal-title">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Cerrar escuela"
          onClick={() => { sound.close(); onClose(); }}
          onMouseEnter={() => sound.hover()}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
            <img
              src={house.logo}
              alt={`Escudo oficial de ${house.name}`}
              className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
            />
          </div>
          <div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              [{house.tag}]
            </span>
            <h2 id="house-modal-title" className="text-xl sm:text-2xl font-cyber font-black text-white mt-1">
              {house.name}
            </h2>
          </div>
        </div>

        {/* Inscription Action */}
        <button
          onClick={() => {
            sound.click();
            onJoinHouse(house.id);
            onClose();
          }}
          onMouseEnter={() => sound.hover()}
          className="w-full py-3.5 rounded-xl font-cyber text-xs uppercase tracking-widest font-black text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:shadow-lg hover:shadow-cyan-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          <span>Inscribirme por {house.name}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
