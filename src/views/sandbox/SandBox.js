import { Layout, Spin } from "antd";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import "./SandBox.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useSelector } from "react-redux";
const { Content } = Layout;
export default function SandBox() {
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  });
  const loading = useSelector(state=>state.loading.value)
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
            background: "white",
            overflow: "auto",
          }}
        >
          <Spin size="large" spinning={loading}>
            <Outlet />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
}
