import React, { useState, useEffect } from 'react';
import './TakeLesson.css';
import Subheader from '../components/Subheader';
import Header from '../components/Header';
import { useAuth } from "../AuthContext"; // AuthContext'ten logout fonksiyonunu alın
import { useNavigate } from "react-router-dom";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";
import keycloak from "../keycloak";

const TakeLesson = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lessonType, setLessonType] = useState('beginner');
  const [lessonDate, setLessonDate] = useState('');
  const [lessonTime, setLessonTime] = useState('');
  const [reservationDone, setReservationDone] = useState(false);
  const [zoomLink, setZoomLink] = useState(''); // Zoom toplantı linki
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, logout: authLogout } = useAuth(); // useAuth'tan isAuthenticated ve logout alın
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/login"); // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
      }
    }, [isAuthenticated, navigate]);
  
  const logout = () => {
    keycloak.logout({
      redirectUri: config.LOGOUT_REDIRECT_URI
    });
  }

  const handleReservation = async () => {
    if (!lessonDate || !lessonTime || !name || !email) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Keycloak token kullan
      const token = keycloak.token;
      if (!token) {
        throw new Error('Token bulunamadı. Lütfen giriş yapın.');
      }
      // ISO 8601 formatı: 2025-05-23T15:00:00
      const isoStartTime = lessonDate && lessonTime ? `${lessonDate}T${lessonTime}` : undefined;
      const reservationData = {
        topic: 'Gitar Eğitimi',
        lessonDate,
        lessonTime,
        duration: 60,
        isoStartTime,
        name,
        email,
        lessonType,
      };
      const response = await fetch(`${config.API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Rezervasyon kaydedilirken hata oluştu.');
      }

      const data = await response.json();
      setZoomLink(data.reservation.zoomLink); // Zoom toplantı linkini kaydet
      setReservationDone(true);
    } catch (error) {
      console.error('Hata:', error);
      alert('Rezervasyon kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (<div>
     <Header language={language} setLanguage={setLanguage} logout={logout} />
      <Subheader language={language} />
  
    <div className="take-lesson-page">
     
      <div className="lesson-container lesson-white-frame">
        <h2 className="take-lesson-header">
          {language === "tr"
            ? "Online Gitar Dersi Rezervasyonu"
            : "Online Reservation For Lesson"}
        </h2>
        {reservationDone ? (
          <div className="success-message">
            <h3>{language === "tr" ? "Rezervasyon Tamamlandı!" : "Reservation Completed!"}</h3>
            <p>
              {language === "tr"
                ? "Rezervasyonunuz başarıyla kaydedildi."
                : "Your reservation has been successfully saved."}
            </p>
            <p>
              {language === "tr"
                ? "Zoom toplantı linkiniz:"
                : "Your Zoom meeting link:"}{" "}
              <a href={zoomLink} target="_blank" rel="noopener noreferrer">
                {zoomLink}
              </a>
            </p>
          </div>
        ) : (
          <form className="reservation-form">
            {/* Form alanları */}
            <div className="form-group">
              <label htmlFor="name">{language === "tr" ? "Adınız" : "Name"}</label>
              <input
                type="text"
                id="name"
                placeholder={language === "tr" ? "Adınızı girin" : "Enter your name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{language === 'tr' ? 'E-posta' : 'Email'}</label>
              <input
                type="email"
                id="email"
                placeholder={language === 'tr' ? 'E-posta adresinizi girin' : 'Enter your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lessonType">{language === 'tr' ? 'Ders Tipi' : 'Lesson Type'}</label>
              <select
                id="lessonType"
                value={lessonType}
                onChange={(e) => setLessonType(e.target.value)}
              >
                <option value="beginner">{language === 'tr' ? 'Başlangıç' : 'Beginner'}</option>
                <option value="intermediate">{language === 'tr' ? 'Orta Seviye' : 'Intermediate'}</option>
                <option value="advanced">{language === 'tr' ? 'İleri Seviye' : 'Advanced'}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="lessonDate">{language === 'tr' ? 'Ders Tarihi' : 'Lesson Date'}</label>
              <input
                type="date"
                id="lessonDate"
                value={lessonDate}
                onChange={(e) => setLessonDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lessonTime">{language === 'tr' ? 'Ders Saati' : 'Lesson Time'}</label>
              <input
                type="time"
                id="lessonTime"
                value={lessonTime}
                onChange={(e) => setLessonTime(e.target.value)}
                required
              />
            </div>

            <button type="button" className="submit-btn" onClick={handleReservation} disabled={isSubmitting}>
            {language === "tr" ? "Rezervasyonu Tamamla" : "Complete Reservation"}
          </button>
        </form>
      )}
    </div>
  </div>
  </div>
  );

};

export default TakeLesson;