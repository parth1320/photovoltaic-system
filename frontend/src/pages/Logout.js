import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");

    const timeout = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <>
      <h2>You have been logged out.</h2>
      <p>Redirecting to the login page...</p>
    </>
  );
};

export default Logout;
