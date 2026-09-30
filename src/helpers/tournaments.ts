import type { DocumentData } from "firebase/firestore";
import { DISCIPLINES } from "../data/tournamentData";
import type { DialogMode } from "./dialogMode";
import { paginate, readPageParam, setPageParam, setParam } from "./listParams";
import { disciplineName, type Team } from "./teams";

export const TOURNAMENTS_COLLECTION = "torneos";

export const TOURNAMENT_FORMATS = [
  { value: "dos-grupos-final", label: "2 grupos + final" },
  {
    value: "todos-contra-todos-con-fixture",
    label: "Todos contra todos (con fixture)",
  },
  {
    value: "todos-contra-todos-sin-fixture",
    label: "Todos contra todos (sin fixture)",
  },
  { value: "eliminatoria-directa", label: "Eliminatoria directa" },
] as const;

export type TournamentFormat = (typeof TOURNAMENT_FORMATS)[number]["value"];

export const RANKING_FORMAT = "todos-contra-todos-sin-fixture" as const;

export function isRankingFormat(
  format: TournamentFormat,
): format is typeof RANKING_FORMAT {
  return format === RANKING_FORMAT;
}

export interface RankingEvent {
  venue: string;
  eventDate: string;
  details: string;
}

export interface RankingPodium {
  firstId: string | null;
  secondId: string | null;
  thirdId: string | null;
}

export const emptyRankingPodium: RankingPodium = {
  firstId: null,
  secondId: null,
  thirdId: null,
};

export const GROUP_IDS = ["A", "B"] as const;

export type GroupId = (typeof GROUP_IDS)[number];

export interface TournamentGroup {
  id: GroupId;
  name: string;
  teamIds: string[];
}

export interface Tournament {
  id: string;
  disciplineId: string;
  format: TournamentFormat;
  teamIds: string[];
  groups: TournamentGroup[];
  event: RankingEvent | null;
  podium: RankingPodium;
}

export interface TournamentDraft {
  disciplineId: string;
  format: "" | TournamentFormat;
  teamIds: string[];
  venue: string;
  eventDate: string;
  details: string;
}

export const emptyTournamentDraft: TournamentDraft = {
  disciplineId: "",
  format: "",
  teamIds: [],
  venue: "",
  eventDate: "",
  details: "",
};

export interface TournamentListPatch {
  q?: string;
  disciplina?: string;
  formato?: string;
  pagina?: number;
}

export function isTournamentFormat(value: unknown): value is TournamentFormat {
  return TOURNAMENT_FORMATS.some((format) => format.value === value);
}

export function isGroupId(value: unknown): value is GroupId {
  return value === "A" || value === "B";
}

export function emptyTournamentGroups(): TournamentGroup[] {
  return [
    { id: "A", name: "Grupo A", teamIds: [] },
    { id: "B", name: "Grupo B", teamIds: [] },
  ];
}

export function pruneTournamentGroups(
  groups: TournamentGroup[],
  teamIds: string[],
): TournamentGroup[] {
  const allowed = new Set(teamIds);
  const seen = new Set<string>();

  return emptyTournamentGroups().map((fallback) => {
    const current = groups.find((group) => group.id === fallback.id);
    const nextTeamIds = (current?.teamIds ?? []).filter((teamId) => {
      if (!allowed.has(teamId) || seen.has(teamId)) return false;
      seen.add(teamId);
      return true;
    });

    return {
      id: fallback.id,
      name: current?.name?.trim() || fallback.name,
      teamIds: nextTeamIds,
    };
  });
}

function parseGroups(value: unknown, teamIds: string[]): TournamentGroup[] {
  if (!Array.isArray(value)) return emptyTournamentGroups();

  const parsed = value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];

    const group = item as {
      id?: unknown;
      name?: unknown;
      teamIds?: unknown;
    };

    if (!isGroupId(group.id)) return [];

    const groupTeamIds = Array.isArray(group.teamIds)
      ? group.teamIds.filter((teamId) => typeof teamId === "string")
      : [];

    return [
      {
        id: group.id,
        name: typeof group.name === "string" ? group.name : "",
        teamIds: groupTeamIds,
      },
    ];
  });

  return pruneTournamentGroups(parsed, teamIds);
}

export function formatLabel(format: TournamentFormat): string {
  return (
    TOURNAMENT_FORMATS.find((item) => item.value === format)?.label ?? format
  );
}

export function tournamentLabel(tournament: Tournament): string {
  return `${disciplineName(tournament.disciplineId)} · ${formatLabel(tournament.format)}`;
}

export function parseTournament(
  id: string,
  data: DocumentData,
): Tournament | null {
  if (
    typeof data.disciplineId !== "string" ||
    !isTournamentFormat(data.format) ||
    !Array.isArray(data.teamIds) ||
    data.teamIds.some((teamId) => typeof teamId !== "string")
  ) {
    return null;
  }

  const teamIds = data.teamIds as string[];

  return {
    id,
    disciplineId: data.disciplineId,
    format: data.format,
    teamIds,
    groups: parseGroups(data.groups, teamIds),
    event: parseRankingEvent(data.format, data),
    podium: isRankingFormat(data.format)
      ? parseRankingPodium(data.podium, teamIds)
      : emptyRankingPodium,
  };
}

function parseRankingEvent(
  format: TournamentFormat,
  data: DocumentData,
): RankingEvent | null {
  if (!isRankingFormat(format)) return null;

  return {
    venue: typeof data.venue === "string" ? data.venue : "",
    eventDate: typeof data.eventDate === "string" ? data.eventDate : "",
    details: typeof data.details === "string" ? data.details : "",
  };
}

function podiumTeamId(value: unknown, allowed: Set<string>, used: Set<string>) {
  if (typeof value !== "string" || !allowed.has(value) || used.has(value)) {
    return null;
  }

  used.add(value);
  return value;
}

export function parseRankingPodium(
  value: unknown,
  teamIds: string[],
): RankingPodium {
  const allowed = new Set(teamIds);
  const used = new Set<string>();
  const podium =
    value && typeof value === "object"
      ? (value as {
          firstId?: unknown;
          secondId?: unknown;
          thirdId?: unknown;
        })
      : {};

  return {
    firstId: podiumTeamId(podium.firstId, allowed, used),
    secondId: podiumTeamId(podium.secondId, allowed, used),
    thirdId: podiumTeamId(podium.thirdId, allowed, used),
  };
}

export function pruneRankingPodium(
  podium: RankingPodium,
  teamIds: string[],
): RankingPodium {
  return parseRankingPodium(podium, teamIds);
}

export function isEventDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function formatEventDate(value: string) {
  if (!isEventDate(value)) return value;

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function tournamentFormTitle(mode: DialogMode): string {
  if (mode === "create") return "Nuevo torneo";
  if (mode === "edit") return "Editar torneo";
  return "Ver torneo";
}

export function draftFromTournament(tournament: Tournament): TournamentDraft {
  return {
    disciplineId: tournament.disciplineId,
    format: tournament.format,
    teamIds: tournament.teamIds,
    venue: tournament.event?.venue ?? "",
    eventDate: tournament.event?.eventDate ?? "",
    details: tournament.event?.details ?? "",
  };
}

export function teamsForDiscipline(teams: Team[], disciplineId: string) {
  if (!disciplineId) return [];

  return teams
    .filter((team) => team.disciplineId === disciplineId)
    .sort((left, right) => left.name.localeCompare(right.name, "es"));
}

export function eligibleTeamIds(draft: TournamentDraft, teams: Team[]) {
  const allowed = new Set(
    teamsForDiscipline(teams, draft.disciplineId).map((team) => team.id),
  );

  return draft.teamIds.filter((teamId) => allowed.has(teamId));
}

export function validateTournamentDraft(
  draft: TournamentDraft,
  teams: Team[],
): string | null {
  if (!draft.disciplineId || !draft.format) {
    return "Completá disciplina y formato.";
  }

  const teamCount = eligibleTeamIds(draft, teams).length;

  if (draft.format && isRankingFormat(draft.format)) {
    if (!draft.venue.trim() || !isEventDate(draft.eventDate)) {
      return "Completá el lugar y la fecha.";
    }

    if (teamCount < 3) {
      return "Elegí al menos tres equipos para armar el podio.";
    }

    return null;
  }

  if (teamCount === 0) {
    return "Elegí al menos un equipo de la disciplina.";
  }

  return null;
}

export function teamNames(tournament: Tournament, teams: Team[]) {
  return tournament.teamIds.map((teamId) => {
    return teams.find((team) => team.id === teamId)?.name ?? "Equipo eliminado";
  });
}

export function applyTournamentListParams(
  current: URLSearchParams,
  patch: TournamentListPatch,
  resetPage: boolean,
) {
  const next = new URLSearchParams(current);

  if ("q" in patch) setParam(next, "q", patch.q);
  if ("disciplina" in patch) setParam(next, "disciplina", patch.disciplina);
  if ("formato" in patch) setParam(next, "formato", patch.formato);
  if (resetPage || "pagina" in patch) {
    setPageParam(next, patch.pagina, resetPage);
  }

  return next;
}

export function readTournamentListQuery(searchParams: URLSearchParams) {
  const query = searchParams.get("q") ?? "";
  const disciplineParam = searchParams.get("disciplina") ?? "";
  const disciplineFilter = DISCIPLINES.some(
    (discipline) => discipline.id === disciplineParam,
  )
    ? disciplineParam
    : "";
  const formatParam = searchParams.get("formato") ?? "";
  const formatFilter: "" | TournamentFormat = isTournamentFormat(formatParam)
    ? formatParam
    : "";
  const page = readPageParam(searchParams);

  return { query, disciplineFilter, formatFilter, page };
}

export function filterTournaments(
  tournaments: Tournament[],
  teams: Team[],
  filters: {
    query: string;
    disciplineFilter: string;
    formatFilter: "" | TournamentFormat;
  },
) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase("es");

  return tournaments.filter((tournament) => {
    if (
      filters.disciplineFilter &&
      tournament.disciplineId !== filters.disciplineFilter
    ) {
      return false;
    }
    if (filters.formatFilter && tournament.format !== filters.formatFilter) {
      return false;
    }
    if (!normalizedQuery) return true;

    const discipline = disciplineName(
      tournament.disciplineId,
    ).toLocaleLowerCase("es");
    const format = formatLabel(tournament.format).toLocaleLowerCase("es");
    const names = teamNames(tournament, teams)
      .join(" ")
      .toLocaleLowerCase("es");

    return (
      discipline.includes(normalizedQuery) ||
      format.includes(normalizedQuery) ||
      names.includes(normalizedQuery)
    );
  });
}

export function paginateTournaments(tournaments: Tournament[], page: number) {
  const result = paginate(tournaments, page);

  return {
    pageCount: result.pageCount,
    currentPage: result.currentPage,
    visibleTournaments: result.visible,
  };
}

export function hasActiveTournamentQuery(filters: {
  query: string;
  disciplineFilter: string;
  formatFilter: string;
}) {
  return (
    filters.query.trim().length > 0 ||
    filters.disciplineFilter.length > 0 ||
    filters.formatFilter.length > 0
  );
}
