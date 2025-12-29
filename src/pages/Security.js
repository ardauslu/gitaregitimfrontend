import React, { useState, useCallback } from "react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import config from "../config";
import keycloak from "../keycloak";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import "./Security.css";

const Security = () => {
  const [error, setError] = useState("");
  const { isAuthenticated, logout: keycloakLogout } = useAuth();
  const { language, setLanguage } = useLanguage();

  const handleChangePassword = async () => {
    setError("");
    try {
      // Direkt Keycloak account console URL'ini kullan
      const keycloakAccountUrl = "http://localhost:8081/realms/guitar-education/account/";
      
      console.log("Keycloak Account URL:", keycloakAccountUrl);
      window.open(keycloakAccountUrl, "_blank");
    } catch (err) {
      console.error("Hata:", err);
      setError(language === "tr" ? "Bir hata oluştu." : "An error occurred.");
    }
  };

  const logout = useCallback(() => {
    keycloakLogout({ redirectUri: config.LOGOUT_REDIRECT_URI });
  }, [keycloakLogout]);

  if (!isAuthenticated) {
    return <div>{language === "tr" ? "Lütfen giriş yapın." : "Please log in."}</div>;
  }

  return (
    <div>
      <Header language={language} setLanguage={setLanguage} logout={logout} />
      <Subheader language={language} />
      <div className="security-page">
        <div className="security-container">
          <h1 className="security-title">
            {language === "tr" ? "Hesap Güvenliği" : "Account Security"}
          </h1>
          <p className="security-description">
            {language === "tr" 
              ? "Şifrenizi değiştirmek için aşağıdaki butona tıklayın" 
              : "Click the button below to change your password"}
          </p>
          <button onClick={handleChangePassword} className="security-button">
            <i className="fas fa-key"></i>
            {language === "tr" ? "Şifre Değiştir" : "Change Password"}
          </button>
          {error && <div className="security-error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Security;
