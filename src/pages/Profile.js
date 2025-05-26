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
  const [instruments, setInstruments] = useState([]);
  const [favoriteStyles, setFavoriteStyles] = useState([]);
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
      setInstruments(data.instruments || []);
      setFavoriteStyles(data.favoriteStyles || []);
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
    instruments,
    setInstruments,
    favoriteStyles,
    setFavoriteStyles,
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
    instruments,
    setInstruments,
    favoriteStyles,
    setFavoriteStyles,
    profileImage,
    setProfileImage,
    fetchProfile,
  } = useUserProfile(keycloak.token, setLoading, setError);

  const styleOptions = [
    language === "tr" ? "Rock" : "Rock",
    language === "tr" ? "Caz" : "Jazz",
    language === "tr" ? "Blues" : "Blues",
    language === "tr" ? "Metal" : "Metal",
    language === "tr" ? "Pop" : "Pop",
    language === "tr" ? "Klasik" : "Classical",
    language === "tr" ? "Funk" : "Funk",
    language === "tr" ? "Reggae" : "Reggae",
  ]; // Tarz seçenekleri

  const instrumentOptions = [
    language === "tr" ? "Gitar" : "Guitar",
    language === "tr" ? "Bas" : "Bass",
    language === "tr" ? "Davul" : "Drums",
    language === "tr" ? "Klavye" : "Keyboard",
    language === "tr" ? "Keman" : "Violin",
    language === "tr" ? "Saksafon" : "Saxophone",
    language === "tr" ? "Flüt" : "Flute",
    language === "tr" ? "Vokal" : "Vocals",
  ]; // Enstrüman seçenekleri

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
      instruments.length === 0 ||
      favoriteStyles.length === 0 ||
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
          instruments,
          favoriteStyles,
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


  const handleInstrumentToggle = (instrument) => {
    setInstruments((prev) =>
      prev.includes(instrument)
        ? prev.filter((item) => item !== instrument) // Seçiliyse kaldır
        : [...prev, instrument] // Seçili değilse ekle
    );
  };
  
  const handleStyleToggle = (style) => {
    setFavoriteStyles((prev) =>
      prev.includes(style)
        ? prev.filter((item) => item !== style) // Seçiliyse kaldır
        : [...prev, style] // Seçili değilse ekle
    );
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

        {/* Keycloak'tan gelen bilgiler */}
        {keycloakProfile && (
          <div className="profile-card">
            <h3>{language === "tr" ? "Keycloak Bilgileri" : "Keycloak Info"}</h3>
            <p>
              <strong>{language === "tr" ? "Kullanıcı Adı:" : "Username:"}</strong> {keycloakProfile.username}
            </p>
            <p>
              <strong>{language === "tr" ? "E-posta:" : "Email:"}</strong> {keycloakProfile.email}
            </p>
            <p>
              <strong>{language === "tr" ? "Ad:" : "First Name:"}</strong> {keycloakProfile.firstName}
            </p>
            <p>
              <strong>{language === "tr" ? "Soyad:" : "Last Name:"}</strong> {keycloakProfile.lastName}
            </p>
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
            <label>
              {language === "tr" ? "Enstrümanlar:" : "Instruments:"}
              <ul className="custom-multi-select">
                {instrumentOptions.map((instrument, index) => (
                  <li
                    key={index}
                    className={instruments.includes(instrument) ? "selected" : ""}
                    onClick={() => handleInstrumentToggle(instrument)}
                  >
                    {instrument}
                    {instruments.includes(instrument) && <span className="tick">✔</span>}
                  </li>
                ))}
              </ul>
            </label>
            <label>
              {language === "tr" ? "Favori Tarzlar:" : "Favorite Styles:"}
              <ul className="custom-multi-select">
                {styleOptions.map((style, index) => (
                  <li
                    key={index}
                    className={favoriteStyles.includes(style) ? "selected" : ""}
                    onClick={() => handleStyleToggle(style)}
                  >
                    {style}
                    {favoriteStyles.includes(style) && <span className="tick">✔</span>}
                  </li>
                ))}
              </ul>
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
            <div className="profile-card">
              <h3>{language === "tr" ? "Ad ve Soyad" : "Name and Surname"}</h3>
              <p>
                <strong>{language === "tr" ? "Ad:" : "First Name:"}</strong> {userData?.firstName || (language === "tr" ? "Belirtilmemiş" : "Not Specified")}
              </p>
              <p>
                <strong>{language === "tr" ? "Soyad:" : "Last Name:"}</strong> {userData?.lastName || (language === "tr" ? "Belirtilmemiş" : "Not Specified")}
              </p>
            </div>

            <div className="profile-card">
              <h3>{language === "tr" ? "Enstrümanlar" : "Instruments"}</h3>
              <ul className="profile-list">
                {userData?.instruments?.length > 0
                  ? userData.instruments.map((instrument, index) => (
                      <li key={index}>{instrument}</li>
                    ))
                  : <li>{language === "tr" ? "Belirtilmemiş" : "Not Specified"}</li>}
              </ul>
            </div>

            <div className="profile-card">
              <h3>{language === "tr" ? "Favori Tarzlar" : "Favorite Styles"}</h3>
              <ul className="profile-list">
                {userData?.favoriteStyles?.length > 0
                  ? userData.favoriteStyles.map((style, index) => (
                      <li key={index}>{style}</li>
                    ))
                  : <li>{language === "tr" ? "Belirtilmemiş" : "Not Specified"}</li>}
              </ul>
            </div>

            {/* Güncel Randevular Bölümü */}
            {reservations && reservations.length > 0 && (
              <div className="profile-card">
                <h3>{language === 'tr' ? 'Güncel Randevular' : 'Upcoming Reservations'}</h3>
                <table className="reservations-table" style={{width: '100%', color: '#fff', background: 'rgba(0,0,0,0.1)', borderRadius: '8px'}}>
                  <thead>
                    <tr>
                      <th>{language === 'tr' ? 'Ders Tipi' : 'Lesson Type'}</th>
                      <th>{language === 'tr' ? 'Tarih' : 'Date'}</th>
                      <th>{language === 'tr' ? 'Saat' : 'Time'}</th>
                      <th>{language === 'tr' ? 'Zoom Linki' : 'Zoom Link'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r._id}>
                        <td>{r.lessonType}</td>
                        <td>{r.lessonDate ? new Date(r.lessonDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US') : '-'}</td>
                        <td>{r.lessonTime}</td>
                        <td>
                          {r.zoomLink ? (
                            <a href={r.zoomLink.startsWith('http') ? r.zoomLink : `https://${r.zoomLink}`} target="_blank" rel="noopener noreferrer" style={{color:'#40db9a'}}>
                              {language === 'tr' ? 'Bağlantı' : 'Link'}
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