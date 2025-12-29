import React, { useState, useEffect, useCallback } from "react";
import imageCompression from "browser-image-compression";
import "./Profile.css";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";
import keycloak from "../keycloak";

// Custom hook for fetching user profile
const useUserProfile = (token, setLoading, setError) => {
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Profil bilgileri alınamadı.");
      const data = await response.json();
      setUserData(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setProfileImage(data.profileImage || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError]);

  return {
    userData,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    profileImage,
    setProfileImage,
    fetchProfile,
  };
};

const Profile = () => {
  const [keycloakProfile, setKeycloakProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const { isAuthenticated, logout: keycloakLogout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  // Use extracted profile hook
  const {
    userData,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    profileImage,
    setProfileImage,
    fetchProfile,
  } = useUserProfile(keycloak.token, setLoading, setError);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Keycloak profilini çek
  useEffect(() => {
    if (keycloak.authenticated) {
      keycloak.loadUserProfile().then(profile => setKeycloakProfile(profile));
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [fetchProfile]);

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/users/my`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        if (!response.ok) throw new Error('Randevular alınamadı');
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setReservations([]);
      }
    };
    if (keycloak.token) fetchReservations();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const options = {
          maxSizeMB: 0.05,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();

        reader.onloadend = () => {
          setProfileImage(reader.result);
        };

        reader.readAsDataURL(compressedFile);
      } catch (err) {
        alert("Resim sıkıştırılamadı. Lütfen başka bir resim seçin.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Tüm alanların doldurulup doldurulmadığını kontrol et
    if (
      !firstName ||
      !lastName ||
      !profileImage
    ) {
      alert(language === "tr" ? "Lütfen tüm alanları doldurun!" : "Please fill in all fields!");
      return;
    }
  
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          profileImage,
        }),
      });
  
      if (response.ok) {
        alert(language === "tr" ? "Profil bilgileri başarıyla güncellendi!" : "Profile updated successfully!");
        fetchProfile();
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Profil güncellenemedi.");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
  };

  const logout = useCallback(() => {
    keycloakLogout({ redirectUri: config.LOGOUT_REDIRECT_URI });
  }, [keycloakLogout]);

  if (loading) {
    return <div className="profile-page">{language === "tr" ? "Yükleniyor..." : "Loading..."}</div>;
  }

  if (error) {
    return <div className="profile-page">{language === "tr" ? `Hata: ${error}` : `Error: ${error}`}</div>;
  }

return (
  <div>
    <Header language={language} setLanguage={setLanguage} logout={logout} />
    <Subheader language={language} />

    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-image-container">
          <img
            src={profileImage ? profileImage : "https://via.placeholder.com/150"}
            alt={language === "tr" ? "Profil Resmi" : "Profile Image"}
            className="profile-image"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="profile-image-input"
            />
          )}
        </div>

        {/* Keycloak'tan gelen bilgiler - Modern Card Design */}
        {keycloakProfile && (
          <div className="reservations-section">
            <h3 className="reservations-title">
              <i className="fas fa-user-circle"></i>
              {language === "tr" ? "Bilgiler" : "Information"}
            </h3>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-user"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">{language === "tr" ? "Kullanıcı Adı" : "Username"}</span>
                  <span className="info-value">{keycloakProfile.username}</span>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">{language === "tr" ? "E-posta" : "Email"}</span>
                  <span className="info-value">{keycloakProfile.email}</span>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-id-card"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">{language === "tr" ? "Ad" : "First Name"}</span>
                  <span className="info-value">{keycloakProfile.firstName}</span>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-id-badge"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">{language === "tr" ? "Soyad" : "Last Name"}</span>
                  <span className="info-value">{keycloakProfile.lastName}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <label>
              {language === "tr" ? "Ad:" : "First Name:"}
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label>
              {language === "tr" ? "Soyad:" : "Last Name:"}
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <div className="profile-buttons">
              <button type="submit" className="save-button">
                {language === "tr" ? "Kaydet" : "Save"}
              </button>
              <button type="button" onClick={handleCancel} className="cancel-button">
                {language === "tr" ? "İptal" : "Cancel"}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Güncel Randevular Bölümü - Modern Card Design */}
            {reservations && reservations.length > 0 && (
              <div className="reservations-section">
                <h3 className="reservations-title">
                  <i className="fas fa-calendar-alt"></i>
                  {language === 'tr' ? 'Güncel Randevular' : 'Upcoming Reservations'}
                </h3>
                <div className="reservations-grid">
                  {reservations.map((r) => (
                    <div key={r._id} className="reservation-card">
                      <div className="reservation-header">
                        <div className="lesson-type-badge">
                          <i className="fas fa-guitar"></i>
                          <span>{r.lessonType}</span>
                        </div>
                        {r.zoomLink && (
                          <a 
                            href={r.zoomLink.startsWith('http') ? r.zoomLink : `https://${r.zoomLink}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="zoom-link-badge"
                          >
                            <i className="fas fa-video"></i>
                            {language === 'tr' ? 'Derse Katıl' : 'Join Lesson'}
                          </a>
                        )}
                      </div>
                      
                      <div className="reservation-details">
                        <div className="reservation-detail-item">
                          <i className="fas fa-calendar"></i>
                          <div>
                            <span className="detail-label">{language === 'tr' ? 'Tarih' : 'Date'}</span>
                            <span className="detail-value">
                              {r.lessonDate ? new Date(r.lessonDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : '-'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="reservation-detail-item">
                          <i className="fas fa-clock"></i>
                          <div>
                            <span className="detail-label">{language === 'tr' ? 'Saat' : 'Time'}</span>
                            <span className="detail-value">{r.lessonTime}</span>
                          </div>
                        </div>
                      </div>

                      {!r.zoomLink && (
                        <div className="no-zoom-notice">
                          <i className="fas fa-info-circle"></i>
                          <span>{language === 'tr' ? 'Zoom linki yakında gönderilecektir' : 'Zoom link will be sent soon'}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setIsEditing(true)} className="edit-button">
              {language === "tr" ? "Düzenle" : "Edit"}
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);

}

export default Profile;