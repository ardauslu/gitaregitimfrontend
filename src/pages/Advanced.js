import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ReactPlayer from "react-player";
import "./Advanced.css";

const Advanced = () => {
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/data/advancedVideos.json");
        const data = await response.json();
        setVideoData(data);
      } catch (error) {
        console.error("Videolar yüklenirken bir hata oluştu:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <Layout>
      <div className="advanced-page">
        <header className="advanced-header">
          <h1>İleri Düzey Elektro Gitar Dersleri</h1>
          <p>
            Bu sayfa ileri düzey gitar derslerini içerir. Aşağıdaki dersleri
            izleyerek gitar çalma yeteneklerinizi geliştirebilirsiniz.
          </p>
        </header>

        <div className="video-grid">
          {videoData.length > 0 ? (
            videoData.map((video, index) => (
              <div className="video-card" key={index}>
                <div className="video-thumbnail">
                  <ReactPlayer
                    url={video.url}
                    width="100%"
                    height="100%"
                    controls
                  />
                </div>
                <div className="video-info">
                  <h2>{video.title}</h2>
                  <p>{video.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Videolar yükleniyor...</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Advanced;