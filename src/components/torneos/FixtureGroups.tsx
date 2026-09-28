import { unassignedTeamIds } from "../../helpers/fixtures";
import { cycleLabel, houseName, type Team } from "../../helpers/teams";
import type { GroupId, TournamentGroup } from "../../helpers/tournaments";
import {
  panelGhostButtonClassName,
  panelSubmitButtonClassName,
} from "../panel/panelClasses";

function teamCaption(team: Team) {
  return `${team.name} · ${houseName(team.houseId)} · ${cycleLabel(team.cycle)}`;
}

function TeamPool({
  title,
  teams,
  actions,
  onMove,
}: {
  title: string;
  teams: Team[];
  actions: { label: string; target: "none" | GroupId }[];
  onMove: (teamId: string, target: "none" | GroupId) => void;
}) {
  return (
    <section className="rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-4">
      <h2 className="font-cyber text-sm font-black tracking-wide text-white uppercase">
        {title}
        <span className="ml-2 text-slate-500">{teams.length}</span>
      </h2>
      {teams.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Sin equipos</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {teams.map((team) => (
            <li
              key={team.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="min-w-0 text-sm text-slate-100">
                {teamCaption(team)}
              </p>
              <div className="flex flex-wrap gap-2">
                {actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => onMove(team.id, action.target)}
                    className={panelGhostButtonClassName}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function FixtureGroups({
  teams,
  teamIds,
  groups,
  onMove,
  onSave,
  saving,
  dirty,
  error,
}: {
  teams: Team[];
  teamIds: string[];
  groups: TournamentGroup[];
  onMove: (teamId: string, target: "none" | GroupId) => void;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
  error: string | null;
}) {
  const byId = new Map(teams.map((team) => [team.id, team]));
  const visible = (ids: string[]) =>
    ids
      .flatMap((id) => {
        const team = byId.get(id);
        return team ? [team] : [];
      })
      .sort((left, right) => left.name.localeCompare(right.name, "es"));

  return (
    <div>
      <div className="grid gap-3 lg:grid-cols-3">
        <TeamPool
          title="Sin grupo"
          teams={visible(unassignedTeamIds(teamIds, groups))}
          actions={[
            { label: "Grupo A", target: "A" },
            { label: "Grupo B", target: "B" },
          ]}
          onMove={onMove}
        />
        <TeamPool
          title="Grupo A"
          teams={visible(groups.find((group) => group.id === "A")?.teamIds ?? [])}
          actions={[
            { label: "Grupo B", target: "B" },
            { label: "Quitar", target: "none" },
          ]}
          onMove={onMove}
        />
        <TeamPool
          title="Grupo B"
          teams={visible(groups.find((group) => group.id === "B")?.teamIds ?? [])}
          actions={[
            { label: "Grupo A", target: "A" },
            { label: "Quitar", target: "none" },
          ]}
          onMove={onMove}
        />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          {dirty
            ? "Hay cambios de grupos sin guardar."
            : "Cada equipo inscripto va en un solo grupo."}
        </p>
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !dirty}
          className={panelSubmitButtonClassName}
        >
          {saving ? "Guardando…" : "Guardar grupos"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
