import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import "./Profile.css";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import config from "../config";
const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [instruments, setInstruments] = useState([]); // Çoklu seçim için enstrümanlar
  const [favoriteStyles, setFavoriteStyles] = useState([]); // Çoklu seçim için tarzlar
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const [language, setLanguage] = useState("tr");
  const navigate = useNavigate();

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

  const fetchProfile = async () => {
    try {
       const response = await fetch(`${config.API_BASE_URL}/api/users/profile`, {
                method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Profil bilgileri alınamadı.");
      }

      const data = await response.json();
      setUserData(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setInstruments(data.instruments || []);
      setFavoriteStyles(data.favoriteStyles || []);
      setProfileImage(data.profileImage || null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
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
        console.error("Resim sıkıştırma hatası:", err);
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          instruments, // Çoklu seçim enstrümanlar
          favoriteStyles, // Çoklu seçim tarzlar
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
      console.error("Hata:", err.message);
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

      <button onClick={() => setIsEditing(true)} className="edit-button">
        {language === "tr" ? "Düzenle" : "Edit"}
      </button>
    </>
  )}
</div>
      </div>
    </div>
  );
};

export default Profile;