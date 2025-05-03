import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './SpeedAnalysis.css';

// VideoPlayer bileşeni
const VideoPlayer = ({ videoUrl }) => {
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    if (videoUrl) {
      const src = `http://localhost:5003/results/${videoUrl}?t=${Date.now()}`;
      setVideoSrc(src);
    }
  }, [videoUrl]);

  if (!videoSrc) {
    return <div>Loading video...</div>;
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
        Your browser does not support HTML5 video.
      </video>
      <div style={{ marginTop: '10px' }}>
        <a href={videoSrc} target="_blank" rel="noopener noreferrer">
          Open video in new tab
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

  const analyzeYoutubeVideo = async () => {
    if (!youtubeUrl) {
      setError('Please enter a YouTube URL');
      return;
    }

    // Basic YouTube URL validation
    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
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
      setError(err.response?.data?.error || 'An error occurred during analysis');
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
    <div className="speed-analysis-container">
      <header className="analysis-header">
        <h1 className="text-3xl font-bold text-gray-800">
          <i className="fas fa-guitar mr-2 text-indigo-600"></i>
          Guitar Speed Analysis
        </h1>
        <p className="text-gray-600 mt-2">
          Enter a YouTube URL of your guitar performance to analyze picking technique and speed
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
                placeholder="Paste YouTube video URL here..."
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-play mr-2"></i>
                    Analyze
                  </>
                )}
              </button>
            </div>
            <p className="input-hint">
              Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
            </p>
          </div>
        ) : (
          <div className="video-preview">
            {/* VideoPlayer bileşeni burada kullanılıyor */}
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
              Analyze Another Video
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
          <p>Processing YouTube video...</p>
          <p className="text-sm text-gray-500 mt-2">
            This may take a few moments depending on video length
          </p>
        </div>
      )}

      {results && (
        <div className="results-section">
          <h2 className="section-title">
            <i className="fas fa-chart-bar mr-2"></i>
            Performance Analysis Results
          </h2>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <i className="fas fa-star metric-icon"></i>
                <h3>Overall Score</h3>
              </div>
              <div className={`metric-value ${getScoreColor(results.performance_score)}`}>
                {results.performance_score}/100
              </div>
              <div className="metric-description">
                {results.performance_score >= 80
                  ? "Excellent technique!"
                  : results.performance_score >= 60
                  ? "Good, but could improve"
                  : "Needs practice"}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <i className="fas fa-tachometer-alt metric-icon"></i>
                <h3>Speed</h3>
              </div>
              <div className="metric-value">
                {(results.pick_count / results.duration_minutes).toFixed(1)} picks/min
              </div>
              <div className="metric-description">
                {results.pick_count} total picks
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <i className="fas fa-hand-paper metric-icon"></i>
                <h3>Wrist Angle</h3>
              </div>
              <div className="metric-value">
                {results.avg_angle.toFixed(1)}°
              </div>
              <div className="metric-description">
                {results.avg_angle < 15
                  ? "Optimal angle"
                  : "Could be more efficient"}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <i className="fas fa-exchange-alt metric-icon"></i>
                <h3>Alternate Picking</h3>
              </div>
              <div className="metric-value">
                {results.alternate_percent.toFixed(1)}%
              </div>
              <div className="metric-description">
                {results.alternate_percent > 85
                  ? "Great consistency!"
                  : "Practice alternate picking"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedAnalysis;