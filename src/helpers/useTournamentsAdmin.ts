import { useEffect, useState, type SubmitEvent } from "react";
import { useSearchParams } from "react-router";
import type { DialogMode } from "./dialogMode";
import type { Team } from "./teams";
import { subscribeTeams } from "./teamsFirestore";
import {
  applyTournamentListParams,
  draftFromTournament,
  eligibleTeamIds,
  emptyTournamentDraft,
  filterTournaments,
  hasActiveTournamentQuery,
  paginateTournaments,
  readTournamentListQuery,
  tournamentFormTitle,
  validateTournamentDraft,
  type Tournament,
  type TournamentDraft,
  type TournamentListPatch,
} from "./tournaments";
import {
  createTournament,
  removeTournament,
  subscribeTournaments,
  updateTournament,
} from "./tournamentsFirestore";
import { usePanelDialogs } from "./usePanelDialogs";

export function useTournamentsAdmin() {
  const dialogs = usePanelDialogs();
  const [searchParams, setSearchParams] = useSearchParams();
  const listQuery = readTournamentListQuery(searchParams);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournamentsReady, setTournamentsReady] = useState(false);
  const [teamsReady, setTeamsReady] = useState(false);

  const [mode, setMode] = useState<DialogMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TournamentDraft>(emptyTournamentDraft);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Tournament | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const filteredTournaments = filterTournaments(tournaments, teams, listQuery);
  const pagination = paginateTournaments(filteredTournaments, listQuery.page);

  const updateListParams = (patch: TournamentListPatch, resetPage = false) => {
    setSearchParams(
      (current) => applyTournamentListParams(current, patch, resetPage),
      { replace: true },
    );
  };

  const openForm = (nextMode: DialogMode, tournament?: Tournament) => {
    setMode(nextMode);
    setEditingId(tournament?.id ?? null);
    setDraft(
      tournament ? draftFromTournament(tournament) : emptyTournamentDraft,
    );
    setFormError(null);
    dialogs.requestForm();
  };

  const openDelete = (tournament: Tournament) => {
    setPendingDelete(tournament);
    setDeleteError(null);
    dialogs.requestDelete();
  };

  const handleSave = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "view" || saving) return;

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const validationError = validateTournamentDraft(draft, teams);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!draft.format) return;

    const input = {
      disciplineId: draft.disciplineId,
      format: draft.format,
      teamIds: eligibleTeamIds(draft, teams),
    };

    setSaving(true);
    setFormError(null);

    try {
      if (mode === "create") {
        await createTournament(input);
      } else if (editingId) {
        await updateTournament(editingId, input);
      }

      dialogs.formDialogRef.current?.close();
    } catch {
      setFormError("No se pudo guardar el torneo. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete || deleting) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await removeTournament(pendingDelete.id);
      dialogs.deleteDialogRef.current?.close();
    } catch {
      setDeleteError("No se pudo eliminar el torneo. Intentá de nuevo.");
    } finally {
      setDeleting(false);
    }
  };

  const clearDeleteDialog = () => {
    setPendingDelete(null);
    setDeleteError(null);
  };

  return {
    loading: !tournamentsReady || !teamsReady,
    teams,
    filteredCount: filteredTournaments.length,
    activeQuery: hasActiveTournamentQuery(listQuery),
    listQuery,
    visibleTournaments: pagination.visibleTournaments,
    currentPage: pagination.currentPage,
    pageCount: pagination.pageCount,
    updateListParams,
    openForm,
    openDelete,
    formDialogRef: dialogs.formDialogRef,
    deleteDialogRef: dialogs.deleteDialogRef,
    draft,
    setDraft,
    formError,
    saving,
    handleSave,
    formTitle: tournamentFormTitle(mode),
    readOnly: mode === "view",
    pendingDelete,
    deleteError,
    deleting,
    handleDelete,
    clearDeleteDialog,
  };
}
