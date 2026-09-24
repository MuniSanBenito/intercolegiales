import { Gamepad2 } from "lucide-react";

export function Component() {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] [align-items:safe_center] px-4 py-6 sm:py-10 lg:min-h-dvh">
      <div className="mx-auto w-full max-w-md">
        <section className="w-full min-w-0 rounded-3xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-md sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/30">
              <div className="grid h-full w-full place-items-center rounded-[10px] bg-[#0d0f1a] text-cyan-400">
                <Gamepad2 className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="font-cyber text-[10px] font-bold tracking-[0.24em] text-cyan-400 uppercase">
                Intercolegiales
              </p>
              <p className="font-cyber text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-400">
                SAN BENITO
              </p>
            </div>
          </div>

          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-cyber tracking-widest text-cyan-300 uppercase">
              Panel staff
            </div>
            <h1 className="mb-2 font-cyber text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
              Panel
            </h1>
            <p className="text-sm text-slate-400">
              Sesión iniciada. Desde el menú vas a poder entrar a las secciones
              del panel.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
