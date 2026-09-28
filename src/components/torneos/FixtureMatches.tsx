import { useId, useState, type SubmitEvent } from "react";
import {
  COMPLEXES,
  groupMatches,
  isComplexId,
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
  panelFieldClassName,
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

function MatchCard({
  tournamentId,
  match,
  title,
  groups,
  matches,
  teamName,
}: {
  tournamentId: string;
  match: Match;
  title: string;
  groups: TournamentGroup[];
  matches: Match[];
  teamName: (teamId: string) => string;
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
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "";
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
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
    >
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
        <button
          type="submit"
          disabled={saving}
          className={panelSubmitButtonClassName}
        >
          {saving ? "Guardando…" : "Guardar partido"}
        </button>
      </div>
    </form>
  );
}

export function FixtureMatches({
  tournamentId,
  groups,
  matches,
  teams,
}: {
  tournamentId: string;
  groups: TournamentGroup[];
  matches: Match[];
  teams: Team[];
}) {
  const teamName = (teamId: string) =>
    teams.find((team) => team.id === teamId)?.name ?? "Equipo eliminado";

  const sections = [
    ...groups.map((group) => ({
      id: group.id,
      title: group.name,
      matches: groupMatches(matches, group.id),
    })),
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
  ];

  if (matches.length === 0) {
    return (
      <p className="rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 px-4 py-5 text-sm text-slate-400">
        Todavía no hay partidos. Cuando los grupos estén guardados, generá el
        fixture.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => (
        <section key={section.id} className="min-w-0">
          <h2 className="mb-3 font-cyber text-sm font-black tracking-wide text-white uppercase">
            {section.title}
          </h2>
          {section.matches.length === 0 ? (
            <p className="text-sm text-slate-500">Sin partidos.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {section.id === "A" || section.id === "B"
                ? [...new Set(section.matches.map((match) => match.round ?? 0))]
                    .sort((left, right) => left - right)
                    .map((round) => (
                      <div key={round} className="flex flex-col gap-3">
                        <h3 className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                          Jornada {round}
                        </h3>
                        {section.matches
                          .filter((match) => match.round === round)
                          .map((match) => (
                            <MatchCard
                              key={match.id}
                              match={match}
                              title={`${section.title} · Jornada ${round}`}
                              groups={groups}
                              matches={matches}
                              teamName={teamName}
                              tournamentId={tournamentId}
                            />
                          ))}
                      </div>
                    ))
                : section.matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      title={section.title}
                      groups={groups}
                      matches={matches}
                      teamName={teamName}
                      tournamentId={tournamentId}
                    />
                  ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
