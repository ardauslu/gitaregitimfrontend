import React, { createContext, useContext, useState, useEffect } from "react";
import keycloak from "./keycloak";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Keycloak init sadece bir kez çağrılır
  useEffect(() => {
  keycloak.init({
    onLoad: "check-sso",
    redirectUri: "http://localhost:3000/home"
  })
  .then(authenticated => {
    setIsAuthenticated(keycloak.authenticated);
    setLoading(false);
  })
  .catch(error => {
    console.error("Keycloak init error:", error);
    setIsAuthenticated(false);
    setLoading(false);
  });
}, []);

  // Token yenileme (isteğe bağlı)
  useEffect(() => {
    const interval = setInterval(() => {
      keycloak.updateToken(60);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const login = () => {
    keycloak.login({
      redirectUri: "http://localhost:3000/home"
    });
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: "http://localhost:3000/login"
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);