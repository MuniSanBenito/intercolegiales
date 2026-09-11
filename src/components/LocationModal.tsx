import React, { useEffect } from 'react';
import { X, MapPin, ExternalLink, Navigation, CheckCircle2, ShieldCheck, Bus, Car } from 'lucide-react';
import { sound } from '../lib/sound';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Parque+Vieytes+San+Benito+Entre+Rios'
  const chapinoMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Complejo+Oscar+Chapino+Av+Jorge+Newbery+5900+San+Benito+Entre+Rios'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0c0e1a] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 max-h-[92vh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="location-modal-title">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Cerrar ubicación"
          onClick={() => { sound.close(); onClose(); }}
          onMouseEnter={() => sound.hover()}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <MapPin className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                2 SEDES OFICIALES DEL TORNEO
              </span>
              <span className="text-[11px] font-mono text-amber-400">
                5 AL 9 OCTUBRE 2026
              </span>
            </div>
            <h2 id="location-modal-title" className="text-2xl sm:text-3xl font-cyber font-black text-white">
              SEDES DEL TORNEO
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-400">
              San Benito, Entre Ríos, Argentina
            </p>
          </div>
        </div>

        {/* Venue 1: Parque Vieytes */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
              Sede central
            </span>
            <h3 className="text-sm sm:text-base font-cyber font-black text-white tracking-wide uppercase">
              Parque Vieytes
            </h3>
          </div>
          <p className="text-xs font-mono text-slate-400 mb-3">
            Predio central — San Benito, Entre Ríos
          </p>
          <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-800 relative mb-3 shadow-inner bg-slate-950">
            <iframe
              title="Ubicación Parque Vieytes San Benito"
              src="https://maps.google.com/maps?q=Parque+Vieytes,+San+Benito,+Entre+Rios,+Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter contrast-105 opacity-90"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.open()}
            onMouseEnter={() => sound.hover()}
            className="w-full py-3 rounded-xl font-cyber text-xs uppercase tracking-widest font-black text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:shadow-lg hover:shadow-cyan-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-black" />
            <span>Cómo llegar a Parque Vieytes</span>
          </a>
        </div>

        {/* Venue 2: Complejo Oscar Chapino */}
        <div className="mb-6 rounded-2xl border border-purple-500/20 bg-slate-900/40 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase">
              Sede fútbol
            </span>
            <h3 className="text-sm sm:text-base font-cyber font-black text-white tracking-wide uppercase">
              Complejo Oscar Chapino
            </h3>
          </div>
          <p className="text-xs font-mono text-slate-400 mb-1">
            Av. Jorge Newbery 5900, Acceso a San Benito
          </p>
          <p className="text-xs font-mono text-purple-300/90 mb-3">
            Fútbol 11 Masculino y Fútbol 9 Femenino — Martes 6 de octubre
          </p>
          <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-800 relative mb-3 shadow-inner bg-slate-950">
            <iframe
              title="Ubicación Complejo Oscar Chapino San Benito"
              src="https://maps.google.com/maps?q=Complejo+Oscar+Chapino,+Av.+Jorge+Newbery+5900,+San+Benito,+Entre+Rios,+Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter contrast-105 opacity-90"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
          <a
            href={chapinoMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.open()}
            onMouseEnter={() => sound.hover()}
            className="w-full py-3 rounded-xl font-cyber text-xs uppercase tracking-widest font-bold text-purple-200 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 hover:border-purple-400 transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Cómo llegar al Complejo Chapino</span>
          </a>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5 font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Instalaciones Habilitadas</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1 font-mono">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Fútbol en Complejo Chapino (Av. Newbery 5900)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Gimnasio Techado de Vóley</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Pista de Atletismo y Saltos</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Anfiteatro y Zona Cultural</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1.5 font-bold uppercase">
              <Navigation className="w-4 h-4" />
              <span>Acceso & Transporte</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1 font-mono">
              <li className="flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Líneas urbanas con parada en el predio</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Estacionamiento para micros escolares</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Puestos de Hidratación y Asistencia</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Horario oficial: 10:00 a 15:00 hs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => { sound.close(); onClose(); }}
            onMouseEnter={() => sound.hover()}
            className="w-full px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
