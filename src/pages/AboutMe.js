import React, { useEffect, useState } from "react";
import "./AboutMe.css"; // CSS dosyasını import edin
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
const translations = {
  tr: {
    title: "Hakkımda",
    content: `
       Selam! Ben Arda — mesai saatlerinde yazılımcı, geceleri distortion büyücüsü. Bilgisayar mühendisiyim ama kodlardan çok bazen tel sesleri kafamı toparlıyor. Gitar çalmak benim için bir tür kaçış planı; bu site de o planın haritası. Burada rock’ı, tınıyı, yanlış bastığım notaları (ve doğrularını) birlikte konuşacağız. Yani: "Ders" gibi düşünme — bu bir ortak çalma alanı!    `,
  },
  en: {
    title: "About Me",
    content: `
      Sure, I write code for a living, but sometimes it's the sound of strings, not keystrokes, that clears my mind. Playing guitar is my escape plan, and this website? Well, it's the map.
Here, we'll talk rock, tone, and all the wrong notes I’ve hit (and the right ones too).
So don’t think of this as a “lesson” — think of it as a shared space to play, learn, and get loud together.    `,
  },
};

const AboutMe = () => {
  const { language, setLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const t = translations[language];

  return (
    <div>
      <Header language={language} setLanguage={setLanguage} logout={logout} />
         <Subheader language={language} />
     <div className="about-me-page">
     

      <div className="about-me-content">
        <h1 className="about-me-title">{t.title}</h1>
        <p className="about-me-text">{t.content}</p>
      </div>
    </div>
    </div>
  );
};

export default AboutMe;