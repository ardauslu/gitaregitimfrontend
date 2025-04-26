import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // Firebase Authentication
import "./Login.css";
import unnamed3 from "./assets/unnamed (3).png"; // Görseli içe aktarın

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    navigate("/home"); // Başarılı girişten sonra yönlendirme
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google User:", result.user);
      navigate("/home"); // Başarılı girişten sonra yönlendirme
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={unnamed3} alt="Login Illustration" />
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