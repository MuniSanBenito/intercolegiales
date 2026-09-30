import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { MATCHES_SUBCOLLECTION } from "./fixtures";
import { disciplineName } from "./teams";
import {
  isRankingFormat,
  parseTournament,
  TOURNAMENTS_COLLECTION,
  type RankingPodium,
  type Tournament,
  type TournamentFormat,
  type TournamentGroup,
} from "./tournaments";

export function subscribeTournaments(
  onChange: (tournaments: Tournament[]) => void,
  onError: () => void,
) {
  return onSnapshot(
    collection(db, TOURNAMENTS_COLLECTION),
    (snapshot) => {
      const nextTournaments = snapshot.docs
        .map((tournamentDoc) =>
          parseTournament(tournamentDoc.id, tournamentDoc.data()),
        )
        .filter((tournament): tournament is Tournament => tournament !== null)
        .sort((left, right) =>
          disciplineName(left.disciplineId).localeCompare(
            disciplineName(right.disciplineId),
            "es",
          ),
        );

      onChange(nextTournaments);
    },
    onError,
  );
}

function podiumPayload(podium: RankingPodium) {
  return {
    firstId: podium.firstId,
    secondId: podium.secondId,
    thirdId: podium.thirdId,
  };
}

function rankingFields(input: {
  format: TournamentFormat;
  venue: string;
  eventDate: string;
  details: string;
  podium: RankingPodium;
}) {
  if (!isRankingFormat(input.format)) {
    return {
      venue: deleteField(),
      eventDate: deleteField(),
      details: deleteField(),
      podium: deleteField(),
    };
  }

  return {
    venue: input.venue,
    eventDate: input.eventDate,
    details: input.details,
    podium: podiumPayload(input.podium),
  };
}

export async function createTournament(input: {
  disciplineId: string;
  format: TournamentFormat;
  teamIds: string[];
  venue: string;
  eventDate: string;
  details: string;
  podium: RankingPodium;
}) {
  const ranking = isRankingFormat(input.format)
    ? {
        venue: input.venue,
        eventDate: input.eventDate,
        details: input.details,
        podium: podiumPayload(input.podium),
      }
    : {};

  await addDoc(collection(db, TOURNAMENTS_COLLECTION), {
    disciplineId: input.disciplineId,
    format: input.format,
    teamIds: input.teamIds,
    createdAt: serverTimestamp(),
    ...ranking,
  });
}

function groupsPayload(groups: TournamentGroup[]) {
  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    teamIds: group.teamIds,
  }));
}

export async function updateTournament(
  id: string,
  input: {
    disciplineId: string;
    format: TournamentFormat;
    teamIds: string[];
    groups: TournamentGroup[];
    venue: string;
    eventDate: string;
    details: string;
    podium: RankingPodium;
  },
) {
  await updateDoc(doc(db, TOURNAMENTS_COLLECTION, id), {
    disciplineId: input.disciplineId,
    format: input.format,
    teamIds: input.teamIds,
    groups: groupsPayload(input.groups),
    ...rankingFields(input),
  });
}

export async function saveRankingPodium(id: string, podium: RankingPodium) {
  await updateDoc(doc(db, TOURNAMENTS_COLLECTION, id), {
    podium: podiumPayload(podium),
  });
}

export async function saveTournamentGroups(
  id: string,
  groups: TournamentGroup[],
) {
  await updateDoc(doc(db, TOURNAMENTS_COLLECTION, id), {
    groups: groupsPayload(groups),
  });
}

export async function removeTournament(id: string) {
  const tournamentRef = doc(db, TOURNAMENTS_COLLECTION, id);
  const matches = await getDocs(
    collection(tournamentRef, MATCHES_SUBCOLLECTION),
  );
  const batch = writeBatch(db);

  matches.forEach((matchDoc) => {
    batch.delete(matchDoc.ref);
  });
  batch.delete(tournamentRef);
  await batch.commit();
}
