import type { RefObject } from "react";
import { tournamentLabel, type Tournament } from "../../helpers/tournaments";
import { PanelDeleteDialog } from "../panel/PanelDeleteDialog";

export function TournamentDeleteDialog({
  dialogRef,
  tournament,
  error,
  deleting,
  onCancel,
  onConfirm,
  onClose,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  tournament: Tournament | null;
  error: string | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <PanelDeleteDialog
      dialogRef={dialogRef}
      title="Eliminar torneo"
      description={
        <>
          ¿Eliminar el torneo{" "}
          <span className="font-semibold text-white">
            {tournament ? tournamentLabel(tournament) : ""}
          </span>
          ? Esta acción no se puede deshacer.
        </>
      }
      error={error}
      deleting={deleting}
      onCancel={onCancel}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
