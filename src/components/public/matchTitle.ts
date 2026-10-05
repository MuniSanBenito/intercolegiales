import {
  complexLabel,
  eliminationRoundLabel,
  groupMatches,
  isPlayed,
  placeLabel,
  resolveGroupPlace,
  resolveMatchSide,
  type Match,
  type MatchSide,
} from "../../helpers/fixtures";
import type { TournamentGroup } from "../../helpers/tournaments";

function joinNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} y ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

function referredMatchLabel(matchKey: string, matches: Match[]) {
  const source = matches.find((match) => match.matchKey === matchKey);
  if (!source) return "un partido anterior";
  if (source.stage === "final") return "la final";
  if (source.stage === "tercer-puesto") return "el partido por el 3.º";

  const sameRound = matches.filter(
    (match) => match.stage === "eliminatoria" && match.round === source.round,
  );
  const name = eliminationRoundLabel(source.round ?? 4).toLowerCase();
  if (sameRound.length <= 1) return name;

  const index = sameRound.findIndex((match) => match.matchKey === matchKey);
  return `${name} · partido ${index + 1}`;
}

export function matchSideTitle(
  side: MatchSide,
  groups: TournamentGroup[],
  matches: Match[],
  teamName: (teamId: string) => string,
) {
  if (side.kind === "team") return teamName(side.teamId);

  if (side.kind === "winner" || side.kind === "loser") {
    const role = side.kind === "winner" ? "Ganador" : "Perdedor";
    const origin = referredMatchLabel(side.matchKey, matches);
    const resolution = resolveMatchSide(side, groups, matches);
    if (resolution.status === "team") {
      return `${role} de ${origin} · ${teamName(resolution.teamId)}`;
    }
    return `${role} de ${origin}`;
  }

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

export function matchPlaceLabel(match: Match) {
  if (!match.complexId && !match.court) return "Sin sede";

  const place = match.complexId ? complexLabel(match.complexId) : "";
  return [place, match.court].filter(Boolean).join(" · ");
}

export function kickoffLabel(startsAt: string | undefined) {
  if (!startsAt) return "Sin horario";

  const [date, time] = startsAt.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const formatted = new Date(year, (month ?? 1) - 1, day).toLocaleDateString(
    "es-AR",
    { day: "numeric", month: "short" },
  );

  return `${formatted} · ${time}`;
}

export function scoreLabel(match: Match) {
  if (!isPlayed(match)) return "Sin resultado";
  return `${match.homeScore}–${match.awayScore}`;
}
