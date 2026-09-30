import { rankedStandings, type Match } from "../../helpers/fixtures";
import type { Team } from "../../helpers/teams";

function formatDifference(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

export function FixtureStandings({
  title,
  teamIds,
  matches,
  teams,
}: {
  title: string;
  teamIds: string[];
  matches: Match[];
  teams: Team[];
}) {
  const teamName = (teamId: string) =>
    teams.find((team) => team.id === teamId)?.name ?? "Equipo eliminado";
  const rows = rankedStandings(teamIds, matches);

  return (
    <div className="grid gap-3">
      <section className="overflow-x-auto rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90">
        <table className="w-full min-w-[36rem] text-left text-sm lg:min-w-full">
          <caption className="px-4 py-3 text-left font-cyber text-sm font-black tracking-wide text-white uppercase">
            {title}
          </caption>
          <thead className="border-b border-slate-800 text-[11px] tracking-wide text-slate-400 uppercase">
            <tr>
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">Pos</th>
              <th className="w-full px-3 py-2.5 font-medium">Equipo</th>
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
              ).map(([label, hint]) => (
                <th
                  key={label}
                  className="px-3 py-2.5 text-right font-medium whitespace-nowrap"
                >
                  <abbr title={hint} className="no-underline">
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
                  Sin equipos.
                </td>
              </tr>
            ) : (
              rows.map(({ rank, row }) => (
                <tr key={row.teamId} className="border-t border-slate-800">
                  <td className="px-4 py-2.5 text-slate-400 tabular-nums">
                    {rank}
                  </td>
                  <th
                    scope="row"
                    className="px-3 py-2.5 font-medium break-words text-slate-100"
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
                      className={`px-3 py-2.5 text-right whitespace-nowrap tabular-nums ${
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
    </div>
  );
}
