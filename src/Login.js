import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Giriş başarılı, kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem('username', username);
        localStorage.setItem('token', data.token); // Örneğin, bir token dönerse kaydedebilirsiniz
        navigate('/home'); // Home sayfasına yönlendir
      } else {
        setError('Geçersiz kullanıcı adı veya şifre');
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Giriş Yap</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px', margin: '5px' }}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', margin: '5px' }}
        />
      </div>
      <div>
        <button onClick={handleLogin} style={{ padding: '10px 20px', marginTop: '10px' }}>
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

export default Login;