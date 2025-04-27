import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { auth } from "./Firebase"; 
import logo from "./assets/logo.png";
import unnamed1 from "./assets/unnamed (1).png";
import unnamed2 from "./assets/unnamed (2).png";
import Subheader from "./components/Subheader";
import { useAuth } from "./AuthContext";
const Home = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("tr"); // Varsayılan dil Türkçe

  const { logout } = useAuth();
  
  const menuItems = [
    {
      title: language === "tr" ? "Elektro Gitar Dersleri" : "Electric Guitar Lessons",
      options: [
        { name: language === "tr" ? "Başlangıç" : "Beginner", path: "/beginner" },
        { name: language === "tr" ? "Orta Düzey" : "Intermediate", path: "/intermediate" },
        { name: language === "tr" ? "İleri Seviye" : "Advanced", path: "/advanced" },
        { name: language === "tr" ? "Etüdler" : "Etudes", path: "/etudes" },
        { name: language === "tr" ? "Sizin Dersleriniz" : "Your Lessons", path: "/your-lessons" },
      ],
    },
    {
      title: language === "tr" ? "Riff Generator" : "Riff Generator",
      options: [
        { name: language === "tr" ? "Riff Oluştur" : "Generate Riff", path: "/riff-generator" },
        { name: language === "tr" ? "Riff Kaydet" : "Save Riff", path: "/save-riff" },
      ],
    },
    {
      title: language === "tr" ? "Çalım Analizleri" : "Playing Analysis",
      options: [
        { name: language === "tr" ? "Hız Analizi" : "Speed Analysis", path: "/speed-analysis" },
        { name: language === "tr" ? "Doğruluk Analizi" : "Accuracy Analysis", path: "/accuracy-analysis" },
      ],
    },
    {
      title: language === "tr" ? "Ton Laboratuvarı" : "Tone Lab",
      options: [
        { name: language === "tr" ? "Efektler" : "Effects", path: "/effects" },
        { name: language === "tr" ? "Ton Ayarları" : "Tone Settings", path: "/tone-settings" },
      ],
    },
    {
      title: language === "tr" ? "Gitar Hero" : "Guitar Hero",
      options: [
        { name: language === "tr" ? "Başlangıç Seviyesi" : "Beginner Level", path: "/guitar-hero-beginner" },
        { name: language === "tr" ? "İleri Seviye" : "Advanced Level", path: "/guitar-hero-advanced" },
      ],
    },
    {
      title: language === "tr" ? "Akort & Metronom" : "Tuner & Metronome",
      options: [
        { name: language === "tr" ? "Akort Et" : "Tune", path: "/tune" },
        { name: language === "tr" ? "Metronom" : "Metronome", path: "/metronome" },
      ],
    },
    {
      title: language === "tr" ? "Cover Yarışması" : "Cover Contest",
      options: [
        { name: language === "tr" ? "Katıl" : "Join", path: "/join-contest" },
        { name: language === "tr" ? "Sonuçlar" : "Results", path: "/contest-results" },
      ],
    },
    {
      title: language === "tr" ? "Gitarist DNA Testi" : "Guitarist DNA Test",
      options: [
        { name: language === "tr" ? "Test Başlat" : "Start Test", path: "/start-dna-test" },
        { name: language === "tr" ? "Sonuçlar" : "Results", path: "/dna-test-results" },
      ],
    },
    {
      title: language === "tr" ? "AI Riff Asistanı" : "AI Riff Assistant",
      options: [
        { name: language === "tr" ? "Riff Öner" : "Suggest Riff", path: "/suggest-riff" },
        { name: language === "tr" ? "Riff Analizi" : "Riff Analysis", path: "/riff-analysis" },
      ],
    },
    {
      title: language === "tr" ? "Gitar Haritası" : "Guitar Map",
      options: [
        { name: language === "tr" ? "Haritayı Gör" : "View Map", path: "/view-map" },
        { name: language === "tr" ? "Haritayı Düzenle" : "Edit Map", path: "/edit-map" },
      ],
    },
  ];

  return (
    <div>
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
          <button className="logout-button" onClick={logout}>
            {language === "tr" ? "Çıkış Yap" : "Logout"}
          </button>
        </div>
      </div>

      {/* Alt Header */}
      <Subheader language={language} /> {/* Dil state'i Subheader'a prop olarak geçildi */}

      {/* Görseller */}
      <div className="image-container">
        <img src={unnamed1} alt="Unnamed 1" className="home-image" />

        {/* Görseller arasındaki boşluk ve tanıtım paneli */}
        <div className="image-gap">
          <div className="site-info-panel">
            <h2>{language === "tr" ? "Sitemize Hoşgeldiniz!" : "Welcome to Our Site!"}</h2>
            <p>
              {language === "tr"
                ? "Gitar tutkunları için en iyi araçları ve kaynakları keşfedin. Riff oluşturuculardan ton laboratuvarlarına kadar, gitar becerilerinizi bir üst seviyeye taşımanız için ihtiyacınız olan her şey burada."
                : "Discover the best tools and resources for guitar enthusiasts. From riff generators to tone labs, we have everything you need to take your guitar skills to the next level."}
            </p>
            <button onClick={() => navigate("/about")}>
              {language === "tr" ? "Daha Fazla Bilgi" : "Learn More"}
            </button>
          </div>
        </div>

        <img src={unnamed2} alt="Unnamed 2" className="home-image" />
      </div>
    </div>
  );
};

export default Home;