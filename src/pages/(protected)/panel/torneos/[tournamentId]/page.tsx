import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { PanelHeading } from "../../../../../components/panel/PanelHeading";
import { PanelLoading } from "../../../../../components/panel/PanelLoading";
import { PanelPage } from "../../../../../components/panel/PanelPage";
import {
  panelDialogClassName,
  panelGhostButtonClassName,
  panelPrimaryButtonClassName,
} from "../../../../../components/panel/panelClasses";
import { FixtureGroups } from "../../../../../components/torneos/FixtureGroups";
import {
  FixtureMatches,
  type FixtureSection,
} from "../../../../../components/torneos/FixtureMatches";
import { FixtureRegenerateDialog } from "../../../../../components/torneos/FixtureRegenerateDialog";
import { FixtureStandings } from "../../../../../components/torneos/FixtureStandings";
import { disciplineName } from "../../../../../helpers/teams";
import { formatLabel } from "../../../../../helpers/tournaments";
import { useFixtureAdmin } from "../../../../../helpers/useFixtureAdmin";

export function Component() {
  const { tournamentId = "" } = useParams();
  const admin = useFixtureAdmin(tournamentId);
  const tournament = admin.tournament;
  const [section, setSection] = useState<FixtureSection>("A");
  const groupsDialogRef = useRef<HTMLDialogElement>(null);
  const [groupsOpen, setGroupsOpen] = useState(false);
  const [groupsReady, setGroupsReady] = useState(false);

  if (!admin.loading && !groupsReady) {
    setGroupsReady(true);
    setGroupsOpen(!admin.hasGroupMatches);
  }

  useEffect(() => {
    const dialog = groupsDialogRef.current;
    if (!dialog || !groupsOpen || dialog.open) return;
    dialog.showModal();
  }, [groupsOpen]);

  const dismissGroups = () => {
    setGroupsOpen(false);
    if (groupsDialogRef.current?.open) groupsDialogRef.current.close();
  };

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

  const selectedGroup = tournament.groups.find((group) => group.id === section);

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
              onClick={() => setGroupsOpen(true)}
              className={panelGhostButtonClassName}
            >
              Armar grupos
            </button>
            {back}
          </div>
        }
      />

      <dialog
        ref={groupsDialogRef}
        aria-labelledby="armar-grupos-titulo"
        className={panelDialogClassName}
        onCancel={(event) => {
          if (admin.groupsDirty) event.preventDefault();
        }}
        onClose={() => setGroupsOpen(false)}
      >
        <h2
          id="armar-grupos-titulo"
          className="font-cyber text-lg font-black tracking-tight text-white uppercase"
        >
          Armar grupos
        </h2>
        <div className="mt-4">
          <FixtureGroups
            teams={admin.teams}
            teamIds={tournament.teamIds}
            groups={admin.groups}
            onMove={admin.moveTeam}
            onSave={() => {
              void admin.saveGroups().then((saved) => {
                if (saved) dismissGroups();
              });
            }}
            saving={admin.savingGroups}
            dirty={admin.groupsDirty}
            error={admin.groupsError}
          />

          <div className="mt-6 flex flex-col gap-3">
            <p className="text-sm text-slate-400">
              Cada grupo juega todos contra todos. El 1.º de cada grupo va a la
              final y el 2.º juega el 3.º y 4.º puesto.
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={dismissGroups}
                disabled={admin.groupsDirty}
                className={panelGhostButtonClassName}
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  void admin.requestGenerate().then((generated) => {
                    if (generated) dismissGroups();
                  });
                }}
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
          </div>
          {admin.generateError ? (
            <p role="alert" className="mt-3 text-sm text-rose-300">
              {admin.generateError}
            </p>
          ) : null}
        </div>
      </dialog>

      {admin.matches.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 px-4 py-5 text-sm text-slate-400">
          Todavía no hay partidos. Cuando los grupos estén guardados, generá el
          fixture.
        </p>
      ) : (
        <div className="mt-6">
          <div className="sticky top-16 z-20 -mx-4 border-b border-cyan-500/20 bg-[#08090e]/95 px-4 py-2 backdrop-blur-md lg:top-0 lg:mx-0 lg:rounded-xl lg:border">
            <div
              role="tablist"
              aria-label="Tramos del fixture"
              className="grid grid-cols-3 gap-1"
            >
              {(
                [
                  ["A", "Grupo A"],
                  ["B", "Grupo B"],
                  ["final", "Final"],
                ] as const
              ).map(([id, label]) => {
                const selected = section === id;

                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    id={`fixture-tab-${id}`}
                    aria-selected={selected}
                    aria-controls={`fixture-panel-${id}`}
                    onClick={() => setSection(id)}
                    className={`min-h-11 rounded-xl px-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      selected
                        ? "bg-cyan-400/15 text-cyan-200"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            role="tabpanel"
            id={`fixture-panel-${section}`}
            aria-labelledby={`fixture-tab-${section}`}
            className="mt-4 flex flex-col gap-4"
          >
            {selectedGroup ? (
              <FixtureStandings
                groups={[selectedGroup]}
                matches={admin.matches}
                teams={admin.teams}
              />
            ) : null}
            <FixtureMatches
              tournamentId={tournament.id}
              section={section}
              groups={tournament.groups}
              matches={admin.matches}
              teams={admin.teams}
            />
          </div>
        </div>
      )}

      <FixtureRegenerateDialog
        dialogRef={admin.regenerateDialogRef}
        generating={admin.generating}
        hasResults={admin.groupResults}
        onCancel={() => admin.regenerateDialogRef.current?.close()}
        onConfirm={() => {
          void admin.confirmGenerate().then((generated) => {
            if (generated) dismissGroups();
          });
        }}
      />
    </PanelPage>
  );
}
