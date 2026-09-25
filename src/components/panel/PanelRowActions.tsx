import { Eye, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

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

export function PanelRowActions({
  name,
  onView,
  onEdit,
  onDelete,
  className,
}: {
  name: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  className: string;
}) {
  return (
    <div className={className}>
      <ActionButton label={`Ver ${name}`} onClick={onView}>
        <Eye className="h-4 w-4" aria-hidden="true" />
      </ActionButton>
      <ActionButton label={`Editar ${name}`} onClick={onEdit}>
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </ActionButton>
      <ActionButton label={`Eliminar ${name}`} onClick={onDelete}>
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </ActionButton>
    </div>
  );
}
