import React, { useState, useRef, useEffect } from 'react';
import Soundfont from 'soundfont-player';
import { Chord , Scale } from 'tonal';
import './AdvancedRiffGenerator.css';
import Layout from './Layout';
import notesImage from '../assets/notes.png'; // Görseli içe aktarın
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import { useAuth } from "../AuthContext"; // AuthContext'ten logout fonksiyonunu alın
import { useNavigate } from "react-router-dom";
class RiffGenerator {
  constructor() {
    this.scaleTypes = [
      "major", "minor", "dorian", "phrygian", "lydian", "mixolydian", "locrian",
      "harmonic minor", "melodic minor", "pentatonic major", "pentatonic minor",
      "blues", "chromatic", "whole tone", "augmented", "diminished", "double harmonic",
      "neapolitan major", "neapolitan minor", "hungarian minor", "gypsy", "enigmatic",
      "persian", "japanese", "arabic", "byzantine", "flamenco"
    ];
    
    this.guitarVoicings = {
      major: [
        [0, 0, 2, 2, 2, 0],  // C major
        [-1, 3, 2, 0, 1, 0],  // C major alt
        [3, 3, 2, 0, 1, 0]    // C major root 5
      ],
      minor: [
        [0, 0, 2, 2, 1, 0],   // C minor
        [-1, 3, 1, 0, 1, 0],   // C minor alt
        [3, 3, 1, 0, 1, 0]     // C minor root 5
      ],
      seventh: [
        [0, 0, 2, 0, 2, 0],    // C7
        [-1, 3, 2, 3, 1, 0],    // C7 alt
        [3, 3, 2, 3, 1, 0]      // C7 root 5
      ]
    };

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
  getGuitarVoicing(rootNote, chordType) {
    const voicings = this.guitarVoicings[chordType] || this.guitarVoicings.major;
    return voicings[Math.floor(Math.random() * voicings.length)];
  }
  
  generateGuitarRiff(rootNote, scaleName, tempo) {
    const scaleNotes = this.generateScaleNotes(rootNote, scaleName);
    const chords = [
      { type: 'major', duration: 2 },
      { type: 'seventh', duration: 1 },
      { type: 'minor', duration: 1 }
    ];
    
    const riff = [];
    let time = 0;
    
    chords.forEach(chord => {
      const voicing = this.getGuitarVoicing(rootNote, chord.type);
      const notes = voicing.map((fret, string) => {
        const openStringMidi = 40 + (5 * string); // E2=40, A2=45, D3=50, etc.
        return fret >= 0 ? openStringMidi + fret : null;
      }).filter(note => note !== null);
      
      // Add strum pattern
      const strumOffset = [0, 0.1, 0.2, 0.05]; // Simulate strumming
      notes.forEach((note, i) => {
        riff.push({
          midiNote: note,
          duration: chord.duration * (60 / tempo),
          velocity: 0.8 - (i * 0.1),
          strumDelay: strumOffset[i % strumOffset.length]
        });
      });
      
      time += chord.duration;
    });
    
    return riff;
  }
}





const AdvancedRiffGenerator = () => {
  const [selectedKey, setSelectedKey] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [tempo, setTempo] = useState(120);
  const [riffLength, setRiffLength] = useState(8);
  const [riff, setRiff] = useState([]);
  const [chordProgression, setChordProgression] = useState([]);
  const [lastPlayedChords, setLastPlayedChords] = useState([]); // Son çalınan akorlar
  const [isPlaying, setIsPlaying] = useState(false);
  const [instrument, setInstrument] = useState('acoustic_grand_piano');
  const [riffNotes, setRiffNotes] = useState([]);
  const [activeChords, setActiveChords] = useState([]);
  const audioContextRef = useRef(null);
  const instrumentRef = useRef(null);
  const riffGeneratorRef = useRef(new RiffGenerator());
  const activeTimeoutsRef = useRef([]);
  const [language, setLanguage] = useState("tr");
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
 
       useEffect(() => {
         if (!isAuthenticated) {
           navigate("/login"); // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
         }
       }, [isAuthenticated, navigate]);
     

   // Safe note transposition
   const safeTranspose = (note, semitones) => {
    if (!note) return 'C4'; // Fallback for undefined notes
    
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteName = (note.match(/[A-Za-z#]+/) || ['C'])[0];
    const octave = (note.match(/\d+/) || ['4'])[0];
    
    const noteIndex = notes.indexOf(noteName);
    if (noteIndex === -1) return 'C4';
    
    let newIndex = noteIndex + semitones;
    let octaveOffset = Math.floor(newIndex / 12);
    newIndex = ((newIndex % 12) + 12) % 12;
    
    return notes[newIndex] + (parseInt(octave) + octaveOffset);
  };
  const getSafeChordTones = (root, type = '') => {
    if (!root) return ['C4', 'E4', 'G4']; // Fallback triad
    
    try {
      // Try with Tonal first
      const tonalChord = Chord.get(root + type);
      if (tonalChord.notes && tonalChord.notes.length > 0) {
        return tonalChord.notes.map(n => n || 'C4');
      }
    } catch (e) {
      console.warn('Tonal chord failed, using fallback', e);
    }
  
    // Fallback intervals
    const intervals = {
      '': [0, 4, 7],    // Major
      'm': [0, 3, 7],   // Minor
      '7': [0, 4, 7, 10], // Dominant 7
      'm7': [0, 3, 7, 10], // Minor 7
      'maj7': [0, 4, 7, 11], // Major 7
      'aug': [0, 4, 8],  // Augmented
      'dim': [0, 3, 6]   // Diminished
    };
    
    const rootMidi = getKeyMidiNote((root.match(/[A-Za-z#]+/) || ['C'])[0]);
    return (intervals[type] || [0, 4, 7]).map(interval => {
      return midiToNoteName(rootMidi + interval);
    });
  };

  const midiToNoteName = (midiNote) => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = notes[midiNote % 12] || 'C';
    return noteName + octave;
  };


  const isSpecialScale = (scaleType) => {
    const specialScales = [
      'blues', 'augmented', 'whole tone', 
      'arabic', 'japanese', 'byzantine',
      'persian', 'enigmatic', 'hungarian minor'
    ];
    return specialScales.includes(scaleType.toLowerCase());
  };


  const generateSpecialScaleProgression = (scaleType, rootNote) => {
    const progressionTemplates = {
      blues: () => [
      { symbol: 'I7', name: `${rootNote}7`, notes: getSafeChordTones(rootNote, '7') },
      { symbol: 'IV7', name: `${safeTranspose(rootNote, 5)}7`, notes: getSafeChordTones(safeTranspose(rootNote, 5), '7') },
      { symbol: 'V7', name: `${safeTranspose(rootNote, 7)}7`, notes: getSafeChordTones(safeTranspose(rootNote, 7), '7') }
      ],
      augmented: () => [
      { symbol: 'I+', name: `${rootNote}+`, notes: getSafeChordTones(rootNote, 'aug') },
      { symbol: 'III+', name: `${safeTranspose(rootNote, 4)}+`, notes: getSafeChordTones(safeTranspose(rootNote, 4), 'aug') },
      { symbol: 'bVI+', name: `${safeTranspose(rootNote, 8)}+`, notes: getSafeChordTones(safeTranspose(rootNote, 8), 'aug') }
      ],
      arabic: () => [
      { symbol: 'I', name: rootNote, notes: [rootNote, safeTranspose(rootNote, 1), safeTranspose(rootNote, 4)] },
      { symbol: 'IV', name: safeTranspose(rootNote, 5), notes: [safeTranspose(rootNote, 5), safeTranspose(rootNote, 6), safeTranspose(rootNote, 8)] },
      { symbol: 'V', name: safeTranspose(rootNote, 7), notes: [safeTranspose(rootNote, 7), safeTranspose(rootNote, 8), safeTranspose(rootNote, 11)] }
      ],
      japanese: () => [
      { symbol: 'I', name: rootNote, notes: [rootNote, safeTranspose(rootNote, 2), safeTranspose(rootNote, 5)] },
      { symbol: 'bIII', name: safeTranspose(rootNote, 3), notes: [safeTranspose(rootNote, 3), safeTranspose(rootNote, 5), safeTranspose(rootNote, 7)] },
      { symbol: 'IV', name: safeTranspose(rootNote, 5), notes: [safeTranspose(rootNote, 5), safeTranspose(rootNote, 7), safeTranspose(rootNote, 9)] }
      ],
      default: () => [
      { symbol: 'I', name: rootNote, notes: [rootNote] },
      { symbol: 'II', name: safeTranspose(rootNote, 2), notes: [safeTranspose(rootNote, 2)] },
      { symbol: 'IV', name: safeTranspose(rootNote, 5), notes: [safeTranspose(rootNote, 5)] }
      ]
    };

    const template = progressionTemplates[scaleType.toLowerCase()] || progressionTemplates.default;
    return template();
  };



  const generateChordProgression = () => {
    const specialProgressions = {
      blues: () => [
        createChord('I7', selectedKey, '7'),
        createChord('IV7', safeTranspose(selectedKey, 5), '7'),
        createChord('V7', safeTranspose(selectedKey, 7), '7')
      ],
      augmented: () => [
        createChord('I+', selectedKey, 'aug'),
        createChord('III+', safeTranspose(selectedKey, 4), 'aug'),
        createChord('bVI+', safeTranspose(selectedKey, 8), 'aug')
      ],
      arabic: () => [
        createChord('I', selectedKey, '', [0, 1, 4]),
        createChord('IV', safeTranspose(selectedKey, 5), '', [0, 1, 4]),
        createChord('V', safeTranspose(selectedKey, 7), '', [0, 1, 4])
      ],
      japanese: () => [
        createChord('I', selectedKey, '', [0, 2, 5]),
        createChord('bIII', safeTranspose(selectedKey, 3), 'm', [0, 2, 5]),
        createChord('IV', safeTranspose(selectedKey, 5), '', [0, 2, 5])
      ],
      default: () => [
        createChord('I', selectedKey),
        createChord('IV', safeTranspose(selectedKey, 5)),
        createChord('V', safeTranspose(selectedKey, 7))
      ]
    };

    const progression = specialProgressions[scaleType.toLowerCase()] 
      ? specialProgressions[scaleType.toLowerCase()]()
      : specialProgressions.default();

    return progression.map(chord => ({
      ...chord,
      color: getChordColor(chord.symbol)
    }));
  };

  const createChord = (symbol, root, type = '', intervals = null) => {
    const notes = intervals 
      ? intervals.map(i => safeTranspose(root, i))
      : getSafeChordTones(root, type);
      
    return {
      symbol,
      name: root + type,
      fullName: root + type,
      romanNumeral: symbol,
      notes,
      type,
      extensions: ''
    };
  };

  const getChordColor = (symbol) => {
    const colors = {
      'I': '#4CAF50',     // Green
      'I7': '#4CAF50',
      'I+': '#4CAF50',
      'IV': '#2196F3',    // Blue
      'IV7': '#2196F3',
      'V': '#F44336',     // Red
      'V7': '#F44336',
      'vi': '#9C27B0',    // Purple
      'bIII': '#FF9800',  // Orange
      'bVI+': '#607D8B'   // Gray
    };
    return colors[symbol] || '#607D8B';
  };


  // Initialize audio
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
        { 
          soundfont: 'MusyngKite',
          gain: 2.0
        }
      );
      console.log('Instrument loaded:', instrument);
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
  

  const generateAdvancedChordProgression = () => {
    const scale = Scale.get(`${selectedKey} ${scaleType}`);
    if (!scale.notes || scale.notes.length < 3) {
      // Handle scales with fewer notes (like pentatonic/blues)
      return generateSpecialScaleProgression(scaleType);
    }

    // All possible chord types with their characteristics
    const chordTypes = [
      // Basic triads
      { symbol: '', name: 'maj', extensions: '', color: '#4CAF50', tension: 0 },
      { symbol: 'm', name: 'min', extensions: '', color: '#9C27B0', tension: 1 },
      { symbol: 'dim', name: 'dim', extensions: '', color: '#607D8B', tension: 2 },
      { symbol: 'aug', name: 'aug', extensions: '', color: '#FF9800', tension: 2 },
      
      // Seventh chords
      { symbol: 'maj7', name: 'maj7', extensions: '', color: '#4CAF50', tension: 1 },
      { symbol: '7', name: 'dom7', extensions: '', color: '#F44336', tension: 3 },
      { symbol: 'm7', name: 'min7', extensions: '', color: '#9C27B0', tension: 2 },
      { symbol: 'm7b5', name: 'half-dim', extensions: '', color: '#607D8B', tension: 3 },
      { symbol: 'dim7', name: 'dim7', extensions: '', color: '#795548', tension: 4 },
      
      // Extended chords
      { symbol: '6', name: '6', extensions: '', color: '#4CAF50', tension: 1 },
      { symbol: 'm6', name: 'min6', extensions: '', color: '#9C27B0', tension: 2 },
      { symbol: '9', name: '9', extensions: '', color: '#F44336', tension: 3 },
      { symbol: 'maj9', name: 'maj9', extensions: '', color: '#4CAF50', tension: 2 },
      { symbol: 'm9', name: 'min9', extensions: '', color: '#9C27B0', tension: 3 },
      { symbol: '11', name: '11', extensions: '', color: '#F44336', tension: 4 },
      { symbol: 'maj11', name: 'maj11', extensions: '', color: '#4CAF50', tension: 3 },
      { symbol: 'm11', name: 'min11', extensions: '', color: '#9C27B0', tension: 4 },
      { symbol: '13', name: '13', extensions: '', color: '#F44336', tension: 4 },
      
      // Altered chords
      { symbol: '7b9', name: '7♭9', extensions: '', color: '#F44336', tension: 5 },
      { symbol: '7#9', name: '7♯9', extensions: '', color: '#F44336', tension: 5 },
      { symbol: '7b5', name: '7♭5', extensions: '', color: '#F44336', tension: 5 },
      { symbol: '7#5', name: '7♯5', extensions: '', color: '#F44336', tension: 5 },
      
      // Suspended chords
      { symbol: 'sus2', name: 'sus2', extensions: '', color: '#FFC107', tension: 1 },
      { symbol: 'sus4', name: 'sus4', extensions: '', color: '#FFC107', tension: 1 },
      
      // Added tone chords
      { symbol: 'add9', name: 'add9', extensions: '', color: '#4CAF50', tension: 2 },
      { symbol: 'madd9', name: 'madd9', extensions: '', color: '#9C27B0', tension: 3 }
    ];
  
    // Common progression templates with variations
    const progressionTemplates = [
      // Basic progressions
      { degrees: [0, 3, 4], variations: [5, 2], cadence: 'authentic' },
      { degrees: [0, 5, 3, 4], variations: [2, 6], cadence: 'plagal' },
      { degrees: [0, 4, 5, 3], variations: [1, 6], cadence: 'authentic' },
      
      // Jazz progressions
      { degrees: [0, 5, 3, 6], variations: [2, 4], cadence: 'jazz' },
      { degrees: [0, 2, 5, 1], variations: [3, 6], cadence: 'jazz' },
      
      // Blues progressions
      { degrees: [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4], variations: [], cadence: 'blues' },
      
      // Modal progressions
      { degrees: [0, 4, 1, 5], variations: [2, 3], cadence: 'modal' },
      { degrees: [0, 3, 4, 2], variations: [1, 5], cadence: 'modal' },
      
      // Chromatic progressions
      { degrees: [0, 1, 2, 3], variations: [4, 5], cadence: 'chromatic' },
      { degrees: [0, 6, 5, 4], variations: [3, 2], cadence: 'chromatic' }
    ];
  
    // Select a random progression template
    const template = progressionTemplates[Math.floor(Math.random() * progressionTemplates.length)];
    
    // Generate the progression with variations
    const progression = template.degrees.map((degree, index) => {
      // Add some variation (30% chance)
      const useVariation = Math.random() < 0.3 && template.variations.length > 0;
      const finalDegree = useVariation ? 
        template.variations[Math.floor(Math.random() * template.variations.length)] : 
        degree;
      
      // Determine chord type based on degree and scale type
      let chordType;
      if (finalDegree === 0) {
        // Tonic - more likely to be major or maj7
        chordType = Math.random() < 0.7 ? 
          chordTypes.find(t => t.symbol === 'maj7') : 
          chordTypes[Math.floor(Math.random() * 4)];
      } else if (finalDegree === 4) {
        // Dominant - more likely to be 7 or 9
        chordType = Math.random() < 0.6 ? 
          chordTypes.find(t => t.symbol === '7') : 
          chordTypes[Math.floor(Math.random() * 8) + 5];
      } else if (finalDegree === 5) {
        // Submediant - more likely to be minor
        chordType = Math.random() < 0.7 ? 
          chordTypes.find(t => t.symbol === 'm7') : 
          chordTypes[Math.floor(Math.random() * 4) + 1];
      } else {
        // Other degrees - random but weighted by tension
        const tension = [0, 2, 4, 1, 3, 2, 4][finalDegree % 7];
        const possibleTypes = chordTypes.filter(t => t.tension <= tension + 1);
        chordType = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
      }
      
      const root = scale.notes[finalDegree % scale.notes.length];
      const chord = Chord.get(root + chordType.symbol);
      
      // 20% chance to add extensions
      let extensions = '';
      if (Math.random() < 0.2) {
        const possibleExtensions = ['9', '11', '13', 'b9', '#9', 'b5', '#5'];
        extensions = possibleExtensions[Math.floor(Math.random() * possibleExtensions.length)];
      }
      
      return {
        symbol: getRomanNumeral(finalDegree, scaleType),
        name: chord.symbol + extensions,
        fullName: root + chordType.symbol + extensions,
        romanNumeral: getRomanNumeral(finalDegree, scaleType),
        type: chordType.name,
        extensions,
        notes: chord.notes.map(n => n.replace(/\d+$/, '')),
        color: chordType.color,
        degree: finalDegree,
        tension: chordType.tension
      };
    });
  
    // 30% chance to add secondary dominants
    if (Math.random() < 0.3) {
      for (let i = 1; i < progression.length; i++) {
        if (Math.random() < 0.4) {
          const targetDegree = progression[i].degree;
          const secondaryDominant = {
            degree: (targetDegree - 1) % 7,
            symbol: 'V',
            type: 'dom7',
            resolvesTo: targetDegree
          };
          
          const root = scale.notes[secondaryDominant.degree % scale.notes.length];
          const chord = Chord.get(root + '7');
          
          progression.splice(i, 0, {
            symbol: 'V/' + progression[i].symbol,
            name: chord.symbol,
            fullName: root + '7',
            romanNumeral: 'V/' + progression[i].symbol,
            type: 'secondary dominant',
            extensions: '',
            notes: chord.notes.map(n => n.replace(/\d+$/, '')),
            color: '#F44336',
            degree: secondaryDominant.degree,
            tension: 4
          });
          i++; // Skip the next chord
        }
      }
    }
  
    // 20% chance to add modal mixture
    if (Math.random() < 0.2) {
      const mixtureIndex = Math.floor(Math.random() * (progression.length - 1)) + 1;
      const originalChord = progression[mixtureIndex];
      
      // Borrow from parallel mode
      const parallelType = scaleType.includes('minor') ? 'major' : 'harmonic minor';
      const parallelScale = Scale.get(`${selectedKey} ${parallelType}`).notes;
      
      if (parallelScale && parallelScale.length > 0) {
        const root = parallelScale[originalChord.degree % parallelScale.length];
        const chordType = originalChord.type.includes('min') ? 
          chordTypes.find(t => t.symbol === '') : 
          chordTypes.find(t => t.symbol === 'm');
        
        if (chordType) {
          const chord = Chord.get(root + chordType.symbol);
          progression[mixtureIndex] = {
            ...originalChord,
            name: chord.symbol,
            fullName: root + chordType.symbol,
            romanNumeral: originalChord.symbol + ' (♭)',
            type: 'modal mixture',
            notes: chord.notes.map(n => n.replace(/\d+$/, '')),
            color: '#FF5722'
          };
        }
      }
    }
  
    return progression;
  };



  const getChordNotes = (rootMidi, chordType) => {
    const chord = Chord.get(riffGeneratorRef.current.midiToNoteName(rootMidi) + chordType);
    return chord.notes || [riffGeneratorRef.current.midiToNoteName(rootMidi)];
  };







  const getRomanNumeral = (degree, scaleType) => {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    const isMinor = scaleType.includes('minor');
    
    // Lowercase for minor chords in major scale
    if (!isMinor && [2, 3, 6].includes(degree)) {
      return numerals[degree].toLowerCase();
    }
    
    // Diminished symbol for vii° in major or ii° in harmonic minor
    if ((!isMinor && degree === 6) || 
        (scaleType === 'harmonic minor' && degree === 1)) {
      return numerals[degree].toLowerCase() + '°';
    }
    
    return numerals[degree];
  };

  const playChords = (progression) => {
    const startTime = audioContextRef.current.currentTime;
    const chordDuration = (60 / tempo) * 2; // 2 beats per chord

    progression.forEach((chord, index) => {
      const chordStartTime = startTime + (index * chordDuration);

      // Akoru vurgula
      const highlightTimeout = setTimeout(() => {
        setActiveChords([chord.symbol]);
      }, index * chordDuration * 1000);
      activeTimeoutsRef.current.push(highlightTimeout);

      // Akor notalarını çal
      chord.notes.forEach((note, noteIndex) => {
        const noteStartTime = chordStartTime + (noteIndex * 0.1);
        const fullNoteName = note + "4"; // Oktav bilgisi ekle
        instrumentRef.current.play(
          fullNoteName,
          noteStartTime,
          {
            duration: chordDuration * 0.8,
            gain: 0.8 - (noteIndex * 0.1),
            attack: 0.1,
            release: 0.3
          }
        );
      });
    });

    const totalDuration = progression.length * chordDuration;
    const endTimeout = setTimeout(() => {
      setIsPlaying(false);
      setActiveChords([]);
    }, totalDuration * 1000);
    activeTimeoutsRef.current.push(endTimeout);
  };

  const replayChords = () => {
    if (lastPlayedChords.length > 0) {
      playChords(lastPlayedChords);
    }
  };




  

  // Play chord progression
  const playChordProgression = async () => {
    const progression = generateAdvancedChordProgression();
    setChordProgression(progression);
    setLastPlayedChords(progression); // Son çalınan akorları kaydet
    playChords(progression);
  };

  // Generate riff
  const generateRiff = () => {
    const rootMidiNote = getKeyMidiNote(selectedKey);
    const generatedRiff = riffGeneratorRef.current.generateRiff(
      rootMidiNote, 
      scaleType, 
      tempo,
      riffLength
    );
    
    const notesWithNames = generatedRiff.map(note => ({
      ...note,
      name: riffGeneratorRef.current.midiToNoteName(note.midiNote)
    }));
    
    setRiff(notesWithNames); // Use the version with names
    setRiffNotes(notesWithNames.map(note => note.name));
  };

  // Play riff
  const playRiff = () => {
    if (!instrumentRef.current) return;
  
    const isGuitar = instrument.includes('guitar');
    const startTime = audioContextRef.current.currentTime;
  
    riff.forEach((note, index) => {
      const noteStartTime = startTime + getRiffDuration(riff.slice(0, index));
      
      if (isGuitar && note.strumDelay !== undefined) {
        // Guitar strum effect
        instrumentRef.current.play(
          midiToNoteName(note.midiNote),
          noteStartTime + note.strumDelay,
          {
            duration: note.duration * 0.9,
            gain: note.velocity,
            attack: 0.05,
            release: 0.3
          }
        );
      } else {
        // Regular playback
        instrumentRef.current.play(
          midiToNoteName(note.midiNote),
          noteStartTime,
          { 
            duration: note.duration * 0.8,
            gain: note.velocity
          }
        );
      }
    });
  };

  const getRiffDuration = (riffSegment) => {
    return riffSegment.reduce((total, note) => total + note.duration, 0);
  };

  // Circle of fifths
  const createCircleOfFifths = () => {
    const circle = [];
    const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
    
    keys.forEach((currentKey, index) => {
      const isCurrent = currentKey === selectedKey;
      circle.push({
        key: currentKey,
        isCurrent,
        degree: index === 0 ? 'I' : 
               index === 7 ? 'bV' : 
               index < 7 ? `${index}♯` : `${12-index}b`
      });
    });
    
    return circle;
  };

  const circleOfFifths = createCircleOfFifths();

  return (<div>
    <Header language={language} setLanguage={setLanguage} logout={logout} />
      <Subheader language={language} />
         <div className="advanced-riff-generator">
        <div className="main-panel">
        <h1>
            {language === "tr"
              ? "Gelişmiş Riff Üretici"
              : "Advanced Riff Generator"}
          </h1>
          <div className="action-buttons">
          </div>
          <div className="controls">
          <div className="control-group">
              <label>{language === "tr" ? "Ton:" : "Key:"}</label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                disabled={isPlaying}
              >
                {["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F"].map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>{language === "tr" ? "Skala Türü:" : "Scale Type:"}</label>
              <select
                value={scaleType}
                onChange={(e) => setScaleType(e.target.value)}
                disabled={isPlaying}
              >
                {riffGeneratorRef.current.scaleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>
                {language === "tr" ? "Tempo:" : "Tempo:"} {tempo} BPM
              </label>
              <input
                type="range"
                min="40"
                max="200"
                value={tempo}
                onChange={(e) => setTempo(Number(e.target.value))}
                disabled={isPlaying}
              />
            </div>

            <div className="control-group">
              <label>
                {language === "tr" ? "Riff Uzunluğu:" : "Riff Length:"} {riffLength}
              </label>
              <input
                type="range"
                min="4"
                max="16"
                value={riffLength}
                onChange={(e) => setRiffLength(Number(e.target.value))}
                disabled={isPlaying}
              />
            </div>

            <div className="control-group">
  <label>{language === "tr" ? "Enstrüman:" : "Instrument:"}</label>
  <select
    value={instrument}
    onChange={(e) => setInstrument(e.target.value)}
    disabled={isPlaying}
  >
    <option value="acoustic_guitar_nylon">
      {language === "tr" ? "Klasik" : "Nylon Acoustic"}
    </option>
    <option value="acoustic_guitar_steel">
      {language === "tr" ? "Akustik" : "Steel Acoustic"}
    </option>
    <option value="electric_guitar_jazz">
      {language === "tr" ? "Caz Elektro" : "Jazz Electric"}
    </option>
    <option value="electric_guitar_clean">
      {language === "tr" ? "Temiz Elektro" : "Clean Electric"}
    </option>
  </select>
</div>
          </div>

          <div className="action-buttons">
            <button onClick={generateRiff} disabled={isPlaying} className="generate-btn">
              {language === "tr" ? "Riff Üret" : "Generate Riff"}
            </button>
            <button
              onClick={playRiff}
              disabled={riff.length === 0 || isPlaying}
              className="play-btn"
            >
              {language === "tr" ? "Riff Çal" : "Play Riff"}
            </button>
            <button
              onClick={playChordProgression}
              disabled={isPlaying}
              className="chords-btn"
            >
              {language === "tr" ? "Akor Çal" : "Play Chords"}
            </button>
            <button onClick={replayChords} disabled={isPlaying || lastPlayedChords.length === 0} className="replay-btn">
              {language === "tr" ? "Tekrar Çal" : "Replay Chords"}
            </button>
          </div>

          <div className="output-section">
          <div className="riff-output">
  <h2>{language === "tr" ? "Üretilen Riff:" : "Generated Riff:"}</h2>
  {riffNotes.length > 0 ? (
    <div className="notes">
      {riffNotes.map((note, index) => (
        <span key={index} className="note">
          {note}
        </span>
      ))}
    </div>
  ) : (
    <p className="no-riff-message">
      {language === "tr"
        ? "Henüz bir riff üretilmedi."
        : "No riff has been generated yet."}
    </p>
  )}
</div>

<div className="chord-progression">
  <h2>{language === "tr" ? "Akor İlerleyişi:" : "Chord Progression:"}</h2>
  <div className="chord-display-container">
    {/* Roman numeral analysis (I-IV-vi-V etc.) */}
    <div className="roman-numerals">
      {chordProgression.map((chord, index) => (
        <div
          key={`${chord.symbol}-${index}`}
          className={`roman-numeral ${activeChords.includes(chord.symbol) ? "active" : ""}`}
          style={{ color: chord.color }}
        >
          {chord.romanNumeral}
        </div>
      ))}
    </div>

    {/* Full chord names (Cmaj7, G7, etc.) */}
    <div className="chord-names" data-scale-type={scaleType}>
      {chordProgression.map((chord, index) => (
        <div
          key={`${chord.fullName}-${index}`}
          className={`chord-name ${activeChords.includes(chord.symbol) ? "active" : ""}`}
        >
          {chord.fullName}
          {/* Voicing details */}
          <div className="voicing-details">
            <div className="chord-notes">
              {chord.notes.map((note, i) => (
                <span key={i} className="note">{note}</span>
              ))}
            </div>
            {chord.extensions && (
              <div className="extensions">{chord.extensions}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
          </div>
          
        </div>
        
        <div className="notes-image-container">
  <h3 className="notes-image-title">
    {language === "tr" ? "Gitar Klavyesi Görseli" : "Guitar Fretboard Diagram"}
  </h3>
  <img src={notesImage} alt="Notes" className="notes-image" />
</div>
      </div>
      </div>
  );
};

export default AdvancedRiffGenerator;