import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import './Metronome.css';
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

const waveTypes = ['sine', 'triangle', 'square', 'sawtooth'];

const translations = {
  tr: {
    title: "Metronom",
    bpmLabel: "Tempo (BPM)",
    start: "Başlat",
    stop: "Durdur",
    timeSignature: "Ölçü",
    soundType: "Ses Tipi",
    volume: "Ses Seviyesi",
    tempos: {
      largo: "Largo (40-60)",
      adagio: "Adagio (60-80)",
      andante: "Andante (80-100)",
      moderato: "Moderato (100-120)",
      allegro: "Allegro (120-156)",
      presto: "Presto (156-200)",
      prestissimo: "Prestissimo (200-240)"
    },
    soundTypes: {
      classic: "Klasik",
      woodblock: "Tahta Blok",
      digital: "Dijital",
      click: "Klik"
    }
  },
  en: {
    title: "Metronome",
    bpmLabel: "Tempo (BPM)",
    start: "Start",
    stop: "Stop",
    timeSignature: "Time Signature",
    soundType: "Sound Type",
    volume: "Volume",
    tempos: {
      largo: "Largo (40-60)",
      adagio: "Adagio (60-80)",
      andante: "Andante (80-100)",
      moderato: "Moderato (100-120)",
      allegro: "Allegro (120-156)",
      presto: "Presto (156-200)",
      prestissimo: "Prestissimo (200-240)"
    },
    soundTypes: {
      classic: "Classic",
      woodblock: "Wood Block",
      digital: "Digital",
      click: "Click"
    }
  },
};

const Metronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [soundType, setSoundType] = useState('classic');
  const [volume, setVolume] = useState(0.7);
  const [timeSignatureTop, setTimeSignatureTop] = useState(4);
  const [timeSignatureBottom, setTimeSignatureBottom] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [visualPulse, setVisualPulse] = useState(false);
  const { language } = useLanguage();
   
  const beatCount = useRef(0);
  const nextNoteTimeRef = useRef(0);
  const schedulerIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    document.body.classList.add('metronome-page-bg');
    return () => {
      document.body.classList.remove('metronome-page-bg');
    };
  }, []);

  const playClick = (isAccent, time) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Ses tipine göre farklı sesler
    let freq, duration, gainValue;
    
    switch(soundType) {
      case 'classic':
        freq = isAccent ? 1000 : 800;
        duration = 0.05;
        gainValue = isAccent ? 0.3 * volume : 0.2 * volume;
        osc.type = 'sine';
        break;
      case 'woodblock':
        freq = isAccent ? 1500 : 1200;
        duration = 0.03;
        gainValue = isAccent ? 0.4 * volume : 0.25 * volume;
        osc.type = 'triangle';
        break;
      case 'digital':
        freq = isAccent ? 880 : 440;
        duration = 0.1;
        gainValue = isAccent ? 0.25 * volume : 0.15 * volume;
        osc.type = 'square';
        break;
      case 'click':
        freq = isAccent ? 2000 : 1500;
        duration = 0.02;
        gainValue = isAccent ? 0.35 * volume : 0.2 * volume;
        osc.type = 'sawtooth';
        break;
      default:
        freq = isAccent ? 1000 : 800;
        duration = 0.05;
        gainValue = isAccent ? 0.3 * volume : 0.2 * volume;
        osc.type = 'sine';
    }

    osc.frequency.value = freq;
    gainNode.gain.setValueAtTime(gainValue, time);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration + 0.1);
  };

  const scheduleNote = (beatNumber, time) => {
    const isAccent = beatNumber % timeSignatureTop === 0;
    playClick(isAccent, time);
    
    // Visual feedback
    setTimeout(() => {
      setCurrentBeat(beatNumber % timeSignatureTop);
      setVisualPulse(true);
      setTimeout(() => setVisualPulse(false), 100);
    }, (time - audioCtxRef.current.currentTime) * 1000);
  };

  const scheduler = () => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    // 100ms önden schedule et (daha doğru timing için)
    while (nextNoteTimeRef.current < audioCtx.currentTime + 0.1) {
      scheduleNote(beatCount.current, nextNoteTimeRef.current);
      
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTimeRef.current += secondsPerBeat;
      beatCount.current++;
    }
  };

  const startMetronome = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    beatCount.current = 0;
    nextNoteTimeRef.current = audioCtxRef.current.currentTime;
    
    // 25ms'de bir scheduler çalıştır (hassas timing)
    schedulerIntervalRef.current = setInterval(scheduler, 25);
  };

  const stopMetronome = () => {
    if (schedulerIntervalRef.current) {
      clearInterval(schedulerIntervalRef.current);
      schedulerIntervalRef.current = null;
    }
    setCurrentBeat(0);
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    document.body.classList.add('metronome-page-bg');
    return () => {
      document.body.classList.remove('metronome-page-bg');
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startMetronome();
    } else {
      stopMetronome();
    }
    return stopMetronome;
  }, [isPlaying, bpm, soundType, volume, timeSignatureTop, timeSignatureBottom]);

  // Tempo ismi getir
  const getTempoName = () => {
    if (bpm >= 40 && bpm < 60) return t.tempos.largo;
    if (bpm >= 60 && bpm < 80) return t.tempos.adagio;
    if (bpm >= 80 && bpm < 100) return t.tempos.andante;
    if (bpm >= 100 && bpm < 120) return t.tempos.moderato;
    if (bpm >= 120 && bpm < 156) return t.tempos.allegro;
    if (bpm >= 156 && bpm < 200) return t.tempos.presto;
    return t.tempos.prestissimo;
  };

  const t = translations[language]; // Çeviri metinlerini seç

  return (
    <div>
      <Header language={language} logout={logout} />
      <Subheader language={language} />
      
      <div className="metronome-container">
        <h1 className="metronome-title">{t.title}</h1>

        {/* Ana BPM Display */}
        <div className={`bpm-display ${visualPulse ? 'pulse' : ''}`}>
          <div className="bpm-number">{bpm}</div>
          <div className="bpm-label">BPM</div>
          <div className="tempo-name">{getTempoName()}</div>
        </div>

        {/* Play/Stop Button */}
        <button 
          className={`play-button ${isPlaying ? 'playing' : ''}`} 
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <FaStop /> : <FaPlay />}
          <span>{isPlaying ? t.stop : t.start}</span>
        </button>

        {/* Beat Göstergesi */}
        <div className="beat-indicators">
          {Array.from({ length: timeSignatureTop }).map((_, i) => (
            <div 
              key={i} 
              className={`beat-dot ${i === currentBeat ? 'active' : ''} ${i === 0 ? 'accent' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Tempo Slider */}
        <div className="tempo-control">
          <label>{t.bpmLabel}</label>
          <div className="slider-container">
            <span className="slider-value">40</span>
            <input
              type="range"
              min="40"
              max="240"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="tempo-slider"
            />
            <span className="slider-value">240</span>
          </div>
          <div className="preset-tempos">
            <button onClick={() => setBpm(60)}>60</button>
            <button onClick={() => setBpm(90)}>90</button>
            <button onClick={() => setBpm(120)}>120</button>
            <button onClick={() => setBpm(140)}>140</button>
            <button onClick={() => setBpm(180)}>180</button>
          </div>
        </div>

        {/* Time Signature */}
        <div className="time-signature-control">
          <label>{t.timeSignature}</label>
          <div className="signature-selector">
            <select 
              value={`${timeSignatureTop}/${timeSignatureBottom}`}
              onChange={(e) => {
                const [top, bottom] = e.target.value.split('/').map(Number);
                setTimeSignatureTop(top);
                setTimeSignatureBottom(bottom);
              }}
            >
              <option value="2/4">2/4</option>
              <option value="3/4">3/4 (Vals)</option>
              <option value="4/4">4/4 (Standart)</option>
              <option value="5/4">5/4</option>
              <option value="6/8">6/8</option>
              <option value="7/8">7/8</option>
              <option value="9/8">9/8</option>
              <option value="12/8">12/8</option>
            </select>
          </div>
        </div>

        {/* Sound Type */}
        <div className="sound-type-control">
          <label>{t.soundType}</label>
          <div className="sound-buttons">
            {Object.entries(t.soundTypes).map(([key, label]) => (
              <button
                key={key}
                className={`sound-btn ${soundType === key ? 'active' : ''}`}
                onClick={() => setSoundType(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Control */}
        <div className="volume-control">
          <label>{t.volume}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
          <span className="volume-percentage">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default Metronome;
