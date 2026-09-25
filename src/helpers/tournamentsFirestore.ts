import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { disciplineName } from "./teams";
import {
  parseTournament,
  TOURNAMENTS_COLLECTION,
  type Tournament,
  type TournamentFormat,
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

export async function createTournament(input: {
  disciplineId: string;
  format: TournamentFormat;
  teamIds: string[];
}) {
  await addDoc(collection(db, TOURNAMENTS_COLLECTION), {
    disciplineId: input.disciplineId,
    format: input.format,
    teamIds: input.teamIds,
    createdAt: serverTimestamp(),
  });
}

export async function updateTournament(
  id: string,
  input: {
    disciplineId: string;
    format: TournamentFormat;
    teamIds: string[];
  },
) {
  await updateDoc(doc(db, TOURNAMENTS_COLLECTION, id), {
    disciplineId: input.disciplineId,
    format: input.format,
    teamIds: input.teamIds,
  });
}

export async function removeTournament(id: string) {
  await deleteDoc(doc(db, TOURNAMENTS_COLLECTION, id));
}
