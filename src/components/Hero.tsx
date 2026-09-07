import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Shield, Flame, Zap, Trophy, ChevronRight, Terminal, Clock, Calendar, MapPin } from 'lucide-react';

interface HeroProps {
  onOpenQuiz: () => void;
  onOpenLocation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuiz, onOpenLocation }) => {
  // Countdown to October 5, 2026 at 10:00 AM
  const [timeLeft, setTimeLeft] = useState({
    days: 32,
    hours: 1,
    minutes: 27,
    seconds: 8,
  });

  useEffect(() => {
    const targetDate = new Date('2026-10-05T10:00:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex flex-col justify-center overflow-hidden">
      {/* Background Cyber Grid & Glow Orbs */}
      <div className="absolute inset-0 cyber-grid-bg pointer-events-none opacity-40"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-tr from-cyan-600/20 via-purple-600/20 to-pink-600/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-glow"></div>
      <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 -right-10 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Status HUD Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-lg shadow-cyan-500/20 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-300">
              5 AL 9 DE OCTUBRE 2026 // 10:00 A 15:00 HS
            </span>
          </div>

          {/* Location Badge Button */}
          <button
            onClick={onOpenLocation}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-500/40 hover:border-emerald-400 text-xs font-mono text-emerald-300 transition-all hover:scale-105 shadow-md shadow-emerald-950/50 group"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:animate-bounce" />
            <span>SEDE: PARQUE VIEYTES (SAN BENITO)</span>
            <ChevronRight className="w-3 h-3 text-emerald-400 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Main Title & Glitch Heading */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-cyber font-bold tracking-[0.25em] uppercase text-cyan-400 mb-2">
            <span>5 ESCUELAS EN COMPETENCIA</span>
            <span>•</span>
            <span className="text-amber-400">SEDE PARQUE VIEYTES</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-cyber tracking-tight uppercase leading-none mb-6">
            <span className="block text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              INTERCOLEGIALES
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 neon-text-cyan">
              SAN BENITO 2026
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal max-w-3xl mx-auto leading-relaxed">
            Del <strong className="text-cyan-300 font-bold">Lunes 5 al Viernes 9 de Octubre (10:00 a 15:00 hs)</strong> en el <strong className="text-emerald-300 font-bold">Parque Vieytes</strong>. 
            El gran choque entre <span className="text-white font-semibold">San Benito Abad</span>, <span className="text-white font-semibold">San Alberto Hurtado</span>, <span className="text-white font-semibold">Escuela Zuloaga</span>, <span className="text-white font-semibold">Escuela Evita</span> y la <span className="text-white font-semibold">ENET 18</span>.
          </p>
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="#inscripciones"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-cyber text-sm font-black uppercase tracking-widest text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/60 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <Zap className="w-5 h-5 text-black group-hover:rotate-12 transition-transform" />
            <span>Inscribirme al Torneo</span>
            <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Sede Location Button */}
          <button
            onClick={onOpenLocation}
            className="w-full sm:w-auto px-6 py-4 rounded-xl font-cyber text-xs uppercase tracking-widest font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 hover:border-emerald-400 shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <MapPin className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Ver Ubicación (Parque Vieytes)</span>
          </button>

          <button
            onClick={onOpenQuiz}
            className="w-full sm:w-auto px-6 py-4 rounded-xl font-cyber text-xs uppercase tracking-widest font-bold text-cyan-300 bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-purple-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-45 transition-transform" />
            <span>Test de Afinidad</span>
          </button>

          <a
            href="#disciplinas"
            className="w-full sm:w-auto px-6 py-4 rounded-xl font-cyber text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white bg-slate-950/60 hover:bg-slate-900 border border-slate-700/60 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>Ver Disciplinas</span>
          </a>
        </div>

        {/* Countdown HUD Display */}
        <div className="max-w-3xl mx-auto mb-16 p-1 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-amber-500/30 backdrop-blur-xl">
          <div className="bg-[#0b0c16]/90 rounded-[14px] p-4 sm:p-6 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  CUENTA REGRESIVA • APERTURA EN PARQUE VIEYTES
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/30 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  05 OCT 2026
                </span>
                <span className="text-[11px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  10:00 HS
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 shadow-inner">
                <div className="text-2xl sm:text-4xl md:text-5xl font-cyber font-black text-cyan-400">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">
                  Días
                </div>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 shadow-inner">
                <div className="text-2xl sm:text-4xl md:text-5xl font-cyber font-black text-purple-400">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">
                  Horas
                </div>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 shadow-inner">
                <div className="text-2xl sm:text-4xl md:text-5xl font-cyber font-black text-amber-400">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">
                  Minutos
                </div>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 shadow-inner">
                <div className="text-2xl sm:text-4xl md:text-5xl font-cyber font-black text-emerald-400">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">
                  Segundos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-cyber font-bold text-white">5 Escuelas</div>
              <div className="text-xs font-mono text-slate-400">Delegaciones Oficiales</div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-cyber font-bold text-white">990+</div>
              <div className="text-xs font-mono text-slate-400">Estudiantes Atletas</div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-cyber font-bold text-white">10 a 15 HS</div>
              <div className="text-xs font-mono text-slate-400">Jornada Diaria</div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-cyber font-bold text-white">1 Copa</div>
              <div className="text-xs font-mono text-slate-400">Intercolegial 2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
