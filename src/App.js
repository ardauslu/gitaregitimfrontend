import React from "react";
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"; // Değişti!
import { AnimatePresence } from "framer-motion";
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
import { LanguageProvider } from "./contexts/LanguageContext";

const AppRoutes = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
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
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/speed-analysis" element={<SpeedAnalysis />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router> {/* Artık HashRouter olarak çalışıyor! */}
          <AppRoutes />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;