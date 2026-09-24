import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useSearchParams } from "react-router";
import {
  applyTeamListParams,
  draftFromTeam,
  emptyTeamDraft,
  filterTeams,
  hasActiveTeamQuery,
  paginateTeams,
  readTeamListQuery,
  teamFormTitle,
  validateTeamDraft,
  type DialogMode,
  type Team,
  type TeamDraft,
  type TeamListPatch,
} from "./teams";
import {
  createTeam,
  removeTeam,
  subscribeTeams,
  updateTeam,
} from "./teamsFirestore";

export function useTeamsAdmin() {
  const formDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const listQuery = readTeamListQuery(searchParams);

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<DialogMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TeamDraft>(emptyTeamDraft);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Team | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formRequest, setFormRequest] = useState(0);
  const [deleteRequest, setDeleteRequest] = useState(0);

  useEffect(() => {
    return subscribeTeams(
      (nextTeams) => {
        setTeams(nextTeams);
        setLoading(false);
      },
      () => {
        setTeams([]);
        setLoading(false);
      },
    );
  }, []);

  const filteredTeams = filterTeams(teams, listQuery);
  const pagination = paginateTeams(filteredTeams, listQuery.page);
  const activeQuery = hasActiveTeamQuery(listQuery);

  const updateListParams = (patch: TeamListPatch, resetPage = false) => {
    setSearchParams(
      (current) => applyTeamListParams(current, patch, resetPage),
      { replace: true },
    );
  };

  const openForm = (nextMode: DialogMode, team?: Team) => {
    setMode(nextMode);
    setEditingId(team?.id ?? null);
    setDraft(team ? draftFromTeam(team) : emptyTeamDraft);
    setFormError(null);
    setFormRequest((current) => current + 1);
  };

  const openDelete = (team: Team) => {
    setPendingDelete(team);
    setDeleteError(null);
    setDeleteRequest((current) => current + 1);
  };

  useEffect(() => {
    if (formRequest === 0) return;
    const dialog = formDialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, [formRequest]);

  useEffect(() => {
    if (deleteRequest === 0) return;
    const dialog = deleteDialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, [deleteRequest]);

  const handleSave = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "view" || saving) return;

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const validationError = validateTeamDraft(draft);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!draft.cycle) return;

    const name = draft.name.trim();
    const sheetUrl = draft.sheetUrl.trim();
    const input = {
      houseId: draft.houseId,
      cycle: draft.cycle,
      name,
      disciplineId: draft.disciplineId,
      sheetUrl,
    };

    setSaving(true);
    setFormError(null);

    try {
      if (mode === "create") {
        await createTeam(input);
      } else if (editingId) {
        await updateTeam(editingId, input);
      }

      formDialogRef.current?.close();
    } catch {
      setFormError("No se pudo guardar el equipo. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete || deleting) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await removeTeam(pendingDelete.id);
      deleteDialogRef.current?.close();
    } catch {
      setDeleteError("No se pudo eliminar el equipo. Intentá de nuevo.");
    } finally {
      setDeleting(false);
    }
  };

  const clearDeleteDialog = () => {
    setPendingDelete(null);
    setDeleteError(null);
  };

  return {
    loading,
    filteredCount: filteredTeams.length,
    activeQuery,
    listQuery,
    visibleTeams: pagination.visibleTeams,
    currentPage: pagination.currentPage,
    pageCount: pagination.pageCount,
    updateListParams,
    openForm,
    openDelete,
    formDialogRef,
    deleteDialogRef,
    mode,
    draft,
    setDraft,
    formError,
    saving,
    handleSave,
    formTitle: teamFormTitle(mode),
    readOnly: mode === "view",
    pendingDelete,
    deleteError,
    deleting,
    handleDelete,
    clearDeleteDialog,
  };
}
