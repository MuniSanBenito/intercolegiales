import type { RefObject } from "react";
import {
  panelDangerButtonClassName,
  panelDialogClassName,
  panelGhostButtonClassName,
} from "../panel/panelClasses";

export function FixtureRegenerateDialog({
  dialogRef,
  generating,
  hasResults,
  onCancel,
  onConfirm,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  generating: boolean;
  hasResults: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="regenerar-fixture-titulo"
      className={panelDialogClassName}
    >
      <h2
        id="regenerar-fixture-titulo"
        className="font-cyber text-lg font-black tracking-tight text-white uppercase"
      >
        Regenerar fase de grupos
      </h2>
      <p className="mt-3 text-sm text-slate-300">
        {hasResults
          ? "Se vuelven a crear los partidos de grupo y se pierden los marcadores, la cancha y el horario de esa fase. La final y el partido por el 3.º y 4.º puesto se conservan."
          : "Se vuelven a crear los partidos de grupo. La cancha y el horario de esa fase se cargan de nuevo desde la disciplina. La final y el 3.º y 4.º puesto se conservan."}
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className={panelGhostButtonClassName}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={generating}
          className={panelDangerButtonClassName}
        >
          {generating ? "Regenerando…" : "Regenerar"}
        </button>
      </div>
    </dialog>
  );
}
