import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RootLayout from "./pages/Root";
import UserProfile from "./pages/Profile";
import "./App.css";
import Logout from "./pages/Logout";
import Auth from "./pages/Auth";
import CreateProject from "./pages/project/CreateProjectForm";
import ProjectDetails from "./pages/project/ProjectDetails";
import VisualMap from "./pages/project/VisualMap";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "dashboard",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "create",
        element: <CreateProject />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "projects/:projectId",
        element: <ProjectDetails />,
      },
      {
        path: "visualmap/:projectId",
        element: <VisualMap />,
      },
    ],
  },
  {
    path: "logout",
    element: <Logout />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
