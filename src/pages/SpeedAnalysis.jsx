import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './SpeedAnalysis.css';
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import Subheader from '../components/Subheader';
import Header from '../components/Header';
import { useAuth } from "../AuthContext"; // AuthContext'ten logout fonksiyonunu alın
import config from "../config";

// VideoPlayer component / VideoPlayer bileşeni
const VideoPlayer = ({ videoUrl }) => {
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    if (videoUrl) {
      const src = `http://localhost:5003/results/${videoUrl}?t=${Date.now()}`;
      setVideoSrc(src);
    }
  }, [videoUrl]);

  if (!videoSrc) {
    return <div>Loading video... / Video yükleniyor...</div>;
  }

  return (
    <div>
      <video
        controls
        autoPlay
        style={{ width: '100%', maxHeight: '500px' }}
        key={videoSrc}  // Force re-render when source changes
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support HTML5 video. / Tarayıcınız HTML5 video desteklemiyor.
      </video>
      <div style={{ marginTop: '10px' }}>
        <a href={videoSrc} target="_blank" rel="noopener noreferrer">
          Open video in new tab / Videoyu yeni sekmede aç
        </a>
      </div>
    </div>
  );
};

const SpeedAnalysis = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { logout } = useAuth();
  
  const translations = {
    en: {
      title: "Guitar Speed Analysis",
      description: "Enter a YouTube URL of your guitar performance to analyze picking technique and speed",
      placeholder: "Paste YouTube video URL here...",
      analyze: "Analyze",
      analyzing: "Analyzing...",
      example: "Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      another: "Analyze Another Video",
      processing: "Processing YouTube video...",
      mayTake: "This may take a few moments depending on video length",
      resultsTitle: "Performance Analysis Results",
      overallScore: "Overall Score",
      excellent: "Excellent technique!",
      good: "Good, but could improve",
      needsPractice: "Needs practice",
      speed: "Speed",
      picksMin: "Picks/Min",
      totalPicks: "total picks",
      wristAngle: "Wrist Angle",
      optimal: "Optimal angle",
      efficient: "Could be more efficient",
      alternatePicking: "Alternate Picking",
      greatConsistency: "Great consistency!",
      practiceAlternate: "Practice alternate picking",
      errorEmpty: "Please enter a YouTube URL",
      errorInvalid: "Please enter a valid YouTube URL",
      errorGeneral: "An error occurred during analysis"
    },
    tr: {
      title: "Gitar Hız Analizi",
      description: "Gitar performansınızın pena tekniğini ve hızını analiz etmek için bir YouTube URL'si girin",
      placeholder: "YouTube video URL'sini buraya yapıştırın...",
      analyze: "Analiz Et",
      analyzing: "Analiz Ediliyor...",
      example: "Örnek: https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      another: "Başka Bir Videoyu Analiz Et",
      processing: "YouTube videosu işleniyor...",
      mayTake: "Video uzunluğuna bağlı olarak bu işlem birkaç dakika sürebilir",
      resultsTitle: "Performans Analiz Sonuçları",
      overallScore: "Genel Puan",
      excellent: "Mükemmel teknik!",
      good: "İyi, ancak geliştirilebilir",
      needsPractice: "Pratik gerekiyor",
      speed: "Hız",
      picksMin: "Pena vuruşu/Dk",
      totalPicks: "toplam pena vuruşu",
      wristAngle: "Bilek Açısı",
      optimal: "Optimal açı",
      efficient: "Daha verimli olabilir",
      alternatePicking: "Alternatif Pena Vuruşu",
      greatConsistency: "Harika tutarlılık!",
      practiceAlternate: "Alternatif pena vuruşu pratiği yapın",
      errorEmpty: "Lütfen bir YouTube URL'si girin",
      errorInvalid: "Lütfen geçerli bir YouTube URL'si girin",
      errorGeneral: "Analiz sırasında bir hata oluştu"
    }
  };

  const t = language === 'tr' ? translations.tr : translations.en;

  const analyzeYoutubeVideo = async () => {
    if (!youtubeUrl) {
      setError(t.errorEmpty);
      return;
    }

    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      setError(t.errorInvalid);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5003/analyze/youtube', {
        youtube_url: youtubeUrl
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || t.errorGeneral);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setYoutubeUrl('');
    setResults(null);
    setError(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div>  
      <Header language={language} setLanguage={setLanguage} logout={logout} />
      <Subheader language={language} />
       
      <div className="speed-analysis-container">
        <header className="analysis-header">
          <h1 className="text-3xl font-bold text-gray-800">
            <i className="fas fa-guitar mr-2 text-indigo-600"></i>
            {t.title}
          </h1>
          <p className="text-gray-600 mt-2">
            {t.description}
          </p>
        </header>

        <div className="youtube-input-section">
          {!results ? (
            <div className="youtube-url-input">
              <div className="input-group">
                <span className="input-icon">
                  <i className="fab fa-youtube"></i>
                </span>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder={t.placeholder}
                  className="youtube-url-field"
                />
                <button
                  onClick={analyzeYoutubeVideo}
                  disabled={!youtubeUrl || isAnalyzing}
                  className={`analyze-btn ${isAnalyzing ? 'analyzing' : ''}`}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="spinner"></span>
                      {t.analyzing}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-play mr-2"></i>
                      {t.analyze}
                    </>
                  )}
                </button>
              </div>
              <p className="input-hint">
                {t.example}
              </p>
            </div>
          ) : (
            <div className="video-preview">
              <VideoPlayer videoUrl={results.output_video} />
            </div>
          )}

          {results && (
            <div className="action-buttons">
              <button
                onClick={resetAnalysis}
                className="reset-btn"
              >
                <i className="fas fa-redo mr-2"></i>
                {t.another}
              </button>
            </div>
          )}

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
        </div>

        {isAnalyzing && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>{t.processing}</p>
            <p className="text-sm text-gray-500 mt-2">
              {t.mayTake}
            </p>
          </div>
        )}

        {results && (
          <div className="results-section">
            <h2 className="section-title">
              <i className="fas fa-chart-bar mr-2"></i>
              {t.resultsTitle}
            </h2>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <i className="fas fa-star metric-icon"></i>
                  <h3>{t.overallScore}</h3>
                </div>
                <div className={`metric-value ${getScoreColor(results.performance_score)}`}>
                  {results.performance_score}/100
                </div>
                <div className="metric-description">
                  {results.performance_score >= 80
                    ? t.excellent
                    : results.performance_score >= 60
                    ? t.good
                    : t.needsPractice}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <i className="fas fa-tachometer-alt metric-icon"></i>
                  <h3>{t.speed}</h3>
                </div>
                <div className="metric-value">
                  {t.picksMin}
                </div>
                <div className="metric-description">
                  {results.pick_count} {t.totalPicks}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <i className="fas fa-hand-paper metric-icon"></i>
                  <h3>{t.wristAngle}</h3>
                </div>
                <div className="metric-value">
                  {results.avg_angle.toFixed(1)}°
                </div>
                <div className="metric-description">
                  {results.avg_angle < 15
                    ? t.optimal
                    : t.efficient}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <i className="fas fa-exchange-alt metric-icon"></i>
                  <h3>{t.alternatePicking}</h3>
                </div>
                <div className="metric-value">
                  {results.alternate_percent.toFixed(1)}%
                </div>
                <div className="metric-description">
                  {results.alternate_percent > 85
                    ? t.greatConsistency
                    : t.practiceAlternate}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedAnalysis;