import { Button } from "antd";
import type { ReactNode } from "react";

export function ToolbarButton({
  tone,
  addType,
  id,
  title,
  icon,
  children,
}: {
  tone: string;
  addType?: string;
  id?: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Button
      id={id}
      htmlType="button"
      className="toolbar-button"
      data-tone={tone}
      data-add={addType}
      title={title}
      icon={<ToneIcon tone={tone}>{icon}</ToneIcon>}
    >
      {children}
    </Button>
  );
}

function ToneIcon({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span className="toolbar-icon" data-tone={tone} aria-hidden="true">
      {children}
    </span>
  );
}
