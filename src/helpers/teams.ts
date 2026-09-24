import type { DocumentData } from "firebase/firestore";
import { DISCIPLINES, HOUSES } from "../data/tournamentData";

export const TEAMS_PAGE_SIZE = 15;
export const TEAMS_COLLECTION = "equipos";

export const TEAM_CYCLES = [
  { value: "basico", label: "Básico" },
  { value: "orientado", label: "Orientado" },
] as const;

export type TeamCycle = (typeof TEAM_CYCLES)[number]["value"];
export type DialogMode = "create" | "edit" | "view";

export interface Team {
  id: string;
  houseId: string;
  cycle: TeamCycle;
  name: string;
  disciplineId: string;
  sheetUrl?: string;
}

export interface TeamDraft {
  houseId: string;
  cycle: "" | TeamCycle;
  name: string;
  disciplineId: string;
  sheetUrl: string;
}

export const emptyTeamDraft: TeamDraft = {
  houseId: "",
  cycle: "",
  name: "",
  disciplineId: "",
  sheetUrl: "",
};

export interface TeamListPatch {
  q?: string;
  escuela?: string;
  ciclo?: string;
  disciplina?: string;
  pagina?: number;
}

export function isTeamCycle(value: unknown): value is TeamCycle {
  return value === "basico" || value === "orientado";
}

export function isGoogleSheetUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "docs.google.com" &&
      url.pathname.startsWith("/spreadsheets/")
    );
  } catch {
    return false;
  }
}

export function parseTeam(id: string, data: DocumentData): Team | null {
  if (
    typeof data.houseId !== "string" ||
    !isTeamCycle(data.cycle) ||
    typeof data.name !== "string" ||
    typeof data.disciplineId !== "string"
  ) {
    return null;
  }

  const team: Team = {
    id,
    houseId: data.houseId,
    cycle: data.cycle,
    name: data.name,
    disciplineId: data.disciplineId,
  };

  if (typeof data.sheetUrl === "string" && data.sheetUrl.length > 0) {
    team.sheetUrl = data.sheetUrl;
  }

  return team;
}

export function cycleLabel(cycle: TeamCycle): string {
  return cycle === "basico" ? "Básico" : "Orientado";
}

export function houseName(houseId: string): string {
  return (
    HOUSES.find((house) => house.id === houseId)?.name ?? "Escuela desconocida"
  );
}

export function disciplineName(disciplineId: string): string {
  return (
    DISCIPLINES.find((discipline) => discipline.id === disciplineId)?.name ??
    "Disciplina desconocida"
  );
}

export function teamFormTitle(mode: DialogMode): string {
  if (mode === "create") return "Nuevo equipo";
  if (mode === "edit") return "Editar equipo";
  return "Ver equipo";
}

export function draftFromTeam(team: Team): TeamDraft {
  return {
    houseId: team.houseId,
    cycle: team.cycle,
    name: team.name,
    disciplineId: team.disciplineId,
    sheetUrl: team.sheetUrl ?? "",
  };
}

export function validateTeamDraft(draft: TeamDraft): string | null {
  const name = draft.name.trim();
  const sheetUrl = draft.sheetUrl.trim();

  if (!name) return "El nombre es obligatorio.";

  if (!draft.houseId || !draft.cycle || !draft.disciplineId) {
    return "Completá escuela, ciclo y disciplina.";
  }

  if (sheetUrl && !isGoogleSheetUrl(sheetUrl)) {
    return "La lista de buena fe tiene que ser un enlace https de Google Sheets.";
  }

  return null;
}

export function applyTeamListParams(
  current: URLSearchParams,
  patch: TeamListPatch,
  resetPage: boolean,
) {
  const next = new URLSearchParams(current);
  const setOrDelete = (key: string, value: string | undefined) => {
    if (value) next.set(key, value);
    else next.delete(key);
  };

  if ("q" in patch) setOrDelete("q", patch.q);
  if ("escuela" in patch) setOrDelete("escuela", patch.escuela);
  if ("ciclo" in patch) setOrDelete("ciclo", patch.ciclo);
  if ("disciplina" in patch) setOrDelete("disciplina", patch.disciplina);

  if (resetPage) {
    next.delete("pagina");
  } else if ("pagina" in patch) {
    if (patch.pagina && patch.pagina > 1) {
      next.set("pagina", String(patch.pagina));
    } else {
      next.delete("pagina");
    }
  }

  return next;
}

export function readTeamListQuery(searchParams: URLSearchParams) {
  const query = searchParams.get("q") ?? "";
  const houseParam = searchParams.get("escuela") ?? "";
  const houseFilter = HOUSES.some((house) => house.id === houseParam)
    ? houseParam
    : "";
  const cycleParam = searchParams.get("ciclo") ?? "";
  const cycleFilter: "" | TeamCycle = isTeamCycle(cycleParam) ? cycleParam : "";
  const disciplineParam = searchParams.get("disciplina") ?? "";
  const disciplineFilter = DISCIPLINES.some(
    (discipline) => discipline.id === disciplineParam,
  )
    ? disciplineParam
    : "";
  const requestedPage = Number(searchParams.get("pagina"));
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  return { query, houseFilter, cycleFilter, disciplineFilter, page };
}

export function filterTeams(
  teams: Team[],
  filters: {
    query: string;
    houseFilter: string;
    cycleFilter: "" | TeamCycle;
    disciplineFilter: string;
  },
) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase("es");

  return teams.filter((team) => {
    if (filters.houseFilter && team.houseId !== filters.houseFilter) {
      return false;
    }
    if (filters.cycleFilter && team.cycle !== filters.cycleFilter) return false;
    if (
      filters.disciplineFilter &&
      team.disciplineId !== filters.disciplineFilter
    ) {
      return false;
    }
    if (!normalizedQuery) return true;

    const school = houseName(team.houseId).toLocaleLowerCase("es");
    return (
      team.name.toLocaleLowerCase("es").includes(normalizedQuery) ||
      school.includes(normalizedQuery)
    );
  });
}

export function paginateTeams(teams: Team[], page: number) {
  const pageCount = Math.max(1, Math.ceil(teams.length / TEAMS_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * TEAMS_PAGE_SIZE;

  return {
    pageCount,
    currentPage,
    visibleTeams: teams.slice(pageStart, pageStart + TEAMS_PAGE_SIZE),
  };
}

export function hasActiveTeamQuery(filters: {
  query: string;
  houseFilter: string;
  cycleFilter: string;
  disciplineFilter: string;
}) {
  return (
    filters.query.trim().length > 0 ||
    filters.houseFilter.length > 0 ||
    filters.cycleFilter.length > 0 ||
    filters.disciplineFilter.length > 0
  );
}
