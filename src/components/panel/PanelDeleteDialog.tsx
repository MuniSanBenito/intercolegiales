import { useId, type ReactNode, type RefObject } from "react";
import {
  panelDangerButtonClassName,
  panelDialogClassName,
  panelGhostButtonClassName,
} from "./panelClasses";

export function PanelDeleteDialog({
  dialogRef,
  title,
  description,
  error,
  deleting,
  onCancel,
  onConfirm,
  onClose,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  description: ReactNode;
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
      className={panelDialogClassName}
      onClose={onClose}
    >
      <h2
        id={deleteTitleId}
        className="font-cyber text-lg font-black tracking-tight text-white uppercase"
      >
        {title}
      </h2>
      <p className="mt-3 text-sm text-slate-300">{description}</p>
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
          className={panelGhostButtonClassName}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={deleting}
          aria-describedby={error ? deleteErrorId : undefined}
          className={panelDangerButtonClassName}
        >
          {deleting ? "Eliminando…" : "Eliminar"}
        </button>
      </div>
    </dialog>
  );
}
