import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression"; // Sıkıştırma kütüphanesi
import "./Profile.css";
import Layout from "../components/Layout"; // Layout bileşeni
const Profile = () => {
  const [userData, setUserData] = useState(null); // Kullanıcı verilerini tutar
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [instrument, setInstrument] = useState("");
  const [favoriteStyles, setFavoriteStyles] = useState("");
  const [profileImage, setProfileImage] = useState(null); // Base64 formatında profil resmi
  const [loading, setLoading] = useState(true); // Yüklenme durumu
  const [error, setError] = useState(null); // Hata durumu

  // Profil bilgilerini API'den çek
  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token eklenir
        },
      });

      if (!response.ok) {
        throw new Error("Profil bilgileri alınamadı.");
      }

      const data = await response.json();
      setUserData(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setInstrument(data.instrument || "");
      setFavoriteStyles(data.favoriteStyles || "");
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
        // Resmi sıkıştırma ayarları
        const options = {
          maxSizeMB: 0.05, // Maksimum boyut 100KB
          maxWidthOrHeight: 800, // Maksimum genişlik veya yükseklik
          useWebWorker: true, // Performans için Web Worker kullan
        };

        const compressedFile = await imageCompression(file, options); // Resmi sıkıştır
        const reader = new FileReader();

        reader.onloadend = () => {
          setProfileImage(reader.result); // Base64 formatında resmi saklayın
        };

        reader.readAsDataURL(compressedFile); // Sıkıştırılmış dosyayı okuyun
      } catch (err) {
        console.error("Resim sıkıştırma hatası:", err);
        alert("Resim sıkıştırılamadı. Lütfen başka bir resim seçin.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token'ı ekleyin
        },
        body: JSON.stringify({
          firstName,
          lastName,
          instrument,
          favoriteStyles,
          profileImage, // Base64 formatındaki resmi gönderin
        }),
      });

      if (response.ok) {
        alert("Profil bilgileri başarıyla güncellendi!");
        fetchProfile(); // Güncellenmiş bilgileri tekrar yükle
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
    fetchProfile(); // Bilgileri yeniden yükle
    setIsEditing(false);
  };

  if (loading) {
    return <div className="profile-page">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="profile-page">Hata: {error}</div>;
  }

  return (
    <Layout>
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-image-container">
          <img
            src={
              profileImage
                ? profileImage
                : "https://via.placeholder.com/150"
            }
            alt="Profil Resmi"
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
              Ad:
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label>
              Soyad:
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <label>
              Enstrüman:
              <input
                type="text"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
              />
            </label>
            <label>
              Favori Tarzlar:
              <input
                type="text"
                value={favoriteStyles}
                onChange={(e) => setFavoriteStyles(e.target.value)}
              />
            </label>
            <div className="profile-buttons">
              <button type="submit" className="save-button">
                Kaydet
              </button>
              <button type="button" onClick={handleCancel} className="cancel-button">
                İptal
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <p><strong>Ad:</strong> {userData.firstName}</p>
            <p><strong>Soyad:</strong> {userData.lastName}</p>
            <p><strong>Enstrüman:</strong> {userData.instrument || "Belirtilmemiş"}</p>
            <p><strong>Favori Tarzlar:</strong> {userData.favoriteStyles || "Belirtilmemiş"}</p>
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Düzenle
            </button>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default Profile;