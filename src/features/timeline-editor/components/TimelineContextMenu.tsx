import { useAppLocale } from "../../../app/providers/AppLocaleProvider";
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
  RedoOutlined,
  RightOutlined,
  SmileOutlined,
  UndoOutlined,
  UnlockOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import type { ReactNode } from "react";

export function TimelineContextMenu() {
  const { t } = useAppLocale();
  return (
    <div className="context-menu" id="timelineContextMenu" role="menu" aria-label={t("item_actions")} hidden>
      <div className="context-menu-submenu" data-context-submenu="add">
        <Button htmlType="button" role="menuitem" data-context-action="add-menu" aria-haspopup="menu" aria-expanded="false">
          <span className="context-menu-label">
            <PlusOutlined aria-hidden="true" />
            <span>{t("add")}</span>
          </span>
          <RightOutlined aria-hidden="true" />
        </Button>
        <div className="context-submenu-panel" role="menu" aria-label={t("add_item_type")}>
          <ContextMenuButton action="birth" icon={<SmileOutlined />}>{t("birth")}</ContextMenuButton>
          <ContextMenuButton action="event" icon={<AimOutlined />}>{t("event")}</ContextMenuButton>
          <ContextMenuButton action="marker" icon={<FlagOutlined />}>{t("marker")}</ContextMenuButton>
          <ContextMenuButton action="note" icon={<FormOutlined />}>{t("note")}</ContextMenuButton>
          <ContextMenuButton action="period" icon={<CalendarOutlined />}>{t("period")}</ContextMenuButton>
          <ContextMenuButton action="line" icon={<MinusOutlined />}>{t("line")}</ContextMenuButton>
          <ContextMenuButton action="text" icon={<FontSizeOutlined />}>{t("text")}</ContextMenuButton>
        </div>
      </div>
      <div className="context-menu-separator" role="separator"></div>
      <ContextMenuAction action="undo" icon={<UndoOutlined />} shortcut="Ctrl/Cmd Z">{t("undo")}</ContextMenuAction>
      <ContextMenuAction action="redo" icon={<RedoOutlined />} shortcut="Ctrl/Cmd Y">{t("redo")}</ContextMenuAction>
      <div className="context-menu-separator" role="separator"></div>
      <ContextMenuAction action="copy" icon={<CopyOutlined />} shortcut="Ctrl/Cmd C">{t("copy")}</ContextMenuAction>
      <ContextMenuAction action="paste" icon={<FileAddOutlined />} shortcut="Ctrl/Cmd V">{t("paste")}</ContextMenuAction>
      <ContextMenuAction action="duplicate" icon={<FileTextOutlined />} shortcut="Ctrl/Cmd D">{t("duplicate")}</ContextMenuAction>
      <ContextMenuAction action="lock-item" icon={<LockOutlined />}>{t("lock_item")}</ContextMenuAction>
      <ContextMenuAction action="unlock-item" icon={<UnlockOutlined />}>{t("unlock_item")}</ContextMenuAction>
      <div className="context-menu-separator" role="separator"></div>
      <ContextMenuAction action="zoom-in" icon={<ZoomInOutlined />} shortcut="+">{t("zoom_in")}</ContextMenuAction>
      <ContextMenuAction action="zoom-out" icon={<ZoomOutOutlined />} shortcut="-">{t("zoom_out")}</ContextMenuAction>
      <ContextMenuAction action="fit" icon={<FullscreenOutlined />}>{t("fit")}</ContextMenuAction>
      <div className="context-menu-separator" role="separator"></div>
      <ContextMenuAction action="delete" icon={<DeleteOutlined />} shortcut="Del" danger>{t("delete")}</ContextMenuAction>
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
