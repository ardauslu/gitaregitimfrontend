import React, { useState } from "react";
import chatgptImage from "./assets/chatgpt.png";
import keycloak from "./keycloak.js";
import config from "./config";
import "./Login.css";

const Login = () => {
  const [language, setLanguage] = useState("tr");

  const handleKeycloakLogin = () => {
    keycloak.login({
      redirectUri: config.LOGIN_REDIRECT_URI,
      locale: language
    });
  };

  const handleKeycloakRegister = () => {
    keycloak.register({
     redirectUri: config.REGISTER_REDIRECT_URI,
      locale: language
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="image-container">
          <img src={chatgptImage} alt="ChatGPT Logo" className="chatgpt-image" />
        </div>
        <div className="form-container">
          <div className="language-switcher" style={{ marginBottom: "1rem" }}>
            <button
              className={language === "tr" ? "active" : ""}
              onClick={() => setLanguage("tr")}
            >
              Türkçe
            </button>
            <button
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
              style={{ marginLeft: "0.5rem" }}
            >
              English
            </button>
          </div>
          <button className="login-button" onClick={handleKeycloakLogin}>
            {language === "tr" ? "Giriş Yap" : "Sign In"}
          </button>
          <button
            className="signup-button"
            onClick={handleKeycloakRegister}
          >
            {language === "tr" ? "Kayıt Ol" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;