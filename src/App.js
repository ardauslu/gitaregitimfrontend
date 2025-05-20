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
        <Route path="/riff-generator" element={isAuthenticated ? <AdvancedRiffGenerator /> : <Navigate to="/login" />} />
        <Route path="/beginner" element={isAuthenticated ? <Beginner /> : <Navigate to="/login" />} />
        <Route path="/intermediate" element={isAuthenticated ? <Intermediate /> : <Navigate to="/login" />} />
        <Route path="/advanced" element={isAuthenticated ? <Advanced /> : <Navigate to="/login" />} />
        <Route path="/etudes" element={isAuthenticated ? <Etudes /> : <Navigate to="/login" />} />
        <Route path="/your-lessons" element={isAuthenticated ? <YourLessons /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile/> : <Navigate to="/login" />} />
        <Route path="/take-lesson" element={isAuthenticated ? <TakeLesson /> : <Navigate to="/login" />} />
        <Route path="/admin-panel" element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="/metronome" element={isAuthenticated ? <Metronome /> : <Navigate to="/login" />} />
        <Route path="/about-me" element={isAuthenticated ? <AboutMe /> : <Navigate to="/login" />} />
        <Route path="/speed-analysis" element={isAuthenticated ? <SpeedAnalysis /> : <Navigate to="/login" />} />
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