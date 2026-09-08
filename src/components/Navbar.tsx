import React, { useState, useEffect } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { Gamepad2, Shield, Menu, X, Volume2, VolumeX, UserCheck, MapPin } from 'lucide-react';
import { sound, getSoundEnabled, setSoundEnabled as persistSound } from '../lib/sound';

interface NavbarProps {
  onOpenLocation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLocation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => getSoundEnabled());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const playClickSound = () => sound.click();

  const navLinks = [
    { name: 'Escuelas', href: '#Escuelas', icon: Shield },
    { name: 'Disciplinas', href: '#disciplinas', icon: Gamepad2 },
    { name: 'Inscripciones', href: '#inscripciones', icon: UserCheck },
    { name: 'Ubicación', href: '#ubicacion', icon: MapPin, onClick: onOpenLocation },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090e]/90 backdrop-blur-md border-b border-cyan-500/20 py-3 shadow-lg shadow-cyan-950/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={playClickSound}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative w-11 h-11 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl p-[2px] shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#0d0f1a] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-black text-[10px] font-black px-1 rounded-sm border border-black uppercase font-cyber">
              '26
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-cyber font-black text-lg sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400">
                SAN BENITO
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-cyber uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                PARQUE VIEYTES
              </span>
            </div>
            <span className="text-[11px] font-mono tracking-widest text-slate-400">
              5 AL 9 OCT // 10 A 15 HS
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  playClickSound();
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                onMouseEnter={() => sound.hover()}
                onFocus={() => sound.hover()}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg border border-transparent hover:border-cyan-500/30 transition-all duration-150"
              >
                <Icon className="w-4 h-4 text-cyan-400/80" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Location Quick Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenLocation();
            }}
            onMouseEnter={() => sound.hover()}
            onFocus={() => sound.hover()}
            title="Ver ubicación: Parque Vieytes"
            className="p-2.5 rounded-lg bg-slate-900/80 border border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 text-xs font-mono"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="hidden xl:inline">Parque Vieytes</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              persistSound(next);
              if (next) sound.click();
            }}
            title={soundEnabled ? 'Silenciar efectos' : 'Activar efectos de sonido'}
            className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Inscription CTA */}
          <a
            href="#inscripciones"
            onClick={playClickSound}
            onMouseEnter={() => sound.hover()}
            onFocus={() => sound.hover()}
            className="relative group px-5 py-2.5 rounded-xl font-cyber text-xs uppercase tracking-widest font-bold text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden inline-flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-black" />
            <span>Inscribirme</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="md:hidden bg-[#0a0b12]/95 backdrop-blur-xl border-b border-cyan-500/30 px-4 pt-3 pb-6 space-y-2 animate-slide-down">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  playClickSound();
                  setMobileMenuOpen(false);
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                onMouseEnter={() => sound.hover()}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-200 hover:bg-cyan-500/15 hover:text-cyan-300 border border-slate-800"
              >
                <Icon className="w-5 h-5 text-cyan-400" />
                <span>{link.name}</span>
              </a>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-3">
            <button
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(false);
                onOpenLocation();
              }}
              onMouseEnter={() => sound.hover()}
              className="w-full py-3 rounded-xl font-cyber text-xs uppercase tracking-widest font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 text-center flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              Ver Ubicación: Parque Vieytes
            </button>

            <a
              href="#inscripciones"
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(false);
              }}
              onMouseEnter={() => sound.hover()}
              className="w-full py-3 rounded-xl font-cyber text-xs uppercase tracking-widest font-bold text-black bg-gradient-to-r from-cyan-400 to-amber-300 text-center flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
            >
              <UserCheck className="w-4 h-4" />
              Inscribirme al Torneo
            </a>
          </div>
        </div>
      )}
      </motion.header>
    </MotionConfig>
  );
};
