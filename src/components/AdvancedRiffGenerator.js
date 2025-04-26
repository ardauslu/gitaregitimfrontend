import React, { useState, useRef, useEffect } from 'react';
import Soundfont from 'soundfont-player';
import { Key, Scale, Chord } from 'tonal';
import './AdvancedRiffGenerator.css';
import Layout from './Layout';

class RiffGenerator {
  constructor() {
    this.scaleTypes = [
      "major", "minor", "dorian", "phrygian", "lydian", "mixolydian", "locrian",
      "harmonic minor", "melodic minor", "pentatonic major", "pentatonic minor",
      "blues", "chromatic", "whole tone", "augmented", "diminished", "double harmonic",
      "neapolitan major", "neapolitan minor", "hungarian minor", "gypsy", "enigmatic",
      "persian", "japanese", "arabic", "byzantine", "flamenco"
    ];
    
    this.rhythmPatterns = [
      [1, 0.5, 0.5, 1], 
      [0.5, 0.5, 0.5, 0.5],
      [1.5, 0.5, 1],
      [0.25, 0.25, 0.25, 0.25, 0.5, 0.5],
      [2, 0.5, 0.5, 1]
    ];
  }

  getScaleIntervals(scaleName) {
    const scaleDefinitions = {
      "major": [2, 2, 1, 2, 2, 2, 1],
      "minor": [2, 1, 2, 2, 1, 2, 2],
      "dorian": [2, 1, 2, 2, 2, 1, 2],
      "phrygian": [1, 2, 2, 2, 1, 2, 2],
      "lydian": [2, 2, 2, 1, 2, 2, 1],
      "mixolydian": [2, 2, 1, 2, 2, 1, 2],
      "locrian": [1, 2, 2, 1, 2, 2, 2],
      "harmonic minor": [2, 1, 2, 2, 1, 3, 1],
      "melodic minor": [2, 1, 2, 2, 2, 2, 1],
      "pentatonic major": [2, 2, 3, 2, 3],
      "pentatonic minor": [3, 2, 2, 3, 2],
      "blues": [3, 2, 1, 1, 3, 2],
      "chromatic": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      "whole tone": [2, 2, 2, 2, 2],
      "augmented": [3, 1, 3, 1, 3],
      "diminished": [2, 1, 2, 1, 2, 1, 2],
      "double harmonic": [1, 3, 1, 2, 1, 3, 1],
      "neapolitan major": [1, 2, 2, 2, 2, 2, 1],
      "neapolitan minor": [1, 2, 2, 2, 1, 3, 1],
      "hungarian minor": [2, 1, 3, 1, 1, 3, 1],
      "gypsy": [1, 3, 1, 2, 1, 2, 2],
      "enigmatic": [1, 3, 2, 2, 2, 1, 1],
      "persian": [1, 3, 1, 1, 2, 3, 1],
      "japanese": [1, 4, 2, 1, 4],
      "arabic": [2, 2, 1, 1, 2, 2, 2],
      "byzantine": [1, 3, 1, 2, 1, 3, 1],
      "flamenco": [1, 3, 1, 2, 1, 2, 2]
    };
    
    return scaleDefinitions[scaleName.toLowerCase()] || scaleDefinitions["minor"];
  }

  generateScaleNotes(rootNote, scaleName) {
    const intervals = this.getScaleIntervals(scaleName);
    const notes = [rootNote];
    
    let currentNote = rootNote;
    for (const interval of intervals) {
      currentNote += interval;
      notes.push(currentNote);
    }
    
    notes.push(rootNote + 12);
    return notes;
  }

  generateRiff(rootNote, scaleName, tempo, length = 8, complexity = 0.5) {
    const scaleNotes = this.generateScaleNotes(rootNote, scaleName);
    const rhythm = this.rhythmPatterns[Math.floor(Math.random() * this.rhythmPatterns.length)];
    const riff = [];
    
    for (let i = 0; i < length; i++) {
      const noteIndex = Math.random() < complexity ? 
        Math.floor(Math.random() * scaleNotes.length) :
        (riff.length > 0 ? riff[riff.length - 1].noteIndex : 0);
      
      const rhythmValue = rhythm[i % rhythm.length];
      
      riff.push({
        noteIndex,
        midiNote: scaleNotes[noteIndex],
        duration: rhythmValue * (60 / tempo),
        velocity: 0.7 + Math.random() * 0.3
      });
    }
    
    return riff;
  }

  midiToNoteName(midiNote) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = notes[midiNote % 12];
    return noteName + octave;
  }

  getChordForRiffNote(riffNote, scaleChords) {
    if (!scaleChords || scaleChords.length === 0) {
      return { symbol: 'I', name: riffNote.name.replace(/\d/g, '') + 'maj', notes: [] };
    }

    // Find the chord that contains this note
    for (const chord of scaleChords) {
      if (chord.notes && chord.notes.some(note => 
        note.replace(/\d/g, '') === riffNote.name.replace(/\d/g, ''))) {
        return chord;
      }
    }
    return scaleChords[0]; // Default to first chord if not found
  }

  getFallbackChords(rootKey) {
    return [
      { symbol: 'I', name: rootKey + 'maj', notes: [rootKey + '3', rootKey + '5', rootKey + '7'] },
      { symbol: 'IV', name: rootKey + 'maj', notes: [rootKey + '4', rootKey + '6', rootKey + '8'] },
      { symbol: 'V', name: rootKey + 'maj', notes: [rootKey + '5', rootKey + '7', rootKey + '9'] }
    ];
  }
}


const AdvancedRiffGenerator = () => {
  const [selectedKey, setSelectedKey] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [tempo, setTempo] = useState(120);
  const [riff, setRiff] = useState([]);
  const [chordProgression, setChordProgression] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [instrument, setInstrument] = useState('electric_guitar_clean');
  const [riffNotes, setRiffNotes] = useState([]);
  const [activeChords, setActiveChords] = useState([]);
  
  const audioContextRef = useRef(null);
  const instrumentRef = useRef(null);
  const riffGeneratorRef = useRef(new RiffGenerator());
  const activeTimeoutsRef = useRef([]);

  // Audio context ve enstrümanı başlat
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    loadInstrument();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      // Clear all timeouts on unmount
      activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      activeTimeoutsRef.current = [];
    };
  }, [instrument]);

  const loadInstrument = async () => {
    try {
      instrumentRef.current = await Soundfont.instrument(
        audioContextRef.current,
        instrument
      );
    } catch (error) {
      console.error('Error loading instrument:', error);
    }
  };

  const getKeyMidiNote = (key) => {
    const keyToMidi = {
      'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64,
      'F': 65, 'F#': 66, 'G': 67, 'G#': 68, 'A': 69,
      'A#': 70, 'B': 71
    };
    return keyToMidi[key] || 60;
  };

  // Riff üretme fonksiyonu
  const generateRiff = () => {
    const rootMidiNote = getKeyMidiNote(selectedKey);
    const generatedRiff = riffGeneratorRef.current.generateRiff(rootMidiNote, scaleType, tempo);
    
    const notesWithNames = generatedRiff.map(note => ({
      ...note,
      name: riffGeneratorRef.current.midiToNoteName(note.midiNote)
    }));
    
    setRiff(generatedRiff);
    setRiffNotes(notesWithNames.map(note => note.name));
    
    // Generate chord progression that matches the riff
    let scaleChords = getChordsForScale(selectedKey, scaleType);
    
    // Use fallback chords if we couldn't generate proper ones
    if (scaleChords.length === 0) {
      scaleChords = riffGeneratorRef.current.getFallbackChords(selectedKey);
    }
    
    const riffChords = notesWithNames.map(note => 
      riffGeneratorRef.current.getChordForRiffNote(note, scaleChords)
    );
    
    // Get unique chords maintaining order
    const uniqueChords = [];
    const seen = new Set();
    for (const chord of riffChords) {
      if (chord && !seen.has(chord.symbol)) {
        seen.add(chord.symbol);
        uniqueChords.push(chord);
      }
    }
    
    setChordProgression(uniqueChords.length > 0 ? uniqueChords : scaleChords.slice(0, 2));
  };

  // Gam için akorları al
  const getChordsForScale = (rootKey, type) => {
    try {
      // Special handling for pentatonic scales
      if (type.includes('pentatonic')) {
        return [
          { symbol: 'I', name: rootKey + 'maj', notes: [rootKey + '3', rootKey + '5', rootKey + '7'] },
          { symbol: 'IV', name: rootKey + 'maj', notes: [rootKey + '4', rootKey + '6', rootKey + '8'] },
          { symbol: 'V', name: rootKey + 'maj', notes: [rootKey + '5', rootKey + '7', rootKey + '9'] }
        ];
      }
  
      // Special handling for other problematic scales
      if (['japanese', 'arabic', 'byzantine', 'neapolitan'].some(s => type.includes(s))) {
        return [
          { symbol: 'I', name: rootKey + 'maj', notes: [rootKey + '3', rootKey + '5', rootKey + '7'] },
          { symbol: 'II', name: rootKey + 'min', notes: [rootKey + '4', rootKey + '6', rootKey + '8'] }
        ];
      }
  
      const scale = Scale.get(`${rootKey} ${type}`);
      if (!scale.intervals || scale.intervals.length === 0) {
        return riffGeneratorRef.current.getFallbackChords(rootKey);
      }
      
      const chords = [];
      
      scale.intervals.forEach((interval, i) => {
        const note = scale.tonic + interval;
        const chordType = getChordType(type, i);
        const chord = Chord.get(note + chordType);
        
        if (chord && chord.notes && chord.notes.length > 0) {
          chords.push({
            symbol: getRomanNumeral(i, type),
            name: chord.symbol,
            notes: chord.notes
          });
        }
      });
      
      return chords.length > 0 ? chords : riffGeneratorRef.current.getFallbackChords(rootKey);
    } catch (error) {
      console.error('Error generating chords:', error);
      return riffGeneratorRef.current.getFallbackChords(rootKey);
    }
  };

  const getChordType = (scaleType, degree) => {
    scaleType = scaleType.toLowerCase();
    
    // Handle pentatonic scales
    if (scaleType.includes('pentatonic')) {
      return degree % 2 === 0 ? 'maj' : 'min';
    }
    
    // Handle other special scales
    if (['japanese', 'arabic', 'byzantine', 'neapolitan'].some(s => scaleType.includes(s))) {
      return degree === 0 ? 'maj' : 'min';
    }
  
    // Default handling
    if (scaleType.includes('major')) {
      return degree === 6 ? 'dim' : degree === 0 ? 'maj' : [2, 3, 6].includes(degree) ? 'min' : 'maj';
    } else if (scaleType.includes('minor')) {
      return degree === 1 ? 'dim' : [0, 3, 4].includes(degree) ? 'min' : 'maj';
    } else {
      return 'maj';
    }
  };
  

  const getRomanNumeral = (degree, scaleType) => {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    scaleType = scaleType.toLowerCase();
    
    if (scaleType.includes('major') || scaleType === 'pentatonic major') {
      return [0, 3, 4].includes(degree) ? numerals[degree] : numerals[degree].toLowerCase();
    } else if (scaleType.includes('minor') || scaleType === 'pentatonic minor') {
      return [0, 3, 4].includes(degree) ? numerals[degree].toLowerCase() : numerals[degree];
    } else {
      return numerals[degree];
    }
  };

  // Riff çalma fonksiyonu
  const playRiff = async () => {
    if (!instrumentRef.current || riff.length === 0) return;

    // Clear any existing timeouts
    activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    activeTimeoutsRef.current = [];
    
    setIsPlaying(true);
    const startTime = audioContextRef.current.currentTime;
    setActiveChords([]);

    riff.forEach((note, index) => {
      const noteStartTime = startTime + getRiffDuration(riff.slice(0, index));
      const noteEndTime = noteStartTime + note.duration;
      
      // Play the note
      instrumentRef.current.play(
        riffGeneratorRef.current.midiToNoteName(note.midiNote),
        noteStartTime,
        { duration: note.duration * 0.8, gain: note.velocity }
      );
      
      // Highlight the active chord
      const scaleChords = getChordsForScale(selectedKey, scaleType);
      const noteName = riffGeneratorRef.current.midiToNoteName(note.midiNote);
      const chord = riffGeneratorRef.current.getChordForRiffNote(
        { name: noteName }, 
        scaleChords
      );
      
      const timeout = setTimeout(() => {
        setActiveChords([chord.symbol]);
      }, (noteStartTime - startTime) * 1000);
      
      activeTimeoutsRef.current.push(timeout);
    });

    const totalDuration = getRiffDuration(riff);
    const endTimeout = setTimeout(() => {
      setIsPlaying(false);
      setActiveChords([]);
    }, totalDuration * 1000);
    
    activeTimeoutsRef.current.push(endTimeout);
  };

  const getRiffDuration = (riffSegment) => {
    return riffSegment.reduce((total, note) => total + note.duration, 0);
  };

  // Akor dizisini çalma
  const playChordProgression = async () => {
    if (!instrumentRef.current || chordProgression.length === 0) return;
  
    // Clear any existing timeouts
    activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    activeTimeoutsRef.current = [];
    
    setIsPlaying(true);
    const startTime = audioContextRef.current.currentTime;
    const chordDuration = (60 / tempo) * 2; // 2 beats per chord
    setActiveChords([]);
  
    chordProgression.forEach((chord, index) => {
      if (!chord || !chord.notes) return; // Skip invalid chords
      
      const chordStartTime = startTime + index * chordDuration;
      
      // Highlight the chord
      const highlightTimeout = setTimeout(() => {
        setActiveChords([chord.symbol || 'I']);
      }, index * chordDuration * 1000);
      
      activeTimeoutsRef.current.push(highlightTimeout);
      
      // Play each note of the chord with slight offset for realism
      chord.notes.forEach((note, noteIndex) => {
        if (note) { // Only play valid notes
          const noteStartTime = chordStartTime + (noteIndex * 0.05);
          instrumentRef.current.play(
            note,
            noteStartTime,
            { duration: chordDuration * 0.8 }
          );
        }
      });
    });
  
    const totalDuration = chordProgression.length * chordDuration;
    const endTimeout = setTimeout(() => {
      setIsPlaying(false);
      setActiveChords([]);
    }, totalDuration * 1000);
    
    activeTimeoutsRef.current.push(endTimeout);
  };

  // Circle of Fifths oluşturma
  const createCircleOfFifths = () => {
    const circle = [];
    const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
    
    keys.forEach((currentKey, index) => {
      const isCurrent = currentKey === selectedKey;
      const scale = Scale.get(`${currentKey} ${scaleType}`).notes;
      const chords = getChordsForScale(currentKey, scaleType);
      
      circle.push({
        key: currentKey,
        isCurrent,
        scale,
        chords,
        degree: index === 0 ? 'I' : 
               index === 7 ? 'bV' : 
               index < 7 ? `${index}♯` : `${12-index}b`
      });
    });
    
    return circle;
  };

  const circleOfFifths = createCircleOfFifths();

  return (
    <Layout>
      <div className="advanced-riff-generator">
        <div className="main-panel">
          <h1>Advanced Riff Generator</h1>
          
          <div className="controls">
            <div className="control-group">
              <label>Key:</label>
              <select value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>
                {['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'].map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Scale Type:</label>
              <select value={scaleType} onChange={(e) => setScaleType(e.target.value)}>
                {riffGeneratorRef.current.scaleTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Tempo: {tempo} BPM</label>
              <input
                type="range"
                min="40"
                max="240"
                value={tempo}
                onChange={(e) => setTempo(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>Instrument:</label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
              >
                <option value="acoustic_guitar_nylon">Nylon Acoustic</option>
                <option value="acoustic_guitar_steel">Steel Acoustic</option>
                <option value="electric_guitar_clean">Clean Electric</option>
                <option value="electric_guitar_jazz">Jazz Electric</option>
                <option value="electric_piano_1">Electric Piano</option>
                <option value="synth_bass_1">Synth Bass</option>
              </select>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={generateRiff} disabled={isPlaying}>
              Generate Riff
            </button>
            <button onClick={playRiff} disabled={riff.length === 0 || isPlaying}>
              Play Riff
            </button>
            <button 
  onClick={playChordProgression} 
  disabled={!chordProgression || chordProgression.length === 0 || isPlaying}
>
  Play Chords ({chordProgression.length > 0 ? chordProgression.map(c => c?.symbol || '?').join('-') : 'N/A'})
</button>
          </div>

          <div className="output-section">
            <div className="riff-output">
              <h2>Generated Riff:</h2>
              <div className="notes">
                {riffNotes.map((note, index) => (
                  <span key={index} className="note">{note}</span>
                ))}
              </div>
            </div>

            <div className="chord-progression">
  <h2>Chord Progression:</h2>
  <div className="chords">
    {chordProgression.map((chord, index) => (
      chord && chord.symbol ? (
        <div 
          key={index} 
          className={`chord ${activeChords.includes(chord.symbol) ? 'active' : ''}`}
        >
          <div className="chord-symbol">{chord.symbol}</div>
          <div className="chord-name">{chord.name || chord.symbol}</div>
        </div>
      ) : null
    ))}
  </div>
</div>
          </div>
        </div>

        <div className="circle-of-fifths-panel">
          <h2>Circle of Fifths - {selectedKey} {scaleType.charAt(0).toUpperCase() + scaleType.slice(1)}</h2>
          
          <div className="circle-container">
            {circleOfFifths.map((item, index) => (
              <div
                key={item.key}
                className={`circle-item ${item.isCurrent ? 'current' : ''}`}
                style={{
                  transform: `rotate(${index * 30}deg) translate(200px) rotate(${-index * 30}deg)`
                }}
              >
                <div className="key-degree">{item.degree}</div>
                <div className="key-name">{item.key}</div>
                <div className="key-chords">
                  {item.chords.slice(0, 3).map((chord, i) => (
                    <div key={i} className="chord-symbol">{chord.symbol}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="circle-center">
            <div className="current-key">{selectedKey}</div>
            <div className="current-scale">{scaleType.charAt(0).toUpperCase() + scaleType.slice(1)}</div>
          </div>

          <div className="scale-info">
            <h3>{selectedKey} {scaleType.charAt(0).toUpperCase() + scaleType.slice(1)} Scale:</h3>
            <div className="scale-notes">
              {Scale.get(`${selectedKey} ${scaleType}`).notes.map((note, index) => (
                <span key={index} className="note">{note}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdvancedRiffGenerator;