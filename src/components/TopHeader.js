import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined,UserOutlined } from "@ant-design/icons";
import { Layout, Dropdown,Avatar } from "antd";

const { Header } = Layout;
export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false);
  const items = [
    { label: "菜单项一", key: "item-1" }, // 菜单项务必填写 key
    { label: "Logout", key: "item-2" },
  ];
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: () => setCollapsed(!collapsed),
      })}
      <div style={{ float: "right" }}>
        <span>welcome back.</span>
        <Dropdown menu={{ items }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}
