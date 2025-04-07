import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();  // useNavigate hook'u
  const [subreddits, setSubreddits] = useState([
    { name: "r/ReactJS", commentCount: 10, posts: [{ title: "React Hooks", commentCount: 5 }, { title: "React State", commentCount: 3 }] },
    { name: "r/JavaScript", commentCount: 12, posts: [{ title: "JS Promises", commentCount: 2 }, { title: "JS Async/Await", commentCount: 4 }] },
  ]);

  const [selectedSubreddit, setSelectedSubreddit] = useState(null);
  const [newSubreddit, setNewSubreddit] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  const handleSelectSubreddit = (subreddit) => {
    setSelectedSubreddit(subreddit);
  };

  const handleAddSubreddit = () => {
    const newSubredditData = { name: newSubreddit, commentCount: 0, posts: [] };
    setSubreddits([...subreddits, newSubredditData]);
    setNewSubreddit("");
    setPopupVisible(false);
  };

  const handleRefresh = (subredditName) => {
    const updatedSubreddits = subreddits.map((subreddit) =>
      subreddit.name === subredditName
        ? { ...subreddit, posts: subreddit.posts.map((post) => ({ ...post, commentCount: post.commentCount + 1 })) }
        : subreddit
    );
    setSubreddits(updatedSubreddits);
  };

  const handleDeleteSubreddit = (subredditName) => {
    setSubreddits(subreddits.filter((subreddit) => subreddit.name !== subredditName));
    if (selectedSubreddit && selectedSubreddit.name === subredditName) {
      setSelectedSubreddit(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');  // Kullanıcıyı logout et
    localStorage.removeItem('password');  // Şifreyi de temizle
    navigate('/');  // Login sayfasına yönlendir
  };

  return (
    <div className='home-container'>
      <div className="welcome-container">
        <h2>Hoşgeldiniz, {localStorage.getItem('username')}</h2>
        <button onClick={handleLogout}>Çıkış Yap</button>
      </div>

      {/* Üç panelli tasarım burada olacak */}
      <div className="three-panel-layout">
        <div className="left-panel">
          <div className="panel-header">Subreddits</div>
          {subreddits.map((subreddit) => (
            <div className="subreddit" key={subreddit.name}>
              <div className="subreddit-name" onClick={() => handleSelectSubreddit(subreddit)}>
                {subreddit.name} ({subreddit.commentCount} comments)
              </div>
              <div className="menu-container">
                <div className="menu-icon">
                  <button
                    onClick={() => {
                      const menu = document.getElementById(subreddit.name);
                      menu.style.display = menu.style.display === "block" ? "none" : "block";
                    }}
                  >
                    ⋮
                  </button>
                  <div id={subreddit.name} className="menu">
                    <button onClick={() => handleRefresh(subreddit.name)}>Refresh</button>
                    <button onClick={() => handleDeleteSubreddit(subreddit.name)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="middle-panel">
          <div className="panel-header">
            {selectedSubreddit ? selectedSubreddit.name : "Select a Subreddit"}
          </div>
          {selectedSubreddit ? (
            selectedSubreddit.posts.map((post, index) => (
              <div className="post" key={index}>
                <div className="post-title">{post.title}</div>
                <div className="comment-count">{post.commentCount} comments</div>
              </div>
            ))
          ) : (
            <div>No subreddit selected</div>
          )}
        </div>
        <div className="right-panel">
          <div className="add-subreddit-container">
            <button className="add-button" onClick={() => setPopupVisible(true)}>
              +
            </button>
            {popupVisible && (
              <div className="popup">
                <input
                  type="text"
                  value={newSubreddit}
                  onChange={(e) => setNewSubreddit(e.target.value)}
                  placeholder="Enter new subreddit"
                />
                <button onClick={handleAddSubreddit}>Add Subreddit</button>
                <button className="close" onClick={() => setPopupVisible(false)}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
