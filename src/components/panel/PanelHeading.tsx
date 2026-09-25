import type { ReactNode } from "react";

export function PanelHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header
      className={
        action
          ? "mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          : "mb-4"
      }
    >
      <div>
        <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-cyber tracking-widest text-cyan-300 uppercase">
          {eyebrow}
        </div>
        <h1 className="font-cyber text-2xl font-black tracking-tight text-white uppercase">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      {action}
    </header>
  );
}
