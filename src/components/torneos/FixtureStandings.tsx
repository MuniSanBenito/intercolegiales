import { rankedStandings, type Match } from "../../helpers/fixtures";
import type { Team } from "../../helpers/teams";
import type { TournamentGroup } from "../../helpers/tournaments";

function formatDifference(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

export function FixtureStandings({
  groups,
  matches,
  teams,
}: {
  groups: TournamentGroup[];
  matches: Match[];
  teams: Team[];
}) {
  const teamName = (teamId: string) =>
    teams.find((team) => team.id === teamId)?.name ?? "Equipo eliminado";

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {groups.map((group) => {
        const rows = rankedStandings(
          group.teamIds,
          matches.filter(
            (match) => match.stage === "grupos" && match.groupId === group.id,
          ),
        );

        return (
          <section
            key={group.id}
            className="overflow-x-auto rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90"
          >
            <table className="w-full min-w-[36rem] text-left text-sm">
              <caption className="px-4 py-3 text-left font-cyber text-sm font-black tracking-wide text-white uppercase">
                Tabla de {group.name}
              </caption>
              <thead className="text-[11px] tracking-wide text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">Pos</th>
                  <th className="px-3 py-2 font-medium">Equipo</th>
                  {(
                    [
                      ["PJ", "Partidos jugados"],
                      ["PG", "Partidos ganados"],
                      ["PE", "Partidos empatados"],
                      ["PP", "Partidos perdidos"],
                      ["GF", "Tantos a favor"],
                      ["GC", "Tantos en contra"],
                      ["DG", "Diferencia"],
                      ["Pts", "Puntos"],
                    ] as const
                  ).map(([label, title]) => (
                    <th key={label} className="px-2 py-2 text-right font-medium">
                      <abbr title={title} className="no-underline">
                        {label}
                      </abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-4 text-slate-500">
                      Sin equipos en este grupo.
                    </td>
                  </tr>
                ) : (
                  rows.map(({ rank, row }) => (
                    <tr key={row.teamId} className="border-t border-slate-800">
                      <td className="px-3 py-2 text-slate-400">{rank}</td>
                      <th
                        scope="row"
                        className="px-3 py-2 font-medium text-slate-100"
                      >
                        {teamName(row.teamId)}
                      </th>
                      {(
                        [
                          row.played,
                          row.won,
                          row.drawn,
                          row.lost,
                          row.goalsFor,
                          row.goalsAgainst,
                          formatDifference(row.goalDifference),
                          row.points,
                        ] as const
                      ).map((value, index) => (
                        <td
                          key={`${row.teamId}-${index}`}
                          className={`px-2 py-2 text-right ${
                            index === 7
                              ? "font-semibold text-cyan-200"
                              : "text-slate-300"
                          }`}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        );
      })}
    </div>
  );
}
