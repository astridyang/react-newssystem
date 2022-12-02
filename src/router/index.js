import axios from "axios";
import { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import Redirect from "../components/Redirect";
import Audit from "../views/audit-manage/Audit";
import AuditList from "../views/audit-manage/AuditList";
import Home from "../views/home/Home";
import Login from "../views/login/Login";
import NewsAdd from "../views/news-manage/NewsAdd";
import NewsCategory from "../views/news-manage/NewsCategory";
import NewsDraft from "../views/news-manage/NewsDraft";
import NewsPreview from "../views/news-manage/NewsPreview";
import NewsUpdate from "../views/news-manage/NewsUpdate";
import NoPermission from "../views/nopermission/NoPermission";
import Published from "../views/publish-manage/Published";
import Sunset from "../views/publish-manage/Sunset";
import Unpublished from "../views/publish-manage/Unpublished";
import RightList from "../views/right-manage/RightList";
import RoleList from "../views/right-manage/RoleList";
import SandBox from "../views/sandbox/SandBox";
import UserList from "../views/user-manage/UserList";

const LocalRouteMap = {
  "/home": <Home />,
  "/user-manage/list": <UserList />,
  "/right-manage/right/list": <RightList />,
  "/right-manage/role/list": <RoleList />,
  "/news-manage/add": <NewsAdd />,
  "/news-manage/draft": <NewsDraft />,
  "/news-manage/category": <NewsCategory />,
  "/news-manage/preview/:id": <NewsPreview />,
  "/news-manage/update/:id": <NewsUpdate />,
  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <Unpublished />,
  "/publish-manage/published": <Published />,
  "/publish-manage/sunset": <Sunset />,
};

export default function IndexRouter() {
  // const [backRouteList, setBackRouteList] = useState([]);
  const [routeMap, setRouteMap] = useState([]);
  useEffect(() => {
    Promise.all([axios.get(`/rights`), axios.get(`/children`)]).then((res) => {
      // setBackRouteList();
      generateRouteMap([...res[0].data, ...res[1].data]);
    });
  }, []);
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token")) || { role: { rights: [] } }; // todo 状态管理？
  const checkRoute = (item) => {
    return LocalRouteMap[item.key] && (item.pagepermisson === 1 || item.routepermisson === 1);
  };
  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };

  const generateRouteMap = (backRouteList) => {
    let temp = backRouteList.filter(
      (item) => checkRoute(item) && checkUserPermission(item)
    );
    temp = temp.map((item) => {
      return {
        path: item.key,
        element: LocalRouteMap[item.key],
      };
    });
    setRouteMap(temp);
  };

  const routes = useRoutes([
    {
      path: "/login",
      element: (
        <LoginComponent>
          <Login />
        </LoginComponent>
      ),
    },
    {
      path: "/",
      element: (
        <AuthComponent>
          <SandBox />
        </AuthComponent>
      ),
      children: [
        {
          path: "",
          element: <Redirect to="/home" />,
        },
        // {
        //   path: "/home",
        //   element: <Home />,
        // },
        // {
        //   path: "/user-manage/list",
        //   element: <UserList />,
        // },
        // {
        //   path: "/right-manage/right/list",
        //   element: <RightList />,
        // },
        // {
        //   path: "/right-manage/role/list",
        //   element: <RoleList />,
        // },
        ...routeMap,
        {
          path: "*",
          element: <NoPermission />,
        },
      ],
    },
  ]);
  return routes;
}

// 路由拦截
function AuthComponent({ children }) {
  return localStorage.getItem("token") ? children : <Redirect to="/login" />;
}

function LoginComponent({ children }) {
  return localStorage.getItem("token") ? <Redirect to="/" /> : children;
}
