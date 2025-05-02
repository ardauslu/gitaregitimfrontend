import React, { useState, useEffect, useCallback } from 'react';
import './YourLessons.css';
import Subheader from '../components/Subheader';
import Header from '../components/Header';
import { useNavigate } from "react-router-dom";
import config from "../config";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiStar, FiHeart } from "react-icons/fi";
import { useAuth } from "../AuthContext";

const videoVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -50 }
};

const YourLessons = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [userVideos, setUserVideos] = useState([]);
  const [otherVideos, setOtherVideos] = useState([]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [language, setLanguage] = useState('tr');
  const [notification, setNotification] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Admin kontrolü için state
  const navigate = useNavigate();
  const { logout } = useAuth();
  const token = localStorage.getItem('token');

  const getEmbedUrl = (url) => {
    if (!url) return '';

    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1&modestbranding=1`;
      }
      return url;
    }

    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const regExp = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
      const match = url.match(regExp);
      if (match && match[3]) {
        return `https://player.vimeo.com/video/${match[3]}`;
      }
    }

    // Return original URL for other cases
    return url;
  };

  const fetchUserProfile = useCallback(async () => {
    try {
      const profileResponse = await fetch(`${config.API_BASE_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profileData = await profileResponse.json();
      setIsAdmin(profileData.isAdmin || false); // Kullanıcının admin olup olmadığını kontrol et
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }, [token]);

  const fetchVideos = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/videos`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(res.status === 401 ? 'Authentication required' : 'Failed to fetch videos');
      }

      const data = await res.json();
      setUserVideos(data.userVideos || []);
      setOtherVideos(data.otherVideos || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      showNotification(err.message, true);
      if (err.message === 'Authentication required') {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchUserProfile(); // Kullanıcı profilini getir
      fetchVideos(); // Videoları getir
    }
  }, [token, navigate, fetchUserProfile, fetchVideos]);

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) {
      showNotification("Video URL is required", true);
      return;
    }

    try {
      const profileResponse = await fetch(`${config.API_BASE_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profileData = await profileResponse.json();
      const username = profileData.username;

      if (!username) {
        throw new Error('Username not found in user profile');
      }

      const embedUrl = getEmbedUrl(videoUrl.trim());

      const newVideo = {
        url: embedUrl,
        description: description.trim(),
        category: category.trim(),
        favorite,
        user: username,
      };

      const response = await fetch(`${config.API_BASE_URL}/api/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newVideo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add video');
      }

      const savedVideo = await response.json();
      setUserVideos((prev) => [savedVideo, ...prev]);
      resetForm();
      showNotification("Video added successfully!");
    } catch (err) {
      showNotification(err.message || "Failed to add video", true);
      console.error('Error adding video:', err);
    }
  };

  const resetForm = () => {
    setVideoUrl('');
    setDescription('');
    setCategory('');
    setFavorite(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/videos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete video');
      }

      setUserVideos((prev) => prev.filter((video) => video._id !== id));
      setOtherVideos((prev) => prev.filter((video) => video._id !== id));
      showNotification('Video deleted successfully');
    } catch (err) {
      showNotification(err.message || 'Failed to delete video', true);
      console.error('Delete error:', err);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const videoToUpdate = userVideos.find(v => v._id === id);
      if (!videoToUpdate) return;

      const response = await fetch(`${config.API_BASE_URL}/api/videos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ favorite: !videoToUpdate.favorite }),
      });

      if (!response.ok) {
        throw new Error('Failed to update video');
      }

      setUserVideos(prev =>
        prev.map(video =>
          video._id === id ? { ...video, favorite: !video.favorite } : video
        )
      );
    } catch (err) {
      showNotification(err.message || "Failed to update video", true);
      console.error('Update error:', err);
    }
  };

  const filteredVideos = (videos) => {
    if (selectedCategory === 'all') return videos;
    return videos.filter(video => video.category === selectedCategory);
  };

  const uniqueCategories = [...new Set([
    ...userVideos.map(v => v.category),
    ...otherVideos.map(v => v.category)
  ])].filter(Boolean);

  const renderVideoPlayer = (video) => {
    const embedUrl = getEmbedUrl(video.url);

    if (embedUrl.includes('youtube.com/embed') || embedUrl.includes('vimeo.com')) {
      return (
        <div className="video-embed">
          <iframe
            src={embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.description || "Video"}
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      );
    } else {
      return (
        <div className="video-embed">
          <video controls className="video-tag">
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  };

  return (
    <div className="lessons-page">
      <Header language={language} setLanguage={setLanguage} logout={logout} />
      <Subheader language={language} />

      <div className="lesson-container">
        {notification && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`notification ${notification.isError ? 'error' : 'success'}`}
          >
            {notification.message}
          </motion.div>
        )}

        <div className="video-upload-container">
          <h2 className="lesson-title">Add Your Lesson</h2>

          <div className="input-group">
            <input
              type="text"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="YouTube, Vimeo or direct video URL"
              className="input-url"
            />
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
              className="input-meta"
            />
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Category"
              className="input-meta"
            />
            <label className="favorite-checkbox">
              <input
                type="checkbox"
                checked={favorite}
                onChange={() => setFavorite(!favorite)}
              />
              <FiStar className={favorite ? 'favorite' : ''} /> Favorite
            </label>
            <motion.button
              onClick={handleAddVideo}
              className="add-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <FiPlus /> {isLoading ? 'Adding...' : 'Add Video'}
            </motion.button>
          </div>
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={isLoading}
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading videos...</p>
          </div>
        ) : (
          <>
            <div className="video-list-container">
              <h2 className="lesson-title">Your Videos</h2>

              {filteredVideos(userVideos).length > 0 ? (
                <div className="video-list">
                  <AnimatePresence>
                    {filteredVideos(userVideos).map((video) => (
                      <motion.div
                        key={video._id}
                        className={`video-card ${video.favorite ? 'favorite' : ''}`}
                        variants={videoVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        transition={{ duration: 0.3 }}
                      >
                        <div className="video-header">
                          <div className="video-title">
                            {video.favorite && <FiStar className="favorite-icon" />}
                            <strong>{video.description || 'Untitled Video'}</strong>
                          </div>
                          <span className="video-category">{video.category}</span>
                          <div className="video-actions">
                            <button
                              onClick={() => toggleFavorite(video._id)}
                              className={`favorite-button ${video.favorite ? 'active' : ''}`}
                              aria-label={video.favorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <FiHeart />
                            </button>
                            <button
                              onClick={() => handleDelete(video._id)}
                              className="remove-button"
                              aria-label="Delete video"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        {renderVideoPlayer(video)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.p
                  className="empty-state"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {selectedCategory === 'all'
                    ? 'No videos available yet.'
                    : `No videos in ${selectedCategory} category.`}
                </motion.p>
              )}

<h2 className="lesson-title">Community Videos</h2>
{filteredVideos(otherVideos).length > 0 ? (
  <div className="video-list">
    <AnimatePresence>
      {filteredVideos(otherVideos).map((video) => (
        <motion.div
          key={video._id}
          className={`video-card ${video.favorite ? 'favorite' : ''}`}
          variants={videoVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
          transition={{ duration: 0.3 }}
        >
          <div className="video-header">
            <div className="video-title">
              {video.favorite && <FiStar className="favorite-icon" />}
              <strong>{video.description || 'Untitled Video'}</strong>
            </div>
            <span className="video-category">{video.category}</span>
            <div className="video-author">
              {video.user || 'Unknown user'}
            </div>
            {isAdmin && ( // Eğer kullanıcı admin ise silme butonunu göster
              <button
                onClick={() => handleDelete(video._id)}
                className="remove-button"
                aria-label="Delete video"
              >
                <FiTrash2 />
              </button>
            )}
          </div>
          {renderVideoPlayer(video)}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
) : (
  <motion.p
    className="empty-state"
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    {selectedCategory === 'all'
      ? 'No community videos available.'
      : `No community videos in ${selectedCategory} category.`}
  </motion.p>
)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YourLessons;