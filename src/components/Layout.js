import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Subheader from "./Subheader";
import logo from "../assets/logo.png";
import "./Layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("tr");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/login");
  };

  return (
    <div className="layout">
      {/* Ana Header */}
      <div className="header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="header-logo" />
        </div>
        <div className="header-middle">
          <div className="welcome-container">
            <span className="username">
              {language === "tr" ? "Hoşgeldiniz" : "Welcome"}, {localStorage.getItem("username")}
            </span>
          </div>
          <button
            className="language-toggle"
            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
          >
            {language === "tr" ? "EN" : "TR"}
          </button>
        </div>
        <div className="header-right">
          <button className="logout-button" onClick={handleLogout}>
            {language === "tr" ? "Çıkış Yap" : "Logout"}
          </button>
        </div>
      </div>

      {/* Alt Header */}
      <Subheader language={language} />

      {/* İçerik */}
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;