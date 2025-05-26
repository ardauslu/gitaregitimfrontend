import React, { useState, useEffect, useCallback } from "react";
import "./AdminPanel.css";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";
import keycloak from "../keycloak";

const AdminPanel = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, logout: keycloakLogout } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const logout = useCallback(() => {
    keycloakLogout({ redirectUri: config.LOGOUT_REDIRECT_URI });
  }, [keycloakLogout]);

  // Rezervasyonları API'den çek
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/reservations/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Rezervasyonlar alınamadı.");
        }

        const data = await response.json();
        setReservations(data); // Rezervasyonları state'e kaydet
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Tarihi gün/ay/yıl formatına çeviren yardımcı fonksiyon
  const formatDate = (dateString) => {
    const date = new Date(dateString); // ISO formatındaki tarihi Date nesnesine dönüştür
    const day = date.getDate().toString().padStart(2, "0"); // Gün (2 haneli)
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ay (2 haneli, 0 tabanlı olduğu için +1)
    const year = date.getFullYear(); // Yıl
    return `${day}/${month}/${year}`; // Gün/Ay/Yıl formatında döndür
  };

  // Google Calendar URL'si oluşturma
  const createGoogleCalendarLink = (reservation) => {
    const baseUrl = "https://calendar.google.com/calendar/render";

    // Başlangıç saatini ISO 8601 formatına dönüştür
    const startDateTime = `${reservation.lessonDate.replace(/-/g, "")}T${reservation.lessonTime.replace(
      ":",
      ""
    )}00`;

    // Bitiş saatini hesapla (1 saatlik ders varsayımı)
    const [hour, minute] = reservation.lessonTime.split(":").map(Number);
    const endHour = hour + 1; // 1 saat ekle
    const endDateTime = `${reservation.lessonDate.replace(/-/g, "")}T${endHour
      .toString()
      .padStart(2, "0")}${minute.toString().padStart(2, "0")}00`;

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Gitar Dersi - ${reservation.lessonType}`,
      dates: `${startDateTime}/${endDateTime}`,
      details: `Ad: ${reservation.name}\nE-posta: ${reservation.email}`,
      location: "Online",
    });

    return `${baseUrl}?${params.toString()}`;
  };

  // Zoom toplantısı oluşturmak için API isteği
  const createZoomMeeting = async ({ topic, lessonDate, lessonTime, duration }) => {
    try {
      const token = keycloak.token;
      if (!token) throw new Error("Token bulunamadı");
      const response = await fetch(`${config.API_BASE_URL}/api/zoom/meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          lessonDate,
          lessonTime,
          duration,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Zoom toplantısı oluşturulamadı");
      }
      const data = await response.json();
      return data; // Zoom toplantısı bilgileri
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return <div className="admin-panel">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="admin-panel">Hata: {error}</div>;
  }

  return (
    <> 
    <Header language={language} setLanguage={setLanguage} logout={logout} />
    <Subheader language={language} />

    <div className="admin-panel admin-white-frame">
    <h1>{language === 'tr' ? 'Admin Paneli' : 'Admin Page'}</h1>
    <div className="table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>{language === 'tr' ? 'Ad' : 'Name'}</th>
              <th>{language === 'tr' ? 'E-Posta' : 'E-Mail'}</th>
              <th>{language === 'tr' ? 'Ders Tipi' : 'Lesson Type'}</th>
              <th>{language === 'tr' ? 'Tarih' : 'Date'}</th>
              <th>{language === 'tr' ? 'Saat' : 'Time'}</th>
              <th>{language === 'tr' ? 'Zoom Linki' : 'Zoom Link'}</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.name}</td>
                <td>{reservation.email}</td>
                <td>{reservation.lessonType}</td>
                <td>{formatDate(reservation.lessonDate)}</td> {/* Tarih formatlandı */}
                <td>{reservation.lessonTime}</td>
                <td>
                  {reservation.zoomLink ? (
                    <a
                      href={reservation.zoomLink.startsWith('http') ? reservation.zoomLink : `https://${reservation.zoomLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => {
                        // Eğer link yoksa veya geçersizse tıklamayı engelle
                        if (!reservation.zoomLink || reservation.zoomLink === '#' || reservation.zoomLink === 'about:blank') {
                          e.preventDefault();
                        }
                      }}
                    >
                      {language === 'tr' ? 'Zoom Linki' : 'Zoom Link'}
                    </a>
                  ) : (
                    <span style={{ color: '#aaa' }}>{language === 'tr' ? 'Yok' : 'N/A'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </> 
  );
};

export default AdminPanel;