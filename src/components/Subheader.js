import React, { useEffect, useState, memo, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Subheader.css";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import keycloak from "../keycloak";

const Subheader = memo(() => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // Admin kontrolü için state
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const [dropdownPositions, setDropdownPositions] = useState({});
  const itemRefs = useRef([]);
 
  useEffect(() => {
    // Keycloak rolünden admin kontrolü
    let isAdminRole = false;
    if (keycloak && keycloak.tokenParsed && keycloak.tokenParsed.realm_access && Array.isArray(keycloak.tokenParsed.realm_access.roles)) {
      isAdminRole = keycloak.tokenParsed.realm_access.roles.includes("admin");
    }
    setIsAdmin(isAdminRole);
  }, []);
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "tr" ? "en" : "tr"));
  };

  // Menü öğeleri - useMemo ile optimize et
  const menuItems = useMemo(() => [
    {
      title: language === "tr" ? "Elektro Gitar Dersleri" : "Electric Guitar Lessons",
      options: [
        { name: language === "tr" ? "Giriş Kapısı" : "The Entry Gate", path: "/beginner" },
        { name: language === "tr" ? "Keşif Yolu" : "The Path of Discovery", path: "/intermediate" },
        { name: language === "tr" ? "Ustalık Zirvesi" : "The Summit of Mastery", path: "/advanced" },
        { name: language === "tr" ? "Teknik Bahçesi" : "The Technique Garden", path: "/etudes" },
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
      ],
    },
    {
      title: language === "tr" ? "Özel Ders" : "Private Lesson",
      options: [
        { name: language === "tr" ? "Ders Al" : "Take Lesson", path: "/take-lesson" },
        ...(isAdmin
          ? [{ name: language === "tr" ? "Admin Paneli" : "Admin Panel", path: "/admin-panel" }]
          : []),
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
      title: language === "tr" ? "Ayarlar" : "Settings",
      options: [
        { name: language === "tr" ? "Dil Seçimi" : "Language", path: "/language" },
        { name: language === "tr" ? "Güvenlik" : "Security", path: "/security" },
      ],
    },
  ], [language, isAdmin]); // Sadece language veya isAdmin değiştiğinde yeniden hesapla

  const handleMouseEnter = (index, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPositions(prev => ({
      ...prev,
      [index]: {
        top: rect.bottom + 4,
        left: rect.left
      }
    }));
  };

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

      {/* Profil Bağlantısı */}
      <a
        onClick={() => navigate("/profile")}
        className="sub-header-home"
        style={{ cursor: "pointer" }}
      >
        {language === "tr" ? "Profil" : "Profile"}
      </a>

      {/* Diğer Menü Öğeleri */}
      {menuItems.map((menu, index) => (
        <div 
          className="sub-header-item" 
          key={index}
          onMouseEnter={(e) => handleMouseEnter(index, e)}
        >
          <span>{menu.title}</span>
          <div 
            className="sub-header-dropdown"
            style={dropdownPositions[index] ? {
              top: `${dropdownPositions[index].top}px`,
              left: `${dropdownPositions[index].left}px`
            } : {}}
          >
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
});

Subheader.displayName = 'Subheader';
export default Subheader;