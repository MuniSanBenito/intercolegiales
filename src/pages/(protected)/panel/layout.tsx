import { signOut } from "firebase/auth";
import {
  Gamepad2,
  Home,
  LoaderCircle,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { auth } from "../../../lib/firebase";

const navItems = [
  { label: "Inicio", icon: Home, current: true },
  { label: "Disciplinas", icon: Gamepad2, current: false },
  { label: "Equipos", icon: Users, current: false },
];

export function Component() {
  const navigate = useNavigate();
  const navId = useId();
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      if (event.matches) setOpen(false);
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!open || isDesktop) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isDesktop]);

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
    <div className="relative min-h-dvh bg-[#08090e] text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 cyber-grid-bg opacity-40" />
        <div className="absolute top-1/4 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-600/20 via-purple-600/20 to-pink-600/10 blur-[120px] sm:h-[480px] sm:w-[480px]" />
      </div>

      <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b border-cyan-500/20 bg-[#08090e]/90 px-4 backdrop-blur-md lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={navId}
          aria-label={open ? "Cerrar menú del panel" : "Abrir menú del panel"}
          onClick={() => setOpen((current) => !current)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
        <div className="min-w-0">
          <p className="font-cyber text-[10px] font-bold tracking-[0.24em] text-cyan-400 uppercase">
            Intercolegiales
          </p>
          <p className="truncate font-cyber text-sm font-black tracking-wider text-white">
            Panel
          </p>
        </div>
      </header>

      {open ? (
        <button
          type="button"
          aria-label="Cerrar menú del panel"
          onClick={() => setOpen(false)}
          className="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        id={navId}
        inert={!isDesktop && !open}
        className={`fixed top-16 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-cyan-500/30 bg-[#0c0e1a]/95 shadow-2xl shadow-cyan-950/40 backdrop-blur-md transition-transform duration-200 motion-reduce:transition-none lg:top-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-cyan-500/20 px-5 py-5">
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

        <nav
          aria-label="Secciones del panel"
          className="flex flex-1 flex-col gap-1 p-3"
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                aria-current={item.current ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 text-left font-cyber text-xs font-bold tracking-widest uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  item.current
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                    : "border-transparent text-slate-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300"
                }`}
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-cyan-400"
                  aria-hidden="true"
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-cyan-500/20 p-3">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            aria-busy={loading}
            className="grid h-12 w-full place-items-center rounded-xl border border-slate-700 bg-slate-900 font-cyber text-xs font-black tracking-widest text-slate-200 uppercase transition-transform duration-200 hover:scale-[1.02] hover:border-cyan-400/50 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-70"
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
        </div>
      </aside>

      <div className="relative z-10 min-h-[calc(100dvh-4rem)] lg:min-h-dvh lg:pl-72">
        <Outlet />
      </div>
    </div>
  );
}
