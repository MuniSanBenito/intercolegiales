import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  parseTeam,
  TEAMS_COLLECTION,
  type Team,
  type TeamCycle,
} from "./teams";

export function subscribeTeams(
  onChange: (teams: Team[]) => void,
  onError: () => void,
) {
  return onSnapshot(
    collection(db, TEAMS_COLLECTION),
    (snapshot) => {
      const nextTeams = snapshot.docs
        .map((teamDoc) => parseTeam(teamDoc.id, teamDoc.data()))
        .filter((team): team is Team => team !== null)
        .sort((left, right) => left.name.localeCompare(right.name, "es"));

      onChange(nextTeams);
    },
    onError,
  );
}

export async function createTeam(input: {
  houseId: string;
  cycle: TeamCycle;
  name: string;
  disciplineId: string;
  sheetUrl: string;
}) {
  await addDoc(collection(db, TEAMS_COLLECTION), {
    houseId: input.houseId,
    cycle: input.cycle,
    name: input.name,
    disciplineId: input.disciplineId,
    ...(input.sheetUrl ? { sheetUrl: input.sheetUrl } : {}),
    createdAt: serverTimestamp(),
  });
}

export async function updateTeam(
  id: string,
  input: {
    houseId: string;
    cycle: TeamCycle;
    name: string;
    disciplineId: string;
    sheetUrl: string;
  },
) {
  await updateDoc(doc(db, TEAMS_COLLECTION, id), {
    houseId: input.houseId,
    cycle: input.cycle,
    name: input.name,
    disciplineId: input.disciplineId,
    sheetUrl: input.sheetUrl ? input.sheetUrl : deleteField(),
  });
}

export async function removeTeam(id: string) {
  await deleteDoc(doc(db, TEAMS_COLLECTION, id));
}
