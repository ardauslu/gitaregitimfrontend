import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [subreddits, setSubreddits] = useState([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const postsPerPage = 10;

  const fetchSubreddits = async () => {
    try {
      const response = await fetch('http://192.168.1.20:8080/api/v1/api/reddit/subreddits');
      if (response.ok) {
        const data = await response.json();
        setSubreddits(data);
      } else {
        console.error('Subreddit verileri alınamadı.');
      }
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Lütfen bir subreddit adı girin!");
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.20:8080/api/v1/api/reddit/fetch/${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        if (data.message === "Veriler MongoDB'ye kaydedildi!") {
          const postsResponse = await fetch(`http://192.168.1.20:8080/api/v1/api/reddit/posts/${searchTerm}`);
          if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            setPosts(postsData || []);
          } else {
            console.error("Gönderiler alınamadı.");
          }

          setSelectedSubreddit(searchTerm);
          setCurrentPage(1);
          await fetchSubreddits();
        } else {
          alert(`r/${searchTerm} için gönderi bulunamadı.`);
        }
      } else {
        console.error("Arama sonuçları alınamadı.");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const handleSubredditClick = async (subreddit) => {
    setSelectedSubreddit(subreddit);
    setCurrentPage(1);
    try {
      const response = await fetch(`http://192.168.1.20:8080/api/v1/api/reddit/posts/${subreddit}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Beklenmeyen yanıt formatı:", data);
          setPosts([]);
        }
      } else {
        console.error("Subreddit gönderileri alınamadı.");
        setPosts([]);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setPosts([]);
    }
  };

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

  useEffect(() => {
    fetchSubreddits();
  }, []);


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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Arama terimini güncelle
            />
            <button className="search-button" onClick={handleSearch}>
              Ara
            </button>
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
            currentPosts.map((post, index) => (
              <div className="post" key={index} style={{ marginBottom: "10px" }}>
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
      </div>
    </div>
  );
};

export default Home;