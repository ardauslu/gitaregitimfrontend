import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";
import unnamed1 from "./assets/gemini1.jpg";
import unnamed2 from "./assets/gemini2.jpg";
import Subheader from "./components/Subheader";
import Header from "./components/Header"; // Header bileşenini içe aktarın
import { useAuth } from "./AuthContext";
import config from "./config";
import { useLanguage } from "./contexts/LanguageContext";
const Home = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false); // Admin kontrolü için state
  const { logout } = useAuth(); // AuthContext'ten logout fonksiyonunu alın

  const pageVariants = {
    initial: { opacity: 0, x: "-100vw" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100vw" },
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Kullanıcı bilgileri alınamadı.");
        }

        const data = await response.json();
        setIsAdmin(data.isAdmin); // Kullanıcının admin olup olmadığını kontrol et
      } catch (err) {
        console.error("Kullanıcı bilgileri alınamadı:", err);
      }
    };

    fetchUserData();
  }, []);

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
      title: language === "tr" ? "Özel Ders" : "Private Lesson",
      options: [
        { name: language === "tr" ? "Ders Konusu Yarat" : "Create Lesson Subject", path: "/lesson-subject" },
        { name: language === "tr" ? "Ders Al" : "Take Lesson", path: "/take-lesson" },
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
     <Header language={language} setLanguage={setLanguage} logout={logout} />
        <Subheader language={language} />
       
    <div className="home-bg-video-container">
      <video
        className="home-bg-background-video"
        src={require("./assets/guitaranime.mp4")}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="home-bg-content">
        {/* Ana Header */}
        {/* Görseller */}
        <div className="image-container">
          {/* <img src={unnamed1} alt="Unnamed 1" className="home-image" /> */}
          <motion.div
            className="home-page"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
          >
            <h2>{language === "tr" ? "Sitemize Hoşgeldiniz!" : "Welcome to Our Site!"}</h2>
            <p>
              {language === "tr"
                ? "Gitar dünyasına adım atın! İlham verici riff oluşturucu, seviyelere göre derslerle müziğinizi bir üst seviyeye taşıyın. Hayalinizdeki gitarist olmak için ihtiyacınız olan her şey burada."
                : "Step into the world of guitars! With inspiring riff generator, personalized lessons, take your music to the next level. Everything you need to become the guitarist of your dreams is right here."}
            </p><button onClick={() => navigate("/about-me")}>{language === "tr" ? "Hakkımda" : "About Me"}</button>
          </motion.div>
          <div className="home-small-video-title-wrapper">
            <div className="home-video-title" style={{marginBottom: '6px'}}>
              <span>{language === "tr" ? "Metronom" : "Metronome"}</span>
            </div>
          </div>
          <div className="home-small-video-wrapper">
            <div className="home-small-video-frame">
              <video
                className="home-small-video"
                src={require("./assets/homescreen.mp4")}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
          <div className="home-small-video-title-wrapper">
            <div className="home-video-title" style={{marginBottom: '6px'}}>
              <span>{language === "tr" ? "Riff Generator" : "Riff Generator"}</span>
            </div>
          </div>
          <div className="home-small-video-wrapper">
            <div className="home-small-video-frame">
              <video
                className="home-small-video"
                src={require("./assets/riff.mp4")}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
          <div className="home-small-video-title-wrapper">
            <div className="home-video-title" style={{marginBottom: '6px'}}>
              <span>{language === "tr" ? "Zoom Dersi" : "Zoom Lesson"}</span>
            </div>
          </div>
          <div className="home-small-video-wrapper">
            <div className="home-small-video-frame">
              <video
                className="home-small-video"
                src={require("./assets/zoom.mp4")}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
          {/* <img src={unnamed2} alt="Unnamed 2" className="home-image" /> */}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Home;