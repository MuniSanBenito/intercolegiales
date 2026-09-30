import { useEffect, useRef, useState } from "react";
import {
  groupMatches,
  isPlayed,
  moveTeamToGroup,
  sameGroupAssignment,
  validateFixtureGroups,
  validateLeagueFixture,
  venueForDiscipline,
  type Match,
} from "./fixtures";
import {
  generateFixture,
  generateLeagueFixture,
  subscribeMatches,
} from "./fixturesFirestore";
import type { Team } from "./teams";
import { subscribeTeams } from "./teamsFirestore";
import {
  emptyTournamentGroups,
  pruneTournamentGroups,
  type GroupId,
  type Tournament,
  type TournamentGroup,
} from "./tournaments";
import {
  saveTournamentGroups,
  subscribeTournaments,
} from "./tournamentsFirestore";

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
  const [matchesReady, setMatchesReady] = useState(
    () => tournamentId.length === 0,
  );
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
  const hasLeagueMatches = matches.some((match) => match.stage === "liga");
  const leagueResults = matches.some(
    (match) => match.stage === "liga" && isPlayed(match),
  );

  const moveTeam = (teamId: string, target: "none" | GroupId) => {
    setGroupsError(null);
    setGenerateError(null);
    setGroupsDraft((current) =>
      moveTeamToGroup(current ?? groups, teamId, target),
    );
  };

  const saveGroups = async () => {
    if (!tournament || savingGroups) return false;

    setSavingGroups(true);
    setGroupsError(null);

    try {
      await saveTournamentGroups(
        tournament.id,
        pruneTournamentGroups(groups, tournament.teamIds),
      );
      return true;
    } catch {
      setGroupsError("No se pudieron guardar los grupos. Intentá de nuevo.");
      return false;
    } finally {
      setSavingGroups(false);
    }
  };

  const runGenerate = async () => {
    if (!tournament || generating) return false;

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
      return true;
    } catch {
      setGenerateError("No se pudo armar el fixture. Intentá de nuevo.");
      return false;
    } finally {
      setGenerating(false);
    }
  };

  const requestGenerate = async () => {
    if (!tournament || generating) return false;

    if (groupsDirty) {
      setGenerateError("Guardá los grupos antes de generar el fixture.");
      return false;
    }

    const validationError = validateFixtureGroups(tournament);
    if (validationError) {
      setGenerateError(validationError);
      return false;
    }

    if (hasGroupMatches) {
      regenerateDialogRef.current?.showModal();
      return false;
    }

    return runGenerate();
  };

  const runLeagueGenerate = async () => {
    if (!tournament || generating) return false;

    setGenerating(true);
    setGenerateError(null);

    try {
      await generateLeagueFixture(
        tournament.id,
        tournament.teamIds,
        matches,
        venueForDiscipline(tournament.disciplineId),
      );
      if (regenerateDialogRef.current?.open) {
        regenerateDialogRef.current.close();
      }
      return true;
    } catch {
      setGenerateError("No se pudo armar el fixture. Intentá de nuevo.");
      return false;
    } finally {
      setGenerating(false);
    }
  };

  const requestLeagueGenerate = async () => {
    if (!tournament || generating) return false;

    const validationError = validateLeagueFixture(tournament);
    if (validationError) {
      setGenerateError(validationError);
      return false;
    }

    if (hasLeagueMatches) {
      regenerateDialogRef.current?.showModal();
      return false;
    }

    return runLeagueGenerate();
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
    hasLeagueMatches,
    leagueResults,
    regenerateDialogRef,
    moveTeam,
    saveGroups,
    requestGenerate,
    confirmGenerate: runGenerate,
    requestLeagueGenerate,
    confirmLeagueGenerate: runLeagueGenerate,
    groupMatches: (groupId: GroupId) => groupMatches(matches, groupId),
  };
}
