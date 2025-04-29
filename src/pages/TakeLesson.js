import React, { useState } from 'react';
import './TakeLesson.css';
import Subheader from '../components/Subheader';
import Header from '../components/Header';

const TakeLesson = () => {
  const [language, setLanguage] = useState('tr'); // Dil state'i

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lessonType, setLessonType] = useState('beginner');
  const [lessonDate, setLessonDate] = useState('');
  const [lessonTime, setLessonTime] = useState('');
  const [reservationDone, setReservationDone] = useState(false);
  const [zoomLink, setZoomLink] = useState(''); // Zoom toplantı linki

  const handleReservation = async () => {
    if (!lessonDate || !lessonTime || !name || !email) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    const reservationData = {
      name,
      email,
      lessonType,
      lessonDate,
      lessonTime,
    };

    try {
      const token = localStorage.getItem('token'); // Token'ı localStorage'dan al
      if (!token) {
        throw new Error('Token bulunamadı. Lütfen giriş yapın.');
      }

      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Token'ı Authorization başlığına ekle
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
    }
  };

  return (
    <div className="take-lesson-page">
      {/* Header bileşenine language ve setLanguage prop'larını geçiyoruz */}
      <Header language={language} setLanguage={setLanguage} logout={() => {}} />
      <Subheader language={language} />

      <div className="lesson-container">
        <h2 className="take-lesson-header">Online Gitar Dersi Rezervasyonu</h2>
        {reservationDone ? (
          <div className="success-message">
            <h3>Rezervasyon Tamamlandı!</h3>
            <p>
              {language === 'tr'
                ? 'Rezervasyonunuz başarıyla kaydedildi.'
                : 'Your reservation has been successfully saved.'}
            </p>
            <p>
              {language === 'tr'
                ? 'Zoom toplantı linkiniz:'
                : 'Your Zoom meeting link:'}{' '}
              <a href={zoomLink} target="_blank" rel="noopener noreferrer">
                {zoomLink}
              </a>
            </p>
          </div>
        ) : (
          <form className="reservation-form">
            <div className="form-group">
              <label htmlFor="name">{language === 'tr' ? 'Adınız' : 'Name'}</label>
              <input
                type="text"
                id="name"
                placeholder={language === 'tr' ? 'Adınızı girin' : 'Enter your name'}
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

            <button type="button" className="submit-btn" onClick={handleReservation}>
              {language === 'tr' ? 'Rezervasyonu Tamamla' : 'Complete Reservation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TakeLesson;