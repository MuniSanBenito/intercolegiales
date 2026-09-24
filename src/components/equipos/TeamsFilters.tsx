import { useId } from "react";
import { DISCIPLINES, HOUSES } from "../../data/tournamentData";
import { isTeamCycle, TEAM_CYCLES, type TeamCycle } from "../../helpers/teams";
import { teamFieldClassName } from "./teamClasses";

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
      <div className="grid gap-2 md:col-span-2 xl:col-span-1">
        <label
          htmlFor={searchId}
          className="text-xs font-medium text-slate-300"
        >
          Buscar
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Nombre o escuela"
          className={teamFieldClassName}
        />
      </div>
      <div className="grid gap-2">
        <label
          htmlFor={houseFilterId}
          className="text-xs font-medium text-slate-300"
        >
          Escuela
        </label>
        <select
          id={houseFilterId}
          value={houseFilter}
          onChange={(event) => onHouseChange(event.target.value)}
          className={teamFieldClassName}
        >
          <option value="">Todas</option>
          {HOUSES.map((house) => (
            <option key={house.id} value={house.id}>
              {house.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label
          htmlFor={cycleFilterId}
          className="text-xs font-medium text-slate-300"
        >
          Ciclo
        </label>
        <select
          id={cycleFilterId}
          value={cycleFilter}
          onChange={(event) => {
            const value = event.target.value;
            onCycleChange(isTeamCycle(value) ? value : "");
          }}
          className={teamFieldClassName}
        >
          <option value="">Todos</option>
          {TEAM_CYCLES.map((cycle) => (
            <option key={cycle.value} value={cycle.value}>
              {cycle.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label
          htmlFor={disciplineFilterId}
          className="text-xs font-medium text-slate-300"
        >
          Disciplina
        </label>
        <select
          id={disciplineFilterId}
          value={disciplineFilter}
          onChange={(event) => onDisciplineChange(event.target.value)}
          className={teamFieldClassName}
        >
          <option value="">Todas</option>
          {DISCIPLINES.map((discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
