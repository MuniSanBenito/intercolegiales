import { useEffect, useMemo, useState } from "react";
import { subscribeMatches } from "./fixturesFirestore";
import type { Match } from "./fixtures";
import { buildResults } from "./results";
import type { Team } from "./teams";
import { subscribeTeams } from "./teamsFirestore";
import type { Tournament } from "./tournaments";
import { subscribeTournaments } from "./tournamentsFirestore";

export function useResults() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matchesByTournament, setMatchesByTournament] = useState<
    Record<string, Match[]>
  >({});
  const [tournamentsReady, setTournamentsReady] = useState(false);
  const [teamsReady, setTeamsReady] = useState(false);
  const [matchesReady, setMatchesReady] = useState(false);
  const [trackedKey, setTrackedKey] = useState<string | null>(null);

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

  const tournamentKey = tournaments.map((tournament) => tournament.id).join("|");

  if (tournamentsReady && trackedKey !== tournamentKey) {
    setTrackedKey(tournamentKey);
    setMatchesByTournament({});
    setMatchesReady(tournamentKey.length === 0);
  }

  useEffect(() => {
    if (!tournamentsReady || tournamentKey.length === 0) return;

    const ids = tournamentKey.split("|");
    let active = true;
    const pending = new Set(ids);

    const markReady = (id: string, matches: Match[]) => {
      if (!active) return;
      setMatchesByTournament((current) => ({ ...current, [id]: matches }));
      pending.delete(id);
      if (pending.size === 0) setMatchesReady(true);
    };

    const unsubs = ids.map((id) =>
      subscribeMatches(
        id,
        (matches) => markReady(id, matches),
        () => markReady(id, []),
      ),
    );

    return () => {
      active = false;
      unsubs.forEach((unsub) => unsub());
    };
  }, [tournamentsReady, tournamentKey]);

  const board = useMemo(
    () => buildResults(tournaments, teams, matchesByTournament),
    [tournaments, teams, matchesByTournament],
  );

  return {
    loading: !tournamentsReady || !teamsReady || !matchesReady,
    teams,
    schools: board.schools,
    disciplines: board.disciplines,
  };
}
