import React, { useState, useRef, useEffect } from 'react';
import Soundfont from 'soundfont-player';
import { Scale, Chord } from 'tonal';
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
      "pentatonic major": [2, 2, 3, 2],
      "pentatonic minor": [3, 2, 2, 3],
      "blues": [3, 2, 1, 1, 3],
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
}

const AdvancedRiffGenerator = () => {
  const [selectedKey, setSelectedKey] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [tempo, setTempo] = useState(120);
  const [riffLength, setRiffLength] = useState(8);
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

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    loadInstrument();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [instrument]);

  const loadInstrument = async () => {
    try {
      instrumentRef.current = await Soundfont.instrument(
        audioContextRef.current,
        instrument,
        { soundfont: 'MusyngKite' }
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

  const progressionPatterns = {
    major: [
      ['I', 'V', 'vi', 'IV'],
      ['I', 'vi', 'IV', 'V'],
      ['vi', 'IV', 'I', 'V'],
      ['I', 'IV', 'vi', 'V'],
      ['I', 'iii', 'IV', 'V'],
      ['ii', 'V', 'I', 'vi'],
      ['I', 'V', 'IV', 'V'],
      ['I', 'vi', 'ii', 'V']
    ],
    minor: [
      ['i', 'VII', 'VI', 'V'],
      ['i', 'iv', 'VII', 'III'],
      ['i', 'VI', 'III', 'VII'],
      ['i', 'iv', 'v', 'i'],
      ['i', 'VII', 'VI', 'v'],
      ['i', 'bIII', 'bVII', 'iv'],
      ['i', 'bVI', 'bIII', 'bVII'],
      ['i', 'iv', 'VII', 'III']
    ]
  };

  const getProgressionPatterns = () => {
    if (scaleType.includes('major')) return progressionPatterns.major;
    if (scaleType.includes('minor')) return progressionPatterns.minor;
    return progressionPatterns.major;
  };

  const getChordType = (scaleType, degree) => {
    scaleType = scaleType.toLowerCase();
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
    
    if (scaleType.includes('major')) {
      return [0, 3, 4].includes(degree) ? numerals[degree] : numerals[degree].toLowerCase();
    } else if (scaleType.includes('minor')) {
      return [0, 3, 4].includes(degree) ? numerals[degree].toLowerCase() : numerals[degree];
    } else {
      return numerals[degree];
    }
  };

  const getChordsForScale = (rootKey, type) => {
    try {
      const scale = Scale.get(`${rootKey} ${type}`);
      if (!scale.intervals) return [];
      
      const chords = [];
      const chordQualities = {
        maj: ['', '6', '7', 'maj7', '9', 'maj9', 'add9', '6/9'],
        min: ['m', 'm7', 'm9', 'm6', 'm11'],
        dim: ['dim', 'dim7'],
        aug: ['aug', 'maj7#5']
      };

      scale.intervals.forEach((interval, i) => {
        const note = scale.tonic + interval;
        const chordType = getChordType(type, i);
        const qualities = chordQualities[chordType] || chordQualities.maj;
        
        qualities.forEach(quality => {
          try {
            const chord = Chord.get(note + quality);
            if (chord.notes) {
              chords.push({
                symbol: getRomanNumeral(i, type),
                name: chord.symbol,
                notes: chord.notes
              });
            }
          } catch (e) {
            console.warn(`Couldn't create chord ${note}${quality}`);
          }
        });
      });
      
      return chords.length > 0 ? chords : [
        {
          symbol: 'I',
          name: rootKey + 'maj',
          notes: [rootKey + '3', rootKey + '5', rootKey + '7']
        }
      ];
    } catch (error) {
      console.error('Error generating chords:', error);
      return [
        {
          symbol: 'I',
          name: selectedKey + 'maj',
          notes: [selectedKey + '3', selectedKey + '5', selectedKey + '7']
        }
      ];
    }
  };

  const generateExtendedChord = (baseChord) => {
    if (!baseChord) return null;
    
    const extensions = ['', '7', 'maj7', '9', 'm9', 'add9', '6', 'm7', 'maj9'];
    const randomExtension = extensions[Math.floor(Math.random() * extensions.length)];
    
    try {
      const chordName = baseChord.name.replace(/\d+$/, '') + randomExtension;
      const extendedChord = Chord.get(chordName);
      
      if (extendedChord && extendedChord.notes) {
        return {
          ...baseChord,
          name: extendedChord.symbol,
          notes: extendedChord.notes
        };
      }
    } catch (e) {
      console.error('Error extending chord:', e);
    }
    
    return baseChord;
  };

  const generateChordProgression = (scaleChords) => {
    const patterns = getProgressionPatterns();
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    const progression = selectedPattern.map(degree => {
      const chord = scaleChords.find(c => 
        c.symbol.toLowerCase() === degree.toLowerCase()
      ) || scaleChords[0];
      
      return generateExtendedChord(chord);
    }).filter(Boolean);

    return progression.length > 0 ? progression : [generateExtendedChord(scaleChords[0])].filter(Boolean);
  };

  const generateRiff = () => {
    const rootMidiNote = getKeyMidiNote(selectedKey);
    const generatedRiff = riffGeneratorRef.current.generateRiff(
      rootMidiNote, 
      scaleType, 
      tempo,
      riffLength // Use the user-selected riff length
    );
    
    const notesWithNames = generatedRiff.map(note => ({
      ...note,
      name: riffGeneratorRef.current.midiToNoteName(note.midiNote)
    }));
    
    setRiff(generatedRiff);
    setRiffNotes(notesWithNames.map(note => note.name));
    
    const scaleChords = getChordsForScale(selectedKey, scaleType);
    const progression = generateChordProgression(scaleChords);
    setChordProgression(progression);
  };

  const playRiff = () => {
    if (!instrumentRef.current || riff.length === 0) return;

    activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    activeTimeoutsRef.current = [];
    
    setIsPlaying(true);
    const startTime = audioContextRef.current.currentTime;
    setActiveChords([]);

    riff.forEach((note, index) => {
      const noteStartTime = startTime + getRiffDuration(riff.slice(0, index));
      
      instrumentRef.current.play(
        riffGeneratorRef.current.midiToNoteName(note.midiNote),
        noteStartTime,
        { duration: note.duration * 0.8, gain: note.velocity }
      );
    });

    const totalDuration = getRiffDuration(riff);
    const endTimeout = setTimeout(() => {
      setIsPlaying(false);
    }, totalDuration * 1000);
    activeTimeoutsRef.current.push(endTimeout);
  };

   // Fixed playChordProgression function
   const playChordProgression = async () => {
    if (!instrumentRef.current || chordProgression.length === 0) return;

    // Clear previous timeouts
    activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    activeTimeoutsRef.current = [];
    
    setIsPlaying(true);
    const startTime = audioContextRef.current.currentTime;
    const chordDuration = (60 / tempo) * 2; // 2 beats per chord
    setActiveChords([]);

    chordProgression.forEach((chord, index) => {
      if (!chord?.notes) return;
      
      const chordStartTime = startTime + index * chordDuration;
      
      // Highlight chord
      const highlightTimeout = setTimeout(() => {
        setActiveChords([chord.symbol]);
      }, index * chordDuration * 1000);
      activeTimeoutsRef.current.push(highlightTimeout);
      
      // Play chord notes with slight arpeggiation
      chord.notes.forEach((note, noteIndex) => {
        try {
          const noteStartTime = chordStartTime + (noteIndex * 0.1);
          instrumentRef.current.play(
            note,
            noteStartTime,
            { 
              duration: chordDuration * 0.8,
              gain: 0.7 - (noteIndex * 0.1)
            }
          );
        } catch (error) {
          console.error('Error playing note:', note, error);
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

  const getRiffDuration = (riffSegment) => {
    return riffSegment.reduce((total, note) => total + note.duration, 0);
  };

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
              <label>Riff Length: {riffLength} notes</label>
              <input
                type="range"
                min="4"
                max="16"
                value={riffLength}
                onChange={(e) => setRiffLength(Number(e.target.value))}
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
              disabled={chordProgression.length === 0 || isPlaying}
            >
              Play Chords ({chordProgression.map(c => c?.symbol || '?').join('-')})
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
                  <div 
                    key={index} 
                    className={`chord ${activeChords.includes(chord.symbol) ? 'active' : ''}`}
                  >
                    <div className="chord-symbol">{chord.symbol}</div>
                    <div className="chord-name">{chord.name}</div>
                    <div className="chord-notes">
                      {chord.notes.map((note, i) => (
                        <span key={i} className="chord-note">{note}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="circle-of-fifths-panel">
          <h2>Circle of Fifths</h2>
          <div className="circle-container">
            <div className="circle-visualization">
              {circleOfFifths.map((item, index) => (
                <div
                  key={item.key}
                  className={`circle-key ${item.isCurrent ? 'current' : ''}`}
                  style={{
                    transform: `rotate(${index * 30}deg) translate(12em) rotate(${-index * 30}deg)`
                  }}
                >
                  <div className="key-info">
                    <div className="key-degree">{item.degree}</div>
                    <div className="key-name">{item.key}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="circle-center">
              <div className="current-scale-info">
                <div className="current-key">{selectedKey}</div>
                <div className="current-scale">{scaleType.charAt(0).toUpperCase() + scaleType.slice(1)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdvancedRiffGenerator;