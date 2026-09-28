import { useEffect, useId, useRef, useState, type SubmitEvent } from "react";
import {
  COMPLEXES,
  complexLabel,
  groupMatches,
  isComplexId,
  isPlayed,
  placeLabel,
  resolveGroupPlace,
  stageLabel,
  type ComplexId,
  type Match,
  type MatchSide,
} from "../../helpers/fixtures";
import { updateMatchSchedule } from "../../helpers/fixturesFirestore";
import type { Team } from "../../helpers/teams";
import type { TournamentGroup } from "../../helpers/tournaments";
import { PanelField } from "../panel/PanelField";
import {
  panelDialogClassName,
  panelFieldClassName,
  panelGhostButtonClassName,
  panelSubmitButtonClassName,
} from "../panel/panelClasses";

function joinNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} y ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

function sideTitle(
  side: MatchSide,
  groups: TournamentGroup[],
  matches: Match[],
  teamName: (teamId: string) => string,
) {
  if (side.kind === "team") return teamName(side.teamId);

  const group = groups.find((item) => item.id === side.groupId);
  const groupName = group?.name ?? `Grupo ${side.groupId}`;
  const label = placeLabel(groupName, side.place);
  const resolution = resolveGroupPlace(
    group?.teamIds ?? [],
    groupMatches(matches, side.groupId),
    side.place,
  );

  if (resolution.status === "team") {
    return `${label} · ${teamName(resolution.teamId)}`;
  }

  if (resolution.status === "tie") {
    return `${label} · Empate entre ${joinNames(resolution.teamIds.map(teamName))}`;
  }

  return label;
}

function scoreValue(score: number | undefined) {
  return score === undefined ? "" : String(score);
}

function kickoffLabel(startsAt: string | undefined) {
  if (!startsAt) return "Sin horario";

  const [date, time] = startsAt.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const formatted = new Date(year, (month ?? 1) - 1, day).toLocaleDateString(
    "es-AR",
    { day: "numeric", month: "short" },
  );

  return `${formatted} · ${time}`;
}

function matchPlaceLabel(match: Match) {
  if (!match.complexId && !match.court) return "Sin sede";

  const place = match.complexId ? complexLabel(match.complexId) : "";
  return [place, match.court].filter(Boolean).join(" · ");
}

function scoreLabel(match: Match) {
  if (!isPlayed(match)) return "Sin resultado";
  return `${match.homeScore}–${match.awayScore}`;
}

function MatchCard({
  tournamentId,
  match,
  title,
  groups,
  matches,
  teamName,
  onClose,
  onSaved,
}: {
  tournamentId: string;
  match: Match;
  title: string;
  groups: TournamentGroup[];
  matches: Match[];
  teamName: (teamId: string) => string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const baseId = useId();
  const [complexId, setComplexId] = useState<"" | ComplexId>(
    match.complexId ?? "",
  );
  const [court, setCourt] = useState(match.court ?? "");
  const [startsAt, setStartsAt] = useState(match.startsAt ?? "");
  const [homeScore, setHomeScore] = useState(scoreValue(match.homeScore));
  const [awayScore, setAwayScore] = useState(scoreValue(match.awayScore));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saved = [
    match.complexId ?? "",
    match.court ?? "",
    match.startsAt ?? "",
    scoreValue(match.homeScore),
    scoreValue(match.awayScore),
  ].join("|");
  const [seenSaved, setSeenSaved] = useState(saved);

  if (seenSaved !== saved) {
    setSeenSaved(saved);
    setComplexId(match.complexId ?? "");
    setCourt(match.court ?? "");
    setStartsAt(match.startsAt ?? "");
    setHomeScore(scoreValue(match.homeScore));
    setAwayScore(scoreValue(match.awayScore));
    setError(null);
  }

  const homeLabel = sideTitle(match.home, groups, matches, teamName);
  const awayLabel = sideTitle(match.away, groups, matches, teamName);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      await updateMatchSchedule(tournamentId, match.id, {
        complexId,
        court,
        startsAt,
        homeScore,
        awayScore,
      });
      onSaved();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "";
      setError(
        message.startsWith("El ")
          ? message
          : "No se pudo guardar el partido. Intentá de nuevo.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-w-0">
      <fieldset className="min-w-0 border-0 p-0">
        <legend className="mb-3 max-w-full text-sm font-semibold break-words text-white">
          <span className="mb-1 block text-[11px] font-medium tracking-wide text-cyan-300 uppercase">
            {title}
          </span>
          {homeLabel}
          <span className="mx-2 text-slate-500">vs</span>
          {awayLabel}
        </legend>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <PanelField id={`${baseId}-sede`} label="Sede">
            <select
              id={`${baseId}-sede`}
              value={complexId}
              onChange={(event) => {
                const value = event.target.value;
                setComplexId(isComplexId(value) ? value : "");
              }}
              className={panelFieldClassName}
            >
              <option value="">Sin sede</option>
              {COMPLEXES.map((complex) => (
                <option key={complex.id} value={complex.id}>
                  {complex.label}
                </option>
              ))}
            </select>
          </PanelField>
          <PanelField id={`${baseId}-cancha`} label="Cancha">
            <input
              id={`${baseId}-cancha`}
              value={court}
              onChange={(event) => setCourt(event.target.value)}
              className={panelFieldClassName}
              autoComplete="off"
            />
          </PanelField>
          <PanelField id={`${baseId}-horario`} label="Día y hora">
            <input
              id={`${baseId}-horario`}
              type="datetime-local"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
              className={`${panelFieldClassName} scheme-dark`}
            />
          </PanelField>
          <PanelField id={`${baseId}-local`} label={`Marcador de ${homeLabel}`}>
            <input
              id={`${baseId}-local`}
              inputMode="numeric"
              value={homeScore}
              onChange={(event) => setHomeScore(event.target.value)}
              className={panelFieldClassName}
              autoComplete="off"
            />
          </PanelField>
          <PanelField
            id={`${baseId}-visitante`}
            label={`Marcador de ${awayLabel}`}
          >
            <input
              id={`${baseId}-visitante`}
              inputMode="numeric"
              value={awayScore}
              onChange={(event) => setAwayScore(event.target.value)}
              className={panelFieldClassName}
              autoComplete="off"
            />
          </PanelField>
        </div>
      </fieldset>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {error ? (
          <p role="alert" className="text-sm text-rose-300">
            {error}
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            {(homeScore.trim() === "") !== (awayScore.trim() === "")
              ? "El partido suma en la tabla cuando los dos marcadores están cargados."
              : stageLabel(match.stage)}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={panelGhostButtonClassName}
          >
            Cerrar
          </button>
          <button
            type="submit"
            disabled={saving}
            className={panelSubmitButtonClassName}
          >
            {saving ? "Guardando…" : "Guardar partido"}
          </button>
        </div>
      </div>
    </form>
  );
}

function MatchRow({
  match,
  title,
  homeLabel,
  awayLabel,
  onOpen,
}: {
  match: Match;
  title: string;
  homeLabel: string;
  awayLabel: string;
  onOpen: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full min-w-0 flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-left transition-colors hover:border-cyan-400/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        {title ? (
          <span className="text-[11px] font-medium tracking-wide text-cyan-300 uppercase">
            {title}
          </span>
        ) : null}
        <span className="text-sm font-semibold break-words text-white">
          {homeLabel}
          <span className="mx-1.5 font-normal text-slate-500">vs</span>
          {awayLabel}
        </span>
        <span className="text-xs break-words text-slate-400">
          {matchPlaceLabel(match)}
          <span aria-hidden="true"> · </span>
          {kickoffLabel(match.startsAt)}
          <span aria-hidden="true"> · </span>
          {scoreLabel(match)}
        </span>
      </button>
    </li>
  );
}

export type FixtureSection = "A" | "B" | "final";

export function FixtureMatches({
  tournamentId,
  section,
  groups,
  matches,
  teams,
}: {
  tournamentId: string;
  section: FixtureSection;
  groups: TournamentGroup[];
  matches: Match[];
  teams: Team[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const teamName = (teamId: string) =>
    teams.find((team) => team.id === teamId)?.name ?? "Equipo eliminado";
  const openMatch = matches.find((match) => match.id === openId) ?? null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !openId || dialog.open) return;
    dialog.showModal();
  }, [openId]);

  const closeDialog = () => {
    setOpenId(null);
    if (dialogRef.current?.open) dialogRef.current.close();
  };

  const blocks =
    section === "final"
      ? [
          {
            id: "final",
            title: "Final",
            matches: matches.filter((match) => match.stage === "final"),
          },
          {
            id: "tercer-puesto",
            title: "3.º y 4.º puesto",
            matches: matches.filter((match) => match.stage === "tercer-puesto"),
          },
        ]
      : [
          {
            id: section,
            title:
              groups.find((group) => group.id === section)?.name ??
              `Grupo ${section}`,
            matches: groupMatches(matches, section),
          },
        ];

  const openTitle = openMatch
    ? openMatch.stage === "grupos"
      ? `${blocks[0]?.title ?? "Partido"} · Jornada ${openMatch.round ?? 1}`
      : openMatch.stage === "final"
        ? "Final"
        : "3.º y 4.º puesto"
    : "Partido";

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block) => {
        const rounds = [
          ...new Set(block.matches.map((match) => match.round ?? 0)),
        ].sort((left, right) => left - right);
        const grouped =
          section === "final"
            ? [{ round: 0, matches: block.matches }]
            : rounds.map((round) => ({
                round,
                matches: block.matches.filter((match) => match.round === round),
              }));

        return (
          <section key={block.id} className="min-w-0">
            {section === "final" ? (
              <h2 className="mb-2 font-cyber text-sm font-black tracking-wide text-white uppercase">
                {block.title}
              </h2>
            ) : null}
            {block.matches.length === 0 ? (
              <p className="text-sm text-slate-500">Sin partidos.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {grouped.map((group) => (
                  <div key={`${block.id}-${group.round}`}>
                    {section !== "final" ? (
                      <h3 className="mb-2 text-xs font-medium tracking-wide text-slate-400 uppercase">
                        Jornada {group.round}
                      </h3>
                    ) : null}
                    <ul className="flex flex-col gap-2">
                      {group.matches.map((match) => (
                        <MatchRow
                          key={match.id}
                          match={match}
                          title={section === "final" ? block.title : ""}
                          homeLabel={sideTitle(
                            match.home,
                            groups,
                            matches,
                            teamName,
                          )}
                          awayLabel={sideTitle(
                            match.away,
                            groups,
                            matches,
                            teamName,
                          )}
                          onOpen={() => setOpenId(match.id)}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      <dialog
        ref={dialogRef}
        aria-labelledby="editar-partido-titulo"
        className={panelDialogClassName}
        onClose={() => setOpenId(null)}
      >
        <h2
          id="editar-partido-titulo"
          className="font-cyber text-lg font-black tracking-tight text-white uppercase"
        >
          Editar partido
        </h2>
        {openMatch ? (
          <div className="mt-4">
            <MatchCard
              key={openMatch.id}
              tournamentId={tournamentId}
              match={openMatch}
              title={openTitle}
              groups={groups}
              matches={matches}
              teamName={teamName}
              onClose={closeDialog}
              onSaved={closeDialog}
            />
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
