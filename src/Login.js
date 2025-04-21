import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "/api"; // API URL sabiti

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-body");
    return () => {
      document.body.classList.remove("login-body");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("username", username);
          localStorage.setItem("token", data.token);
          alert("Başarıyla giriş yaptınız!");
          navigate("/home");
        } else {
          alert("Giriş başarısız! Lütfen kullanıcı adı ve şifrenizi kontrol edin.");
        }
      } catch (error) {
        console.error("Bir hata oluştu:", error);
        alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    } else {
      alert("Lütfen kullanıcı adı ve şifre girin!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Giriş Yap</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
            />
          </div>
          <button type="submit" className="login-button">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;