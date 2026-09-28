import { Link, useParams } from "react-router";
import { FixtureGroups } from "../../../../../components/torneos/FixtureGroups";
import { FixtureMatches } from "../../../../../components/torneos/FixtureMatches";
import { FixtureRegenerateDialog } from "../../../../../components/torneos/FixtureRegenerateDialog";
import { FixtureStandings } from "../../../../../components/torneos/FixtureStandings";
import { PanelHeading } from "../../../../../components/panel/PanelHeading";
import { PanelLoading } from "../../../../../components/panel/PanelLoading";
import { PanelPage } from "../../../../../components/panel/PanelPage";
import { panelGhostButtonClassName, panelPrimaryButtonClassName } from "../../../../../components/panel/panelClasses";
import { useFixtureAdmin } from "../../../../../helpers/useFixtureAdmin";
import { disciplineName } from "../../../../../helpers/teams";
import { formatLabel } from "../../../../../helpers/tournaments";

export function Component() {
  const { tournamentId = "" } = useParams();
  const admin = useFixtureAdmin(tournamentId);
  const tournament = admin.tournament;

  if (admin.loading) {
    return (
      <PanelPage>
        <PanelLoading label="Cargando fixture…" />
      </PanelPage>
    );
  }

  if (!tournament) {
    return (
      <PanelPage>
        <PanelHeading
          eyebrow="Fixture"
          title="Torneo"
          description="No encontramos este torneo."
          action={
            <Link to="/panel/torneos" className={panelGhostButtonClassName}>
              Volver a torneos
            </Link>
          }
        />
      </PanelPage>
    );
  }

  const back = (
    <Link to="/panel/torneos" className={panelGhostButtonClassName}>
      Volver a torneos
    </Link>
  );

  if (tournament.format !== "dos-grupos-final") {
    return (
      <PanelPage>
        <PanelHeading
          eyebrow="Fixture"
          title={disciplineName(tournament.disciplineId)}
          description={formatLabel(tournament.format)}
          action={back}
        />
        <p className="rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 px-4 py-5 text-sm text-slate-300">
          Este formato todavía no tiene armado de fixture.
        </p>
      </PanelPage>
    );
  }

  return (
    <PanelPage>
      <PanelHeading
        eyebrow="Fixture"
        title={disciplineName(tournament.disciplineId)}
        description={formatLabel(tournament.format)}
        action={back}
      />

      <FixtureGroups
        teams={admin.teams}
        teamIds={tournament.teamIds}
        groups={admin.groups}
        onMove={admin.moveTeam}
        onSave={() => void admin.saveGroups()}
        saving={admin.savingGroups}
        dirty={admin.groupsDirty}
        error={admin.groupsError}
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          Cada grupo juega todos contra todos. El 1.º de cada grupo va a la
          final y el 2.º juega el 3.º y 4.º puesto.
        </p>
        <button
          type="button"
          onClick={admin.requestGenerate}
          disabled={admin.generating}
          className={panelPrimaryButtonClassName}
        >
          {admin.generating
            ? "Armando…"
            : admin.hasGroupMatches
              ? "Regenerar fixture"
              : "Generar fixture"}
        </button>
      </div>
      {admin.generateError ? (
        <p role="alert" className="mt-3 text-sm text-rose-300">
          {admin.generateError}
        </p>
      ) : null}

      <div className="mt-8">
        <FixtureMatches
          tournamentId={tournament.id}
          groups={tournament.groups}
          matches={admin.matches}
          teams={admin.teams}
        />
      </div>

      {tournament.groups.some((group) => group.teamIds.length > 0) ? (
        <div className="mt-8">
          <FixtureStandings
            groups={tournament.groups}
            matches={admin.matches}
            teams={admin.teams}
          />
        </div>
      ) : null}

      <FixtureRegenerateDialog
        dialogRef={admin.regenerateDialogRef}
        generating={admin.generating}
        hasResults={admin.groupResults}
        onCancel={() => admin.regenerateDialogRef.current?.close()}
        onConfirm={admin.confirmGenerate}
      />
    </PanelPage>
  );
}
