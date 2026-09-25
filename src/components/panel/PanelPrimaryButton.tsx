import type { ReactNode } from "react";
import { panelPrimaryButtonClassName } from "./panelClasses";

export function PanelPrimaryButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={panelPrimaryButtonClassName}
    >
      {children}
    </button>
  );
}
