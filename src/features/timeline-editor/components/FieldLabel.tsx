import type { ReactNode } from "react";

export function FieldLabel({ children, id, label }: { children: ReactNode; id?: string; label: string }) {
  return (
    <label className="field-label" id={id}>
      <span>{label}</span>
      {children}
    </label>
  );
}
