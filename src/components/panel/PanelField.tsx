import type { ReactNode } from "react";

export function PanelField({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`grid gap-2 ${className ?? ""}`}>
      <label htmlFor={id} className="text-xs font-medium text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}
