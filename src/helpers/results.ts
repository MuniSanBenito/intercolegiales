import { HOUSES } from "../data/tournamentData";
import {
  groupMatches,
  isPlayed,
  knockoutMatch,
  leagueMatches,
  resolveGroupPlace,
  type Match,
  type MatchSide,
  type PlaceResolution,
} from "./fixtures";
import { disciplineName, houseName, type Team } from "./teams";
import type {
  Tournament,
  TournamentFormat,
  TournamentGroup,
} from "./tournaments";

export const PODIUM_POINTS = {
  1: 1000,
  2: 800,
  3: 600,
} as const;

export type PodiumPlace = keyof typeof PODIUM_POINTS;

export interface PodiumSlot {
  place: PodiumPlace;
  points: (typeof PODIUM_POINTS)[PodiumPlace];
  teamId: string | null;
  houseId: string | null;
}

export interface DisciplinePodium {
  tournamentId: string;
  disciplineId: string;
  format: TournamentFormat;
  slots: PodiumSlot[];
  detail: string | null;
}

export interface SchoolScore {
  houseId: string;
  points: number;
  places: Record<PodiumPlace, number>;
  rank: number | null;
}

function resolveSide(
  side: MatchSide,
  groups: TournamentGroup[],
  matches: Match[],
): PlaceResolution {
  if (side.kind === "team") return { status: "team", teamId: side.teamId };

  const group = groups.find((item) => item.id === side.groupId);
  return resolveGroupPlace(
    group?.teamIds ?? [],
    groupMatches(matches, side.groupId),
    side.place,
  );
}

type KnockoutDecision =
  | { status: "pending" }
  | { status: "blocked"; reason: string }
  | { status: "decided"; winnerId: string; loserId: string };

function decideMatch(
  match: Match | undefined,
  groups: TournamentGroup[],
  matches: Match[],
  blockedLabel: string,
  drawLabel: string,
): KnockoutDecision {
  if (!match || !isPlayed(match)) return { status: "pending" };

  const home = resolveSide(match.home, groups, matches);
  const away = resolveSide(match.away, groups, matches);

  if (home.status !== "team" || away.status !== "team") {
    if (home.status === "pending" || away.status === "pending") {
      return { status: "pending" };
    }

    return { status: "blocked", reason: blockedLabel };
  }

  if (match.homeScore === match.awayScore) {
    return { status: "blocked", reason: drawLabel };
  }

  const homeWins = (match.homeScore ?? 0) > (match.awayScore ?? 0);

  return {
    status: "decided",
    winnerId: homeWins ? home.teamId : away.teamId,
    loserId: homeWins ? away.teamId : home.teamId,
  };
}

function emptySlot(place: PodiumPlace): PodiumSlot {
  return {
    place,
    points: PODIUM_POINTS[place],
    teamId: null,
    houseId: null,
  };
}

function awardedSlot(
  place: PodiumPlace,
  teamId: string,
  teams: Team[],
): PodiumSlot {
  const team = teams.find((item) => item.id === teamId);
  const houseId = HOUSES.some((house) => house.id === team?.houseId)
    ? (team?.houseId ?? null)
    : null;

  return {
    place,
    points: PODIUM_POINTS[place],
    teamId,
    houseId,
  };
}

function placeWord(place: PodiumPlace) {
  if (place === 1) return "1.º";
  if (place === 2) return "2.º";
  return "3.º";
}

function podiumFromLeague(
  tournament: Tournament,
  matches: Match[],
  teams: Team[],
): DisciplinePodium {
  const slots = [emptySlot(1), emptySlot(2), emptySlot(3)];
  const table = leagueMatches(matches);

  if (table.length === 0) {
    return {
      tournamentId: tournament.id,
      disciplineId: tournament.disciplineId,
      format: tournament.format,
      slots,
      detail: "Generá el fixture para armar la tabla.",
    };
  }

  if (!table.every(isPlayed)) {
    return {
      tournamentId: tournament.id,
      disciplineId: tournament.disciplineId,
      format: tournament.format,
      slots,
      detail:
        "El podio se define cuando están cargados todos los partidos de la tabla.",
    };
  }

  const details: string[] = [];

  for (const place of [1, 2, 3] as const) {
    const resolution = resolveGroupPlace(tournament.teamIds, table, place);

    if (resolution.status === "team") {
      slots[place - 1] = awardedSlot(place, resolution.teamId, teams);
    } else if (resolution.status === "tie") {
      details.push(
        `Hay un empate en el ${placeWord(place)} puesto, así que no se define.`,
      );
    }
  }

  if (slots.some((slot) => slot.teamId && !slot.houseId)) {
    details.push(
      "Hay un puesto de un equipo sin escuela: ese puntaje no entra en la tabla general.",
    );
  }

  return {
    tournamentId: tournament.id,
    disciplineId: tournament.disciplineId,
    format: tournament.format,
    slots,
    detail: details.length > 0 ? details.join(" ") : null,
  };
}

function podiumForTournament(
  tournament: Tournament,
  matches: Match[],
  teams: Team[],
): DisciplinePodium {
  const slots = [emptySlot(1), emptySlot(2), emptySlot(3)];

  if (tournament.format === "todos-contra-todos-con-fixture") {
    return podiumFromLeague(tournament, matches, teams);
  }

  if (tournament.format !== "dos-grupos-final") {
    return {
      tournamentId: tournament.id,
      disciplineId: tournament.disciplineId,
      format: tournament.format,
      slots,
      detail:
        "Este formato todavía no define los tres primeros. Cuando exista el podio, suma igual: 1000, 800 y 600.",
    };
  }

  const details: string[] = [];
  const finalDecision = decideMatch(
    knockoutMatch(matches, "final"),
    tournament.groups,
    matches,
    "Hay un empate en la tabla de un grupo, así que la final no define el 1.º ni el 2.º.",
    "La final terminó empatada, así que no se definen el 1.º ni el 2.º.",
  );
  const thirdDecision = decideMatch(
    knockoutMatch(matches, "tercer-puesto"),
    tournament.groups,
    matches,
    "Hay un empate en la tabla de un grupo, así que no se define el 3.º.",
    "El partido por el 3.º y 4.º puesto terminó empatado, así que no se define el 3.º.",
  );

  if (finalDecision.status === "decided") {
    slots[0] = awardedSlot(1, finalDecision.winnerId, teams);
    slots[1] = awardedSlot(2, finalDecision.loserId, teams);
  } else if (finalDecision.status === "blocked") {
    details.push(finalDecision.reason);
  }

  if (thirdDecision.status === "decided") {
    slots[2] = awardedSlot(3, thirdDecision.winnerId, teams);
  } else if (thirdDecision.status === "blocked") {
    details.push(thirdDecision.reason);
  }

  if (slots.some((slot) => slot.teamId && !slot.houseId)) {
    details.push(
      "Hay un puesto de un equipo sin escuela: ese puntaje no entra en la tabla general.",
    );
  }

  return {
    tournamentId: tournament.id,
    disciplineId: tournament.disciplineId,
    format: tournament.format,
    slots,
    detail: details.length > 0 ? details.join(" ") : null,
  };
}

export function buildResults(
  tournaments: Tournament[],
  teams: Team[],
  matchesByTournament: Record<string, Match[]>,
) {
  const disciplines = [...tournaments]
    .sort((left, right) =>
      disciplineName(left.disciplineId).localeCompare(
        disciplineName(right.disciplineId),
        "es",
      ),
    )
    .map((tournament) =>
      podiumForTournament(
        tournament,
        matchesByTournament[tournament.id] ?? [],
        teams,
      ),
    );

  const totals = new Map(
    HOUSES.map((house) => [
      house.id,
      {
        points: 0,
        places: { 1: 0, 2: 0, 3: 0 } as Record<PodiumPlace, number>,
      },
    ]),
  );

  for (const discipline of disciplines) {
    for (const slot of discipline.slots) {
      if (!slot.teamId || !slot.houseId) continue;
      const total = totals.get(slot.houseId);
      if (!total) continue;
      total.points += slot.points;
      total.places[slot.place] += 1;
    }
  }

  const ranked = HOUSES.map((house) => {
    const total = totals.get(house.id);
    return {
      houseId: house.id,
      points: total?.points ?? 0,
      places: total?.places ?? { 1: 0, 2: 0, 3: 0 },
    };
  }).sort((left, right) => {
    if (right.points !== left.points) return right.points - left.points;
    return houseName(left.houseId).localeCompare(
      houseName(right.houseId),
      "es",
    );
  });

  let lastPoints = -1;
  let lastRank = 0;
  const schools: SchoolScore[] = ranked.map((row, index) => {
    if (row.points === 0) return { ...row, rank: null };
    if (row.points !== lastPoints) {
      lastRank = index + 1;
      lastPoints = row.points;
    }
    return { ...row, rank: lastRank };
  });

  return { schools, disciplines };
}
