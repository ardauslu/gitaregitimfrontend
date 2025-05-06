import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import "./Intermediate.css";
import { useAuth } from "../AuthContext"; // AuthContext'ten logout fonksiyonunu alın
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
const Intermediate = () => {
  const [videoData, setVideoData] = useState([]);
  const { language, setLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth(); // useAuth'tan isAuthenticated ve logout alın
  const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/login"); // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
      }
    }, [isAuthenticated, navigate]);
  
  // Videoları dinamik olarak yükleme
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/data/intermediateVideos.json"); // JSON dosyasından veri çek
        const data = await response.json();
        setVideoData(data);
      } catch (error) {
        console.error("Videolar yüklenirken bir hata oluştu:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
     <Header language={language} setLanguage={setLanguage} logout={logout} />
      <Subheader language={language} />
       <div className="intermediate-content">
        <div className="intermediate-page">
          <header className="intermediate-header">
            <h1>
              {language === "tr"
                ? "Orta Seviye Dersler"
                : "Intermediate Lessons"}
            </h1>
            <p>
              {language === "tr"
                ? "Orta seviyedeki gitar derslerini keşfedin."
                : "Explore intermediate-level guitar lessons."}
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
                <p>
                  {language === "tr"
                    ? video.description_tr
                    : video.description_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intermediate;