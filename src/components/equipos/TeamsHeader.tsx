import { Plus } from "lucide-react";
import { PanelHeading } from "../panel/PanelHeading";

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
    <PanelHeading
      eyebrow="Gestión"
      title="Equipos"
      description={
        loading
          ? "Cargando equipos…"
          : `${count} ${noun}${hasActiveQuery ? match : ""}.`
      }
      action={
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 px-4 font-cyber text-xs font-black tracking-widest text-black uppercase transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo equipo
        </button>
      }
    />
  );
}
