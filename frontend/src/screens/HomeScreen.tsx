import React, { useState, useEffect } from 'react';
import { LotusIcon } from '../components/LotusIcon';
import { GuidanceData } from '../types';
import { QUICK_START_CHIPS } from '../data/gitaData';
import { askGita, wakeUpServer } from '../services/api';

interface HomeScreenProps {
  onSaveTeaching?: (teaching: { chapter: number; verse: number; preview: string }) => void;
  onAddReflection?: (entry: { mood: string; teaching: string; reflection: string }) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSaveTeaching,
  onAddReflection
}) => {
  const [stage, setStage] = useState<'input' | 'analyzing' | 'confirmation' | 'guidance'>('input');
  const [thought, setThought] = useState('');
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [guidance, setGuidance] = useState<GuidanceData | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isJournalAdded, setIsJournalAdded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSlowResponse, setIsSlowResponse] = useState(false);

  // Proactively ping server on launch to wake up Render if sleeping
  useEffect(() => {
    wakeUpServer();
  }, []);

  // Show friendly notice if analyzing takes longer than 6s (e.g. Render spin-up)
  useEffect(() => {
    let timer: any;
    if (stage === 'analyzing') {
      setIsSlowResponse(false);
      timer = setTimeout(() => {
        setIsSlowResponse(true);
      }, 6000);
    } else {
      setIsSlowResponse(false);
    }
    return () => clearTimeout(timer);
  }, [stage]);

  // Handle Speech Recognition
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser/device.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setThought(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Submit query to Gita Brain backend
  const handleSubmit = async (overrideMood?: string, overrideText?: string) => {
    const qText = overrideText !== undefined ? overrideText : thought;
    const mood = overrideMood || selectedMood || 'neutral';
    if (!qText.trim()) return;

    setStage('analyzing');
    setIsSaved(false);
    setIsJournalAdded(false);
    setReflectionText('');

    try {
      // Call live backend
      const result = await askGita(qText, mood);
      setGuidance(result);
      setStage('confirmation');
    } catch (err) {
      console.error("Query failed", err);
      setStage('input');
    }
  };

  const handleReset = () => {
    setStage('input');
    setThought('');
    setGuidance(null);
    setIsSaved(false);
    setIsJournalAdded(false);
    setReflectionText('');
  };

  const handleSaveTeachingClick = () => {
    if (!guidance) return;
    setIsSaved(prev => !prev);
    if (!isSaved && onSaveTeaching) {
      onSaveTeaching({
        chapter: guidance.chapter,
        verse: guidance.verse,
        preview: guidance.translation ? `${guidance.translation.slice(0, 80)}...` : ''
      });
    }
  };

  const handleAddJournalClick = () => {
    if (!guidance) return;
    setIsJournalAdded(true);
    if (onAddReflection) {
      onAddReflection({
        mood: guidance.emotion.split('+')[0].trim() || 'Seeking',
        teaching: `Bhagavad Gita ${guidance.chapter}.${guidance.verse}`,
        reflection: reflectionText || guidance.reflection
      });
    }
  };

  // 1. ANALYZING SCREEN
  if (stage === 'analyzing') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 24,
        padding: '0 32px'
      }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            className="animate-pulse-soft"
            style={{
              position: 'absolute',
              width: 130,
              height: 130,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,160,80,0.2) 0%, transparent 70%)'
            }}
          />
          <LotusIcon size={76} opacity={0.8} spin={true} />
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24,
          color: '#ede9f8',
          textAlign: 'center',
          lineHeight: 1.4,
          fontWeight: 400
        }}>
          Finding relevant wisdom...
        </div>
        <p style={{
          fontSize: 14,
          color: '#6b6487',
          textAlign: 'center',
          lineHeight: 1.6
        }}>
          Consulting the Bhagavad Gita corpus
        </p>
        {isSlowResponse && (
          <div style={{
            fontSize: 12,
            color: '#d4a050',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: 300,
            background: 'rgba(212,160,80,0.08)',
            padding: '10px 16px',
            borderRadius: 12,
            border: '1px solid rgba(212,160,80,0.2)'
          }}>
            Connecting to cloud server... (Render free tier may take up to 40s if waking from sleep)
          </div>
        )}
      </div>
    );
  }

  // 2. CONFIRMATION SCREEN (Empathy Check)
  if (stage === 'confirmation' && guidance) {
    return (
      <div style={{
        padding: '72px 22px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        <div className="animate-fade-up" style={{ opacity: 0 }}>
          <p style={{
            fontSize: 13,
            color: '#d4a050',
            fontWeight: 500,
            marginBottom: 6
          }}>
            It sounds like you're dealing with
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 30,
            color: '#ede9f8',
            lineHeight: 1.25,
            marginBottom: 6,
            fontWeight: 400
          }}>
            {guidance.emotion}
          </h2>
          <p style={{ fontSize: 14, color: '#6b6487' }}>
            {guidance.situation}
          </p>
        </div>

        <div className="animate-fade-up delay-200" style={{
          opacity: 0,
          background: 'rgba(212,160,80,0.05)',
          border: '1px solid rgba(212,160,80,0.15)',
          borderRadius: 16,
          padding: '20px'
        }}>
          <p style={{ fontSize: 15, color: '#c4bedd', lineHeight: 1.8 }}>
            {guidance.understanding}
          </p>
        </div>

        <div className="animate-fade-up delay-400" style={{
          opacity: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginTop: 8
        }}>
          <button
            onClick={() => setStage('guidance')}
            style={{
              background: '#d4a050',
              color: '#0e0c1b',
              borderRadius: 14,
              padding: '17px',
              fontWeight: 600,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            That's right — show me the teaching
          </button>
          <button
            onClick={handleReset}
            style={{
              background: 'transparent',
              color: '#6b6487',
              borderRadius: 14,
              padding: '15px',
              fontSize: 14,
              border: '1px solid #2d2748',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Not quite — let me try again
          </button>
        </div>
      </div>
    );
  }

  // 3. GUIDANCE SCREEN (Teaching, Sanskrit, Meaning, Reflection, Action)
  if (stage === 'guidance' && guidance) {
    return (
      <div style={{
        padding: '52px 20px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 28
      }}>
        <button
          onClick={handleReset}
          style={{
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#4a4464',
            fontSize: 13,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to home
        </button>

        {/* Section 1: Understanding You */}
        <div className="animate-fade-up delay-100" style={{ opacity: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', color: '#d4a050', textTransform: 'uppercase', marginBottom: 10 }}>
            Understanding You
          </div>
          <p style={{ fontSize: 15, color: '#c4bedd', lineHeight: 1.8 }}>
            {guidance.understanding}
          </p>
        </div>

        {/* Section 2: Relevant Teaching (Verse Card) */}
        <div className="animate-fade-up delay-200" style={{ opacity: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', color: '#c17b8a', textTransform: 'uppercase', marginBottom: 10 }}>
            Relevant Teaching
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(42,36,68,0.85), rgba(24,20,44,0.95))',
            border: '1px solid rgba(212,160,80,0.2)',
            borderRadius: 18,
            padding: '22px 20px'
          }}>
            <div style={{ fontSize: 11, color: '#d4a050', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
              Bhagavad Gita — Chapter {guidance.chapter}, Verse {guidance.verse}
            </div>
            {guidance.sanskrit && (
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 16,
                color: '#ede9f8',
                lineHeight: 1.85,
                marginBottom: 14,
                whiteSpace: 'pre-line',
                fontWeight: 400
              }}>
                {guidance.sanskrit}
              </div>
            )}
            {guidance.transliteration && (
              <div style={{ fontSize: 12, color: '#6b6487', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 18 }}>
                {guidance.transliteration}
              </div>
            )}
            <div style={{ borderTop: '1px solid rgba(212,160,80,0.12)', paddingTop: 16 }}>
              <p style={{ fontSize: 14, color: '#c4bedd', lineHeight: 1.75, fontStyle: 'italic' }}>
                "{guidance.translation}"
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: What It Means */}
        {guidance.meaning && (
          <div className="animate-fade-up delay-300" style={{ opacity: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', color: '#7a9baa', textTransform: 'uppercase', marginBottom: 10 }}>
              What It Means
            </div>
            <p style={{ fontSize: 15, color: '#c4bedd', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {guidance.meaning}
            </p>
          </div>
        )}

        {/* Section 4: Apply It To Your Situation */}
        {guidance.application && (
          <div className="animate-fade-up delay-400" style={{ opacity: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', color: '#5b8a6f', textTransform: 'uppercase', marginBottom: 10 }}>
              Apply It To Your Situation
            </div>
            <div style={{
              background: 'rgba(91,138,111,0.07)',
              border: '1px solid rgba(91,138,111,0.2)',
              borderRadius: 14,
              padding: '17px 18px'
            }}>
              <p style={{ fontSize: 15, color: '#c4bedd', lineHeight: 1.8 }}>
                {guidance.application}
              </p>
            </div>
          </div>
        )}

        {/* Section 5: Reflect */}
        <div className="animate-fade-up delay-500" style={{ opacity: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', color: '#9b7aa0', textTransform: 'uppercase', marginBottom: 10 }}>
            Reflect
          </div>
          <div style={{
            background: 'rgba(155,122,160,0.07)',
            border: '1px solid rgba(155,122,160,0.2)',
            borderRadius: 14,
            padding: '17px 18px',
            marginBottom: 12
          }}>
            <p style={{ fontSize: 15, color: '#ede9f8', lineHeight: 1.75, fontStyle: 'italic' }}>
              "{guidance.reflection}"
            </p>
          </div>
          <textarea
            value={reflectionText}
            onChange={e => setReflectionText(e.target.value)}
            placeholder="Write your reflection here..."
            rows={4}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid #2d2748',
              borderRadius: 12,
              padding: '14px 16px',
              color: '#c4bedd',
              fontSize: 14,
              lineHeight: 1.7,
              resize: 'none',
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        </div>

        {/* Section 6: One Small Action */}
        {guidance.action && (
          <div className="animate-fade-up delay-600" style={{ opacity: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', color: '#d4a050', textTransform: 'uppercase', marginBottom: 10 }}>
              One Small Action
            </div>
            <div style={{
              background: 'rgba(212,160,80,0.06)',
              border: '1px solid rgba(212,160,80,0.22)',
              borderRadius: 14,
              padding: '17px 18px'
            }}>
              <p style={{ fontSize: 15, color: '#c4bedd', lineHeight: 1.8 }}>
                {guidance.action}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="animate-fade-up delay-700" style={{ opacity: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              onClick={handleSaveTeachingClick}
              style={{
                background: isSaved ? 'rgba(212,160,80,0.2)' : 'rgba(212,160,80,0.08)',
                border: `1px solid ${isSaved ? 'rgba(212,160,80,0.5)' : 'rgba(212,160,80,0.2)'}`,
                borderRadius: 12,
                padding: '14px',
                color: '#d4a050',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isSaved ? '✓ Saved' : 'Save Teaching'}
            </button>
            <button
              onClick={handleAddJournalClick}
              style={{
                background: isJournalAdded ? 'rgba(91,138,111,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isJournalAdded ? 'rgba(91,138,111,0.4)' : '#2d2748'}`,
                borderRadius: 12,
                padding: '14px',
                color: isJournalAdded ? '#7aba94' : '#8b85a8',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              {isJournalAdded ? '✓ In Journal' : 'Add to Journal'}
            </button>
          </div>
          <button
            onClick={handleReset}
            style={{
              background: '#d4a050',
              color: '#0e0c1b',
              borderRadius: 14,
              padding: '17px',
              fontWeight: 600,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Continue Conversation
          </button>
        </div>
      </div>
    );
  }

  // 4. DEFAULT INPUT SCREEN
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Header with Lotus and Title */}
      <div style={{
        padding: '60px 24px 28px',
        background: 'radial-gradient(ellipse 80% 60% at 50% -5%, rgba(212,160,80,0.13) 0%, transparent 65%)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <LotusIcon size={58} opacity={0.5} />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 34,
          color: '#ede9f8',
          lineHeight: 1.2,
          marginBottom: 12,
          fontWeight: 400
        }}>
          What is on your mind?
        </h1>
        <p style={{ color: '#6b6487', fontSize: 14, lineHeight: 1.7 }}>
          Share what you're going through.<br />
          Find perspective through the wisdom of the Gita.
        </p>
      </div>

      {/* Input & Form */}
      <div style={{ padding: '0 18px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <textarea
          value={thought}
          onChange={e => setThought(e.target.value)}
          placeholder="Write what you're feeling..."
          rows={5}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid #2d2748',
            borderRadius: 16,
            padding: '18px',
            color: '#ede9f8',
            fontSize: 15,
            lineHeight: 1.7,
            resize: 'none',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,160,80,0.4)'}
          onBlur={e => e.currentTarget.style.borderColor = '#2d2748'}
        />

        {/* Speak your mind button */}
        <button
          onClick={handleVoiceInput}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: isListening ? 'rgba(212,160,80,0.15)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isListening ? '#d4a050' : '#2d2748'}`,
            borderRadius: 12,
            padding: '13px',
            color: isListening ? '#d4a050' : '#6b6487',
            fontSize: 13,
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.15s'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          {isListening ? 'Listening...' : 'Speak your mind'}
        </button>

        {/* Find Guidance CTA */}
        <button
          onClick={() => handleSubmit()}
          disabled={!thought.trim()}
          style={{
            background: thought.trim() ? '#d4a050' : 'rgba(212,160,80,0.15)',
            color: thought.trim() ? '#0e0c1b' : '#4a4464',
            borderRadius: 14,
            padding: '18px',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            cursor: thought.trim() ? 'pointer' : 'default',
            width: '100%',
            transition: 'all 0.2s'
          }}
        >
          Find Guidance
        </button>

        {/* Quick Start Chips */}
        <div style={{ paddingTop: 4 }}>
          <p style={{
            fontSize: 11,
            color: '#3a3458',
            fontWeight: 600,
            marginBottom: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            Quick start
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {QUICK_START_CHIPS.map(chip => (
              <button
                key={chip.label}
                onClick={() => {
                  setThought(chip.label);
                  setSelectedMood(chip.key);
                  handleSubmit(chip.key, chip.label);
                }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid #2d2748',
                  borderRadius: 20,
                  padding: '8px 15px',
                  color: '#6b6487',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Today's Wisdom Card */}
        <div
          onClick={() => {
            setThought("Tell me about the Yoga of Action in Chapter 3");
            handleSubmit('neutral', "Tell me about the Yoga of Action in Chapter 3");
          }}
          style={{
            marginTop: 8,
            background: 'linear-gradient(135deg, rgba(34,29,58,0.8), rgba(22,18,42,0.9))',
            border: '1px solid rgba(212,160,80,0.12)',
            borderRadius: 18,
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: '#d4a050', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>
              Today's Wisdom
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#ede9f8', lineHeight: 1.4, marginBottom: 3, fontWeight: 400 }}>
              Yoga of Action
            </div>
            <div style={{ fontSize: 12, color: '#4a4464' }}>
              Bhagavad Gita 3.27
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, flexShrink: 0 }}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};
