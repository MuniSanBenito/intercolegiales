import {
  useId,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  type SubmitEvent,
} from "react";
import { DISCIPLINES } from "../../data/tournamentData";
import { cycleLabel, houseName, type Team } from "../../helpers/teams";
import {
  isTournamentFormat,
  teamsForDiscipline,
  TOURNAMENT_FORMATS,
  type TournamentDraft,
} from "../../helpers/tournaments";
import { PanelField } from "../panel/PanelField";
import { PanelFormDialog } from "../panel/PanelFormDialog";
import { panelFieldClassName } from "../panel/panelClasses";

export function TournamentFormDialog({
  dialogRef,
  title,
  readOnly,
  saving,
  draft,
  setDraft,
  teams,
  formError,
  onSubmit,
  onClose,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  readOnly: boolean;
  saving: boolean;
  draft: TournamentDraft;
  setDraft: Dispatch<SetStateAction<TournamentDraft>>;
  teams: Team[];
  formError: string | null;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  const disciplineFieldId = useId();
  const formatFieldId = useId();
  const teamsLabelId = useId();
  const eligibleTeams = teamsForDiscipline(teams, draft.disciplineId);
  const selectedCount = draft.teamIds.filter((teamId) =>
    eligibleTeams.some((team) => team.id === teamId),
  ).length;

  return (
    <PanelFormDialog
      dialogRef={dialogRef}
      title={title}
      readOnly={readOnly}
      saving={saving}
      formError={formError}
      onSubmit={onSubmit}
      onClose={onClose}
    >
      <PanelField id={disciplineFieldId} label="Disciplina">
        <select
          id={disciplineFieldId}
          required
          value={draft.disciplineId}
          onChange={(event) => {
            const disciplineId = event.target.value;
            setDraft((current) => ({
              ...current,
              disciplineId,
              teamIds:
                current.disciplineId === disciplineId ? current.teamIds : [],
            }));
          }}
          className={panelFieldClassName}
        >
          <option value="">Elegí una disciplina</option>
          {DISCIPLINES.map((discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.name}
            </option>
          ))}
        </select>
      </PanelField>
      <PanelField id={formatFieldId} label="Formato">
        <select
          id={formatFieldId}
          required
          value={draft.format}
          onChange={(event) => {
            const value = event.target.value;
            setDraft((current) => ({
              ...current,
              format: isTournamentFormat(value) ? value : "",
            }));
          }}
          className={panelFieldClassName}
        >
          <option value="">Elegí un formato</option>
          {TOURNAMENT_FORMATS.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
      </PanelField>
      <div className="grid gap-2">
        <p id={teamsLabelId} className="text-xs font-medium text-slate-300">
          Equipos
          {draft.disciplineId ? (
            <span className="text-slate-500">
              {" "}
              (
              {selectedCount === 1
                ? "1 seleccionado"
                : `${selectedCount} seleccionados`}
              )
            </span>
          ) : null}
        </p>
        {draft.disciplineId ? (
          eligibleTeams.length === 0 ? (
            <p className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
              No hay equipos cargados para esta disciplina.
            </p>
          ) : (
            <div
              role="group"
              aria-labelledby={teamsLabelId}
              className="grid max-h-60 gap-2 overflow-y-auto pr-1"
            >
              {eligibleTeams.map((team) => {
                const checked = draft.teamIds.includes(team.id);

                return (
                  <label
                    key={team.id}
                    className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setDraft((current) => ({
                          ...current,
                          teamIds: current.teamIds.includes(team.id)
                            ? current.teamIds.filter((id) => id !== team.id)
                            : [...current.teamIds, team.id],
                        }))
                      }
                      className="h-4 w-4 shrink-0 accent-cyan-400"
                    />
                    <span className="min-w-0">
                      <span className="block break-words">{team.name}</span>
                      <span className="block text-xs text-slate-400">
                        {houseName(team.houseId)}
                        <span aria-hidden="true"> · </span>
                        {cycleLabel(team.cycle)}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )
        ) : (
          <p className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
            Elegí una disciplina para ver los equipos.
          </p>
        )}
      </div>
    </PanelFormDialog>
  );
}
