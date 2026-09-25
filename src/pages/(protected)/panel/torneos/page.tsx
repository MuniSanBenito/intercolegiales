import { PanelLoading } from "../../../../components/panel/PanelLoading";
import { PanelPage } from "../../../../components/panel/PanelPage";
import { PanelPagination } from "../../../../components/panel/PanelPagination";
import { TournamentDeleteDialog } from "../../../../components/torneos/TournamentDeleteDialog";
import { TournamentFormDialog } from "../../../../components/torneos/TournamentFormDialog";
import { TournamentsFilters } from "../../../../components/torneos/TournamentsFilters";
import { TournamentsHeader } from "../../../../components/torneos/TournamentsHeader";
import { TournamentsResults } from "../../../../components/torneos/TournamentsResults";
import { useTournamentsAdmin } from "../../../../helpers/useTournamentsAdmin";

export function Component() {
  const admin = useTournamentsAdmin();

  return (
    <PanelPage>
      <TournamentsHeader
        loading={admin.loading}
        count={admin.filteredCount}
        hasActiveQuery={admin.activeQuery}
        onCreate={() => admin.openForm("create")}
      />

      <TournamentsFilters
        query={admin.listQuery.query}
        disciplineFilter={admin.listQuery.disciplineFilter}
        formatFilter={admin.listQuery.formatFilter}
        onQueryChange={(value) => admin.updateListParams({ q: value }, true)}
        onDisciplineChange={(value) =>
          admin.updateListParams({ disciplina: value }, true)
        }
        onFormatChange={(value) =>
          admin.updateListParams({ formato: value }, true)
        }
      />

      {admin.loading ? (
        <PanelLoading label="Cargando torneos…" />
      ) : (
        <>
          <TournamentsResults
            tournaments={admin.visibleTournaments}
            teams={admin.teams}
            onView={(tournament) => admin.openForm("view", tournament)}
            onEdit={(tournament) => admin.openForm("edit", tournament)}
            onDelete={admin.openDelete}
          />
          <PanelPagination
            label="Paginación de torneos"
            currentPage={admin.currentPage}
            pageCount={admin.pageCount}
            onPrevious={() =>
              admin.updateListParams({ pagina: admin.currentPage - 1 })
            }
            onNext={() =>
              admin.updateListParams({
                pagina: Math.min(admin.pageCount, admin.currentPage + 1),
              })
            }
          />
        </>
      )}

      <TournamentFormDialog
        dialogRef={admin.formDialogRef}
        title={admin.formTitle}
        readOnly={admin.readOnly}
        saving={admin.saving}
        draft={admin.draft}
        setDraft={admin.setDraft}
        teams={admin.teams}
        formError={admin.formError}
        onSubmit={admin.handleSave}
        onClose={() => admin.formDialogRef.current?.close()}
      />

      <TournamentDeleteDialog
        dialogRef={admin.deleteDialogRef}
        tournament={admin.pendingDelete}
        error={admin.deleteError}
        deleting={admin.deleting}
        onCancel={() => admin.deleteDialogRef.current?.close()}
        onConfirm={admin.handleDelete}
        onClose={admin.clearDeleteDialog}
      />
    </PanelPage>
  );
}
