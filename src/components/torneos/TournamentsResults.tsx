import { disciplineName, type Team } from "../../helpers/teams";
import {
  formatLabel,
  teamNames,
  tournamentLabel,
  type Tournament,
} from "../../helpers/tournaments";
import { PanelCatalog, type PanelColumn } from "../panel/PanelCatalog";
import { PanelRowActions } from "../panel/PanelRowActions";

function TeamSummary({
  tournament,
  teams,
}: {
  tournament: Tournament;
  teams: Team[];
}) {
  const names = teamNames(tournament, teams);
  if (names.length === 0) {
    return <span className="text-slate-500">Sin equipos</span>;
  }

  return (
    <span>
      {names.join(", ")}
      <span className="text-slate-500"> ({names.length})</span>
    </span>
  );
}

export function TournamentsResults({
  tournaments,
  teams,
  onView,
  onEdit,
  onDelete,
}: {
  tournaments: Tournament[];
  teams: Team[];
  onView: (tournament: Tournament) => void;
  onEdit: (tournament: Tournament) => void;
  onDelete: (tournament: Tournament) => void;
}) {
  const columns: PanelColumn<Tournament>[] = [
    {
      header: "Disciplina",
      width: "w-[24%]",
      rowHeader: true,
      className: "break-words",
      render: (tournament) => disciplineName(tournament.disciplineId),
    },
    {
      header: "Formato",
      width: "w-[28%]",
      className: "break-words text-slate-300",
      render: (tournament) => formatLabel(tournament.format),
    },
    {
      header: "Equipos",
      width: "w-[34%]",
      className: "break-words text-slate-300",
      render: (tournament) => (
        <TeamSummary tournament={tournament} teams={teams} />
      ),
    },
    {
      header: "Acciones",
      width: "w-[14%]",
      render: (tournament) => (
        <PanelRowActions
          name={tournamentLabel(tournament)}
          onView={() => onView(tournament)}
          onEdit={() => onEdit(tournament)}
          onDelete={() => onDelete(tournament)}
          className="flex gap-1"
        />
      ),
    },
  ];

  return (
    <PanelCatalog
      items={tournaments}
      caption="Torneos"
      columns={columns}
      tableClassName="w-full min-w-[760px] table-fixed text-left text-sm"
      scroll
      renderCard={(tournament) => (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">
              {disciplineName(tournament.disciplineId)}
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              {formatLabel(tournament.format)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              <TeamSummary tournament={tournament} teams={teams} />
            </p>
          </div>
          <PanelRowActions
            name={tournamentLabel(tournament)}
            onView={() => onView(tournament)}
            onEdit={() => onEdit(tournament)}
            onDelete={() => onDelete(tournament)}
            className="flex shrink-0 gap-1"
          />
        </div>
      )}
    />
  );
}
