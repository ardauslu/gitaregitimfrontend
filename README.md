# Guitar Learning Platform 🎸

Bu proje, gitar öğrenmek isteyen kullanıcılar için özel olarak tasarlanmış bir web uygulamasıdır. Kullanıcılar riff oluşturucular, kişiselleştirilmiş dersler ve ton laboratuvarları gibi araçlarla gitar becerilerini geliştirebilir.

## Özellikler

- 🎵 **Ana Sayfa (Home)**: Kullanıcıları karşılayan ve platformun özelliklerini tanıtan bir giriş sayfası.
- 📖 **Hakkımda Sayfası (About Me)**: Platformun amacı ve geliştirici hakkında bilgi veren bir sayfa.
- 👤 **Profil Sayfası (Profile)**: Kullanıcıların kişisel bilgilerini düzenleyebileceği ve favori tarzlarını seçebileceği bir alan.
- 📚 **Giriş Kapısı (The Entry Gate)**: Kullanıcıların gitar yolculuğuna başladığı ve eğitim içeriklerini görüntüleyebileceği bir alan.
- 📚 **Keşif Yolu (The Path of Discovery)**: Kullanıcıların gitar yolculuğuna devam ettiği ve eğitim içeriklerini görüntüleyebileceği bir alan.
- 📚 **Ustalık Zirvesi (The Mastery Summit)**: Kullanıcıların gitar yolculuğunda ustalık seviyesi dersleri incelediği ve eğitim içeriklerini görüntüleyebileceği bir alan.
- 📚 **Sizin Dersleriniz Sayfası (Your Lessons)**: Kullanıcıların youtube url'leri ile kendi oluşturduğu derslerini görüntüleyebileceği ve yeni dersler ekleyebileceği bir alan.
- 📚 **Teknik Bahçesi (The Technique Garden)**: Kullanıcıların pratik ile gitar çalma becerilerini geliştirdiği bir alan.
- 🎸 **Ders Alma Sayfası (Take Lesson)**: Kullanıcıların gitar dersleri için rezervasyon yapabileceği bir alan.
- 🎸 **Riff ve Akor Üretme Sayfası (Riff Generator )**: Kullanıcıların Riff Üretici ile riff ve akor üretip klavye görseli ile çalışmak için kendilerine eğlenceli bir alan.
- 🎸 **Metronom (Metronome )**: Kullanıcıların metronom ile pratik yapabileceği bir alan.
---

## Kullanılan Teknolojiler ve Detaylar

### 1. **React.js**
- **Kullanım Amacı**: Kullanıcı arayüzünü oluşturmak için kullanıldı.
- **Özellikler**:
  - **Fonksiyonel Bileşenler**: Tüm bileşenler fonksiyonel olarak yazılmıştır.
  - **React Hooks**: `useState`, `useEffect`, `useContext` gibi hook'lar kullanılarak state yönetimi ve yan etkiler kontrol edilmiştir.
  - **Context API**: Dil seçimi (`LanguageContext`) ve kimlik doğrulama (`AuthContext`) gibi global durumlar için kullanılmıştır.

### 2. **Framer Motion**
- **Kullanım Amacı**: Sayfa geçişleri ve animasyonlar için kullanıldı.
- **Özellikler**:
  - **`motion.div`**: Sayfa ve bileşen animasyonları için kullanıldı.
  - **`AnimatePresence`**: Sayfa geçişlerinde çıkış animasyonlarını etkinleştirmek için kullanıldı.
  - **Geçişler**: `initial`, `animate`, ve `exit` durumları ile animasyonlar tanımlandı.

### 3. **React Router**
- **Kullanım Amacı**: Sayfa yönlendirmeleri ve dinamik rotalar için kullanıldı.
- **Özellikler**:
  - **`useNavigate`**: Sayfalar arasında programatik geçişler için kullanıldı.
  - **Dinamik Rotalar**: Örneğin, `/about-me` ve `/your-lessons` gibi rotalar tanımlandı.

### 4. **CSS**
- **Kullanım Amacı**: Uygulamanın stilini oluşturmak için kullanıldı.
- **Özellikler**:
  - **Responsive Tasarım**: Mobil ve masaüstü cihazlar için optimize edilmiş tasarım.
  - **Gradyan Arka Planlar**: Modern bir görünüm için gradyan arka planlar kullanıldı.
  - **Hover ve Geçiş Efektleri**: Butonlar ve görseller için hover efektleri eklendi.

### 5. **Google Fonts**
- **Kullanım Amacı**: Yazı tiplerini özelleştirmek için kullanıldı.
- **Özellikler**:
  - **Roboto** ve **Montserrat** yazı tipleri kullanıldı.
  - Başlıklar ve metinler için farklı ağırlıklar (`400`, `500`, `700`) tanımlandı.

### 6. **Backend API**
- **Kullanım Amacı**: Kullanıcı verilerini almak ve güncellemek için RESTful API kullanıldı.
- **Özellikler**:
  - **Kimlik Doğrulama**: `Bearer Token` ile güvenli API çağrıları yapıldı.
  - **CRUD İşlemleri**: Kullanıcı profili ve ders bilgileri için `GET`, `POST`, `PUT` ve `DELETE` işlemleri gerçekleştirildi.

---


## Kurulum

1. **Projeyi Klonlayın**:
   ```bash
   git clone https://github.com/kullaniciadi/proje-adi.git
   cd proje-adi
