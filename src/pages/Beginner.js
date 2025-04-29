import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ReactPlayer from "react-player";
import "./Beginner.css";
import Header from "../components/Header";
import Subheader from "../components/Subheader";

const Beginner = () => {
  const [videoData, setVideoData] = useState([]);
  const [language, setLanguage] = useState("tr"); // Dil state'i

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

  return (
    <div>
      <Header language={language} setLanguage={setLanguage} logout={() => {}} />
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