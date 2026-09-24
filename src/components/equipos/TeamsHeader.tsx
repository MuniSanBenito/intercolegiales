import { Plus } from "lucide-react";

export function TeamsHeader({
  loading,
  count,
  hasActiveQuery,
  onCreate,
}: {
  loading: boolean;
  count: number;
  hasActiveQuery: boolean;
  onCreate: () => void;
}) {
  const noun = count === 1 ? "equipo" : "equipos";
  const match = count === 1 ? " encontrado" : " encontrados";

  return (
    <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-cyber tracking-widest text-cyan-300 uppercase">
          Gestión
        </div>
        <h1 className="font-cyber text-2xl font-black tracking-tight text-white uppercase">
          Equipos
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {loading
            ? "Cargando equipos…"
            : `${count} ${noun}${hasActiveQuery ? match : ""}.`}
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 px-4 font-cyber text-xs font-black tracking-widest text-black uppercase transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Nuevo equipo
      </button>
    </header>
  );
}
