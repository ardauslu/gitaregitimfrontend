import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";
import unnamed1 from "./assets/gemini1.jpg";
import unnamed2 from "./assets/gemini2.jpg";
import Subheader from "./components/Subheader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "./AuthContext";
import config from "./config";
import { useLanguage } from "./contexts/LanguageContext";
import keycloak from "./keycloak";

const Home = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const { logout: logoutContext } = useAuth();
  const videoRefs = useRef([]);

  // Animation variants - sadece bir kez tanımla
  const pageVariants = useMemo(() => ({
    initial: { opacity: 0, x: "-100vw" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100vw" },
  }), []);

  const logout = useCallback(() => {
    keycloak.logout({
      redirectUri: config.LOGOUT_REDIRECT_URI
    });
  }, []);

  const handleVideoHover = useCallback((index, isHovering) => {
    const video = videoRefs.current[index];
    if (video) {
      if (isHovering) {
        video.play().catch(err => console.log('Video play error:', err));
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  }, []);

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
        setIsAdmin(data.isAdmin);
      } catch (err) {
        console.error("Kullanıcı bilgileri alınamadı:", err);
      }
    };

    fetchUserData();
  }, []); // Empty dependency - sadece mount'ta çalışır

  return (
    <div>
      <Header language={language} logout={logout} />
      <Subheader language={language} />
       
      <div className="home-bg-video-container">
        <video
          className="home-bg-background-video"
          src={require("./assets/guitaranime.mp4")}
          autoPlay
          loop
          muted
          playsInline
          loading="lazy"
        />
        <div className="home-bg-content">
          {/* Ana Header */}
          {/* Görseller */}
          <div className="image-container">
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
              </p>
              <button onClick={() => navigate("/about-me")}>
                {language === "tr" ? "Hakkımda" : "About Me"}
              </button>
            </motion.div>
            
            {/* Metronom Video */}
            <div className="home-small-video-title-wrapper">
              <div className="home-video-title" style={{marginBottom: '6px'}}>
                <span>{language === "tr" ? "Metronom" : "Metronome"}</span>
              </div>
            </div>
            <div className="home-small-video-wrapper">
              <div 
                className="home-small-video-frame"
                onMouseEnter={() => handleVideoHover(0, true)}
                onMouseLeave={() => handleVideoHover(0, false)}
              >
                <video
                  ref={el => videoRefs.current[0] = el}
                  className="home-small-video"
                  src={require("./assets/metronom.mp4")}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
            
            {/* Lesson Video */}
            <div className="home-small-video-title-wrapper">
              <div className="home-video-title" style={{marginBottom: '6px'}}>
                <span>{language === "tr" ? "Lesson" : "Lesson"}</span>
              </div>
            </div>
            <div className="home-small-video-wrapper">
              <div 
                className="home-small-video-frame"
                onMouseEnter={() => handleVideoHover(1, true)}
                onMouseLeave={() => handleVideoHover(1, false)}
              >
                <video
                  ref={el => videoRefs.current[1] = el}
                  className="home-small-video"
                  src={require("./assets/lesson.mp4")}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
            
            {/* Tuner Video */}
            <div className="home-small-video-title-wrapper">
              <div className="home-video-title" style={{marginBottom: '6px'}}>
                <span>{language === "tr" ? "Tuner" : "Tuner"}</span>
              </div>
            </div>
            <div className="home-small-video-wrapper">
              <div 
                className="home-small-video-frame"
                onMouseEnter={() => handleVideoHover(2, true)}
                onMouseLeave={() => handleVideoHover(2, false)}
              >
                <video
                  ref={el => videoRefs.current[2] = el}
                  className="home-small-video"
                  src={require("./assets/tuner.mp4")}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;