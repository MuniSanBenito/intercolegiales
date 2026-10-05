import { Link } from "react-router";
import { PanelHeading } from "../../../components/panel/PanelHeading";
import { disciplineName } from "../../../helpers/teams";
import { formatLabel } from "../../../helpers/tournaments";
import {
  publishedTournaments,
  useTournamentCatalog,
} from "../../../helpers/useTournamentCatalog";

export function Component() {
  const catalog = useTournamentCatalog();
  const tournaments = publishedTournaments(
    catalog.tournaments,
    catalog.matchesByTournament,
  );

  return (
    <>
      <PanelHeading
        eyebrow="Torneos"
        title="Fixture"
        description="Grupos, tablas y partidos de los torneos que ya están armados."
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
      ) : tournaments.length === 0 ? (
        <p className="rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 px-4 py-5 text-sm text-slate-400">
          Cuando un torneo tenga el fixture armado, o el podio cargado, va a
          aparecer acá.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {tournaments.map((tournament) => {
            const count = tournament.teamIds.length;
            const teamsLabel = count === 1 ? "1 equipo" : `${count} equipos`;

            return (
              <li key={tournament.id}>
                <Link
                  to={`/torneos/${tournament.id}`}
                  className="flex min-h-24 flex-col justify-center rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 px-4 py-4 transition-colors hover:border-cyan-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <h2 className="font-cyber text-base font-black tracking-tight text-white uppercase">
                    {disciplineName(tournament.disciplineId)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">
                    {formatLabel(tournament.format)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{teamsLabel}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
