import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../assets/logo.png";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";
import keycloak from "../keycloak";
const Header = ({ logout }) => {
  const [profileImage, setProfileImage] = useState(""); // Profil resmi için state
  const [username, setUsername] = useState(""); // Kullanıcı adı için state
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Profil bilgileri alınamadı.");
        }

        const data = await response.json();

        // Profil resmi kontrolü ve formatlama
        if (data.profileImage) {
          const isBase64 = data.profileImage.startsWith("/9j/"); // Base64 formatını kontrol et
          const formattedImage = isBase64
            ? `data:image/jpeg;base64,${data.profileImage}`
            : data.profileImage; // Eğer base64 değilse, direkt URL olarak kullan
          setProfileImage(formattedImage);
        }

        setUsername(data.username || ""); // Kullanıcı adını ayarla
      } catch (err) {
        console.error("Profil bilgileri alınamadı:", err);
      } finally {
        setIsLoading(false); // Yükleme tamamlandı
      }
    };

    fetchUserProfile();
  }, []);
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "tr" ? "en" : "tr"));
  };
  return (
    <div className="header">
      {/* Sol Bölüm: Hoşgeldiniz Mesajı */}
      <div className="header-left">
        <span className="welcome-message">
          {language === "tr" ? "Gitarlar ve Teoriler" : "Guitarz and Theoriez"}
        </span>
      </div>

      {/* Orta Bölüm: Profil Resmi veya Yükleme Animasyonu */}
      <div className="header-middle">
        {isLoading ? (
          <div className="profile-loading"></div> // Parlayan yükleme animasyonu
        ) : (
          profileImage && (
            <img
              src={profileImage}
              alt="Profil Resmi"
              className="profile-image"
            />
          )
        )}
      </div>

      {/* Sağ Bölüm: Kullanıcı Adı, Dil Butonu ve Çıkış Butonu */}
      <div className="header-right">
        <span className="username">{username}</span>
        <button
          className="language-toggle"
          onClick={toggleLanguage}
        >
          {language === "tr" ? "EN" : "TR"}
        </button>
        <button className="logout-button" onClick={logout}>
          {language === "tr" ? "Çıkış Yap" : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Header;