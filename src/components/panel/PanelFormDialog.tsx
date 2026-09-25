import { useId, type ReactNode, type RefObject, type SubmitEvent } from "react";
import {
  panelDialogClassName,
  panelGhostButtonClassName,
  panelSubmitButtonClassName,
} from "./panelClasses";

export function PanelFormDialog({
  dialogRef,
  title,
  readOnly,
  saving,
  formError,
  onSubmit,
  onClose,
  children,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  readOnly: boolean;
  saving: boolean;
  formError: string | null;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const formTitleId = useId();
  const formErrorId = useId();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={formTitleId}
      className={panelDialogClassName}
    >
      <form onSubmit={onSubmit}>
        <h2
          id={formTitleId}
          className="font-cyber text-lg font-black tracking-tight text-white uppercase"
        >
          {title}
        </h2>
        <fieldset disabled={readOnly || saving} className="mt-4 grid gap-3">
          {children}
        </fieldset>
        {formError ? (
          <p
            id={formErrorId}
            role="alert"
            className="mt-3 text-sm text-rose-300"
          >
            {formError}
          </p>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={panelGhostButtonClassName}
          >
            {readOnly ? "Cerrar" : "Cancelar"}
          </button>
          {readOnly ? null : (
            <button
              type="submit"
              disabled={saving}
              aria-describedby={formError ? formErrorId : undefined}
              className={panelSubmitButtonClassName}
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
}
