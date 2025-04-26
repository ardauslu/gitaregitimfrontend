import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Beginner from "./pages/Beginner";
import Intermediate from "./pages/Intermediate";
import Advanced from "./pages/Advanced";
import Etudes from "./pages/Etudes";
import YourLessons from "./pages/YourLessons";
import Login from "./Login"; // Login sayfasını içe aktarın
import AdvancedRiffGenerator from "./components/AdvancedRiffGenerator";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/riff-generator" element={<AdvancedRiffGenerator />} />
        <Route path="/beginner" element={<Beginner />} />
        <Route path="/intermediate" element={<Intermediate />} />
        <Route path="/advanced" element={<Advanced />} />
        <Route path="/etudes" element={<Etudes />} />
        <Route path="/your-lessons" element={<YourLessons />} />
        <Route path="/login" element={<Login />} /> {/* Login rotası */}
      </Routes>
    </Router>
  );
};

export default App;