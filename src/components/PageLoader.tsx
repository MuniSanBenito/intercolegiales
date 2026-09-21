import { Gamepad2 } from "lucide-react";
import React from "react";

export const PageLoader: React.FC = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#08090e] px-4 text-slate-100"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Cargando Intercolegiales San Benito 2026"
    >
      <div className="animate-fade-in text-center">
        <div className="relative mx-auto grid h-16 w-16 place-items-center">
          <div className="absolute inset-0 rounded-full border border-slate-800" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-purple-400 border-t-cyan-400" />
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-500/50 bg-[#0d0f1a] text-cyan-400">
            <Gamepad2 className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-4 font-cyber text-[10px] font-bold tracking-[0.24em] text-cyan-400">
          INTERCOLEGIALES
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
          Cargando...
        </p>
      </div>
    </div>
  );
};
