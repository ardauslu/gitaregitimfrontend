import React, { createContext, useContext, useState, useEffect } from "react";
import keycloak from "./keycloak";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Keycloak init sadece bir kez çağrılır
  useEffect(() => {
  keycloak.init({
    onLoad: "check-sso",
    checkLoginIframe: false,
    pkceMethod: 'S256',
    flow: 'standard'
  })
  .then(authenticated => {
    console.log("Keycloak authenticated:", authenticated);
    console.log("Keycloak.authenticated:", keycloak.authenticated);
    console.log("Keycloak token:", keycloak.token);
    
    if (authenticated) {
      setIsAuthenticated(true);
      setUser({
        username: keycloak.tokenParsed?.preferred_username,
        email: keycloak.tokenParsed?.email
      });
    } else {
      setIsAuthenticated(false);
    }
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
      redirectUri: window.location.origin + "/home"
    });
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: window.location.origin + "/login"
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, user, keycloak }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);