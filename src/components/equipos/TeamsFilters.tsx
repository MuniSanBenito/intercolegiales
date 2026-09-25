import { useId } from "react";
import { DISCIPLINES, HOUSES } from "../../data/tournamentData";
import { isTeamCycle, TEAM_CYCLES, type TeamCycle } from "../../helpers/teams";
import { PanelField } from "../panel/PanelField";
import { panelFieldClassName } from "../panel/panelClasses";

export function TeamsFilters({
  query,
  houseFilter,
  cycleFilter,
  disciplineFilter,
  onQueryChange,
  onHouseChange,
  onCycleChange,
  onDisciplineChange,
}: {
  query: string;
  houseFilter: string;
  cycleFilter: "" | TeamCycle;
  disciplineFilter: string;
  onQueryChange: (value: string) => void;
  onHouseChange: (value: string) => void;
  onCycleChange: (value: string) => void;
  onDisciplineChange: (value: string) => void;
}) {
  const searchId = useId();
  const houseFilterId = useId();
  const cycleFilterId = useId();
  const disciplineFilterId = useId();

  return (
    <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <PanelField
        id={searchId}
        label="Buscar"
        className="md:col-span-2 xl:col-span-1"
      >
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Nombre o escuela"
          className={panelFieldClassName}
        />
      </PanelField>
      <PanelField id={houseFilterId} label="Escuela">
        <select
          id={houseFilterId}
          value={houseFilter}
          onChange={(event) => onHouseChange(event.target.value)}
          className={panelFieldClassName}
        >
          <option value="">Todas</option>
          {HOUSES.map((house) => (
            <option key={house.id} value={house.id}>
              {house.name}
            </option>
          ))}
        </select>
      </PanelField>
      <PanelField id={cycleFilterId} label="Ciclo">
        <select
          id={cycleFilterId}
          value={cycleFilter}
          onChange={(event) => {
            const value = event.target.value;
            onCycleChange(isTeamCycle(value) ? value : "");
          }}
          className={panelFieldClassName}
        >
          <option value="">Todos</option>
          {TEAM_CYCLES.map((cycle) => (
            <option key={cycle.value} value={cycle.value}>
              {cycle.label}
            </option>
          ))}
        </select>
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
    </div>
  );
}
