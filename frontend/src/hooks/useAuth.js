import { useCallback } from "react";

const TOKEN_KEY = "token";
const USER_ID_KEY = "id";

const useAuth = () => {
  const login = useCallback(async (email, password) => {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const { token, id } = await response.json();
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, id);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }, []);

  return {
    login,
    logout,
    userId: localStorage.getItem(USER_ID_KEY),
    isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),
  };
};

export default useAuth;
