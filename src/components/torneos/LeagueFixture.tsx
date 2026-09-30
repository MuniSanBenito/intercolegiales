import type { RefObject } from "react";
import { Link } from "react-router";
import type { Match } from "../../helpers/fixtures";
import type { Team } from "../../helpers/teams";
import { disciplineName } from "../../helpers/teams";
import type { Tournament } from "../../helpers/tournaments";
import { formatLabel } from "../../helpers/tournaments";
import { PanelHeading } from "../panel/PanelHeading";
import { PanelPage } from "../panel/PanelPage";
import {
  panelGhostButtonClassName,
  panelPrimaryButtonClassName,
} from "../panel/panelClasses";
import { FixtureMatches } from "./FixtureMatches";
import { FixtureRegenerateDialog } from "./FixtureRegenerateDialog";
import { FixtureStandings } from "./FixtureStandings";

export function LeagueFixture({
  tournament,
  teams,
  matches,
  generating,
  generateError,
  hasMatches,
  hasResults,
  regenerateDialogRef,
  onGenerate,
  onConfirmGenerate,
}: {
  tournament: Tournament;
  teams: Team[];
  matches: Match[];
  generating: boolean;
  generateError: string | null;
  hasMatches: boolean;
  hasResults: boolean;
  regenerateDialogRef: RefObject<HTMLDialogElement | null>;
  onGenerate: () => void;
  onConfirmGenerate: () => void;
}) {
  const tableMatches = matches.filter((match) => match.stage === "liga");

  return (
    <PanelPage>
      <PanelHeading
        eyebrow="Fixture"
        title={disciplineName(tournament.disciplineId)}
        description={formatLabel(tournament.format)}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onGenerate}
              disabled={generating}
              className={panelPrimaryButtonClassName}
            >
              {generating
                ? "Armando…"
                : hasMatches
                  ? "Regenerar fixture"
                  : "Generar fixture"}
            </button>
            <Link to="/panel/torneos" className={panelGhostButtonClassName}>
              Volver a torneos
            </Link>
          </div>
        }
      />

      <p className="mt-4 max-w-2xl text-sm text-slate-400">
        Todos los equipos inscriptos juegan entre sí. El 1.º, el 2.º y el 3.º
        salen de la tabla cuando cada partido tiene marcador. Si hay empate en
        un puesto, ese puesto queda sin definir.
      </p>

      {generateError ? (
        <p role="alert" className="mt-3 text-sm text-rose-300">
          {generateError}
        </p>
      ) : null}

      {tableMatches.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 px-4 py-5 text-sm text-slate-400">
          Todavía no hay partidos. Generá el fixture con los equipos inscriptos.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <FixtureStandings
            title="Tabla"
            teamIds={tournament.teamIds}
            matches={tableMatches}
            teams={teams}
          />
          <FixtureMatches
            tournamentId={tournament.id}
            section="liga"
            groups={tournament.groups}
            matches={matches}
            teams={teams}
          />
        </div>
      )}

      <FixtureRegenerateDialog
        dialogRef={regenerateDialogRef}
        generating={generating}
        hasResults={hasResults}
        title="Regenerar fixture"
        description={
          hasResults
            ? "Se vuelven a crear todos los partidos y se pierden los marcadores, la cancha y el horario."
            : "Se vuelven a crear todos los partidos. La cancha se carga de nuevo desde la disciplina."
        }
        onCancel={() => regenerateDialogRef.current?.close()}
        onConfirm={onConfirmGenerate}
      />
    </PanelPage>
  );
}
