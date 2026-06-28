import {
  AimOutlined,
  CalendarOutlined,
  CopyOutlined,
  DeleteOutlined,
  FileAddOutlined,
  FileTextOutlined,
  FlagOutlined,
  FontSizeOutlined,
  FormOutlined,
  FullscreenOutlined,
  LockOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
  SmileOutlined,
  UnlockOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import type { ReactNode } from "react";

export function TimelineContextMenu() {
  return (
    <div className="context-menu" id="timelineContextMenu" role="menu" aria-label="Timeline item actions" hidden>
      <div className="context-menu-submenu" data-context-submenu="add">
        <Button htmlType="button" role="menuitem" data-context-action="add-menu" aria-haspopup="menu" aria-expanded="false">
          <span className="context-menu-label">
            <PlusOutlined aria-hidden="true" />
            <span>Add</span>
          </span>
          <RightOutlined aria-hidden="true" />
        </Button>
        <div className="context-submenu-panel" role="menu" aria-label="Add item type">
          <ContextMenuButton action="birth" icon={<SmileOutlined />}>Birth</ContextMenuButton>
          <ContextMenuButton action="event" icon={<AimOutlined />}>Event</ContextMenuButton>
          <ContextMenuButton action="marker" icon={<FlagOutlined />}>Marker</ContextMenuButton>
          <ContextMenuButton action="note" icon={<FormOutlined />}>Note</ContextMenuButton>
          <ContextMenuButton action="period" icon={<CalendarOutlined />}>Period</ContextMenuButton>
          <ContextMenuButton action="line" icon={<MinusOutlined />}>Line</ContextMenuButton>
          <ContextMenuButton action="text" icon={<FontSizeOutlined />}>Text</ContextMenuButton>
        </div>
      </div>
      <div className="context-menu-separator" role="separator"></div>
      <ContextMenuAction action="copy" icon={<CopyOutlined />} shortcut="Ctrl/Cmd C">Copy</ContextMenuAction>
      <ContextMenuAction action="paste" icon={<FileAddOutlined />} shortcut="Ctrl/Cmd V">Paste</ContextMenuAction>
      <ContextMenuAction action="duplicate" icon={<FileTextOutlined />} shortcut="Ctrl/Cmd D">Duplicate</ContextMenuAction>
      <ContextMenuAction action="lock-item" icon={<LockOutlined />}>Lock item</ContextMenuAction>
      <ContextMenuAction action="unlock-item" icon={<UnlockOutlined />}>Unlock item</ContextMenuAction>
      <div className="context-menu-separator" role="separator"></div>
      <ContextMenuAction action="zoom-in" icon={<ZoomInOutlined />} shortcut="+">Zoom in</ContextMenuAction>
      <ContextMenuAction action="zoom-out" icon={<ZoomOutOutlined />} shortcut="-">Zoom out</ContextMenuAction>
      <ContextMenuAction action="fit" icon={<FullscreenOutlined />}>Fit</ContextMenuAction>
      <div className="context-menu-separator" role="separator"></div>
      <ContextMenuAction action="delete" icon={<DeleteOutlined />} shortcut="Del" danger>Delete</ContextMenuAction>
    </div>
  );
}

function ContextMenuButton({ action, icon, children }: { action: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Button htmlType="button" role="menuitem" data-context-add={action}>
      <span className="context-menu-label">
        {icon}
        <span>{children}</span>
      </span>
    </Button>
  );
}

function ContextMenuAction({
  action,
  icon,
  shortcut,
  danger = false,
  children,
}: {
  action: string;
  icon: ReactNode;
  shortcut?: string;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <Button htmlType="button" role="menuitem" className={danger ? "danger" : undefined} data-context-action={action}>
      <span className="context-menu-label">
        {icon}
        <span>{children}</span>
      </span>
      {shortcut ? <kbd>{shortcut}</kbd> : <span aria-hidden="true"></span>}
    </Button>
  );
}
