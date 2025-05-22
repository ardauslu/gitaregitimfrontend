import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./Etudes.css"; // CSS dosyasını import ediyoruz
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import { useAuth } from "../AuthContext"; // AuthContext'ten logout fonksiyonunu alın
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
const etudesData = [
  {
    title: "Legato",
    videos: [
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
    ],
  },
  {
    title: "Sweep Picking",
    videos: [
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
    ],
  },
  {
    title: "Economy Picking",
    videos: [
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
    ],
  },
  {
    title: "Hybrid Picking",
    videos: [
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
    ],
  },
  {
    title: "Tapping",
    videos: [
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
    ],
  },
];

// Çeviri metinleri
const translations = {
  tr: {
    title: "Teknik Bahçesi",
    description: "Bu sayfa gitar teknikleri üzerine hazırlanmış etüdler içerir.",
  },
  en: {
    title: "The Technique Garden",
    description: "This page contains guitar etudes over different techniques.",
  },
};

const Etudes = () => {
  const [activeTab, setActiveTab] = useState(0); // Varsayılan olarak ilk sekme aktif
  const { language, setLanguage } = useLanguage(); // Dil state'i
  const { isAuthenticated, logout: keycloakLogout } = useAuth(); // useAuth'tan isAuthenticated ve logout alın
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
    }
  }, [isAuthenticated, navigate]);

  const t = translations[language]; // Çeviri metinlerini seç

  const logout = () => {
    keycloakLogout({
      redirectUri: "http://localhost:3000/login"
    });
  };

  return (
    <>
      <Header language={language} setLanguage={setLanguage} logout={logout} />
      <Subheader language={language} />

      <h1 className="etudes-title">{t.title}</h1>
      <p className="etudes-description">{t.description}</p>

      {/* Sekme Butonları */}
      <div className="etudes-tabs">
        {etudesData.map((etude, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {etude.title}
          </button>
        ))}
      </div>

      {/* Sekme İçeriği */}
      <div className="tab-content">
        {etudesData[activeTab].videos.map((videoUrl, videoIndex) => (
          <div key={videoIndex} className="video-container">
            <ReactPlayer
              url={videoUrl}
              controls
              width="100%"
              height="100%"
              className="react-player"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Etudes;