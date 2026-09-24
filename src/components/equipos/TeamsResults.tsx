import { ExternalLink, Eye, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
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
  return (
    <>
      <ul
        className={`flex flex-col gap-2 md:hidden ${
          teams.length === 0
            ? "min-h-16 rounded-xl border border-cyan-500/30 bg-[#0c0e1a]/90"
            : ""
        }`}
      >
        {teams.map((team) => (
          <li
            key={team.id}
            className="rounded-xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-3"
          >
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
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 md:block">
        <table className="w-full min-w-[960px] table-fixed text-left text-sm">
          <caption className="sr-only">Equipos del torneo</caption>
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[12%]" />
            <col className="w-[20%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-cyan-500/20 font-cyber text-[10px] tracking-widest text-cyan-300 uppercase">
              <th scope="col" className="px-3 py-3 font-bold">
                Nombre
              </th>
              <th scope="col" className="px-3 py-3 font-bold">
                Escuela
              </th>
              <th scope="col" className="px-3 py-3 font-bold">
                Ciclo
              </th>
              <th scope="col" className="px-3 py-3 font-bold">
                Disciplina
              </th>
              <th scope="col" className="px-3 py-3 font-bold">
                Buena fe
              </th>
              <th scope="col" className="px-3 py-3 font-bold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.id}
                className="border-b border-slate-800 align-top last:border-0"
              >
                <th
                  scope="row"
                  className="px-3 py-3 text-left text-sm font-semibold break-words text-white"
                >
                  {team.name}
                </th>
                <td className="px-3 py-3 break-words text-slate-300">
                  {houseName(team.houseId)}
                </td>
                <td className="px-3 py-3 text-slate-300">
                  {cycleLabel(team.cycle)}
                </td>
                <td className="px-3 py-3 break-words text-slate-300">
                  {disciplineName(team.disciplineId)}
                </td>
                <td className="px-3 py-3 text-xs">
                  <SheetLink url={team.sheetUrl} />
                </td>
                <td className="px-3 py-3">
                  <TeamActions
                    team={team}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    className="flex gap-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
