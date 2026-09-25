import { useId } from "react";
import { DISCIPLINES } from "../../data/tournamentData";
import {
  isTournamentFormat,
  TOURNAMENT_FORMATS,
  type TournamentFormat,
} from "../../helpers/tournaments";
import { PanelField } from "../panel/PanelField";
import { panelFieldClassName } from "../panel/panelClasses";

export function TournamentsFilters({
  query,
  disciplineFilter,
  formatFilter,
  onQueryChange,
  onDisciplineChange,
  onFormatChange,
}: {
  query: string;
  disciplineFilter: string;
  formatFilter: "" | TournamentFormat;
  onQueryChange: (value: string) => void;
  onDisciplineChange: (value: string) => void;
  onFormatChange: (value: string) => void;
}) {
  const searchId = useId();
  const disciplineFilterId = useId();
  const formatFilterId = useId();

  return (
    <div className="mb-4 grid gap-3 md:grid-cols-3">
      <PanelField id={searchId} label="Buscar">
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Disciplina, formato o equipo"
          className={panelFieldClassName}
        />
      </PanelField>
      <PanelField id={disciplineFilterId} label="Disciplina">
        <select
          id={disciplineFilterId}
          value={disciplineFilter}
          onChange={(event) => onDisciplineChange(event.target.value)}
          className={panelFieldClassName}
        >
          <option value="">Todas</option>
          {DISCIPLINES.map((discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.name}
            </option>
          ))}
        </select>
      </PanelField>
      <PanelField id={formatFilterId} label="Formato">
        <select
          id={formatFilterId}
          value={formatFilter}
          onChange={(event) => {
            const value = event.target.value;
            onFormatChange(isTournamentFormat(value) ? value : "");
          }}
          className={panelFieldClassName}
        >
          <option value="">Todos</option>
          {TOURNAMENT_FORMATS.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
      </PanelField>
    </div>
  );
}
