import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import "bootstrap/dist/css/bootstrap.min.css";

const RootLayout = () => {
  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
