import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

export function MenuFoldIcon({ active }: { active: boolean }) {
  return <MenuFoldOutlined className="toggle-icon-state sidebar-fold-icon" data-active={active} />;
}

export function MenuUnfoldIcon({ active }: { active: boolean }) {
  return <MenuUnfoldOutlined className="toggle-icon-state sidebar-unfold-icon" data-active={active} />;
}
