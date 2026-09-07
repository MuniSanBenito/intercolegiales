import React from 'react';
import { X, MapPin, ExternalLink, Navigation, CheckCircle2, ShieldCheck, Bus, Car } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Parque+Vieytes+San+Benito+Entre+Rios';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c0e1a] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                SEDE OFICIAL DEL TORNEO
              </span>
              <span className="text-[11px] font-mono text-amber-400">
                5 AL 9 OCTUBRE 2026
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-cyber font-black text-white">
              PARQUE VIEYTES
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-400">
              San Benito, Entre Ríos, Argentina
            </p>
          </div>
        </div>

        {/* Embedded Interactive Map */}
        <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-800 relative mb-6 shadow-inner bg-slate-950">
          <iframe
            title="Ubicación Parque Vieytes San Benito"
            src="https://maps.google.com/maps?q=Parque+Vieytes,+San+Benito,+Entre+Rios,+Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 filter contrast-105 opacity-90"
            loading="lazy"
            allowFullScreen
          ></iframe>
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
                <span>Canchas de Fútbol 11 y Sintético</span>
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
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-3.5 rounded-xl font-cyber text-xs uppercase tracking-widest font-black text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:shadow-lg hover:shadow-cyan-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-black" />
            <span>Abrir en Google Maps</span>
          </a>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
