import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import './Metronome.css';
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const waveTypes = ['sine', 'triangle', 'square', 'sawtooth'];

const Metronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [accentWave, setAccentWave] = useState('sine');
  const [mainWave, setMainWave] = useState('triangle');
  const [accentFreq, setAccentFreq] = useState(880);
  const [mainFreq, setMainFreq] = useState(440);
  const [volume, setVolume] = useState(1);
  const [timeSignatureTop, setTimeSignatureTop] = useState(4);
  const [timeSignatureBottom, setTimeSignatureBottom] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);

  const beatCount = useRef(0);
  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const playClick = (isAccent) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    const wave = isAccent ? accentWave : mainWave;
    const freq = isAccent ? accentFreq : mainFreq;
    const gain = isAccent ? 0.2 * volume : 0.1 * volume;

    osc.type = wave;
    osc.frequency.value = freq;
    gainNode.gain.setValueAtTime(gain, audioCtx.currentTime);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
    osc.stop(audioCtx.currentTime + 0.15);
  };

  const startMetronome = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    beatCount.current = 0;
    intervalRef.current = setInterval(() => {
      const isAccent = beatCount.current % timeSignatureTop === 0;
      playClick(isAccent);
      setCurrentBeat(beatCount.current % timeSignatureTop);
      beatCount.current += 1;
    }, (60 / bpm) * 1000 * (4 / timeSignatureBottom));
  };

  const stopMetronome = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    if (isPlaying) {
      startMetronome();
    } else {
      stopMetronome();
    }
    return stopMetronome;
  }, [isPlaying, bpm, accentWave, mainWave, accentFreq, mainFreq, volume]);

  return (
    <div>
      <Header logout={logout} />
      <Subheader />

      <div className="metronome-container">

        {/* BPM ve Play Button */}
        <div className="display">
          <h2>{bpm} BPM</h2>
          <button className="play-button" onClick={() => setIsPlaying((prev) => !prev)}>
            {isPlaying ? <FaStop /> : <FaPlay />}
          </button>
        </div>

        {/* Time Signature */}
        <div className="time-signature">
          <label>Time Signature</label>
          <div className="signature-inputs">
            <input
              type="number"
              min="1"
              max="12"
              value={timeSignatureTop}
              onChange={(e) => setTimeSignatureTop(parseInt(e.target.value))}
            />
            <span>/</span>
            <input
              type="number"
              min="1"
              max="16"
              value={timeSignatureBottom}
              onChange={(e) => setTimeSignatureBottom(parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Beat Göstergesi */}
        <div className="beat-indicators">
          {Array.from({ length: timeSignatureTop }).map((_, i) => (
            <div key={i} className={`beat-dot ${i === currentBeat ? 'active' : ''}`} />
          ))}
        </div>

        {/* Ayarlar */}
        <div className="controls">

          <div className="preset-control">
            <label>Tempo</label>
            <input
              type="range"
              min="40"
              max="240"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
            />
          </div>

          <div className="preset-control">
            <label>Main Wave</label>
            <select value={mainWave} onChange={(e) => setMainWave(e.target.value)}>
              {waveTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="number"
              value={mainFreq}
              onChange={(e) => setMainFreq(parseInt(e.target.value))}
              min="100"
              max="2000"
            />
          </div>

          <div className="preset-control">
            <label>Accent Wave</label>
            <select value={accentWave} onChange={(e) => setAccentWave(e.target.value)}>
              {waveTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="number"
              value={accentFreq}
              onChange={(e) => setAccentFreq(parseInt(e.target.value))}
              min="100"
              max="2000"
            />
          </div>

          <div className="volume-control">
            <label>Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metronome;
