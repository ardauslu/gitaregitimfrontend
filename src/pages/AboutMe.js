import React, { useEffect, useState } from "react";
import './AboutMe.css'; // CSS dosyasını import etmeniz gerekir
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import { useAuth } from "../AuthContext"; // AuthContext'ten logout fonksiyonunu alın
import { useNavigate } from "react-router-dom";
const AboutMe = () => {
     const [language, setLanguage] = useState("tr"); // Dil state'i
      const { isAuthenticated, logout } = useAuth(); // useAuth'tan isAuthenticated ve logout alın
      const navigate = useNavigate();

      useEffect(() => {
          if (!isAuthenticated) {
            navigate("/login"); // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
          }
        }, [isAuthenticated, navigate]);
      
  return (<div>
  <Header language={language} setLanguage={setLanguage} logout={logout} />
        <Subheader language={language} />
      
  <div className="about-me-container">
      <h2 className="about-me-title">Hakkımda</h2>
      <p className="about-me-text">
        Merhaba, ismim Arda Uslu. Mesleğim bilgisayar mühendisliği ve bir süredir gitar çalma konusunda kendimi geliştirmekteyim.
        Bu web sitesini kurma amacım, gitar çalma yolculuğunda hem kendimi hem de öğrencilerimi daha ileriye taşıyabilmek.
        Daha önce özel gitar dersi vermemiş olsam da, elektro gitar ve web sitesi yapma konularında uzun süredir kendimi geliştiriyorum.
        Bu siteyi açarak, öğrendiklerimi ve deneyimlerimi başkalarına faydalı olabilmek adına paylaşmak istiyorum.
        Umarım, gitar çalma sürecinde sizlere de katkı sağlayabilirim.
      </p>
    </div>
    </div>
  );
}

export default AboutMe;
