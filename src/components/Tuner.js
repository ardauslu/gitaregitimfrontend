import React, { useState, useEffect, useRef } from 'react';
import './Tuner.css';
import { useLanguage } from '../contexts/LanguageContext';
import Header from './Header';
import Subheader from './Subheader';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Tuner = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [cents, setCents] = useState(0);
  const [closestString, setClosestString] = useState('');
  const [selectedTuning, setSelectedTuning] = useState('standard');
  const [inputSource, setInputSource] = useState('microphone');
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [gain, setGain] = useState(1);
  const [channelCount, setChannelCount] = useState(1);
  const [audioMode, setAudioMode] = useState('stereo'); // 'mono' veya 'stereo'
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const gainNodeRef = useRef(null);
  const splitterRef = useRef(null);
  const lastSoundTimeRef = useRef(Date.now());

  // Farklı akort dizilimleri
  const tunings = {
    standard: {
      name: language === 'tr' ? 'Standart (E A D G B E)' : 'Standard (E A D G B E)',
      strings: [
        { name: 'E', note: 'E', octave: 2, frequency: 82.41, string: language === 'tr' ? '6. Tel (E)' : '6th String (E)' },
        { name: 'A', note: 'A', octave: 2, frequency: 110.00, string: language === 'tr' ? '5. Tel (A)' : '5th String (A)' },
        { name: 'D', note: 'D', octave: 3, frequency: 146.83, string: language === 'tr' ? '4. Tel (D)' : '4th String (D)' },
        { name: 'G', note: 'G', octave: 3, frequency: 196.00, string: language === 'tr' ? '3. Tel (G)' : '3rd String (G)' },
        { name: 'B', note: 'B', octave: 3, frequency: 246.94, string: language === 'tr' ? '2. Tel (B)' : '2nd String (B)' },
        { name: 'E', note: 'E', octave: 4, frequency: 329.63, string: language === 'tr' ? '1. Tel (E)' : '1st String (E)' }
      ]
    },
    dropD: {
      name: language === 'tr' ? 'Drop D (D A D G B E)' : 'Drop D (D A D G B E)',
      strings: [
        { name: 'D', note: 'D', octave: 2, frequency: 73.42, string: language === 'tr' ? '6. Tel (D)' : '6th String (D)' },
        { name: 'A', note: 'A', octave: 2, frequency: 110.00, string: language === 'tr' ? '5. Tel (A)' : '5th String (A)' },
        { name: 'D', note: 'D', octave: 3, frequency: 146.83, string: language === 'tr' ? '4. Tel (D)' : '4th String (D)' },
        { name: 'G', note: 'G', octave: 3, frequency: 196.00, string: language === 'tr' ? '3. Tel (G)' : '3rd String (G)' },
        { name: 'B', note: 'B', octave: 3, frequency: 246.94, string: language === 'tr' ? '2. Tel (B)' : '2nd String (B)' },
        { name: 'E', note: 'E', octave: 4, frequency: 329.63, string: language === 'tr' ? '1. Tel (E)' : '1st String (E)' }
      ]
    },
    halfStepDown: {
      name: language === 'tr' ? 'Yarım Ton Aşağı (Eb Ab Db Gb Bb Eb)' : 'Half Step Down (Eb Ab Db Gb Bb Eb)',
      strings: [
        { name: 'Eb', note: 'Eb', octave: 2, frequency: 77.78, string: language === 'tr' ? '6. Tel (Eb)' : '6th String (Eb)' },
        { name: 'Ab', note: 'Ab', octave: 2, frequency: 103.83, string: language === 'tr' ? '5. Tel (Ab)' : '5th String (Ab)' },
        { name: 'Db', note: 'Db', octave: 3, frequency: 138.59, string: language === 'tr' ? '4. Tel (Db)' : '4th String (Db)' },
        { name: 'Gb', note: 'Gb', octave: 3, frequency: 185.00, string: language === 'tr' ? '3. Tel (Gb)' : '3rd String (Gb)' },
        { name: 'Bb', note: 'Bb', octave: 3, frequency: 233.08, string: language === 'tr' ? '2. Tel (Bb)' : '2nd String (Bb)' },
        { name: 'Eb', note: 'Eb', octave: 4, frequency: 311.13, string: language === 'tr' ? '1. Tel (Eb)' : '1st String (Eb)' }
      ]
    },
    fullStepDown: {
      name: language === 'tr' ? 'Tam Ton Aşağı (D G C F A D)' : 'Full Step Down (D G C F A D)',
      strings: [
        { name: 'D', note: 'D', octave: 2, frequency: 73.42, string: language === 'tr' ? '6. Tel (D)' : '6th String (D)' },
        { name: 'G', note: 'G', octave: 2, frequency: 98.00, string: language === 'tr' ? '5. Tel (G)' : '5th String (G)' },
        { name: 'C', note: 'C', octave: 3, frequency: 130.81, string: language === 'tr' ? '4. Tel (C)' : '4th String (C)' },
        { name: 'F', note: 'F', octave: 3, frequency: 174.61, string: language === 'tr' ? '3. Tel (F)' : '3rd String (F)' },
        { name: 'A', note: 'A', octave: 3, frequency: 220.00, string: language === 'tr' ? '2. Tel (A)' : '2nd String (A)' },
        { name: 'D', note: 'D', octave: 4, frequency: 293.66, string: language === 'tr' ? '1. Tel (D)' : '1st String (D)' }
      ]
    },
    dadgad: {
      name: 'DADGAD',
      strings: [
        { name: 'D', note: 'D', octave: 2, frequency: 73.42, string: language === 'tr' ? '6. Tel (D)' : '6th String (D)' },
        { name: 'A', note: 'A', octave: 2, frequency: 110.00, string: language === 'tr' ? '5. Tel (A)' : '5th String (A)' },
        { name: 'D', note: 'D', octave: 3, frequency: 146.83, string: language === 'tr' ? '4. Tel (D)' : '4th String (D)' },
        { name: 'G', note: 'G', octave: 3, frequency: 196.00, string: language === 'tr' ? '3. Tel (G)' : '3rd String (G)' },
        { name: 'A', note: 'A', octave: 3, frequency: 220.00, string: language === 'tr' ? '2. Tel (A)' : '2nd String (A)' },
        { name: 'D', note: 'D', octave: 4, frequency: 293.66, string: language === 'tr' ? '1. Tel (D)' : '1st String (D)' }
      ]
    },
    openG: {
      name: language === 'tr' ? 'Açık G (D G D G B D)' : 'Open G (D G D G B D)',
      strings: [
        { name: 'D', note: 'D', octave: 2, frequency: 73.42, string: language === 'tr' ? '6. Tel (D)' : '6th String (D)' },
        { name: 'G', note: 'G', octave: 2, frequency: 98.00, string: language === 'tr' ? '5. Tel (G)' : '5th String (G)' },
        { name: 'D', note: 'D', octave: 3, frequency: 146.83, string: language === 'tr' ? '4. Tel (D)' : '4th String (D)' },
        { name: 'G', note: 'G', octave: 3, frequency: 196.00, string: language === 'tr' ? '3. Tel (G)' : '3rd String (G)' },
        { name: 'B', note: 'B', octave: 3, frequency: 246.94, string: language === 'tr' ? '2. Tel (B)' : '2nd String (B)' },
        { name: 'D', note: 'D', octave: 4, frequency: 293.66, string: language === 'tr' ? '1. Tel (D)' : '1st String (D)' }
      ]
    },
    openD: {
      name: language === 'tr' ? 'Açık D (D A D F# A D)' : 'Open D (D A D F# A D)',
      strings: [
        { name: 'D', note: 'D', octave: 2, frequency: 73.42, string: language === 'tr' ? '6. Tel (D)' : '6th String (D)' },
        { name: 'A', note: 'A', octave: 2, frequency: 110.00, string: language === 'tr' ? '5. Tel (A)' : '5th String (A)' },
        { name: 'D', note: 'D', octave: 3, frequency: 146.83, string: language === 'tr' ? '4. Tel (D)' : '4th String (D)' },
        { name: 'F#', note: 'F#', octave: 3, frequency: 185.00, string: language === 'tr' ? '3. Tel (F#)' : '3rd String (F#)' },
        { name: 'A', note: 'A', octave: 3, frequency: 220.00, string: language === 'tr' ? '2. Tel (A)' : '2nd String (A)' },
        { name: 'D', note: 'D', octave: 4, frequency: 293.66, string: language === 'tr' ? '1. Tel (D)' : '1st String (D)' }
      ]
    },
    dropC: {
      name: language === 'tr' ? 'Drop C (C G C F A D)' : 'Drop C (C G C F A D)',
      strings: [
        { name: 'C', note: 'C', octave: 2, frequency: 65.41, string: language === 'tr' ? '6. Tel (C)' : '6th String (C)' },
        { name: 'G', note: 'G', octave: 2, frequency: 98.00, string: language === 'tr' ? '5. Tel (G)' : '5th String (G)' },
        { name: 'C', note: 'C', octave: 3, frequency: 130.81, string: language === 'tr' ? '4. Tel (C)' : '4th String (C)' },
        { name: 'F', note: 'F', octave: 3, frequency: 174.61, string: language === 'tr' ? '3. Tel (F)' : '3rd String (F)' },
        { name: 'A', note: 'A', octave: 3, frequency: 220.00, string: language === 'tr' ? '2. Tel (A)' : '2nd String (A)' },
        { name: 'D', note: 'D', octave: 4, frequency: 293.66, string: language === 'tr' ? '1. Tel (D)' : '1st String (D)' }
      ]
    },
    dropCSharp: {
      name: language === 'tr' ? 'Drop C# (C# G# C# F# A# D#)' : 'Drop C# (C# G# C# F# A# D#)',
      strings: [
        { name: 'C#', note: 'C#', octave: 2, frequency: 69.30, string: language === 'tr' ? '6. Tel (C#)' : '6th String (C#)' },
        { name: 'G#', note: 'G#', octave: 2, frequency: 103.83, string: language === 'tr' ? '5. Tel (G#)' : '5th String (G#)' },
        { name: 'C#', note: 'C#', octave: 3, frequency: 138.59, string: language === 'tr' ? '4. Tel (C#)' : '4th String (C#)' },
        { name: 'F#', note: 'F#', octave: 3, frequency: 185.00, string: language === 'tr' ? '3. Tel (F#)' : '3rd String (F#)' },
        { name: 'A#', note: 'A#', octave: 3, frequency: 233.08, string: language === 'tr' ? '2. Tel (A#)' : '2nd String (A#)' },
        { name: 'D#', note: 'D#', octave: 4, frequency: 311.13, string: language === 'tr' ? '1. Tel (D#)' : '1st String (D#)' }
      ]
    },
    dropB: {
      name: language === 'tr' ? 'Drop B (B F# B E G# C#)' : 'Drop B (B F# B E G# C#)',
      strings: [
        { name: 'B', note: 'B', octave: 1, frequency: 61.74, string: language === 'tr' ? '6. Tel (B)' : '6th String (B)' },
        { name: 'F#', note: 'F#', octave: 2, frequency: 92.50, string: language === 'tr' ? '5. Tel (F#)' : '5th String (F#)' },
        { name: 'B', note: 'B', octave: 2, frequency: 123.47, string: language === 'tr' ? '4. Tel (B)' : '4th String (B)' },
        { name: 'E', note: 'E', octave: 3, frequency: 164.81, string: language === 'tr' ? '3. Tel (E)' : '3rd String (E)' },
        { name: 'G#', note: 'G#', octave: 3, frequency: 207.65, string: language === 'tr' ? '2. Tel (G#)' : '2nd String (G#)' },
        { name: 'C#', note: 'C#', octave: 4, frequency: 277.18, string: language === 'tr' ? '1. Tel (C#)' : '1st String (C#)' }
      ]
    },
    dropASharp: {
      name: language === 'tr' ? 'Drop A# (A# F A# D# G C)' : 'Drop A# (A# F A# D# G C)',
      strings: [
        { name: 'A#', note: 'A#', octave: 1, frequency: 58.27, string: language === 'tr' ? '6. Tel (A#)' : '6th String (A#)' },
        { name: 'F', note: 'F', octave: 2, frequency: 87.31, string: language === 'tr' ? '5. Tel (F)' : '5th String (F)' },
        { name: 'A#', note: 'A#', octave: 2, frequency: 116.54, string: language === 'tr' ? '4. Tel (A#)' : '4th String (A#)' },
        { name: 'D#', note: 'D#', octave: 3, frequency: 155.56, string: language === 'tr' ? '3. Tel (D#)' : '3rd String (D#)' },
        { name: 'G', note: 'G', octave: 3, frequency: 196.00, string: language === 'tr' ? '2. Tel (G)' : '2nd String (G)' },
        { name: 'C', note: 'C', octave: 4, frequency: 261.63, string: language === 'tr' ? '1. Tel (C)' : '1st String (C)' }
      ]
    },
    dropA: {
      name: language === 'tr' ? 'Drop A (A E A D F# B)' : 'Drop A (A E A D F# B)',
      strings: [
        { name: 'A', note: 'A', octave: 1, frequency: 55.00, string: language === 'tr' ? '6. Tel (A)' : '6th String (A)' },
        { name: 'E', note: 'E', octave: 2, frequency: 82.41, string: language === 'tr' ? '5. Tel (E)' : '5th String (E)' },
        { name: 'A', note: 'A', octave: 2, frequency: 110.00, string: language === 'tr' ? '4. Tel (A)' : '4th String (A)' },
        { name: 'D', note: 'D', octave: 3, frequency: 146.83, string: language === 'tr' ? '3. Tel (D)' : '3rd String (D)' },
        { name: 'F#', note: 'F#', octave: 3, frequency: 185.00, string: language === 'tr' ? '2. Tel (F#)' : '2nd String (F#)' },
        { name: 'B', note: 'B', octave: 3, frequency: 246.94, string: language === 'tr' ? '1. Tel (B)' : '1st String (B)' }
      ]
    },
    cStandard: {
      name: language === 'tr' ? 'C Standart (C F A# D# G C)' : 'C Standard (C F A# D# G C)',
      strings: [
        { name: 'C', note: 'C', octave: 2, frequency: 65.41, string: language === 'tr' ? '6. Tel (C)' : '6th String (C)' },
        { name: 'F', note: 'F', octave: 2, frequency: 87.31, string: language === 'tr' ? '5. Tel (F)' : '5th String (F)' },
        { name: 'A#', note: 'A#', octave: 2, frequency: 116.54, string: language === 'tr' ? '4. Tel (A#)' : '4th String (A#)' },
        { name: 'D#', note: 'D#', octave: 3, frequency: 155.56, string: language === 'tr' ? '3. Tel (D#)' : '3rd String (D#)' },
        { name: 'G', note: 'G', octave: 3, frequency: 196.00, string: language === 'tr' ? '2. Tel (G)' : '2nd String (G)' },
        { name: 'C', note: 'C', octave: 4, frequency: 261.63, string: language === 'tr' ? '1. Tel (C)' : '1st String (C)' }
      ]
    },
    bStandard: {
      name: language === 'tr' ? 'B Standart (B E G# C# F# B)' : 'B Standard (B E G# C# F# B)',
      strings: [
        { name: 'B', note: 'B', octave: 1, frequency: 61.74, string: language === 'tr' ? '6. Tel (B)' : '6th String (B)' },
        { name: 'E', note: 'E', octave: 2, frequency: 82.41, string: language === 'tr' ? '5. Tel (E)' : '5th String (E)' },
        { name: 'G#', note: 'G#', octave: 2, frequency: 103.83, string: language === 'tr' ? '4. Tel (G#)' : '4th String (G#)' },
        { name: 'C#', note: 'C#', octave: 3, frequency: 138.59, string: language === 'tr' ? '3. Tel (C#)' : '3rd String (C#)' },
        { name: 'F#', note: 'F#', octave: 3, frequency: 185.00, string: language === 'tr' ? '2. Tel (F#)' : '2nd String (F#)' },
        { name: 'B', note: 'B', octave: 3, frequency: 246.94, string: language === 'tr' ? '1. Tel (B)' : '1st String (B)' }
      ]
    },
    aStandard: {
      name: language === 'tr' ? 'A Standart (A D G C E A)' : 'A Standard (A D G C E A)',
      strings: [
        { name: 'A', note: 'A', octave: 1, frequency: 55.00, string: language === 'tr' ? '6. Tel (A)' : '6th String (A)' },
        { name: 'D', note: 'D', octave: 2, frequency: 73.42, string: language === 'tr' ? '5. Tel (D)' : '5th String (D)' },
        { name: 'G', note: 'G', octave: 2, frequency: 98.00, string: language === 'tr' ? '4. Tel (G)' : '4th String (G)' },
        { name: 'C', note: 'C', octave: 3, frequency: 130.81, string: language === 'tr' ? '3. Tel (C)' : '3rd String (C)' },
        { name: 'E', note: 'E', octave: 3, frequency: 164.81, string: language === 'tr' ? '2. Tel (E)' : '2nd String (E)' },
        { name: 'A', note: 'A', octave: 3, frequency: 220.00, string: language === 'tr' ? '1. Tel (A)' : '1st String (A)' }
      ]
    }
  };

  const guitarStrings = tunings[selectedTuning].strings;

  // Tüm notalar ve frekansları
  const noteFrequencies = [
    { note: 'C', frequency: 16.35 },
    { note: 'C#', frequency: 17.32 },
    { note: 'D', frequency: 18.35 },
    { note: 'D#', frequency: 19.45 },
    { note: 'E', frequency: 20.60 },
    { note: 'F', frequency: 21.83 },
    { note: 'F#', frequency: 23.12 },
    { note: 'G', frequency: 24.50 },
    { note: 'G#', frequency: 25.96 },
    { note: 'A', frequency: 27.50 },
    { note: 'A#', frequency: 29.14 },
    { note: 'B', frequency: 30.87 }
  ];

  // Frekansı nota çevir
  const frequencyToNote = (frequency) => {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const noteIndex = Math.round(noteNum) + 69;
    const noteName = noteFrequencies[noteIndex % 12].note;
    const octave = Math.floor(noteIndex / 12) - 1;
    const cents = Math.floor((noteNum - Math.round(noteNum)) * 100);
    
    return { noteName, octave, cents };
  };

  // En yakın gitar telini bul
  const findClosestString = (frequency) => {
    let closest = guitarStrings[0];
    let minDiff = Math.abs(frequency - closest.frequency);
    
    guitarStrings.forEach(string => {
      const diff = Math.abs(frequency - string.frequency);
      if (diff < minDiff) {
        minDiff = diff;
        closest = string;
      }
    });
    
    return closest;
  };

  // Autocorrelation ile pitch detection - Geliştirilmiş versiyon
  const autoCorrelate = (buffer, sampleRate) => {
    const SIZE = buffer.length;
    let rms = 0;
    
    // RMS hesapla
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    
    // Enstrüman girişi için daha düşük eşik
    const threshold = inputSource === 'instrument' ? 0.0001 : 0.001;
    
    console.log('RMS:', rms.toFixed(5), 'Threshold:', threshold, 'Source:', inputSource);
    
    if (rms < threshold) return -1;
    
    // Sıfır geçişlerini kullanarak pitch detection
    let r1 = 0, r2 = SIZE - 1;
    
    // Başlangıçtan sıfır geçişini bul
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < 0.01) {
        r1 = i;
        break;
      }
    }
    
    // Autocorrelation
    const correlations = new Array(SIZE).fill(0);
    
    for (let i = 0; i < SIZE / 2; i++) {
      for (let j = 0; j < SIZE / 2; j++) {
        correlations[i] += buffer[j] * buffer[j + i];
      }
    }
    
    let d = 0;
    while (correlations[d] > correlations[d + 1]) d++;
    
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE / 2; i++) {
      if (correlations[i] > maxval) {
        maxval = correlations[i];
        maxpos = i;
      }
    }
    
    let T0 = maxpos;
    
    // Parabolic interpolation
    const x1 = correlations[T0 - 1];
    const x2 = correlations[T0];
    const x3 = correlations[T0 + 1];
    
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    
    if (a) T0 = T0 - b / (2 * a);
    
    const freq = sampleRate / T0;
    
    if (freq > 0 && freq < 1000) {
      console.log('Detected frequency:', freq.toFixed(2), 'Hz');
      return freq;
    }
    
    return -1;
  };

  // Cihazları listele
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        setAvailableDevices(audioInputs);
        if (audioInputs.length > 0 && !selectedDevice) {
          setSelectedDevice(audioInputs[0].deviceId);
        }
        
        // Chrome + NI Audio Interface kontrolü
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const hasNIDevice = audioInputs.some(d => d.label.includes('Komplete Audio') || d.label.includes('Native Instruments'));
        
        if (isChrome && hasNIDevice) {
          setShowBrowserWarning(true);
        }
      } catch (error) {
        console.error('Cihazlar alınamadı:', error);
      }
    };
    getDevices();
  }, []);

  // Ses analizi
  const updatePitch = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(buffer);
    
    // RMS (Root Mean Square) - ses seviyesini ölç
    let rms = 0;
    for (let i = 0; i < buffer.length; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / buffer.length);
    
    // Daha yüksek threshold - sadece güçlü sinyalleri algıla
    const silenceThreshold = inputSource === 'instrument' ? 0.01 : 0.02;
    const minimumSignalStrength = inputSource === 'instrument' ? 0.015 : 0.03;
    
    // Eğer ses çok düşükse
    if (rms < silenceThreshold) {
      // 200ms sessizlikten sonra ekranı temizle (daha hızlı tepki)
      const timeSinceLastSound = Date.now() - lastSoundTimeRef.current;
      if (timeSinceLastSound > 200) {
        setCurrentNote('');
        setCurrentFrequency(0);
        setCents(0);
        setClosestString('');
      }
      animationFrameRef.current = requestAnimationFrame(updatePitch);
      return;
    }
    
    // Ses var ama çok zayıf - görmezden gel
    if (rms < minimumSignalStrength) {
      animationFrameRef.current = requestAnimationFrame(updatePitch);
      return;
    }
    
    // Ses var ve yeterince güçlü - zamanı güncelle
    lastSoundTimeRef.current = Date.now();
    
    const frequency = autoCorrelate(buffer, audioContextRef.current.sampleRate);
    
    // Frekans aralığını genişlettik: 40-800 Hz arası (7 string bass'tan yüksek notalar arası)
    if (frequency > 0 && frequency >= 40 && frequency <= 800) {
      const { noteName, octave, cents } = frequencyToNote(frequency);
      const closest = findClosestString(frequency);
      
      setCurrentFrequency(frequency.toFixed(2));
      setCurrentNote(`${noteName}${octave}`);
      setCents(cents);
      setClosestString(closest.string);
    }
    
    animationFrameRef.current = requestAnimationFrame(updatePitch);
  };

  // Ses girişini başlat
  const startTuner = async () => {
    try {
      // Önce mevcut context'i temizle (eğer varsa ve kapalı değilse)
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          await audioContextRef.current.close();
        } catch (e) {
          console.log('Context close error (ignored):', e.message);
        }
      }

      // Chrome için özel constraints
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      
      const constraints = {
        audio: isChrome ? {
          // Chrome için WDM/DirectSound zorla
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          googEchoCancellation: false,
          googNoiseSuppression: false,
          googAutoGainControl: false,
          googHighpassFilter: false,
          sampleRate: { ideal: 44100 },
          channelCount: { ideal: 2 },
          latency: { ideal: 0 },
          // Chrome-specific: Force raw audio capture
          mediaSource: 'audioCapture'
        } : {
          // Edge/Firefox için normal constraints
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100,
          channelCount: 2,
          latency: 0
        }
      };

      console.log('🎤 Requesting audio with constraints:', constraints);
      console.log('🌐 Browser:', isChrome ? 'Chrome (using WDM workaround)' : 'Edge/Firefox');
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio tracks found');
      }
      
      const trackSettings = audioTracks[0].getSettings();
      console.log('📊 Audio tracks:', audioTracks);
      console.log('⚙️ Track settings:', trackSettings);
      console.log('🏷️ Track label:', audioTracks[0].label);
      console.log('✅ Track enabled:', audioTracks[0].enabled);
      console.log('🔇 Track muted:', audioTracks[0].muted);
      console.log('📡 Track readyState:', audioTracks[0].readyState);
      console.log('🌊 Stream active:', stream.active);
      console.log('🆔 Stream ID:', stream.id);
      
      // CRITICAL: Track muted kontrolü
      if (audioTracks[0].muted) {
        console.error('❌ TRACK IS MUTED! This is why there\'s no signal.');
        console.log('Solution: Check Windows Privacy Settings > Microphone');
        alert(language === 'tr' 
          ? 'Audio track muted! Windows Privacy Settings > Mikrofon ayarlarını kontrol edin.'
          : 'Audio track is muted! Check Windows Privacy Settings > Microphone');
        return;
      }
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Context state kontrolü
      console.log('🎛️ AudioContext state:', audioContextRef.current.state);
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('▶️ AudioContext resumed');
      }
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      console.log('📢 Source channels:', microphoneRef.current.channelCount);
      
      gainNodeRef.current = audioContextRef.current.createGain();
      
      // Gain ayarı - instrument için daha yüksek
      if (inputSource === 'instrument') {
        gainNodeRef.current.gain.value = gain * 50; // 50x boost for instrument
      } else {
        gainNodeRef.current.gain.value = gain * 10; // 10x boost for mic
      }
      
      // Analyser ayarları - daha hassas
      analyserRef.current.fftSize = 8192; // Larger FFT for better low-frequency resolution
      analyserRef.current.smoothingTimeConstant = 0.3; // Less smoothing for faster response
      analyserRef.current.minDecibels = -100;
      // Basit bağlantı - kanal ayırma yok
      microphoneRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(analyserRef.current);
      
      // Chrome için ekstra: Destination'a da bağla (bazen yardımcı oluyor)
      if (isChrome) {
        const destinationNode = audioContextRef.current.createMediaStreamDestination();
        gainNodeRef.current.connect(destinationNode);
        console.log('🔗 Chrome: Added destination node for better compatibility');
      }
      
      console.log('🔗 Simple connection: Microphone → Gain(x' + gainNodeRef.current.gain.value + ') → Analyser');
      
      console.log('🔗 Simple connection: Microphone → Gain(x' + gainNodeRef.current.gain.value + ') → Analyser');
      console.log('🎵 Audio context sample rate:', audioContextRef.current.sampleRate);
      console.log('📊 FFT Size:', analyserRef.current.fftSize);
      console.log('🔊 Input source:', inputSource, 'Gain multiplier:', gainNodeRef.current.gain.value);
      
      // Comprehensive test
      let testAttempt = 0;
      const testInterval = setInterval(() => {
        testAttempt++;
        const testBuffer = new Float32Array(analyserRef.current.fftSize);
        analyserRef.current.getFloatTimeDomainData(testBuffer);
        
        let testRms = 0;
        let minVal = 1, maxVal = -1;
        let nonZeroCount = 0;
        for (let i = 0; i < testBuffer.length; i++) {
          testRms += testBuffer[i] * testBuffer[i];
          minVal = Math.min(minVal, testBuffer[i]);
          maxVal = Math.max(maxVal, testBuffer[i]);
          if (testBuffer[i] !== 0) nonZeroCount++;
        }
        testRms = Math.sqrt(testRms / testBuffer.length);
        
        console.log(`${'═'.repeat(25)} Test ${testAttempt}/5 ${'═'.repeat(25)}`);
        console.log('RMS:', testRms.toFixed(8));
        console.log('Min:', minVal.toFixed(8), 'Max:', maxVal.toFixed(8), 'Range:', (maxVal - minVal).toFixed(8));
        console.log('Non-zero samples:', nonZeroCount, '/', testBuffer.length);
        console.log('First 20 samples:', Array.from(testBuffer.slice(0, 20)).map(v => v.toFixed(6)).join(', '));
        
        if (testAttempt === 5) {
          clearInterval(testInterval);
          if (testRms < 0.000001 && nonZeroCount === 0) {
            console.error('');
            console.error('❌❌❌ CRITICAL: NO AUDIO DATA ❌❌❌');
            console.error('');
            console.error('All samples are exactly 0.000000');
            console.error('This means the browser is NOT receiving audio from your interface.');
            console.error('');
            console.error('🔧 IMMEDIATE ACTIONS:');
            console.error('');
            console.error('1. Try a different browser (Edge, Firefox, Chrome)');
            console.error('2. Windows Privacy: Settings > Privacy > Microphone > Allow desktop apps');
            console.error('3. Check if other apps can use the audio interface');
            console.error('4. Restart browser completely');
            console.error('5. Restart audio interface / reconnect USB');
            console.error('');
          } else {
            console.log('');
            console.log('✅✅✅ AUDIO SIGNAL DETECTED! ✅✅✅');
            console.log('');
          }
        }
      }, 500);
      
      setIsListening(true);
      updatePitch();
    } catch (error) {
      console.error('❌ Ses girişi erişimi hatası:', error);
      alert(language === 'tr' 
        ? `Ses girişi hatası: ${error.message}\n\nLütfen tarayıcı izinlerini ve audio interface bağlantısını kontrol edin.` 
        : `Audio input error: ${error.message}\n\nPlease check browser permissions and audio interface connection.`);
    }
  };

  // Mikrofonu durdur
  const stopTuner = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (splitterRef.current) {
      splitterRef.current.disconnect();
    }
    
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current.mediaStream.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsListening(false);
    setCurrentNote('');
    setCurrentFrequency(0);
    setCents(0);
    setClosestString('');
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (isListening) {
        stopTuner();
      }
    };
  }, []);

  // Akort göstergesi rengi
  const getIndicatorColor = () => {
    if (!currentNote) return '#666';
    if (Math.abs(cents) < 5) return '#4ade80'; // Yeşil - Akortlu
    if (Math.abs(cents) < 15) return '#fbbf24'; // Sarı - Yakın
    return '#f87171'; // Kırmızı - Uzak
  };

  // Akort göstergesi pozisyonu
  const getIndicatorPosition = () => {
    const maxCents = 50;
    const position = (cents / maxCents) * 50;
    return Math.max(-50, Math.min(50, position));
  };

  return (
    <>
      <Header />
      <Subheader />
      
      {showBrowserWarning && (
        <div className="browser-warning">
          <div className="warning-content">
            <span className="warning-icon">⚠️</span>
            <div className="warning-text">
              <strong>
                {language === 'tr' 
                  ? 'Tarayıcı Uyumluluk Uyarısı' 
                  : 'Browser Compatibility Warning'}
              </strong>
              <p>
                {language === 'tr'
                  ? 'Native Instruments audio interface\'iniz Chrome ile tam uyumlu çalışmayabilir. Daha iyi performans için Microsoft Edge veya Firefox kullanmanızı öneririz.'
                  : 'Your Native Instruments audio interface may not work properly with Chrome. For better performance, we recommend using Microsoft Edge or Firefox.'}
              </p>
            </div>
            <button className="warning-close" onClick={() => setShowBrowserWarning(false)}>
              ✕
            </button>
          </div>
        </div>
      )}
      
      <div className="tuner-container">
        <div className="tuner-header">
          <h1>{language === 'tr' ? 'Gitar Akort Cihazı' : 'Guitar Tuner'}</h1>
          <p>{language === 'tr' 
            ? 'Mikrofonunuzu açın ve gitar telini çalın' 
            : 'Enable your microphone and play a guitar string'}</p>
        </div>

        <div className="tuner-main">
          {/* Giriş Kaynağı Seçimi */}
          <div className="input-source-selector">
            <label>{language === 'tr' ? 'Ses Girişi Tipi:' : 'Audio Input Type:'}</label>
            <select 
              value={inputSource} 
              onChange={(e) => setInputSource(e.target.value)}
              className="tuning-dropdown"
              disabled={isListening}
            >
              <option value="microphone">
                {language === 'tr' ? 'Mikrofon' : 'Microphone'}
              </option>
              <option value="instrument">
                {language === 'tr' ? 'Enstrüman Girişi (Audio Interface)' : 'Instrument Input (Audio Interface)'}
              </option>
            </select>
          </div>

          {/* Cihaz Seçimi */}
          {availableDevices.length > 0 && (
            <div className="device-selector">
              <label>{language === 'tr' ? 'Ses Cihazı:' : 'Audio Device:'}</label>
              <select 
                value={selectedDevice} 
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="tuning-dropdown"
                disabled={isListening}
              >
                {availableDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `${language === 'tr' ? 'Cihaz' : 'Device'} ${device.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
              <p className="device-hint">
                {inputSource === 'instrument' 
                  ? (language === 'tr' 
                    ? '💡 Enstrüman girişi için audio interface\'inizi seçin' 
                    : '💡 Select your audio interface for instrument input')
                  : (language === 'tr' 
                    ? '💡 Mikrofon veya ses cihazınızı seçin' 
                    : '💡 Select your microphone or audio device')
                }
              </p>
            </div>
          )}

          {/* Audio Mode - Sadece enstrüman girişi için */}
          {inputSource === 'instrument' && (
            <div className="audio-mode-selector">
              <label>{language === 'tr' ? 'Ses Modu:' : 'Audio Mode:'}</label>
              <select 
                value={audioMode} 
                onChange={(e) => setAudioMode(e.target.value)}
                className="tuning-dropdown"
                disabled={isListening}
              >
                <option value="mono">
                  {language === 'tr' ? 'Mono (Tüm Kanallar Karışık)' : 'Mono (All Channels Mixed)'}
                </option>
                <option value="stereo">
                  {language === 'tr' ? 'Stereo (Kanal Seçimi)' : 'Stereo (Channel Selection)'}
                </option>
              </select>
              <p className="device-hint">
                {language === 'tr' 
                  ? '💡 Eğer ses gelmiyorsa MONO modunu deneyin' 
                  : '💡 If no signal detected, try MONO mode'}
              </p>
            </div>
          )}

          {/* Kanal Seçimi - Sadece stereo modda */}
          {inputSource === 'instrument' && audioMode === 'stereo' && (
            <div className="channel-selector">
              <label>{language === 'tr' ? 'Giriş Kanalı (Audio Interface):' : 'Input Channel (Audio Interface):'}</label>
              <select 
                value={channelCount} 
                onChange={(e) => setChannelCount(parseInt(e.target.value))}
                className="tuning-dropdown"
                disabled={isListening}
              >
                <option value="1">
                  {language === 'tr' ? 'Kanal 1 (Sol / Input 1)' : 'Channel 1 (Left / Input 1)'}
                </option>
                <option value="2">
                  {language === 'tr' ? 'Kanal 2 (Sağ / Input 2)' : 'Channel 2 (Right / Input 2)'}
                </option>
              </select>
              <p className="device-hint">
                {language === 'tr' 
                  ? '💡 Audio interface\'inizde gitarınızı hangi girişe taktıysanız o kanalı seçin' 
                  : '💡 Select the channel where your guitar is connected on the audio interface'}
              </p>
            </div>
          )}

          {/* Gain Kontrolü - Sadece enstrüman girişi için */}
          {inputSource === 'instrument' && (
            <div className="gain-control">
              <label>{language === 'tr' ? 'Ses Seviyesi Güçlendirme:' : 'Gain Boost:'}</label>
              <div className="gain-slider-container">
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="0.5"
                  value={gain}
                  onChange={(e) => setGain(parseFloat(e.target.value))}
                  className="gain-slider"
                  disabled={isListening}
                />
                <span className="gain-value">{gain}x</span>
              </div>
              <p className="device-hint">
                {language === 'tr' 
                  ? '💡 Ses çok zayıfsa artırın, çok gürültülüyse azaltın' 
                  : '💡 Increase if signal is weak, decrease if too noisy'}
              </p>
            </div>
          )}

          {/* Akort Seçimi */}
          <div className="tuning-selector">
            <label>{language === 'tr' ? 'Akort Dizilimi:' : 'Tuning:'}</label>
            <select 
              value={selectedTuning} 
              onChange={(e) => setSelectedTuning(e.target.value)}
              className="tuning-dropdown"
            >
              {Object.keys(tunings).map(key => (
                <option key={key} value={key}>
                  {tunings[key].name}
                </option>
              ))}
            </select>
          </div>

          <button 
            className={`tuner-button ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopTuner : startTuner}
          >
            {isListening 
              ? (language === 'tr' ? 'Durdur' : 'Stop')
              : (language === 'tr' ? 'Akort Etmeye Başla' : 'Start Tuning')}
          </button>

        {isListening && (
          <>
            <div className="tuner-display">
              <div className="current-note">
                {currentNote || '--'}
              </div>
              <div className="current-frequency">
                {currentFrequency ? `${currentFrequency} Hz` : '--'}
              </div>
              {closestString && (
                <div className="closest-string">
                  {closestString}
                </div>
              )}
            </div>

            <div className="tuner-gauge">
              <div className="gauge-labels">
                <span>{language === 'tr' ? 'Pes' : 'Flat'}</span>
                <span>{language === 'tr' ? 'Akortlu' : 'In Tune'}</span>
                <span>{language === 'tr' ? 'Tiz' : 'Sharp'}</span>
              </div>
              <div className="gauge-track">
                <div className="gauge-center"></div>
                <div 
                  className="gauge-indicator"
                  style={{
                    left: `calc(50% + ${getIndicatorPosition()}%)`,
                    backgroundColor: getIndicatorColor()
                  }}
                ></div>
              </div>
              <div className="cents-display">
                {currentNote && (
                  <span style={{ color: getIndicatorColor() }}>
                    {cents > 0 ? '+' : ''}{cents} {language === 'tr' ? 'sent' : 'cents'}
                  </span>
                )}
              </div>
            </div>

            <div className="strings-reference">
              <h3>{tunings[selectedTuning].name}</h3>
              <div className="strings-grid">
                {guitarStrings.map((string, index) => (
                  <div 
                    key={index} 
                    className={`string-item ${closestString === string.string ? 'active' : ''}`}
                  >
                    <span className="string-name">{string.string}</span>
                    <span className="string-freq">{string.frequency.toFixed(2)} Hz</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Tuner;
