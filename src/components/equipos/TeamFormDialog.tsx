import {
  useId,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  type SubmitEvent,
} from "react";
import { DISCIPLINES, HOUSES } from "../../data/tournamentData";
import { isTeamCycle, TEAM_CYCLES, type TeamDraft } from "../../helpers/teams";
import { PanelField } from "../panel/PanelField";
import { PanelFormDialog } from "../panel/PanelFormDialog";
import { panelFieldClassName } from "../panel/panelClasses";

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
  const houseFieldId = useId();
  const cycleFieldId = useId();
  const nameFieldId = useId();
  const disciplineFieldId = useId();
  const sheetFieldId = useId();

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
      <PanelField id={houseFieldId} label="Escuela">
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
          className={panelFieldClassName}
        >
          <option value="">Elegí una escuela</option>
          {HOUSES.map((house) => (
            <option key={house.id} value={house.id}>
              {house.name}
            </option>
          ))}
        </select>
      </PanelField>
      <PanelField id={cycleFieldId} label="Ciclo">
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
          className={panelFieldClassName}
        >
          <option value="">Elegí un ciclo</option>
          {TEAM_CYCLES.map((cycle) => (
            <option key={cycle.value} value={cycle.value}>
              {cycle.label}
            </option>
          ))}
        </select>
      </PanelField>
      <PanelField id={nameFieldId} label="Nombre">
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
          className={panelFieldClassName}
        />
      </PanelField>
      <PanelField id={disciplineFieldId} label="Disciplina">
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
      <PanelField
        id={sheetFieldId}
        label={
          <>
            Lista de buena fe
            <span className="text-slate-500"> (opcional)</span>
          </>
        }
      >
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
          className={panelFieldClassName}
        />
      </PanelField>
    </PanelFormDialog>
  );
}
