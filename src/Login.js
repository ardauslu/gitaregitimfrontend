import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./Login.css";
import chatgpt from "./assets/chatgpt.png";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    navigate("/home");
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate("/home"); // Kullanıcı zaten giriş yaptıysa direkt home'a
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google User:", result.user);

      if (result.user) {
        console.log("Navigating to /home");
        navigate("/home");
      } else {
        console.error("Google Login Error: User not found");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={chatgpt} alt="Login Illustration" />
      </div>
      <div className="login-form">
        <h2>Welcome Back!</h2>
        <p>Please log in to continue.</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <button className="google-login-button" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up here</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;