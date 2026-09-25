import { ChevronLeft, ChevronRight } from "lucide-react";

export function PanelPagination({
  label,
  currentPage,
  pageCount,
  onPrevious,
  onNext,
}: {
  label: string;
  currentPage: number;
  pageCount: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <nav
      aria-label={label}
      className="mt-4 flex items-center justify-between gap-3"
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="inline-flex h-11 items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Anterior
      </button>
      <p className="text-sm text-slate-400">
        Página {currentPage} de {pageCount}
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={currentPage >= pageCount}
        className="inline-flex h-11 items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-40"
      >
        Siguiente
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
