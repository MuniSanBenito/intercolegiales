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

export interface Tournament {
  id: string;
  disciplineId: string;
  format: TournamentFormat;
  teamIds: string[];
}

export interface TournamentDraft {
  disciplineId: string;
  format: "" | TournamentFormat;
  teamIds: string[];
}

export const emptyTournamentDraft: TournamentDraft = {
  disciplineId: "",
  format: "",
  teamIds: [],
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

  return {
    id,
    disciplineId: data.disciplineId,
    format: data.format,
    teamIds: data.teamIds,
  };
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

  if (eligibleTeamIds(draft, teams).length === 0) {
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
