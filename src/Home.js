import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [subreddits, setSubreddits] = useState([]); // Subreddit listesi için state
  const [selectedSubreddit, setSelectedSubreddit] = useState(null); // Seçilen subreddit
  const [posts, setPosts] = useState([]); // Gönderiler için state

  useEffect(() => {
    // Subreddit listesini API'den çek
    const fetchSubreddits = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/api/reddit/subreddits');
        if (response.ok) {
          const data = await response.json();
          setSubreddits(data); // Subreddit listesini state'e kaydet
        } else {
          console.error('Subreddit verileri alınamadı.');
        }
      } catch (error) {
        console.error('Bir hata oluştu:', error);
      }
    };

    fetchSubreddits();
  }, []);

  const handleSubredditClick = async (subreddit) => {
    setSelectedSubreddit(subreddit); // Seçilen subreddit'i kaydet
    try {
      const response = await fetch(`http://localhost:8080/api/v1/api/reddit/posts/${subreddit}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data); // Gönderileri state'e kaydet
      } else {
        console.error('Gönderiler alınamadı.');
      }
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    }
  };

  return (
    <div className='home-container'>
      <div className="welcome-container">
        <h2>Hoşgeldiniz, {localStorage.getItem('username')}</h2>
        <button onClick={() => {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
          navigate('/');
        }}>Çıkış Yap</button>
      </div>

      <div className="three-panel-layout">
        <div className="left-panel">
          <div className="panel-header">Subreddits</div>
          {subreddits.length > 0 ? (
            subreddits.map((subreddit, index) => (
              <div
                className="subreddit"
                key={index}
                onClick={() => handleSubredditClick(subreddit)} // Tıklama işlevi
                style={{ cursor: 'pointer' }}
              >
                <div className="subreddit-name">
                  <span style={{ fontWeight: 'bold', marginRight: '5px' }}>
                    r/{subreddit}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div>No subreddits available</div>
          )}
        </div>
        <div className="middle-panel">
          <div className="panel-header">
            {selectedSubreddit ? `Posts in r/${selectedSubreddit}` : 'Select a Subreddit'}
          </div>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div className="post" key={index} style={{ marginBottom: '10px' }}>
                <h3>{post.title}</h3>
                <p><strong>Author:</strong> {post.author}</p>
                <p><strong>Subreddit:</strong> r/{post.subreddit}</p>
                <p><strong>Ups:</strong> {post.ups}</p>
                <a href={post.url} target="_blank" rel="noopener noreferrer">Read more</a>
              </div>
            ))
          ) : (
            selectedSubreddit && <div>No posts available for this subreddit</div>
          )}
        </div>
        <div className="right-panel">
          <div className="add-subreddit-container">
            <button className="add-button">+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;