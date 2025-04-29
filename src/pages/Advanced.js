import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import "./Advanced.css";

const Advanced = () => {
  const [videoData, setVideoData] = useState([]);
  const [language, setLanguage] = useState("tr"); // Dil state'i

  // Videoları dinamik olarak yükleme
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/data/advancedVideos.json"); // JSON dosyasından veri çek
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
      <Header language={language} setLanguage={setLanguage} logout={() => {}} />
      <Subheader language={language} />
      <div className="advanced-content">
        <div className="advanced-page">
          <header className="advanced-header">
            <h1>
              {language === "tr"
                ? "İleri Düzey Dersler"
                : "Advanced Lessons"}
            </h1>
            <p>
              {language === "tr"
                ? "İleri düzey gitar derslerini keşfedin."
                : "Explore advanced-level guitar lessons."}
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

export default Advanced;