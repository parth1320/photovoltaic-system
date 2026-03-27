import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();

    const timeout = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [logout, navigate]);

  return (
    <>
      <h2>You have been logged out.</h2>
      <p>Redirecting to the login page...</p>
    </>
  );
};

export default Logout;
