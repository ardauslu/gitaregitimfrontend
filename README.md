# 🎸 Guitar Learning Platform / Gitar Öğrenme Platformu

**EN** | A web application designed for guitar enthusiasts to improve their skills through interactive tools, personalized lessons, and creative utilities.

**TR** | Gitar öğrenmek isteyen kullanıcılar için interaktif araçlar, kişiselleştirilmiş dersler ve yaratıcı yardımcılar sunan bir web uygulamasıdır.

---

## 🚀 Features / Özellikler

- **🏠 Home / Ana Sayfa**  
  EN: Welcomes users and introduces platform features.  
  TR: Kullanıcıları karşılayan ve platformun özelliklerini tanıtan giriş sayfası.

- **ℹ️ About Me / Hakkımda Sayfası**  
  EN: Provides information about the platform's purpose and the developer.  
  TR: Platformun amacı ve geliştirici hakkında bilgi veren bir sayfa.

- **👤 Profile / Profil Sayfası**  
  EN: Users can update personal info and choose their favorite styles.  
  TR: Kullanıcıların kişisel bilgilerini düzenleyip favori tarzlarını seçebileceği alan.

- **🚪 The Entry Gate / Giriş Kapısı**  
  EN: Entry point for users starting their guitar journey.  
  TR: Kullanıcıların gitar yolculuğuna başladığı ve temel içeriklere eriştiği alan.

- **🔍 The Path of Discovery / Keşif Yolu**  
  EN: Intermediate learning modules and exercises.  
  TR: Orta seviye eğitim içeriklerinin bulunduğu alan.

- **🏔️ The Mastery Summit / Ustalık Zirvesi**  
  EN: Advanced lessons and mastery-level content.  
  TR: İleri seviye derslerin yer aldığı alan.

- **🎓 Your Lessons / Sizin Dersleriniz**  
  EN: Users can view and add personal lessons via YouTube URLs.  
  TR: YouTube URL’leri ile kullanıcıların kendi oluşturduğu dersleri görüntüleyip ekleyebileceği bölüm.

- **🌱 Technique Garden / Teknik Bahçesi**  
  EN: Practice-focused space to enhance playing skills.  
  TR: Pratik yaparak gitar becerilerini geliştirme alanı.

- **📆 Take Lesson / Ders Alma Sayfası**  
  EN: Users can book personalized guitar lessons.  
  TR: Gitar dersleri için rezervasyon yapılabilecek alan.

- **🎼 Riff Generator / Riff ve Akor Üretme Sayfası**  
  EN: A fun tool to create riffs and chords with visual fretboard support.  
  TR: Riff ve akor üretimi yapabileceğiniz, klavye görseli ile destekli eğlenceli alan.

- **⏱️ Metronome / Metronom**  
  EN: Interactive metronome for timing and rhythm practice.  
  TR: Zamanlama ve ritim pratikleri için kullanılabilecek metronom aracı.

---

## 🛠️ Technologies Used / Kullanılan Teknolojiler

### ⚛️ React.js  
- **EN**: For building the user interface with functional components and hooks.  
- **TR**: Kullanıcı arayüzünü oluşturmak için fonksiyonel bileşenler ve hook’larla kullanıldı.  
  - React Hooks (`useState`, `useEffect`, `useContext`)  
  - Context API (`LanguageContext`, `AuthContext`)

### 🎞️ Framer Motion  
- **EN**: For animations and smooth page transitions.  
- **TR**: Animasyonlar ve geçişler için kullanıldı.  
  - `motion.div`, `AnimatePresence`  
  - `initial`, `animate`, `exit` states

### 🧭 React Router  
- **EN**: For routing between pages.  
- **TR**: Sayfalar arası yönlendirme ve rota yönetimi için kullanıldı.  
  - Dynamic Routes (`/about-me`, `/your-lessons`)  
  - `useNavigate`

### 🎨 CSS  
- **EN**: For responsive and visually appealing styles.  
- **TR**: Uygulamanın stilini ve duyarlı tasarımını oluşturmak için kullanıldı.  
  - Gradient backgrounds  
  - Hover and transition effects

### 🔠 Google Fonts  
- **EN**: For custom typography.  
- **TR**: Özel yazı tipi kullanımı için.  
  - Roboto & Montserrat (`400`, `500`, `700` weights)

### 🌐 Backend API  
- **EN**: RESTful API for data handling and authentication.  
- **TR**: Kullanıcı verileri ve kimlik doğrulama işlemleri için REST API.  
  - Bearer Token authentication  
  - CRUD operations for user profiles and lessons

---

## 🧾 Installation / Kurulum

```bash
# 1. Clone the repository / Repoyu klonlayın
git clone https://github.com/kullaniciadi/proje-adi.git
cd proje-adi

# 2. Install dependencies / Bağımlılıkları yükleyin
npm install

# 3. Start the development server / Geliştirme sunucusunu başlatın
npm start
