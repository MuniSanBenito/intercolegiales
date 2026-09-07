import React from 'react';
import { X, ChevronRight, Zap } from 'lucide-react';
import type { House } from '../data/tournamentData';

interface HouseModalProps {
  house: House | null;
  onClose: () => void;
  onJoinHouse: (houseId: string) => void;
}

export const HouseModal: React.FC<HouseModalProps> = ({ house, onClose, onJoinHouse }) => {
  if (!house) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0d0e1a] border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            [{house.tag}]
          </span>
          <h2 className="text-2xl sm:text-3xl font-cyber font-black text-white">
            {house.name}
          </h2>
        </div>

        {/* Inscription Action */}
        <button
          onClick={() => {
            onJoinHouse(house.id);
            onClose();
          }}
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
