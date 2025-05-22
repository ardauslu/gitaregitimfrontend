import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import config from "../config";
import keycloak from "../keycloak";
import Header from "../components/Header";
import Subheader from "../components/Subheader";

const Security = () => {
  const [redirectUrl, setRedirectUrl] = useState("");
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  const { language, setLanguage } = useLanguage();
  const handleChangePassword = async () => {
    setError("");
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/users/change-password-redirect`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      if (!response.ok) throw new Error("Redirect alınamadı");
      const data = await response.json();
      if (data.url) {
        setRedirectUrl(data.url);
        window.open(data.url, "_blank");
      } else {
        setError(language === "tr" ? "Yönlendirme linki alınamadı." : "Redirect link not found.");
      }
    } catch (err) {
      setError(language === "tr" ? "Bir hata oluştu." : "An error occurred.");
    }
  };

  if (!isAuthenticated) {
    return <div>{language === "tr" ? "Lütfen giriş yapın." : "Please log in."}</div>;
  }

  return (
    <div>
      <Header language={language} setLanguage={setLanguage} />
      <Subheader language={language} />
      <div className="security-page" style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <button onClick={handleChangePassword} style={{ padding: 16, fontSize: 18, borderRadius: 8, background: '#40db9a', color: '#fff', border: 'none', cursor: 'pointer', minWidth: 220 }}>
          {language === "tr" ? "Şifre Değiştir" : "Change Password"}
        </button>
        {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
        {redirectUrl && (
          <div style={{ marginTop: 16 }}>
            <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
              {language === "tr" ? "Şifre değiştirme sayfası için tıklayın." : "Click here for password change page."}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Security;
