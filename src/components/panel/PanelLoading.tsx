import { LoaderCircle } from "lucide-react";

export function PanelLoading({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2 text-sm text-slate-400">
      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label}
    </p>
  );
}
