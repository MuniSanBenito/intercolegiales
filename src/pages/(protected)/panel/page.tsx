import { signOut } from "firebase/auth";
import { Gamepad2, LoaderCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../../../lib/firebase";

export function Component() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh [align-items:safe_center] bg-[#08090e] px-4 py-6 text-slate-100 sm:py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 cyber-grid-bg opacity-40" />
        <div className="absolute top-1/4 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-600/20 via-purple-600/20 to-pink-600/10 blur-[120px] sm:h-[480px] sm:w-[480px]" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-md">
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

          <div className="mb-6">
            <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-cyber tracking-widest text-cyan-300 uppercase">
              Panel staff
            </div>
            <h1 className="mb-2 font-cyber text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
              Panel
            </h1>
            <p className="text-sm text-slate-400">
              Sesión iniciada. Usá el botón para cerrar sesión y volver al login.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            aria-busy={loading}
            className="grid h-12 w-full place-items-center rounded-xl border border-slate-700 bg-slate-900 font-cyber text-xs font-black tracking-widest text-slate-200 uppercase transition-transform duration-200 hover:scale-[1.02] hover:border-cyan-400/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
          >
            <span
              className={`col-start-1 row-start-1 inline-flex items-center gap-2 ${loading ? "opacity-0" : "opacity-100"}`}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Cerrar sesión
            </span>
            <span
              className={`col-start-1 row-start-1 ${loading ? "opacity-100" : "opacity-0"}`}
              aria-hidden={!loading}
            >
              <LoaderCircle className="h-5 w-5 animate-spin" />
            </span>
          </button>
        </section>
      </main>
    </div>
  );
}
