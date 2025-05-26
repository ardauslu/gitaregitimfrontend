import React, { useEffect, useState, useCallback } from "react";
import ReactPlayer from "react-player";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import config from "../config";
import "./Intermediate.css";

// Custom hook for fetching video data
const useVideoData = (jsonPath) => {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error("Failed to fetch videos");
        const data = await response.json();
        setVideoData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [jsonPath]);

  return { videoData, loading, error };
};

const Intermediate = () => {
  const { isAuthenticated, logout: keycloakLogout } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { videoData, loading, error } = useVideoData("/data/intermediateVideos.json");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const logout = useCallback(() => {
    keycloakLogout({ redirectUri: config.LOGOUT_REDIRECT_URI });
  }, [keycloakLogout]);

  return (
    <div>
      <Header language={language} setLanguage={setLanguage} logout={logout} />
      <Subheader language={language} />
      <div className="intermediate-content">
        <div className="intermediate-page">
          <header className="intermediate-header">
            <h1>
              {language === "tr" ? "Orta Seviye Dersler" : "Intermediate Lessons"}
            </h1>
            <p>
              {language === "tr"
                ? "Orta seviyedeki gitar derslerini keşfedin."
                : "Explore intermediate-level guitar lessons."}
            </p>
          </header>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div className="video-list">
            {!loading && !error && videoData.length === 0 && (
              <div>No videos found.</div>
            )}
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

export default Intermediate;