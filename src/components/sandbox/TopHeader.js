import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Dropdown, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleCollapse } from "../../redux/slice/collapseSlice";

const { Header } = Layout;
export default function TopHeader() {
  // const [collapsed, setCollapsed] = useState(false);
  const collapsed = useSelector((state)=>state.collapse.value)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"));
  const items = [
    { label: `${roleName}`, key: "item-1" }, // 菜单项务必填写 key
    { label: "Logout", key: "logout" },
  ];
  const onClick = ({ key }) => {
    switch (key) {
      case "logout":
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        break;
      default:
        console.log(key);
    }
  };
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: () => dispatch(toggleCollapse()),
      })}
      <div style={{ float: "right" }}>
        <span>welcome back <b>{username}</b>.</span>
        <Dropdown menu={{ items, onClick }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}
