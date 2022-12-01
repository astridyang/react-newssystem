import { useRoutes } from "react-router-dom";
import Redirect from "../components/Redirect";
import Home from "../views/home/Home";
import Login from "../views/login/Login";
import NoPermission from "../views/nopermission/NoPermission";
import RightList from "../views/right-manage/RightList";
import RoleList from "../views/right-manage/RoleList";
import SandBox from "../views/sandbox/SandBox";
import UserList from "../views/user-manage/UserList";

export default function IndexRouter() {
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
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/user-manage/list",
          element: <UserList />,
        },
        {
          path: "/right-manage/right/list",
          element: <RightList />,
        },
        {
          path: "/right-manage/role/list",
          element: <RoleList />,
        },
      ],
    },
    {
      path: "*",
      element: <NoPermission />,
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
