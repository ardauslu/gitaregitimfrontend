import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [subreddits, setSubreddits] = useState([]); // Subreddit listesi için state
  const [selectedSubreddit, setSelectedSubreddit] = useState(null); // Seçilen subreddit
  const [posts, setPosts] = useState([]); // Gönderiler için state
  const [currentPage, setCurrentPage] = useState(1); // Mevcut sayfa
  const postsPerPage = 10; // Her sayfada gösterilecek post sayısı

  useEffect(() => {
    // Subreddit listesini API'den çek
    const fetchSubreddits = async () => {
      try {
        const response = await fetch('http://192.168.1.20:8080/api/v1/api/reddit/subreddits');
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
 
 // Sayfalama için hesaplamalar
 const indexOfLastPost = currentPage * postsPerPage;
 const indexOfFirstPost = indexOfLastPost - postsPerPage;
 const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

 const totalPages = Math.ceil(posts.length / postsPerPage);

 const handleNextPage = () => {
   if (currentPage < totalPages) {
     setCurrentPage(currentPage + 1);
   }
 };

 const handlePreviousPage = () => {
   if (currentPage > 1) {
     setCurrentPage(currentPage - 1);
   }
 };

  const handleSubredditClick = async (subreddit) => {
    setSelectedSubreddit(subreddit); // Seçilen subreddit'i kaydet
    try {
      const response = await fetch(`http://192.168.1.20:8080/api/v1/api/reddit/posts/${subreddit}`);
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
    <div>
      <div className="header">
        <div className="header-left">
          <h1>Reddit API</h1>
        </div>
        <div className="header-middle">
          Hoşgeldiniz, {localStorage.getItem("username")}
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Subreddit ara..."
              className="search-input"
            />
            <button className="search-button">Ara</button>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("username");
              localStorage.removeItem("password");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="three-panel-layout">
      <div className="left-panel">
  <div className="panel-header">Subreddits</div>
  {subreddits.length > 0 ? (
    subreddits.map((subreddit, index) => (
      <div
        className="subreddit-bubble"
        key={index}
        onClick={() => handleSubredditClick(subreddit)}
        style={{ cursor: "pointer" }}
      >
        r/{subreddit}
      </div>
    ))
  ) : (
    <div>No subreddits available</div>
  )}
</div>
<div className="middle-panel">
          <div className="panel-header">
            {selectedSubreddit ? `Posts in r/${selectedSubreddit}` : "Select a Subreddit"}
          </div>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <div className="post" key={post.id} style={{ marginBottom: "10px" }}>
                <h3>{post.title}</h3>
                <p>
                  <strong>Author:</strong> {post.author}
                </p>
                <p>
                  <strong>Subreddit:</strong> r/{post.subreddit}
                </p>
                <p>
                  <strong>Ups:</strong> {post.ups}
                </p>
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </div>
            ))
          ) : (
            selectedSubreddit && <div>No posts available for this subreddit</div>
          )}
          {posts.length > 0 && (
            <div className="pagination">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Geri
              </button>
              <span>
                Sayfa {currentPage} / {totalPages} ({posts.length} gönderi)
              </span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                İleri
              </button>
            </div>
          )}
        </div>
        <div className="right-panel">
          {/* Sağ panel içeriği */}
        </div>
      </div>
    </div>
  );
}
export default Home;