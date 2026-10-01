import { DISCIPLINES } from "../data/tournamentData";
import {
  emptyTournamentGroups,
  isGroupId,
  pruneTournamentGroups,
  type GroupId,
  type Tournament,
  type TournamentGroup,
} from "./tournaments";

export const MATCHES_SUBCOLLECTION = "partidos";

export const COMPLEXES = [
  { id: "chapino", label: "Complejo Oscar Chapino" },
  { id: "vieytes", label: "Parque Vieytes" },
  { id: "biblioteca", label: "Biblioteca municipal" },
] as const;

export type ComplexId = (typeof COMPLEXES)[number]["id"];

export type MatchStage =
  | "grupos"
  | "liga"
  | "eliminatoria"
  | "final"
  | "tercer-puesto";

export type MatchSide =
  | { kind: "team"; teamId: string }
  | { kind: "group-place"; groupId: GroupId; place: 1 | 2 }
  | { kind: "winner"; matchKey: string }
  | { kind: "loser"; matchKey: string };

export interface Match {
  id: string;
  stage: MatchStage;
  matchKey?: string;
  groupId?: GroupId;
  round?: number;
  order: number;
  home: MatchSide;
  away: MatchSide;
  complexId?: ComplexId;
  court?: string;
  startsAt?: string;
  homeScore?: number;
  awayScore?: number;
  advancedTeamId?: string;
}

export interface MatchDraft {
  stage: MatchStage;
  matchKey?: string;
  groupId?: GroupId;
  round?: number;
  order: number;
  home: MatchSide;
  away: MatchSide;
  complexId?: ComplexId;
  court?: string;
}

export interface MatchVenue {
  complexId: ComplexId;
  court?: string;
}

export interface StandingRow {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface RankedStanding {
  rank: number;
  row: StandingRow;
}

export type PlaceResolution =
  | { status: "pending" }
  | { status: "team"; teamId: string }
  | { status: "tie"; teamIds: string[] };

export function isComplexId(value: unknown): value is ComplexId {
  return COMPLEXES.some((complex) => complex.id === value);
}

export function complexLabel(complexId: ComplexId): string {
  return (
    COMPLEXES.find((complex) => complex.id === complexId)?.label ?? complexId
  );
}

export function venueFromLocation(location: string): MatchVenue {
  const cleaned = location.trim().replace(/\.$/, "");
  const separator = cleaned.indexOf(" - ");
  const place = separator === -1 ? cleaned : cleaned.slice(0, separator);
  const detail = separator === -1 ? "" : cleaned.slice(separator + 3).trim();
  const haystack = place.toLowerCase();

  let complexId: ComplexId = "vieytes";
  if (haystack.includes("chapino")) complexId = "chapino";
  else if (haystack.includes("bibl")) complexId = "biblioteca";

  return {
    complexId,
    court: detail || undefined,
  };
}

export function venueForDiscipline(disciplineId: string): MatchVenue {
  const location =
    DISCIPLINES.find((discipline) => discipline.id === disciplineId)
      ?.location ?? "";

  return venueFromLocation(location);
}

export function isPlayed(match: Match): boolean {
  return (
    typeof match.homeScore === "number" && typeof match.awayScore === "number"
  );
}

export function roundRobinPairings(teamIds: string[]) {
  if (teamIds.length < 2) return [];

  const slots = [...teamIds];
  if (slots.length % 2 === 1) slots.push("");

  const count = slots.length;
  const rounds = count - 1;
  const half = count / 2;
  const pairings: Array<{
    round: number;
    homeTeamId: string;
    awayTeamId: string;
  }> = [];

  for (let round = 0; round < rounds; round += 1) {
    for (let index = 0; index < half; index += 1) {
      const left = slots[index] ?? "";
      const right = slots[count - 1 - index] ?? "";
      if (!left || !right) continue;

      const swap = round % 2 === 1;
      pairings.push({
        round: round + 1,
        homeTeamId: swap ? right : left,
        awayTeamId: swap ? left : right,
      });
    }

    const fixed = slots[0] ?? "";
    const rotating = slots.slice(1);
    const last = rotating.pop();
    if (last !== undefined) rotating.unshift(last);
    slots.splice(0, slots.length, fixed, ...rotating);
  }

  return pairings;
}

function withVenue(draft: MatchDraft, venue: MatchVenue): MatchDraft {
  return {
    ...draft,
    complexId: venue.complexId,
    court: venue.court,
  };
}

export function buildGroupMatchDrafts(
  groups: TournamentGroup[],
  venue: MatchVenue,
): MatchDraft[] {
  return groups.flatMap((group) => {
    const pairings = roundRobinPairings(group.teamIds);

    return pairings.map((pairing, index) =>
      withVenue(
        {
          stage: "grupos",
          groupId: group.id,
          round: pairing.round,
          order: index,
          home: { kind: "team", teamId: pairing.homeTeamId },
          away: { kind: "team", teamId: pairing.awayTeamId },
        },
        venue,
      ),
    );
  });
}

export function buildLeagueMatchDrafts(
  teamIds: string[],
  venue: MatchVenue,
): MatchDraft[] {
  return roundRobinPairings(teamIds).map((pairing, index) =>
    withVenue(
      {
        stage: "liga",
        round: pairing.round,
        order: index,
        home: { kind: "team", teamId: pairing.homeTeamId },
        away: { kind: "team", teamId: pairing.awayTeamId },
      },
      venue,
    ),
  );
}

function bracketSize(teamCount: number) {
  let size = 1;
  while (size < teamCount) size *= 2;
  return size;
}

export function bracketSeedPositions(size: number) {
  let slots = [1];

  while (slots.length < size) {
    const span = slots.length * 2 + 1;
    const next: number[] = [];
    for (const seed of slots) next.push(seed, span - seed);
    slots = next;
  }

  return slots;
}

export function eliminationRoundLabel(slotCount: number) {
  if (slotCount <= 4) return "Semifinal";
  if (slotCount === 8) return "Cuartos de final";
  if (slotCount === 16) return "Octavos de final";
  if (slotCount === 32) return "16avos de final";
  if (slotCount === 64) return "32avos de final";
  return `Ronda de ${slotCount}`;
}

export function buildEliminationMatchDrafts(
  teamIds: string[],
  venue: MatchVenue,
): MatchDraft[] {
  if (teamIds.length < 2) return [];

  const size = bracketSize(teamIds.length);
  let slots: Array<MatchSide | null> = bracketSeedPositions(size).map(
    (seed) => {
      const teamId = teamIds[seed - 1];
      return teamId ? { kind: "team", teamId } : null;
    },
  );
  const drafts: MatchDraft[] = [];
  let roundIndex = 1;
  let semiKeys: string[] = [];

  while (slots.length > 2) {
    const slotCount = slots.length;
    const next: Array<MatchSide | null> = [];
    const roundKeys: string[] = [];

    for (let index = 0; index < slots.length; index += 2) {
      const home = slots[index] ?? null;
      const away = slots[index + 1] ?? null;

      if (home && away) {
        const matchKey = `r${roundIndex}-${roundKeys.length}`;
        roundKeys.push(matchKey);
        drafts.push(
          withVenue(
            {
              stage: "eliminatoria",
              matchKey,
              round: slotCount,
              order: drafts.length,
              home,
              away,
            },
            venue,
          ),
        );
        next.push({ kind: "winner", matchKey });
      } else {
        next.push(home ?? away);
      }
    }

    if (next.length === 2) semiKeys = roundKeys;
    slots = next;
    roundIndex += 1;
  }

  const home = slots[0];
  const away = slots[1];
  if (!home || !away) return drafts;

  drafts.push(
    withVenue(
      {
        stage: "final",
        matchKey: "final",
        order: drafts.length,
        home,
        away,
      },
      venue,
    ),
  );

  if (semiKeys.length === 2) {
    drafts.push(
      withVenue(
        {
          stage: "tercer-puesto",
          matchKey: "third",
          order: drafts.length,
          home: { kind: "loser", matchKey: semiKeys[0] },
          away: { kind: "loser", matchKey: semiKeys[1] },
        },
        venue,
      ),
    );
  }

  return drafts;
}

export function buildKnockoutMatchDrafts(venue: MatchVenue): MatchDraft[] {
  return [
    withVenue(
      {
        stage: "final",
        order: 0,
        home: { kind: "group-place", groupId: "A", place: 1 },
        away: { kind: "group-place", groupId: "B", place: 1 },
      },
      venue,
    ),
    withVenue(
      {
        stage: "tercer-puesto",
        order: 1,
        home: { kind: "group-place", groupId: "A", place: 2 },
        away: { kind: "group-place", groupId: "B", place: 2 },
      },
      venue,
    ),
  ];
}

export function unassignedTeamIds(
  teamIds: string[],
  groups: TournamentGroup[],
) {
  const assigned = new Set(groups.flatMap((group) => group.teamIds));
  return teamIds.filter((teamId) => !assigned.has(teamId));
}

export function moveTeamToGroup(
  groups: TournamentGroup[],
  teamId: string,
  target: "none" | GroupId,
): TournamentGroup[] {
  const cleared = groups.map((group) => ({
    ...group,
    teamIds: group.teamIds.filter((id) => id !== teamId),
  }));

  if (target === "none") return cleared;

  return cleared.map((group) =>
    group.id === target
      ? { ...group, teamIds: [...group.teamIds, teamId] }
      : group,
  );
}

export function sameGroupAssignment(
  left: TournamentGroup[],
  right: TournamentGroup[],
) {
  const signature = (groups: TournamentGroup[]) =>
    emptyTournamentGroups()
      .map((fallback) => {
        const group = groups.find((item) => item.id === fallback.id);
        return `${fallback.id}:${(group?.teamIds ?? []).join(",")}`;
      })
      .join("|");

  return signature(left) === signature(right);
}

export function moveSeedOrder(
  seeds: string[],
  teamId: string,
  direction: -1 | 1,
) {
  const index = seeds.indexOf(teamId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= seeds.length) return seeds;

  const next = [...seeds];
  const [moved] = next.splice(index, 1);
  next.splice(target, 0, moved);
  return next;
}

export function sameSeedOrder(left: string[], right: string[]) {
  return left.join("|") === right.join("|");
}

export function validateEliminationFixture(
  tournament: Tournament,
): string | null {
  if (tournament.format !== "eliminatoria-directa") {
    return "Este formato todavía no arma fixture.";
  }

  if (tournament.teamIds.length < 2) {
    return "Inscribí al menos 2 equipos.";
  }

  return null;
}

export function validateLeagueFixture(tournament: Tournament): string | null {
  if (tournament.format !== "todos-contra-todos-con-fixture") {
    return "Este formato todavía no arma fixture.";
  }

  if (tournament.teamIds.length < 2) {
    return "Inscribí al menos 2 equipos.";
  }

  return null;
}

export function validateFixtureGroups(tournament: Tournament): string | null {
  if (tournament.format !== "dos-grupos-final") {
    return "Este formato todavía no arma fixture.";
  }

  const groups = pruneTournamentGroups(tournament.groups, tournament.teamIds);
  const assigned = groups.flatMap((group) => group.teamIds);

  if (assigned.length !== tournament.teamIds.length) {
    return "Asigná todos los equipos a un grupo.";
  }

  for (const group of groups) {
    if (group.teamIds.length < 2) {
      return `${group.name} necesita al menos 2 equipos.`;
    }
  }

  return null;
}

export function groupMatches(matches: Match[], groupId: GroupId) {
  return matches
    .filter((match) => match.stage === "grupos" && match.groupId === groupId)
    .sort((left, right) => {
      const roundDifference = (left.round ?? 0) - (right.round ?? 0);
      if (roundDifference !== 0) return roundDifference;
      return left.order - right.order;
    });
}

export function leagueMatches(matches: Match[]) {
  return matches
    .filter((match) => match.stage === "liga")
    .sort((left, right) => {
      const roundDifference = (left.round ?? 0) - (right.round ?? 0);
      if (roundDifference !== 0) return roundDifference;
      return left.order - right.order;
    });
}

export function knockoutMatch(
  matches: Match[],
  stage: "final" | "tercer-puesto",
) {
  return matches.find((match) => match.stage === stage);
}

function emptyStanding(teamId: string): StandingRow {
  return {
    teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

function applyResult(row: StandingRow, scored: number, conceded: number) {
  row.played += 1;
  row.goalsFor += scored;
  row.goalsAgainst += conceded;
  row.goalDifference = row.goalsFor - row.goalsAgainst;

  if (scored > conceded) {
    row.won += 1;
    row.points += 3;
  } else if (scored === conceded) {
    row.drawn += 1;
    row.points += 1;
  } else {
    row.lost += 1;
  }
}

function standingsRows(teamIds: string[], matches: Match[]): StandingRow[] {
  const rows = new Map(
    teamIds.map((teamId) => [teamId, emptyStanding(teamId)]),
  );

  for (const match of matches) {
    if (!isPlayed(match)) continue;
    if (match.home.kind !== "team" || match.away.kind !== "team") continue;

    const home = rows.get(match.home.teamId);
    const away = rows.get(match.away.teamId);
    if (!home || !away) continue;
    if (match.homeScore === undefined || match.awayScore === undefined)
      continue;

    applyResult(home, match.homeScore, match.awayScore);
    applyResult(away, match.awayScore, match.homeScore);
  }

  return [...rows.values()];
}

function compareStanding(left: StandingRow, right: StandingRow) {
  if (right.points !== left.points) return right.points - left.points;
  if (right.goalDifference !== left.goalDifference) {
    return right.goalDifference - left.goalDifference;
  }
  if (right.goalsFor !== left.goalsFor) return right.goalsFor - left.goalsFor;
  return 0;
}

function clusterByRecord(rows: StandingRow[]): StandingRow[][] {
  const sorted = [...rows].sort(compareStanding);
  const clusters: StandingRow[][] = [];

  for (const row of sorted) {
    const current = clusters[clusters.length - 1];
    if (current && compareStanding(current[0], row) === 0) {
      current.push(row);
    } else {
      clusters.push([row]);
    }
  }

  return clusters;
}

function sortCluster(rows: StandingRow[]) {
  return [...rows].sort((left, right) =>
    left.teamId.localeCompare(right.teamId),
  );
}

function orderClusters(teamIds: string[], matches: Match[]): StandingRow[][] {
  const clusters = clusterByRecord(standingsRows(teamIds, matches));
  const ordered: StandingRow[][] = [];

  for (const cluster of clusters) {
    if (cluster.length < 2) {
      ordered.push(cluster);
      continue;
    }

    const ids = new Set(cluster.map((row) => row.teamId));
    const innerMatches = matches.filter((match) => {
      if (!isPlayed(match)) return false;
      if (match.home.kind !== "team" || match.away.kind !== "team")
        return false;
      return ids.has(match.home.teamId) && ids.has(match.away.teamId);
    });
    const innerClusters = clusterByRecord(
      standingsRows([...ids], innerMatches),
    );

    if (innerClusters.length < 2) {
      ordered.push(sortCluster(cluster));
      continue;
    }

    for (const inner of innerClusters) {
      const innerIds = new Set(inner.map((row) => row.teamId));
      ordered.push(
        sortCluster(cluster.filter((row) => innerIds.has(row.teamId))),
      );
    }
  }

  return ordered;
}

export function rankedStandings(
  teamIds: string[],
  matches: Match[],
): RankedStanding[] {
  const ranked: RankedStanding[] = [];
  let rank = 1;

  for (const cluster of orderClusters(teamIds, matches)) {
    for (const row of cluster) ranked.push({ rank, row });
    rank += cluster.length;
  }

  return ranked;
}

export function resolveGroupPlace(
  teamIds: string[],
  matches: Match[],
  place: 1 | 2 | 3,
): PlaceResolution {
  if (teamIds.length === 0) return { status: "pending" };

  const played = matches.some(
    (match) =>
      isPlayed(match) &&
      match.home.kind === "team" &&
      match.away.kind === "team" &&
      teamIds.includes(match.home.teamId) &&
      teamIds.includes(match.away.teamId),
  );

  if (!played) return { status: "pending" };

  let rank = 1;

  for (const cluster of orderClusters(teamIds, matches)) {
    const nextRank = rank + cluster.length;
    if (place >= rank && place < nextRank) {
      if (cluster.length === 1) {
        return { status: "team", teamId: cluster[0].teamId };
      }

      return { status: "tie", teamIds: cluster.map((row) => row.teamId) };
    }
    rank = nextRank;
  }

  return { status: "pending" };
}

export type BracketDecision =
  | { status: "pending" }
  | { status: "blocked"; reason: string }
  | { status: "decided"; winnerId: string; loserId: string };

export function resolveMatchSide(
  side: MatchSide,
  groups: TournamentGroup[],
  matches: Match[],
  trail: Set<string> = new Set(),
): PlaceResolution {
  if (side.kind === "team") return { status: "team", teamId: side.teamId };

  if (side.kind === "group-place") {
    const group = groups.find((item) => item.id === side.groupId);
    return resolveGroupPlace(
      group?.teamIds ?? [],
      groupMatches(matches, side.groupId),
      side.place,
    );
  }

  if (trail.has(side.matchKey)) return { status: "pending" };

  const source = matches.find((match) => match.matchKey === side.matchKey);
  if (!source) return { status: "pending" };

  const nextTrail = new Set(trail);
  nextTrail.add(side.matchKey);
  const decision = decideBracketMatch(source, groups, matches, nextTrail);

  if (decision.status !== "decided") return { status: "pending" };

  return {
    status: "team",
    teamId: side.kind === "winner" ? decision.winnerId : decision.loserId,
  };
}

export function decideBracketMatch(
  match: Match | undefined,
  groups: TournamentGroup[],
  matches: Match[],
  trail: Set<string> = new Set(),
  blockedLabel = "Este partido todavía no define quién avanza.",
  drawLabel = "El partido terminó empatado. Indicá quién pasó.",
): BracketDecision {
  if (!match || !isPlayed(match)) return { status: "pending" };

  const home = resolveMatchSide(match.home, groups, matches, trail);
  const away = resolveMatchSide(match.away, groups, matches, trail);

  if (home.status !== "team" || away.status !== "team") {
    if (home.status === "pending" || away.status === "pending") {
      return { status: "pending" };
    }

    return { status: "blocked", reason: blockedLabel };
  }

  if (match.homeScore === match.awayScore) {
    if (
      match.advancedTeamId === home.teamId ||
      match.advancedTeamId === away.teamId
    ) {
      const winnerId = match.advancedTeamId;
      return {
        status: "decided",
        winnerId,
        loserId: winnerId === home.teamId ? away.teamId : home.teamId,
      };
    }

    return { status: "blocked", reason: drawLabel };
  }

  const homeWins = (match.homeScore ?? 0) > (match.awayScore ?? 0);

  return {
    status: "decided",
    winnerId: homeWins ? home.teamId : away.teamId,
    loserId: homeWins ? away.teamId : home.teamId,
  };
}

export function stageLabel(stage: MatchStage) {
  if (stage === "final") return "Final";
  if (stage === "tercer-puesto") return "3.º y 4.º puesto";
  if (stage === "liga") return "Todos contra todos";
  if (stage === "eliminatoria") return "Eliminatoria";
  return "Fase de grupos";
}

export function placeLabel(groupName: string, place: 1 | 2) {
  return place === 1 ? `1.º de ${groupName}` : `2.º de ${groupName}`;
}

export function parseScoreInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) {
    throw new Error("El marcador tiene que ser un número entero de 0 o más.");
  }
  return Number(trimmed);
}

export function isStartsAt(value: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
}

function parseSide(value: unknown): MatchSide | null {
  if (!value || typeof value !== "object") return null;

  const side = value as {
    kind?: unknown;
    teamId?: unknown;
    groupId?: unknown;
    place?: unknown;
    matchKey?: unknown;
  };

  if (side.kind === "team" && typeof side.teamId === "string") {
    return { kind: "team", teamId: side.teamId };
  }

  if (
    (side.kind === "winner" || side.kind === "loser") &&
    typeof side.matchKey === "string" &&
    side.matchKey.trim()
  ) {
    return { kind: side.kind, matchKey: side.matchKey };
  }

  if (
    side.kind === "group-place" &&
    isGroupId(side.groupId) &&
    (side.place === 1 || side.place === 2)
  ) {
    return { kind: "group-place", groupId: side.groupId, place: side.place };
  }

  return null;
}

export function parseMatch(
  id: string,
  data: Record<string, unknown>,
): Match | null {
  const home = parseSide(data.home);
  const away = parseSide(data.away);
  const stage = data.stage;

  if (
    !home ||
    !away ||
    (stage !== "grupos" &&
      stage !== "liga" &&
      stage !== "eliminatoria" &&
      stage !== "final" &&
      stage !== "tercer-puesto") ||
    typeof data.order !== "number"
  ) {
    return null;
  }

  const match: Match = { id, stage, order: data.order, home, away };

  if (typeof data.matchKey === "string" && data.matchKey.trim()) {
    match.matchKey = data.matchKey;
  }

  if (stage === "grupos") {
    if (!isGroupId(data.groupId) || typeof data.round !== "number") return null;
    match.groupId = data.groupId;
    match.round = data.round;
  }

  if (stage === "liga" || stage === "eliminatoria") {
    if (typeof data.round !== "number") return null;
    match.round = data.round;
  }

  if (stage === "eliminatoria" && !match.matchKey) return null;

  if (typeof data.advancedTeamId === "string" && data.advancedTeamId.trim()) {
    match.advancedTeamId = data.advancedTeamId;
  }

  if (isComplexId(data.complexId)) match.complexId = data.complexId;
  if (typeof data.court === "string" && data.court.trim()) {
    match.court = data.court.trim();
  }
  if (typeof data.startsAt === "string" && isStartsAt(data.startsAt)) {
    match.startsAt = data.startsAt;
  }
  if (typeof data.homeScore === "number" && data.homeScore >= 0) {
    match.homeScore = data.homeScore;
  }
  if (typeof data.awayScore === "number" && data.awayScore >= 0) {
    match.awayScore = data.awayScore;
  }

  return match;
}
