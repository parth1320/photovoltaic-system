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
