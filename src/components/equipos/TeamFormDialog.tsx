import {
  useId,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  type SubmitEvent,
} from "react";
import { DISCIPLINES, HOUSES } from "../../data/tournamentData";
import { isTeamCycle, TEAM_CYCLES, type TeamDraft } from "../../helpers/teams";
import { teamDialogClassName, teamFieldClassName } from "./teamClasses";

export function TeamFormDialog({
  dialogRef,
  title,
  readOnly,
  saving,
  draft,
  setDraft,
  formError,
  onSubmit,
  onClose,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  readOnly: boolean;
  saving: boolean;
  draft: TeamDraft;
  setDraft: Dispatch<SetStateAction<TeamDraft>>;
  formError: string | null;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  const formTitleId = useId();
  const formErrorId = useId();
  const houseFieldId = useId();
  const cycleFieldId = useId();
  const nameFieldId = useId();
  const disciplineFieldId = useId();
  const sheetFieldId = useId();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={formTitleId}
      className={teamDialogClassName}
    >
      <form onSubmit={onSubmit}>
        <h2
          id={formTitleId}
          className="font-cyber text-lg font-black tracking-tight text-white uppercase"
        >
          {title}
        </h2>
        <fieldset disabled={readOnly || saving} className="mt-4 grid gap-3">
          <div className="grid gap-2">
            <label
              htmlFor={houseFieldId}
              className="text-xs font-medium text-slate-300"
            >
              Escuela
            </label>
            <select
              id={houseFieldId}
              required
              value={draft.houseId}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  houseId: event.target.value,
                }))
              }
              className={teamFieldClassName}
            >
              <option value="">Elegí una escuela</option>
              {HOUSES.map((house) => (
                <option key={house.id} value={house.id}>
                  {house.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label
              htmlFor={cycleFieldId}
              className="text-xs font-medium text-slate-300"
            >
              Ciclo
            </label>
            <select
              id={cycleFieldId}
              required
              value={draft.cycle}
              onChange={(event) => {
                const value = event.target.value;
                setDraft((current) => ({
                  ...current,
                  cycle: isTeamCycle(value) ? value : "",
                }));
              }}
              className={teamFieldClassName}
            >
              <option value="">Elegí un ciclo</option>
              {TEAM_CYCLES.map((cycle) => (
                <option key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label
              htmlFor={nameFieldId}
              className="text-xs font-medium text-slate-300"
            >
              Nombre
            </label>
            <input
              id={nameFieldId}
              required
              maxLength={80}
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className={teamFieldClassName}
            />
          </div>
          <div className="grid gap-2">
            <label
              htmlFor={disciplineFieldId}
              className="text-xs font-medium text-slate-300"
            >
              Disciplina
            </label>
            <select
              id={disciplineFieldId}
              required
              value={draft.disciplineId}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  disciplineId: event.target.value,
                }))
              }
              className={teamFieldClassName}
            >
              <option value="">Elegí una disciplina</option>
              {DISCIPLINES.map((discipline) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label
              htmlFor={sheetFieldId}
              className="text-xs font-medium text-slate-300"
            >
              Lista de buena fe
              <span className="text-slate-500"> (opcional)</span>
            </label>
            <input
              id={sheetFieldId}
              type="url"
              inputMode="url"
              placeholder="https://docs.google.com/spreadsheets/..."
              value={draft.sheetUrl}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  sheetUrl: event.target.value,
                }))
              }
              className={teamFieldClassName}
            />
          </div>
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
            className="inline-flex h-11 items-center rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {readOnly ? "Cerrar" : "Cancelar"}
          </button>
          {readOnly ? null : (
            <button
              type="submit"
              disabled={saving}
              aria-describedby={formError ? formErrorId : undefined}
              className="inline-flex h-11 items-center rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 px-4 font-cyber text-xs font-black tracking-widest text-black uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-70"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
}
