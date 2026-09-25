import { ExternalLink, Eye, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { PanelCatalog, type PanelColumn } from "../panel/PanelCatalog";
import {
  cycleLabel,
  disciplineName,
  houseName,
  type Team,
} from "../../helpers/teams";

function SheetLink({ url }: { url?: string }) {
  if (!url) {
    return <span className="text-slate-500">Sin lista</span>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-cyan-300 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      Abrir sheet
      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </a>
  );
}

function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      {children}
    </button>
  );
}

function TeamActions({
  team,
  onView,
  onEdit,
  onDelete,
  className,
}: {
  team: Team;
  onView: (team: Team) => void;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
  className: string;
}) {
  return (
    <div className={className}>
      <ActionButton label={`Ver ${team.name}`} onClick={() => onView(team)}>
        <Eye className="h-4 w-4" aria-hidden="true" />
      </ActionButton>
      <ActionButton label={`Editar ${team.name}`} onClick={() => onEdit(team)}>
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </ActionButton>
      <ActionButton
        label={`Eliminar ${team.name}`}
        onClick={() => onDelete(team)}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </ActionButton>
    </div>
  );
}

export function TeamsLoading() {
  return (
    <p className="flex items-center gap-2 text-sm text-slate-400">
      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      Cargando equipos…
    </p>
  );
}

export function TeamsResults({
  teams,
  onView,
  onEdit,
  onDelete,
}: {
  teams: Team[];
  onView: (team: Team) => void;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
}) {
  const columns: PanelColumn<Team>[] = [
    {
      header: "Nombre",
      width: "w-[20%]",
      rowHeader: true,
      className: "break-words",
      render: (team) => team.name,
    },
    {
      header: "Escuela",
      width: "w-[20%]",
      className: "break-words text-slate-300",
      render: (team) => houseName(team.houseId),
    },
    {
      header: "Ciclo",
      width: "w-[12%]",
      className: "text-slate-300",
      render: (team) => cycleLabel(team.cycle),
    },
    {
      header: "Disciplina",
      width: "w-[20%]",
      className: "break-words text-slate-300",
      render: (team) => disciplineName(team.disciplineId),
    },
    {
      header: "Buena fe",
      width: "w-[14%]",
      className: "text-xs",
      render: (team) => <SheetLink url={team.sheetUrl} />,
    },
    {
      header: "Acciones",
      width: "w-[14%]",
      render: (team) => (
        <TeamActions
          team={team}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          className="flex gap-1"
        />
      ),
    },
  ];

  return (
    <PanelCatalog
      items={teams}
      caption="Equipos del torneo"
      columns={columns}
      tableClassName="w-full min-w-[960px] table-fixed text-left text-sm"
      alignTop
      scroll
      renderCard={(team) => (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-white">
              {team.name}
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              {houseName(team.houseId)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {cycleLabel(team.cycle)}
              <span aria-hidden="true"> · </span>
              {disciplineName(team.disciplineId)}
            </p>
            <p className="mt-1 text-xs">
              <SheetLink url={team.sheetUrl} />
            </p>
          </div>
          <TeamActions
            team={team}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            className="flex shrink-0 gap-1"
          />
        </div>
      )}
    />
  );
}
