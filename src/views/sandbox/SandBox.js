import { Layout } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import "./SandBox.css"
const { Content } = Layout;
export default function SandBox() {
  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background:'white',
            overflow:"auto"
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
