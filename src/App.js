import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import SignUp from "./SignUp"; // SignUp bileşenini içe aktar
import Login from "./Login";
import AdvancedRiffGenerator from "./components/AdvancedRiffGenerator"; // İleri seviye riff oluşturucu bileşenini içe aktar
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase"; // Firebase config dosyanızdan
import Beginner from "./pages/Beginner"; // Başlangıç seviyesi bileşenini içe aktar
import Intermediate from "./pages/Intermediate"; // Orta seviye bileşenini içe aktar
import Advanced from "./pages/Advanced"; // İleri seviye bileşenini içe aktar
import Etudes from "./pages/Etudes"; // Etüdler bileşenini içe aktar
import YourLessons from "./pages/YourLessons"; // Sizin dersleriniz bileşenini içe aktar
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Kullanıcı durumunu güncelle
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={user ? <Home /> : <Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/riff-generator" element={<AdvancedRiffGenerator />} />
        <Route path="/beginner" element={<Beginner />} />
        <Route path="/intermediate" element={<Intermediate />} />
        <Route path="/advanced" element={<Advanced />} />
        <Route path="/etudes" element={<Etudes />} />
        <Route path="/your-lessons" element={<YourLessons />} />
      </Routes>
    </Router>
  );
};

export default App;