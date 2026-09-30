import { CalendarDays, Eye, Medal, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

const actionClassName =
  "grid h-11 w-11 place-items-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:h-8 md:w-8";

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
      className={actionClassName}
    >
      {children}
    </button>
  );
}

export function PanelRowActions({
  name,
  onView,
  onEdit,
  onDelete,
  className,
  fixtureTo,
  fixtureLabel,
}: {
  name: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  className: string;
  fixtureTo?: string;
  fixtureLabel?: string;
}) {
  return (
    <div className={className}>
      {fixtureTo ? (
        <Link
          to={fixtureTo}
          aria-label={fixtureLabel ?? `Fixture de ${name}`}
          className={actionClassName}
        >
          {fixtureLabel ? (
            <Medal className="h-4 w-4 md:h-3.5 md:w-3.5" aria-hidden="true" />
          ) : (
            <CalendarDays
              className="h-4 w-4 md:h-3.5 md:w-3.5"
              aria-hidden="true"
            />
          )}
        </Link>
      ) : null}
      <ActionButton label={`Ver ${name}`} onClick={onView}>
        <Eye className="h-4 w-4 md:h-3.5 md:w-3.5" aria-hidden="true" />
      </ActionButton>
      <ActionButton label={`Editar ${name}`} onClick={onEdit}>
        <Pencil className="h-4 w-4 md:h-3.5 md:w-3.5" aria-hidden="true" />
      </ActionButton>
      <ActionButton label={`Eliminar ${name}`} onClick={onDelete}>
        <Trash2 className="h-4 w-4 md:h-3.5 md:w-3.5" aria-hidden="true" />
      </ActionButton>
    </div>
  );
}
