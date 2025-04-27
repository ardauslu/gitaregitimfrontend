import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Subheader from "./Subheader";
import logo from "../assets/logo.png";
import imageCompression from "browser-image-compression"; // Sıkıştırma kütüphanesi
import "./Layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("tr");
  const [userData, setUserData] = useState(null); // Kullanıcı bilgilerini tutar
  const [profileImage, setProfileImage] = useState(null); // Sıkıştırılmış resim

  // Kullanıcı bilgilerini API'den çek
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Token eklenir
          },
        });

        if (!response.ok) {
          throw new Error("Kullanıcı bilgileri alınamadı.");
        }

        const data = await response.json();
        setUserData(data); // Kullanıcı bilgilerini state'e kaydet

        // Base64 formatındaki resmi sıkıştır
        if (data.profileImage) {
          const compressedImage = await compressBase64Image(data.profileImage);
          setProfileImage(compressedImage);
        }
      } catch (err) {
        console.error("Kullanıcı bilgileri alınamadı:", err);
      }
    };

    fetchUserData();
  }, []);

  // Base64 formatındaki resmi sıkıştırma fonksiyonu
  const compressBase64Image = async (base64Image) => {
    try {
      // Base64'ü Blob'a dönüştür
      const byteCharacters = atob(base64Image);
      const byteNumbers = Array.from(byteCharacters).map((char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // Sıkıştırma ayarları
      const options = {
        maxSizeMB: 0.05, // Maksimum boyut 50KB
        maxWidthOrHeight: 800, // Maksimum genişlik veya yükseklik
        useWebWorker: true, // Performans için Web Worker kullan
      };

      // Resmi sıkıştır
      const compressedBlob = await imageCompression(blob, options);

      // Sıkıştırılmış resmi Base64'e dönüştür
      const compressedBase64 = await imageCompression.getDataUrlFromFile(
        compressedBlob
      );

      return compressedBase64;
    } catch (err) {
      console.error("Resim sıkıştırma hatası:", err);
      return base64Image; // Hata durumunda orijinal resmi döndür
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("Sign out successful");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
              {language === "tr" ? "Hoşgeldiniz" : "Welcome"}
            </span>
            {userData && (
              <div className="profile-info">
                {profileImage && (
                  <img
                    src={profileImage} // Sıkıştırılmış Base64 resmi göster
                    alt="Profil Resmi"
                    className="profile-image-small"
                  />
                )}
                <span className="profile-name">
                  {userData.firstName} {userData.lastName}
                </span>
              </div>
            )}
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