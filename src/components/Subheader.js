import React from "react";
import { useNavigate } from "react-router-dom";
import "./Subheader.css";

const Subheader = ({ language }) => {
  const navigate = useNavigate();

  // Menü öğeleri
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
    {
      title: language === "tr" ? "Ayarlar" : "Settings",
      options: [
        { name: language === "tr" ? "Profil" : "Profile", path: "/profile" },
        { name: language === "tr" ? "Dil Seçimi" : "Language", path: "/language" },
        { name: language === "tr" ? "Güvenlik" : "Security", path: "/security" },
      ],
    },
  ];

  return (
    <div className="sub-header">
      {menuItems.map((menu, index) => (
        <div className="sub-header-item" key={index}>
          <span>{menu.title}</span>
          <div className="sub-header-dropdown">
            {menu.options.map((option, subIndex) => (
              <a
                key={subIndex}
                onClick={() => navigate(option.path)}
                style={{ cursor: "pointer" }}
              >
                {option.name}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Subheader;