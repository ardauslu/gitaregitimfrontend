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

## Kullanılan Teknolojiler

- **React.js**: Kullanıcı arayüzünü oluşturmak için kullanılan JavaScript kütüphanesi.
- **Framer Motion**: Sayfa geçişleri ve animasyonlar için kullanılan kütüphane.
- **CSS**: Uygulamanın stilini oluşturmak için kullanılan stil dili.
- **React Router**: Sayfa yönlendirmeleri için kullanılan kütüphane.
- **Google Fonts**: Yazı tipleri için kullanılan harici kaynak.

---

## Proje Yapısı

### 1. **Ana Sayfa (Home)**

- **Dosya**: `src/pages/Home.js`
- **CSS**: `src/Home.css`
- **Açıklama**: Kullanıcıları karşılayan bir giriş sayfasıdır. Framer Motion kullanılarak sayfa geçiş animasyonları eklenmiştir. Kullanıcılar buradan "Hakkımda" sayfasına yönlendirilebilir.

### 2. **Hakkımda Sayfası (About Me)**

- **Dosya**: `src/pages/AboutMe.js`
- **CSS**: `src/pages/AboutMe.css`
- **Açıklama**: Kullanıcıya platformun amacı ve geliştirici hakkında bilgi veren bir sayfadır. Arka planda animasyonlu bir gradyan efekt bulunmaktadır.

### 3. **Profil Sayfası (Profile)**

- **Dosya**: `src/pages/Profile.js`
- **CSS**: `src/pages/Profile.css`
- **Açıklama**: Kullanıcıların kişisel bilgilerini düzenleyebileceği bir alandır. Kullanıcılar ad, soyad, favori tarzlar ve enstrümanlar gibi bilgileri güncelleyebilir.

### 4. **Dersler Sayfası (Your Lessons)**

- **Dosya**: `src/pages/YourLessons.js`
- **CSS**: `src/pages/YourLessons.css`
- **Açıklama**: Kullanıcıların mevcut derslerini görüntüleyebileceği ve yeni dersler ekleyebileceği bir alandır. Modern bir tasarım ve gradyan arka plan kullanılmıştır.

### 5. **Ders Alma Sayfası (Take Lesson)**

- **Dosya**: `src/pages/TakeLesson.js`
- **CSS**: `src/pages/TakeLesson.css`
- **Açıklama**: Kullanıcıların gitar dersleri için rezervasyon yapabileceği bir alandır. Form alanları ve butonlar modern bir tasarıma sahiptir.

---

## Kurulum

1. **Projeyi Klonlayın**:
   ```bash
   git clone https://github.com/kullaniciadi/proje-adi.git
   cd proje-adi
