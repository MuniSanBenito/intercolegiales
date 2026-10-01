import { useEffect, useRef, useState, type RefObject } from "react";
import { Link } from "react-router";
import type { Match } from "../../helpers/fixtures";
import {
  cycleLabel,
  disciplineName,
  houseName,
  type Team,
} from "../../helpers/teams";
import type { Tournament } from "../../helpers/tournaments";
import { formatLabel } from "../../helpers/tournaments";
import { PanelHeading } from "../panel/PanelHeading";
import { PanelPage } from "../panel/PanelPage";
import {
  panelDialogClassName,
  panelGhostButtonClassName,
  panelPrimaryButtonClassName,
} from "../panel/panelClasses";
import { FixtureMatches } from "./FixtureMatches";
import { FixtureRegenerateDialog } from "./FixtureRegenerateDialog";

export function KnockoutFixture({
  tournament,
  teams,
  matches,
  seeds,
  generating,
  generateError,
  hasMatches,
  hasResults,
  regenerateDialogRef,
  onMoveSeed,
  onGenerate,
  onConfirmGenerate,
}: {
  tournament: Tournament;
  teams: Team[];
  matches: Match[];
  seeds: string[];
  generating: boolean;
  generateError: string | null;
  hasMatches: boolean;
  hasResults: boolean;
  regenerateDialogRef: RefObject<HTMLDialogElement | null>;
  onMoveSeed: (teamId: string, direction: -1 | 1) => void;
  onGenerate: () => Promise<boolean>;
  onConfirmGenerate: () => Promise<boolean>;
}) {
  const seedsDialogRef = useRef<HTMLDialogElement>(null);
  const [seedsOpen, setSeedsOpen] = useState(false);
  const [seedsReady, setSeedsReady] = useState(false);
  const teamById = new Map(teams.map((team) => [team.id, team]));

  if (!seedsReady) {
    setSeedsReady(true);
    setSeedsOpen(!hasMatches);
  }

  useEffect(() => {
    const dialog = seedsDialogRef.current;
    if (!dialog || !seedsOpen || dialog.open) return;
    dialog.showModal();
  }, [seedsOpen]);

  const dismissSeeds = () => {
    setSeedsOpen(false);
    if (seedsDialogRef.current?.open) seedsDialogRef.current.close();
  };

  const back = (
    <Link to="/panel/torneos" className={panelGhostButtonClassName}>
      Volver a torneos
    </Link>
  );

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
              onClick={() => setSeedsOpen(true)}
              className={panelGhostButtonClassName}
            >
              Armar cuadro
            </button>
            {back}
          </div>
        }
      />

      <p className="mt-4 max-w-2xl text-sm text-slate-400">
        Eliminación directa. El 1.º y el 2.º salen de la final. Con cuatro
        equipos o más, el 3.º sale del partido entre los perdedores de las
        semis. Con tres equipos, el 3.º es el perdedor de la única semi.
      </p>

      <dialog
        ref={seedsDialogRef}
        aria-labelledby="armar-cuadro-titulo"
        className={panelDialogClassName}
        onClose={() => setSeedsOpen(false)}
      >
        <h2
          id="armar-cuadro-titulo"
          className="font-cyber text-lg font-black tracking-tight text-white uppercase"
        >
          Armar cuadro
        </h2>
        <p className="mt-3 text-sm text-slate-400">
          El de arriba es el mejor sembrado. Si sobran lugares, los primeros de
          la lista esperan. El 1.º y el 2.º quedan en mitades opuestas.
        </p>
        <ol className="mt-4 flex flex-col gap-2">
          {seeds.map((teamId, index) => {
            const team = teamById.get(teamId);
            const name = team?.name ?? "Equipo eliminado";

            return (
              <li
                key={teamId}
                className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="min-w-0 text-sm text-slate-100">
                  <span className="mr-2 text-cyan-300">{index + 1}.</span>
                  {team
                    ? `${name} · ${houseName(team.houseId)} · ${cycleLabel(team.cycle)}`
                    : name}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-label={`Subir ${name}`}
                    disabled={index === 0}
                    onClick={() => onMoveSeed(teamId, -1)}
                    className={panelGhostButtonClassName}
                  >
                    Subir
                  </button>
                  <button
                    type="button"
                    aria-label={`Bajar ${name}`}
                    disabled={index === seeds.length - 1}
                    onClick={() => onMoveSeed(teamId, 1)}
                    className={panelGhostButtonClassName}
                  >
                    Bajar
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={dismissSeeds}
            className={panelGhostButtonClassName}
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              void onGenerate().then((generated) => {
                if (generated) dismissSeeds();
              });
            }}
            disabled={generating || seeds.length < 2}
            className={panelPrimaryButtonClassName}
          >
            {generating
              ? "Armando…"
              : hasMatches
                ? "Regenerar cuadro"
                : "Generar cuadro"}
          </button>
        </div>
        {generateError ? (
          <p role="alert" className="mt-3 text-sm text-rose-300">
            {generateError}
          </p>
        ) : null}
      </dialog>

      {matches.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 px-4 py-5 text-sm text-slate-400">
          Todavía no hay partidos. Ordená los equipos y generá el cuadro.
        </p>
      ) : (
        <div className="mt-6">
          <FixtureMatches
            tournamentId={tournament.id}
            section="cuadro"
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
        title="Regenerar cuadro"
        description={
          hasResults
            ? "Se vuelven a crear todos los partidos del cuadro y se pierden los marcadores, la cancha y el horario."
            : "Se vuelven a crear todos los partidos del cuadro. La cancha se carga de nuevo desde la disciplina."
        }
        onCancel={() => regenerateDialogRef.current?.close()}
        onConfirm={() => {
          void onConfirmGenerate().then((generated) => {
            if (generated) dismissSeeds();
          });
        }}
      />
    </PanelPage>
  );
}
