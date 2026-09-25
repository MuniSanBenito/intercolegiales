import type { ReactNode } from "react";

const widths = {
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
} as const;

export function PanelPage({
  children,
  width = "6xl",
}: {
  children: ReactNode;
  width?: keyof typeof widths;
}) {
  return (
    <main className="px-4 py-6 sm:py-8 lg:px-8">
      <div className={`mx-auto w-full ${widths[width]}`}>{children}</div>
    </main>
  );
}
