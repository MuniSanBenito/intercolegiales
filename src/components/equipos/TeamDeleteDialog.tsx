import { useId, type RefObject } from "react";
import type { Team } from "../../helpers/teams";
import { teamDialogClassName } from "./teamClasses";

export function TeamDeleteDialog({
  dialogRef,
  team,
  error,
  deleting,
  onCancel,
  onConfirm,
  onClose,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  team: Team | null;
  error: string | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const deleteTitleId = useId();
  const deleteErrorId = useId();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={deleteTitleId}
      className={teamDialogClassName}
      onClose={onClose}
    >
      <h2
        id={deleteTitleId}
        className="font-cyber text-lg font-black tracking-tight text-white uppercase"
      >
        Eliminar equipo
      </h2>
      <p className="mt-3 text-sm text-slate-300">
        ¿Eliminar el equipo{" "}
        <span className="font-semibold text-white">{team?.name}</span>? Esta
        acción no se puede deshacer.
      </p>
      {error ? (
        <p
          id={deleteErrorId}
          role="alert"
          className="mt-3 text-sm text-rose-300"
        >
          {error}
        </p>
      ) : null}
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-11 items-center rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={deleting}
          aria-describedby={error ? deleteErrorId : undefined}
          className="inline-flex h-11 items-center rounded-xl border border-rose-400/40 bg-rose-500/15 px-4 font-cyber text-xs font-black tracking-widest text-rose-200 uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 disabled:opacity-70"
        >
          {deleting ? "Eliminando…" : "Eliminar"}
        </button>
      </div>
    </dialog>
  );
}
