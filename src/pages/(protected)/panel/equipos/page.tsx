import { TeamDeleteDialog } from "../../../../components/equipos/TeamDeleteDialog";
import { TeamFormDialog } from "../../../../components/equipos/TeamFormDialog";
import { TeamsFilters } from "../../../../components/equipos/TeamsFilters";
import { TeamsHeader } from "../../../../components/equipos/TeamsHeader";
import { TeamsPagination } from "../../../../components/equipos/TeamsPagination";
import {
  TeamsLoading,
  TeamsResults,
} from "../../../../components/equipos/TeamsResults";
import { useTeamsAdmin } from "../../../../helpers/useTeamsAdmin";

export function Component() {
  const admin = useTeamsAdmin();

  return (
    <main className="px-4 py-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <TeamsHeader
          loading={admin.loading}
          count={admin.filteredCount}
          hasActiveQuery={admin.activeQuery}
          onCreate={() => admin.openForm("create")}
        />

        <TeamsFilters
          query={admin.listQuery.query}
          houseFilter={admin.listQuery.houseFilter}
          cycleFilter={admin.listQuery.cycleFilter}
          disciplineFilter={admin.listQuery.disciplineFilter}
          onQueryChange={(value) => admin.updateListParams({ q: value }, true)}
          onHouseChange={(value) =>
            admin.updateListParams({ escuela: value }, true)
          }
          onCycleChange={(value) =>
            admin.updateListParams({ ciclo: value }, true)
          }
          onDisciplineChange={(value) =>
            admin.updateListParams({ disciplina: value }, true)
          }
        />

        {admin.loading ? (
          <TeamsLoading />
        ) : (
          <>
            <TeamsResults
              teams={admin.visibleTeams}
              onView={(team) => admin.openForm("view", team)}
              onEdit={(team) => admin.openForm("edit", team)}
              onDelete={admin.openDelete}
            />
            <TeamsPagination
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
      </div>

      <TeamFormDialog
        dialogRef={admin.formDialogRef}
        title={admin.formTitle}
        readOnly={admin.readOnly}
        saving={admin.saving}
        draft={admin.draft}
        setDraft={admin.setDraft}
        formError={admin.formError}
        onSubmit={admin.handleSave}
        onClose={() => admin.formDialogRef.current?.close()}
      />

      <TeamDeleteDialog
        dialogRef={admin.deleteDialogRef}
        team={admin.pendingDelete}
        error={admin.deleteError}
        deleting={admin.deleting}
        onCancel={() => admin.deleteDialogRef.current?.close()}
        onConfirm={admin.handleDelete}
        onClose={admin.clearDeleteDialog}
      />
    </main>
  );
}
