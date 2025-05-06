import React from "react";
import { useNavigate } from "react-router-dom";
import "./Subheader.css";
import { useEffect, useState } from "react";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";
const Subheader = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // Admin kontrolü için state
  const { language, setLanguage } = useLanguage();
 
  useEffect(() => {
    const fetchUserData = async () => {
      console.log("fetchUserData çağrıldı."); // Kontrol için log ekledik

      try {
        const response = await fetch(`${config.API_BASE_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API isteği başarısız oldu: ${response.status}`);
        }

        const data = await response.json();
        console.log("Kullanıcı bilgileri:", data); // Yanıtı kontrol etmek için log ekledik

        setIsAdmin(data.isAdmin || false); // Kullanıcının admin olup olmadığını kontrol et
      } catch (err) {
        console.error("Kullanıcı bilgileri alınamadı:", err);
        setIsAdmin(false); // Hata durumunda admin olarak işaretleme
      }
    };

    fetchUserData();
  }, []);
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "tr" ? "en" : "tr"));
  };

  // Menü öğeleri
  const menuItems = [
    {
      title: language === "tr" ? "Elektro Gitar Dersleri" : "Electric Guitar Lessons",
      options: [
        { name: language === "tr" ? "Giriş Kapısı" : "The Entry Gate", path: "/beginner" },
        { name: language === "tr" ? "Keşif Yolu" : "The Path of Discovery", path: "/intermediate" },
        { name: language === "tr" ? "Ustalık Zirvesi" : "The Summit of Mastery", path: "/advanced" },
        { name: language === "tr" ? "Teknik Bahçesi" : "The Technique Garden", path: "/etudes" },
        { name: language === "tr" ? "Sizin Dersleriniz" : "Your Lessons", path: "/your-lessons" },
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
      title: language === "tr" ? "Riff Generator" : "Riff Generator",
      options: [
        { name: language === "tr" ? "Riff Oluştur" : "Generate Riff", path: "/riff-generator" },
        { name: language === "tr" ? "Riff Kaydet" : "Save Riff", path: "/save-riff" },
      ],
    },
    {
      title: language === "tr" ? "Özel Ders" : "Private Lesson",
      options: [
        { name: language === "tr" ? "Ders Konusu Yarat" : "Create Lesson Subject", path: "/lesson-subject" },
        { name: language === "tr" ? "Ders Al" : "Take Lesson", path: "/take-lesson" },
        ...(isAdmin
          ? [{ name: language === "tr" ? "Admin Paneli" : "Admin Panel", path: "/admin-panel" }]
          : []), // Eğer admin ise "Admin Paneli" seçeneğini ekle
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
      {/* Anasayfa Bağlantısı */}
      <a
        onClick={() => navigate("/home")}
        className="sub-header-home"
        style={{ cursor: "pointer" }}
      >
        {language === "tr" ? "Anasayfa" : "Home"}
      </a>

      {/* Diğer Menü Öğeleri */}
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