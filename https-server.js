const handler = require('serve-handler');
const https = require('https');
const fs = require('fs');

// Sertifika dosyalarını okuyun
const sslOptions = {
  key: fs.readFileSync('key.pem'), // Özel anahtar dosyası
  cert: fs.readFileSync('cert.pem'), // Sertifika dosyası
};

// HTTPS sunucusunu başlatın
https.createServer(sslOptions, (req, res) => {
  return handler(req, res, {
    public: './build', // React build klasörünü belirtin
  });
}).listen(5001, () => {
  console.log('HTTPS sunucu 5001 portunda çalışıyor');
});