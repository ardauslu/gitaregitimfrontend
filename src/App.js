import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import SignUp from "./SignUp"; // SignUp bileşenini içe aktar
import Login from "./Login";
import AdvancedRiffGenerator from "./components/AdvancedRiffGenerator"; // İleri seviye riff oluşturucu bileşenini içe aktar
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase"; // Firebase config dosyanızdan

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
        <Route path="/home" element={user ? <Home /> : <Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/riff-generator" element={<AdvancedRiffGenerator />} />
      </Routes>
    </Router>
  );
};

export default App;