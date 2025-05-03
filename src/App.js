import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import SignUp from "./SignUp";
import Login from "./Login";
import AdvancedRiffGenerator from "./components/AdvancedRiffGenerator";
import { AuthProvider, useAuth } from "./AuthContext";
import Beginner from "./pages/Beginner";
import Intermediate from "./pages/Intermediate";
import Advanced from "./pages/Advanced";
import Etudes from "./pages/Etudes";
import YourLessons from "./pages/YourLessons";
import Profile from "./pages/Profile";
import TakeLesson from "./pages/TakeLesson";
import AdminPanel from "./pages/AdminPanel";
import Metronome from "./components/Metronome";
import AboutMe from "./pages/AboutMe";
import SpeedAnalysis from "./pages/SpeedAnalysis";
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
        <Route path="/riff-generator" element={<AdvancedRiffGenerator />} />
        <Route path="/beginner" element={<Beginner />} />
        <Route path="/intermediate" element={<Intermediate />} />
        <Route path="/advanced" element={<Advanced />} />
        <Route path="/etudes" element={<Etudes />} />
        <Route path="/your-lessons" element={<YourLessons />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/take-lesson" element={<TakeLesson />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/metronome" element={<Metronome />} />
        <Route path="/about" element={<AboutMe />} /> 
        <Route path="your-lessons" element={<YourLessons />} />
        <Route path="/speed-analysis" element={<SpeedAnalysis />} />
     </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
