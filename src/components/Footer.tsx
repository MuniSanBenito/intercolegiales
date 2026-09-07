import React from 'react';
import { Gamepad2, ShieldAlert, MessageSquare, Tv, Radio, Globe, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#06070a] border-t border-cyan-500/20 pt-16 pb-12 text-slate-400 overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#0d0f1a] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-cyber font-black text-xl text-white tracking-wider">
                INTERCOLEGIALES SAN BENITO 2026
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              El evento deportivo y cultural que reúne a las 5 instituciones en el <strong className="text-emerald-300">Parque Vieytes</strong>. 
              Pasión, juego limpio, camaradería estudiantil y orgullo colegial.
            </p>

            {/* Sede Badge */}
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-xs font-mono text-emerald-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SEDE: PARQUE VIEYTES (SAN BENITO, ENTRE RÍOS)</span>
              </div>

              <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>FAIR PLAY ESCOLAR EN VIGOR</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-cyber font-bold uppercase tracking-widest text-white mb-4">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm font-mono">
              <li>
                <a href="#casas" className="hover:text-cyan-400 transition-colors">
                  ✦ Las 5 Escuelas
                </a>
              </li>
              <li>
                <a href="#disciplinas" className="hover:text-cyan-400 transition-colors">
                  ✦ Deportes & Área Cultural
                </a>
              </li>
              <li>
                <a href="#inscripciones" className="hover:text-cyan-400 transition-colors">
                  ✦ Inscripciones Oficiales
                </a>
              </li>
              <li>
                <a href="#cronograma" className="hover:text-cyan-400 transition-colors">
                  ✦ Cronograma del Torneo
                </a>
              </li>
            </ul>
          </div>

          {/* Channels & Info */}
          <div>
            <h4 className="text-xs font-cyber font-bold uppercase tracking-widest text-white mb-4">
              Comunidad & Stream
            </h4>
            <ul className="space-y-3 text-sm font-mono">
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-pink-400" />
                <span className="hover:text-white transition-colors cursor-pointer">
                  @intercolegialessanbe
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-red-400" />
                <span className="hover:text-white transition-colors cursor-pointer">
                  Transmisión Oficial San Benito
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span className="hover:text-white transition-colors cursor-pointer">
                  Radio Escolar Live Hub
                </span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span className="hover:text-white transition-colors cursor-pointer">
                  Comunidad Intercolegial 2026
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            © 2026 Intercolegiales San Benito. Sede Parque Vieytes. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span>Organizado por</span>
            <span className="font-cyber font-bold text-cyan-400">San Benito Intercol 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
