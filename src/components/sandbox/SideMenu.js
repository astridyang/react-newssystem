import React, { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const { Sider } = Layout;
export default function SideMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const location = useLocation();
  const selectedKeys = [location.pathname];
  const openKeys = [`/${location.pathname.split("/")[1]}`];
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  const filterPermisson = (item) => {
    return item.pagepermisson === 1 && rights.includes(item.key);
  };
  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then((res) => {
      const temp = res.data
        .filter((item) => filterPermisson(item))
        .map((item) => {
          item.children = item.children.filter((child) =>
            filterPermisson(child)
          );
          item.children.map((child) => {
            delete child.rightId;
            return child;
          });
          if (item.children.length === 0) {
            item.children = null;
          }
          return item;
        });
      setMenu(temp);
    });
  }, []);
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div className="logo" />
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={selectedKeys}
            defaultOpenKeys={openKeys}
            onClick={({ key }) => {
              navigate(key);
            }}
            items={menu}
          />
        </div>
      </div>
    </Sider>
  );
}
