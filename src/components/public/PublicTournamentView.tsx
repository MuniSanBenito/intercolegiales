import { useState } from "react";
import {
  eliminationRoundLabel,
  groupMatches,
  isPlayed,
  leagueMatches,
  type Match,
} from "../../helpers/fixtures";
import { PODIUM_POINTS, type PodiumPlace } from "../../helpers/results";
import { disciplineName, houseName, type Team } from "../../helpers/teams";
import {
  formatEventDate,
  formatLabel,
  isRankingFormat,
  type RankingPodium,
  type Tournament,
  type TournamentGroup,
} from "../../helpers/tournaments";
import { FixtureStandings } from "../torneos/FixtureStandings";
import {
  kickoffLabel,
  matchPlaceLabel,
  matchSideTitle,
  scoreLabel,
} from "./matchTitle";

const PODIUM_PLACES = [
  { key: "firstId", place: 1 },
  { key: "secondId", place: 2 },
  { key: "thirdId", place: 3 },
] as const satisfies ReadonlyArray<{
  key: keyof RankingPodium;
  place: PodiumPlace;
}>;

function placeWord(place: PodiumPlace) {
  if (place === 1) return "1.º";
  if (place === 2) return "2.º";
  return "3.º";
}

function teamNameOf(teams: Team[], teamId: string) {
  return teams.find((team) => team.id === teamId)?.name ?? "Equipo eliminado";
}

function MatchCards({
  title,
  matches,
  allMatches,
  groups,
  teams,
  showRounds,
}: {
  title: string;
  matches: Match[];
  allMatches: Match[];
  groups: TournamentGroup[];
  teams: Team[];
  showRounds: boolean;
}) {
  const teamName = (teamId: string) => teamNameOf(teams, teamId);
  const rounds = [...new Set(matches.map((match) => match.round ?? 0))].sort(
    (left, right) => left - right,
  );
  const grouped = showRounds
    ? rounds.map((round) => ({
        round,
        matches: matches.filter((match) => match.round === round),
      }))
    : [{ round: 0, matches }];

  return (
    <section className="min-w-0">
      {title ? (
        <h2 className="mb-2 font-cyber text-sm font-black tracking-wide text-white uppercase">
          {title}
        </h2>
      ) : null}
      {matches.length === 0 ? (
        <p className="text-sm text-slate-500">Sin partidos.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {grouped.map((group) => (
            <div key={`${title}-${group.round}`}>
              {showRounds ? (
                <h3 className="mb-2 text-xs font-medium tracking-wide text-slate-400 uppercase">
                  Jornada {group.round}
                </h3>
              ) : null}
              <ul className="flex flex-col gap-2">
                {group.matches.map((match) => (
                  <li key={match.id}>
                    <article className="flex min-w-0 flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3">
                      <p className="text-sm font-semibold break-words text-white">
                        {matchSideTitle(match.home, groups, allMatches, teamName)}
                        <span className="mx-1.5 font-normal text-slate-500">
                          vs
                        </span>
                        {matchSideTitle(match.away, groups, allMatches, teamName)}
                      </p>
                      <p className="text-xs break-words text-slate-400">
                        {matchPlaceLabel(match)}
                        <span aria-hidden="true"> · </span>
                        {kickoffLabel(match.startsAt)}
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          isPlayed(match) ? "text-cyan-200" : "text-slate-500"
                        }`}
                      >
                        <span className="sr-only">Marcador </span>
                        {scoreLabel(match)}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function cuadroBlocks(matches: Match[]) {
  const rounds = [
    ...new Set(
      matches
        .filter((match) => match.stage === "eliminatoria")
        .map((match) => match.round ?? 0),
    ),
  ].sort((left, right) => right - left);

  const blocks = rounds.map((round) => ({
    id: `ronda-${round}`,
    title: eliminationRoundLabel(round),
    matches: matches
      .filter(
        (match) => match.stage === "eliminatoria" && match.round === round,
      )
      .sort((left, right) => left.order - right.order),
  }));

  const finalMatches = matches.filter((match) => match.stage === "final");
  if (finalMatches.length > 0) {
    blocks.push({ id: "final", title: "Final", matches: finalMatches });
  }

  const thirdMatches = matches.filter(
    (match) => match.stage === "tercer-puesto",
  );
  if (thirdMatches.length > 0) {
    blocks.push({
      id: "tercer-puesto",
      title: "3.º y 4.º puesto",
      matches: thirdMatches,
    });
  }

  return blocks;
}

function RankingView({
  tournament,
  teams,
}: {
  tournament: Tournament;
  teams: Team[];
}) {
  const event = tournament.event;
  const { firstId, secondId, thirdId } = tournament.podium;
  const hasResult = Boolean(firstId && secondId && thirdId);

  return (
    <div className="mt-6 flex flex-col gap-4">
      <section className="rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-4">
        <h2 className="font-cyber text-sm font-black tracking-widest text-white uppercase">
          La prueba
        </h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-slate-400">Lugar</dt>
            <dd className="mt-1 text-sm break-words text-slate-100">
              {event?.venue || "Sin lugar"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-400">Fecha</dt>
            <dd className="mt-1 text-sm text-slate-100">
              {event?.eventDate
                ? formatEventDate(event.eventDate)
                : "Sin fecha"}
            </dd>
          </div>
          {event?.details ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-slate-400">Detalles</dt>
              <dd className="mt-1 text-sm break-words whitespace-pre-wrap text-slate-100">
                {event.details}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      {hasResult ? (
        <section className="rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-4">
          <h2 className="font-cyber text-sm font-black tracking-widest text-white uppercase">
            Podio
          </h2>
          <ol className="mt-3 flex flex-col gap-2">
            {PODIUM_PLACES.map((item) => {
              const teamId = tournament.podium[item.key];
              const team = teams.find((entry) => entry.id === teamId);

              return (
                <li
                  key={item.key}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
                >
                  <p className="text-[11px] font-semibold tracking-wide text-cyan-300 uppercase">
                    {placeWord(item.place)}
                    <span className="mx-1.5 text-slate-600" aria-hidden="true">
                      ·
                    </span>
                    {PODIUM_POINTS[item.place].toLocaleString("es-AR")} pts
                  </p>
                  <p className="mt-0.5 text-sm break-words text-slate-100">
                    {team
                      ? `${team.name} · ${houseName(team.houseId)}`
                      : "Equipo eliminado"}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}
    </div>
  );
}

function GroupsView({
  tournament,
  teams,
  matches,
}: {
  tournament: Tournament;
  teams: Team[];
  matches: Match[];
}) {
  const [section, setSection] = useState<"A" | "B" | "final">("A");
  const selectedGroup = tournament.groups.find((group) => group.id === section);

  return (
    <div className="mt-6">
      <div className="sticky top-24 z-20 -mx-4 border-b border-cyan-500/20 bg-[#08090e]/95 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-xl lg:border lg:px-2">
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
            title={`Tabla de ${selectedGroup.name}`}
            teamIds={selectedGroup.teamIds}
            matches={groupMatches(matches, selectedGroup.id)}
            teams={teams}
          />
        ) : null}
        {section === "final" ? (
          <>
            <MatchCards
              title="Final"
              matches={matches.filter((match) => match.stage === "final")}
              allMatches={matches}
              groups={tournament.groups}
              teams={teams}
              showRounds={false}
            />
            <MatchCards
              title="3.º y 4.º puesto"
              matches={matches.filter(
                (match) => match.stage === "tercer-puesto",
              )}
              allMatches={matches}
              groups={tournament.groups}
              teams={teams}
              showRounds={false}
            />
          </>
        ) : (
          <MatchCards
            title=""
            matches={groupMatches(matches, section)}
            allMatches={matches}
            groups={tournament.groups}
            teams={teams}
            showRounds
          />
        )}
      </div>
    </div>
  );
}

export function PublicTournamentView({
  tournament,
  teams,
  matches,
}: {
  tournament: Tournament;
  teams: Team[];
  matches: Match[];
}) {
  if (isRankingFormat(tournament.format)) {
    return <RankingView tournament={tournament} teams={teams} />;
  }

  if (tournament.format === "todos-contra-todos-con-fixture") {
    const tableMatches = matches.filter((match) => match.stage === "liga");

    return (
      <div className="mt-6 flex flex-col gap-4">
        <FixtureStandings
          title="Tabla"
          teamIds={tournament.teamIds}
          matches={tableMatches}
          teams={teams}
        />
        <MatchCards
          title=""
          matches={leagueMatches(matches)}
          allMatches={matches}
          groups={tournament.groups}
          teams={teams}
          showRounds
        />
      </div>
    );
  }

  if (tournament.format === "eliminatoria-directa") {
    const blocks = cuadroBlocks(matches);

    return (
      <div className="mt-6 flex flex-col gap-6">
        {blocks.length === 0 ? (
          <p className="text-sm text-slate-500">Sin partidos.</p>
        ) : (
          blocks.map((block) => (
            <MatchCards
              key={block.id}
              title={block.title}
              matches={block.matches}
              allMatches={matches}
              groups={tournament.groups}
              teams={teams}
              showRounds={false}
            />
          ))
        )}
      </div>
    );
  }

  if (tournament.format === "dos-grupos-final") {
    return (
      <GroupsView tournament={tournament} teams={teams} matches={matches} />
    );
  }

  return (
    <p className="mt-6 rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 px-4 py-5 text-sm text-slate-300">
      {disciplineName(tournament.disciplineId)} · {formatLabel(tournament.format)}
      . Este formato todavía no se puede ver acá.
    </p>
  );
}
