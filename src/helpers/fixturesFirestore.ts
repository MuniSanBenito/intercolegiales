import {
  collection,
  deleteField,
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  buildGroupMatchDrafts,
  buildKnockoutMatchDrafts,
  buildLeagueMatchDrafts,
  isStartsAt,
  MATCHES_SUBCOLLECTION,
  parseMatch,
  parseScoreInput,
  type ComplexId,
  type Match,
  type MatchDraft,
  type MatchVenue,
} from "./fixtures";
import { TOURNAMENTS_COLLECTION, type TournamentGroup } from "./tournaments";

function matchesCollection(tournamentId: string) {
  return collection(
    db,
    TOURNAMENTS_COLLECTION,
    tournamentId,
    MATCHES_SUBCOLLECTION,
  );
}

function matchPayload(match: MatchDraft) {
  const payload: Record<string, unknown> = {
    stage: match.stage,
    order: match.order,
    home: match.home,
    away: match.away,
  };

  if (match.groupId) payload.groupId = match.groupId;
  if (match.round) payload.round = match.round;
  if (match.complexId) payload.complexId = match.complexId;
  if (match.court) payload.court = match.court;

  return payload;
}

export function subscribeMatches(
  tournamentId: string,
  onChange: (matches: Match[]) => void,
  onError: () => void,
) {
  return onSnapshot(
    matchesCollection(tournamentId),
    (snapshot) => {
      const matches = snapshot.docs
        .map((matchDoc) => parseMatch(matchDoc.id, matchDoc.data()))
        .filter((match): match is Match => match !== null)
        .sort((left, right) => left.order - right.order);

      onChange(matches);
    },
    onError,
  );
}

export async function generateFixture(
  tournamentId: string,
  groups: TournamentGroup[],
  existing: Match[],
  venue: MatchVenue,
) {
  const batch = writeBatch(db);
  const parent = matchesCollection(tournamentId);

  for (const match of existing) {
    if (match.stage !== "grupos") continue;
    batch.delete(doc(parent, match.id));
  }

  for (const match of buildGroupMatchDrafts(groups, venue)) {
    batch.set(doc(parent), matchPayload(match));
  }

  const knockout = buildKnockoutMatchDrafts(venue);
  for (const match of knockout) {
    const alreadyExists = existing.some((item) => item.stage === match.stage);
    if (alreadyExists) continue;
    batch.set(doc(parent), matchPayload(match));
  }

  await batch.commit();
}

export async function generateLeagueFixture(
  tournamentId: string,
  teamIds: string[],
  existing: Match[],
  venue: MatchVenue,
) {
  const batch = writeBatch(db);
  const parent = matchesCollection(tournamentId);

  for (const match of existing) {
    batch.delete(doc(parent, match.id));
  }

  for (const match of buildLeagueMatchDrafts(teamIds, venue)) {
    batch.set(doc(parent), matchPayload(match));
  }

  await batch.commit();
}

export async function updateMatchSchedule(
  tournamentId: string,
  matchId: string,
  input: {
    complexId: "" | ComplexId;
    court: string;
    startsAt: string;
    homeScore: string;
    awayScore: string;
  },
) {
  const startsAt = input.startsAt.trim();
  if (startsAt && !isStartsAt(startsAt)) {
    throw new Error("El horario tiene que incluir día y hora.");
  }

  const homeScore = parseScoreInput(input.homeScore);
  const awayScore = parseScoreInput(input.awayScore);
  const court = input.court.trim();

  await updateDoc(doc(matchesCollection(tournamentId), matchId), {
    complexId: input.complexId || deleteField(),
    court: court || deleteField(),
    startsAt: startsAt || deleteField(),
    homeScore: homeScore === null ? deleteField() : homeScore,
    awayScore: awayScore === null ? deleteField() : awayScore,
  });
}
