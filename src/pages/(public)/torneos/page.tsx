import { Link } from "react-router";
import { PanelHeading } from "../../../components/panel/PanelHeading";
import type { Match } from "../../../helpers/fixtures";
import { disciplineName } from "../../../helpers/teams";
import {
  formatEventDate,
  formatLabel,
  isEventDate,
  isRankingFormat,
  type Tournament,
} from "../../../helpers/tournaments";
import {
  publishedTournaments,
  useTournamentCatalog,
} from "../../../helpers/useTournamentCatalog";

const UNDATED = "Sin fecha";

function tournamentDay(tournament: Tournament, matches: Match[]) {
  if (isRankingFormat(tournament.format)) {
    const date = tournament.event?.eventDate ?? "";
    return isEventDate(date) ? date : UNDATED;
  }

  const dates = matches
    .map((match) => match.startsAt?.slice(0, 10) ?? "")
    .filter((date) => isEventDate(date))
    .sort();

  return dates[0] ?? UNDATED;
}

function tournamentsByDay(
  tournaments: Tournament[],
  matchesByTournament: Record<string, Match[]>,
) {
  const groups = new Map<string, Tournament[]>();

  for (const tournament of tournaments) {
    const day = tournamentDay(
      tournament,
      matchesByTournament[tournament.id] ?? [],
    );
    const current = groups.get(day) ?? [];
    current.push(tournament);
    groups.set(day, current);
  }

  return [...groups.keys()]
    .sort((left, right) => {
      if (left === UNDATED) return 1;
      if (right === UNDATED) return -1;
      return left.localeCompare(right);
    })
    .map((day) => ({
      day,
      label: day === UNDATED ? UNDATED : formatEventDate(day),
      tournaments: groups.get(day) ?? [],
    }));
}

export function Component() {
  const catalog = useTournamentCatalog();
  const tournaments = publishedTournaments(
    catalog.tournaments,
    catalog.matchesByTournament,
  );
  const days = tournamentsByDay(tournaments, catalog.matchesByTournament);

  return (
    <>
      <PanelHeading
        eyebrow="Torneos"
        title="Agenda"
        description="Pruebas por día y fixtures de los torneos que ya están armados."
      />

      {catalog.loading ? (
        <p role="status" className="text-sm text-slate-400">
          Cargando torneos…
        </p>
      ) : catalog.error ? (
        <p
          role="alert"
          className="rounded-2xl border border-rose-400/30 bg-rose-950/40 px-4 py-5 text-sm text-rose-200"
        >
          {catalog.error}
        </p>
      ) : days.length === 0 ? (
        <p className="rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 px-4 py-5 text-sm text-slate-400">
          Cuando haya una prueba cargada, o un torneo con el fixture armado, va
          a aparecer acá.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {days.map((group) => (
            <section key={group.day} aria-labelledby={`dia-${group.day}`}>
              <h2
                id={`dia-${group.day}`}
                className="font-cyber text-sm font-black tracking-widest text-cyan-300 uppercase"
              >
                {group.label}
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {group.tournaments.map((tournament) => {
                  const ranking = isRankingFormat(tournament.format);
                  const count = tournament.teamIds.length;
                  const teamsLabel =
                    count === 1 ? "1 equipo" : `${count} equipos`;

                  return (
                    <li key={tournament.id}>
                      <Link
                        to={`/torneos/${tournament.id}`}
                        className="flex min-h-24 flex-col justify-center rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 px-4 py-4 transition-colors hover:border-cyan-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        <h3 className="font-cyber text-base font-black tracking-tight text-white uppercase">
                          {disciplineName(tournament.disciplineId)}
                        </h3>
                        {ranking ? (
                          <>
                            <p className="mt-1 text-sm text-slate-300">
                              {tournament.event?.venue || "Sin lugar"}
                            </p>
                            {tournament.event?.details ? (
                              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                {tournament.event.details}
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <>
                            <p className="mt-1 text-sm text-slate-300">
                              {formatLabel(tournament.format)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {teamsLabel}
                            </p>
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
