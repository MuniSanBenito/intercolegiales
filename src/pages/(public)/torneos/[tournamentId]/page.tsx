import { Link, useParams } from "react-router";
import { PanelHeading } from "../../../../components/panel/PanelHeading";
import { PublicTournamentView } from "../../../../components/public/PublicTournamentView";
import { disciplineName } from "../../../../helpers/teams";
import { formatLabel } from "../../../../helpers/tournaments";
import {
  isTournamentPublished,
  useTournamentCatalog,
} from "../../../../helpers/useTournamentCatalog";

const backClassName =
  "inline-flex min-h-11 items-center rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400";

export function Component() {
  const { tournamentId = "" } = useParams();
  const catalog = useTournamentCatalog();
  const tournament =
    catalog.tournaments.find((item) => item.id === tournamentId) ?? null;
  const matches = catalog.matchesByTournament[tournamentId] ?? [];
  const back = (
    <Link to="/torneos" className={backClassName}>
      Volver a torneos
    </Link>
  );

  if (catalog.loading) {
    return (
      <p role="status" className="text-sm text-slate-400">
        Cargando torneo…
      </p>
    );
  }

  if (catalog.error) {
    return (
      <>
        <PanelHeading
          eyebrow="Torneo"
          title="Fixture"
          description={catalog.error}
          action={back}
        />
      </>
    );
  }

  if (!tournament) {
    return (
      <PanelHeading
        eyebrow="Torneo"
        title="Fixture"
        description="No encontramos este torneo."
        action={back}
      />
    );
  }

  if (!isTournamentPublished(tournament, matches)) {
    return (
      <PanelHeading
        eyebrow="Torneo"
        title={disciplineName(tournament.disciplineId)}
        description="Este torneo todavía no está armado."
        action={back}
      />
    );
  }

  return (
    <>
      <PanelHeading
        eyebrow="Torneo"
        title={disciplineName(tournament.disciplineId)}
        description={formatLabel(tournament.format)}
        action={back}
      />
      <PublicTournamentView
        tournament={tournament}
        teams={catalog.teams}
        matches={matches}
      />
    </>
  );
}
