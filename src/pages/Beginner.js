import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "./Beginner.css";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import { useAuth } from "../AuthContext"; // AuthContext'ten logout fonksiyonunu alın
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
const Beginner = () => {
  const [videoData, setVideoData] = useState([]);
  const { isAuthenticated, logout: keycloakLogout } = useAuth(); // useAuth'tan isAuthenticated ve logout alın
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
    }
  }, [isAuthenticated, navigate]);

  // Videoları dinamik olarak yükleme
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/data/beginnerVideos.json"); // JSON dosyasından veri çek
        const data = await response.json();
        setVideoData(data);
      } catch (error) {
        console.error("Videolar yüklenirken bir hata oluştu:", error);
      }
    };

    fetchVideos();
  }, []);

  const logout = () => {
    keycloakLogout({
      redirectUri: "http://localhost:3000/login"
    });
  };

  return (
    <div>
      <Header language={language} setLanguage={setLanguage} logout={logout} />
      <Subheader language={language} />
      <div className="beginner-content">
        <div className="beginner-page">
          <header className="beginner-header">
            <h1>
              {language === "tr"
                ? "Başlangıç Seviyesi Dersler"
                : "Beginner Lessons"}
            </h1>
            <p>
              {language === "tr"
                ? "Başlangıç seviyesindeki gitar derslerini keşfedin."
                : "Explore beginner-level guitar lessons."}
            </p>
          </header>

          <div className="video-list">
            {videoData.map((video, index) => (
              <div key={index} className="video-item">
                <ReactPlayer
                  url={video.url}
                  controls={true}
                  width="100%"
                  height="150px"
                  className="video-player"
                />
                <h3>{language === "tr" ? video.title_tr : video.title_en}</h3>
                <p>{language === "tr" ? video.description_tr : video.description_en}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beginner;