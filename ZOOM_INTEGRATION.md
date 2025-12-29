# 🎥 Zoom Integration Guide

## Zoom API Credentials
```
zoom.client.id=cO6EYeG7Q3qUfqpLEL2lBA
zoom.client.secret=pDHV5iUQXaCO5B5GMsri7A7R2oQrkbWj
zoom.account.id=zaduqfwLSNmC2LLNwIHT5w
zoom.redirect.uri=http://localhost:8080/api/zoom/callback
```

## Backend Requirements

### 1. Environment Variables (.env)
Backend'de şu environment variable'ları ekleyin:
```bash
ZOOM_CLIENT_ID=cO6EYeG7Q3qUfqpLEL2lBA
ZOOM_CLIENT_SECRET=pDHV5iUQXaCO5B5GMsri7A7R2oQrkbWj
ZOOM_ACCOUNT_ID=zaduqfwLSNmC2LLNwIHT5w
ZOOM_REDIRECT_URI=http://localhost:8080/api/zoom/callback
```

### 2. Zoom API Endpoint (Backend)
**Endpoint:** `POST /api/zoom/meeting`

**Request Body:**
```json
{
  "topic": "Gitar Eğitimi",
  "lessonDate": "2025-12-30",
  "lessonTime": "15:00",
  "duration": 60
}
```

**Expected Response:**
```json
{
  "id": "123456789",
  "join_url": "https://zoom.us/j/123456789?pwd=xxxxx",
  "start_url": "https://zoom.us/s/123456789?zak=xxxxx",
  "topic": "Gitar Eğitimi",
  "start_time": "2025-12-30T15:00:00Z"
}
```

### 3. Backend Implementation (Node.js/Express Example)

#### Install Dependencies
```bash
npm install axios
```

#### Zoom Service (`services/zoomService.js`)
```javascript
const axios = require('axios');

class ZoomService {
  constructor() {
    this.clientId = process.env.ZOOM_CLIENT_ID;
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET;
    this.accountId = process.env.ZOOM_ACCOUNT_ID;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Server-to-Server OAuth Token
  async getAccessToken() {
    try {
      // Token hala geçerliyse yeniden alma
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${this.accountId}`,
        {},
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Token 1 saat geçerli, 5 dakika önce yenile
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
      
      console.log('Zoom access token alındı');
      return this.accessToken;
    } catch (error) {
      console.error('Zoom token hatası:', error.response?.data || error.message);
      throw new Error('Zoom authentication failed');
    }
  }

  // Toplantı oluştur
  async createMeeting({ topic, lessonDate, lessonTime, duration = 60 }) {
    try {
      const token = await this.getAccessToken();
      
      // ISO 8601 format: "2025-12-30T15:00:00Z"
      const startTime = `${lessonDate}T${lessonTime}:00`;
      
      const meetingData = {
        topic: topic || 'Gitar Eğitimi',
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration: duration,
        timezone: 'Europe/Istanbul',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          audio: 'both',
          auto_recording: 'none',
          waiting_room: true
        }
      };

      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        meetingData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Zoom meeting oluşturuldu:', response.data.id);
      return {
        id: response.data.id,
        join_url: response.data.join_url,
        start_url: response.data.start_url,
        topic: response.data.topic,
        start_time: response.data.start_time
      };
    } catch (error) {
      console.error('Zoom meeting oluşturma hatası:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create Zoom meeting');
    }
  }
}

module.exports = new ZoomService();
```

#### Zoom Routes (`routes/zoom.js`)
```javascript
const express = require('express');
const router = express.Router();
const zoomService = require('../services/zoomService');
const { authenticate } = require('../middleware/auth');

// Create Zoom Meeting
router.post('/meeting', authenticate, async (req, res) => {
  try {
    const { topic, lessonDate, lessonTime, duration } = req.body;

    if (!lessonDate || !lessonTime) {
      return res.status(400).json({ 
        error: 'lessonDate and lessonTime are required' 
      });
    }

    const meeting = await zoomService.createMeeting({
      topic,
      lessonDate,
      lessonTime,
      duration
    });

    res.json(meeting);
  } catch (error) {
    console.error('Zoom API error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create Zoom meeting' 
    });
  }
});

module.exports = router;
```

#### Main App (`app.js`)
```javascript
const zoomRoutes = require('./routes/zoom');
app.use('/api/zoom', zoomRoutes);
```

### 4. Reservation Route Update (`routes/reservations.js`)
```javascript
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const zoomService = require('../services/zoomService');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, async (req, res) => {
  try {
    const { topic, lessonDate, lessonTime, duration, name, email, lessonType } = req.body;

    // 1. Zoom toplantısı oluştur
    let zoomLink = null;
    try {
      const meeting = await zoomService.createMeeting({
        topic: topic || 'Gitar Eğitimi',
        lessonDate,
        lessonTime,
        duration: duration || 60
      });
      zoomLink = meeting.join_url;
    } catch (zoomError) {
      console.error('Zoom oluşturulamadı, rezervasyon devam ediyor:', zoomError);
      // Zoom başarısız olsa bile rezervasyonu kaydet
    }

    // 2. Rezervasyonu kaydet
    const reservation = new Reservation({
      name,
      email,
      lessonType,
      lessonDate,
      lessonTime,
      zoomLink,
      user: req.user.id
    });

    await reservation.save();

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: {
        _id: reservation._id,
        name: reservation.name,
        email: reservation.email,
        lessonType: reservation.lessonType,
        lessonDate: reservation.lessonDate,
        lessonTime: reservation.lessonTime,
        zoomLink: reservation.zoomLink
      }
    });
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create reservation' 
    });
  }
});

// Get all reservations (Admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ lessonDate: -1, lessonTime: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

module.exports = router;
```

### 5. Reservation Model (`models/Reservation.js`)
```javascript
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  lessonType: { type: String, required: true },
  lessonDate: { type: String, required: true },
  lessonTime: { type: String, required: true },
  zoomLink: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);
```

## Testing

### 1. Test Zoom Token
```bash
curl -X POST "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=zaduqfwLSNmC2LLNwIHT5w" \
  -H "Authorization: Basic $(echo -n 'cO6EYeG7Q3qUfqpLEL2lBA:pDHV5iUQXaCO5B5GMsri7A7R2oQrkbWj' | base64)"
```

### 2. Test Meeting Creation
```bash
curl -X POST "http://localhost:8080/api/zoom/meeting" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_KEYCLOAK_TOKEN" \
  -d '{
    "topic": "Test Meeting",
    "lessonDate": "2025-12-30",
    "lessonTime": "15:00",
    "duration": 60
  }'
```

### 3. Test Reservation
```bash
curl -X POST "http://localhost:8080/api/reservations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_KEYCLOAK_TOKEN" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "lessonType": "beginner",
    "lessonDate": "2025-12-30",
    "lessonTime": "15:00",
    "topic": "Gitar Eğitimi",
    "duration": 60
  }'
```

## Common Issues

### 1. "Invalid access token"
- Token'ın süresi dolmuş olabilir
- Server-to-Server OAuth kullandığınızdan emin olun
- `account_id` doğru olmalı

### 2. "Meeting not created"
- Zoom hesabınızın meeting oluşturma yetkisi olmalı
- API rate limit'e takılmış olabilirsiniz (100 req/day free plan)
- Timezone formatını kontrol edin

### 3. "CORS Error"
- Backend'de CORS ayarlarını kontrol edin
- Frontend ve backend URL'lerinin doğru olduğundan emin olun

### 4. Frontend Error Handling
Artık frontend şu şekilde hata mesajları gösteriyor:
- Console'da detaylı error log
- Kullanıcıya anlamlı hata mesajı
- Zoom linki oluşturulamamış olsa bile rezervasyon kaydediliyor

## Frontend Changes
✅ Improved error handling in TakeLesson.js
✅ Improved error handling in AdminPanel.js
✅ Console logging for debugging
✅ Graceful fallback when Zoom link creation fails

## Next Steps
1. Backend'de `services/zoomService.js` dosyasını oluşturun
2. Backend'de `routes/zoom.js` dosyasını oluşturun
3. Environment variables'ları backend .env'e ekleyin
4. Zoom API'yi test edin
5. Frontend'den rezervasyon yaparak test edin
