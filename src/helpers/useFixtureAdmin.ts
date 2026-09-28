import { useEffect, useRef, useState } from "react";
import {
  groupMatches,
  isPlayed,
  moveTeamToGroup,
  sameGroupAssignment,
  validateFixtureGroups,
  venueForDiscipline,
  type Match,
} from "./fixtures";
import { generateFixture, subscribeMatches } from "./fixturesFirestore";
import type { Team } from "./teams";
import { subscribeTeams } from "./teamsFirestore";
import {
  emptyTournamentGroups,
  pruneTournamentGroups,
  type GroupId,
  type Tournament,
  type TournamentGroup,
} from "./tournaments";
import { saveTournamentGroups, subscribeTournaments } from "./tournamentsFirestore";

function groupsSignature(groups: TournamentGroup[]) {
  return emptyTournamentGroups()
    .map((fallback) => {
      const group = groups.find((item) => item.id === fallback.id);
      return (group?.teamIds ?? []).join(",");
    })
    .join("|");
}

export function useFixtureAdmin(tournamentId: string) {
  const regenerateDialogRef = useRef<HTMLDialogElement>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournamentsReady, setTournamentsReady] = useState(false);
  const [teamsReady, setTeamsReady] = useState(false);
  const [matchesReady, setMatchesReady] = useState(() => tournamentId.length === 0);
  const [trackedMatchId, setTrackedMatchId] = useState(tournamentId);
  const [groupsDraft, setGroupsDraft] = useState<TournamentGroup[] | null>(
    null,
  );
  const [seenDraftKey, setSeenDraftKey] = useState<string | null>(null);
  const [savingGroups, setSavingGroups] = useState(false);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    return subscribeTournaments(
      (nextTournaments) => {
        setTournaments(nextTournaments);
        setTournamentsReady(true);
      },
      () => {
        setTournaments([]);
        setTournamentsReady(true);
      },
    );
  }, []);

  useEffect(() => {
    return subscribeTeams(
      (nextTeams) => {
        setTeams(nextTeams);
        setTeamsReady(true);
      },
      () => {
        setTeams([]);
        setTeamsReady(true);
      },
    );
  }, []);

  useEffect(() => {
    if (!tournamentId) return;

    return subscribeMatches(
      tournamentId,
      (nextMatches) => {
        setMatches(nextMatches);
        setMatchesReady(true);
      },
      () => {
        setMatches([]);
        setMatchesReady(true);
      },
    );
  }, [tournamentId]);

  if (trackedMatchId !== tournamentId) {
    setTrackedMatchId(tournamentId);
    setMatches([]);
    setMatchesReady(tournamentId.length === 0);
  }

  const tournament =
    tournaments.find((item) => item.id === tournamentId) ?? null;
  const signature = tournament ? groupsSignature(tournament.groups) : "";
  const draftKey = tournament ? `${tournament.id}:${signature}` : "";

  if (seenDraftKey !== draftKey) {
    setSeenDraftKey(draftKey);
    setGroupsDraft(tournament?.groups ?? null);
  }

  const groups = groupsDraft ?? tournament?.groups ?? emptyTournamentGroups();
  const groupsDirty = tournament
    ? !sameGroupAssignment(groups, tournament.groups)
    : false;
  const hasGroupMatches = matches.some((match) => match.stage === "grupos");
  const groupResults = matches.some(
    (match) => match.stage === "grupos" && isPlayed(match),
  );

  const moveTeam = (teamId: string, target: "none" | GroupId) => {
    setGroupsError(null);
    setGenerateError(null);
    setGroupsDraft((current) =>
      moveTeamToGroup(current ?? groups, teamId, target),
    );
  };

  const saveGroups = async () => {
    if (!tournament || savingGroups) return;

    setSavingGroups(true);
    setGroupsError(null);

    try {
      await saveTournamentGroups(
        tournament.id,
        pruneTournamentGroups(groups, tournament.teamIds),
      );
    } catch {
      setGroupsError("No se pudieron guardar los grupos. Intentá de nuevo.");
    } finally {
      setSavingGroups(false);
    }
  };

  const runGenerate = async () => {
    if (!tournament || generating) return;

    setGenerating(true);
    setGenerateError(null);

    try {
      await generateFixture(
        tournament.id,
        pruneTournamentGroups(groups, tournament.teamIds),
        matches,
        venueForDiscipline(tournament.disciplineId),
      );
      if (regenerateDialogRef.current?.open) {
        regenerateDialogRef.current.close();
      }
    } catch {
      setGenerateError("No se pudo armar el fixture. Intentá de nuevo.");
    } finally {
      setGenerating(false);
    }
  };

  const requestGenerate = () => {
    if (!tournament || generating) return;

    if (groupsDirty) {
      setGenerateError("Guardá los grupos antes de generar el fixture.");
      return;
    }

    const validationError = validateFixtureGroups(tournament);
    if (validationError) {
      setGenerateError(validationError);
      return;
    }

    if (hasGroupMatches) {
      regenerateDialogRef.current?.showModal();
      return;
    }

    void runGenerate();
  };

  return {
    loading: !tournamentsReady || !teamsReady || !matchesReady,
    tournament,
    teams,
    matches,
    groups,
    groupsDirty,
    savingGroups,
    groupsError,
    generating,
    generateError,
    hasGroupMatches,
    groupResults,
    regenerateDialogRef,
    moveTeam,
    saveGroups,
    requestGenerate,
    confirmGenerate: () => void runGenerate(),
    groupMatches: (groupId: GroupId) => groupMatches(matches, groupId),
  };
}
