import { Plus } from "lucide-react";
import { PanelHeading } from "../panel/PanelHeading";
import { PanelPrimaryButton } from "../panel/PanelPrimaryButton";

export function TournamentsHeader({
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
  const noun = count === 1 ? "torneo" : "torneos";
  const match = count === 1 ? " encontrado" : " encontrados";

  return (
    <PanelHeading
      eyebrow="Gestión"
      title="Torneos"
      description={
        loading
          ? "Cargando torneos…"
          : `${count} ${noun}${hasActiveQuery ? match : ""}.`
      }
      action={
        <PanelPrimaryButton onClick={onCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo torneo
        </PanelPrimaryButton>
      }
    />
  );
}
