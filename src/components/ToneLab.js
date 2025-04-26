import React, { useState, useEffect, useRef } from "react";
import guitarRiff from "../assets/guitar-riff.mp3";

const ToneLab = () => {
  const [distortion, setDistortion] = useState(0.5);
  const [delay, setDelay] = useState(0.5);
  const [reverb, setReverb] = useState(0.5);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);
  const sourceNodeRef = useRef(null);

  // Audio context ve buffer yükleme
  useEffect(() => {
    const initAudio = async () => {
      try {
        // AudioContext oluştur
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        
        // Ses dosyasını yükle
        const response = await fetch(guitarRiff);
        const arrayBuffer = await response.arrayBuffer();
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
        
        setIsLoaded(true);
      } catch (error) {
        console.error("Audio yükleme hatası:", error);
      }
    };

    initAudio();

    return () => {
      // Temizlik
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playGuitarWithEffects = () => {
    if (!isLoaded || !audioContextRef.current) return;

    // Eski kaynakları temizle
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }

    // Yeni kaynak oluştur
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    sourceNodeRef.current = source;

    // Efekt zinciri oluştur
    const distortionNode = createDistortion(distortion);
    const delayNode = createDelay(delay);
    const reverbNode = createReverb(reverb);

    // Bağlantıları yap
    source.connect(distortionNode);
    distortionNode.connect(delayNode);
    delayNode.connect(reverbNode);
    reverbNode.connect(audioContextRef.current.destination);

    // Çal
    source.start(0);
  };

  // Distortion efekti
  const createDistortion = (amount) => {
    const distortion = audioContextRef.current.createWaveShaper();
    
    // Distortion eğrisi
    const curve = new Float32Array(44100);
    const k = amount * 100;
    for (let i = 0; i < 44100; i++) {
      const x = (i - 22050) / 22050;
      curve[i] = (3 + k) * x * 20 * (Math.PI / 180) / (Math.PI + k * Math.abs(x));
    }
    
    distortion.curve = curve;
    distortion.oversample = '4x';
    return distortion;
  };

  // Delay efekti
  const createDelay = (time) => {
    const delay = audioContextRef.current.createDelay(2.0);
    delay.delayTime.value = time;
    
    const feedback = audioContextRef.current.createGain();
    feedback.gain.value = 0.5;
    
    delay.connect(feedback);
    feedback.connect(delay);
    
    const merger = audioContextRef.current.createChannelMerger(2);
    delay.connect(merger, 0, 0);
    feedback.connect(merger, 0, 1);
    
    return merger;
  };

  // Reverb efekti (Convolver ile basit implementasyon)
  const createReverb = (amount) => {
    const reverb = audioContextRef.current.createConvolver();
    
    // Impulse response oluştur
    const length = audioContextRef.current.sampleRate * 2;
    const impulse = audioContextRef.current.createBuffer(2, length, audioContextRef.current.sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    
    for (let i = 0; i < length; i++) {
      const n = length - i;
      left[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, amount * 10);
      right[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, amount * 10);
    }
    
    reverb.buffer = impulse;
    return reverb;
  };

  return (
    <div className="tone-lab">
      <h2>Ton Laboratuvarı (Web Audio API)</h2>
      <div className="pedals">
        <div className="pedal">
          <label>Distortion: {distortion.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={distortion}
            onChange={(e) => setDistortion(parseFloat(e.target.value))}
          />
        </div>
        <div className="pedal">
          <label>Delay: {delay.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={delay}
            onChange={(e) => setDelay(parseFloat(e.target.value))}
          />
        </div>
        <div className="pedal">
          <label>Reverb: {reverb.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={reverb}
            onChange={(e) => setReverb(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <button onClick={playGuitarWithEffects} disabled={!isLoaded}>
        {isLoaded ? "Gitar Çal" : "Yükleniyor..."}
      </button>
    </div>
  );
};

export default ToneLab;