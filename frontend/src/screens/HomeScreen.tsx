import React, { useState, useEffect, useRef } from 'react';
import { GuidanceData } from '../types';
import { askGita, wakeUpServer } from '../services/api';

interface HomeScreenProps {
  onSaveTeaching?: (teaching: { chapter: number; verse: number; preview: string }) => void;
  onAddReflection?: (entry: { mood: string; teaching: string; reflection: string }) => void;
  onOpenMenu?: () => void;
}

const DEFAULT_SAMPLE_QUERY = "hi i am very sad today, i dont know what to do and how i will succeed in my life, can you help me anyhow ?";

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSaveTeaching,
  onAddReflection,
  onOpenMenu
}) => {
  // Navigation / Query state
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [thought, setThought] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [guidance, setGuidance] = useState<GuidanceData | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isJournalAdded, setIsJournalAdded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSlowResponse, setIsSlowResponse] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Proactively ping server on launch
  useEffect(() => {
    wakeUpServer();
  }, []);

  // Compute time-based greeting, defaulting to "Good evening" if past 4pm or evening
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 16) return 'Good afternoon';
    return 'Good evening';
  };

  const greeting = getGreeting();

  // Slow response warning if server takes > 6s (e.g. Render container waking up)
  useEffect(() => {
    let timer: any;
    if (isAnalyzing) {
      setIsSlowResponse(false);
      timer = setTimeout(() => {
        setIsSlowResponse(true);
      }, 6000);
    } else {
      setIsSlowResponse(false);
    }
    return () => clearTimeout(timer);
  }, [isAnalyzing]);

  // Voice speech recognition
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type your query.");
      return;
    }

    try {
      if (isListening) {
        setIsListening(false);
        return;
      }

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
    } catch {
      setIsListening(false);
    }
  };

  // Submit query
  const handleSubmitQuery = async (queryText?: string, mood = 'neutral') => {
    const textToSubmit = (queryText !== undefined ? queryText : thought).trim();
    if (!textToSubmit) return;

    setSubmittedQuery(textToSubmit);
    setThought('');
    setIsAnalyzing(true);
    setGuidance(null);
    setIsSaved(false);
    setIsJournalAdded(false);

    try {
      const result = await askGita(textToSubmit, mood);
      setGuidance(result);
    } catch (err) {
      console.error("Failed to query Gita Brain", err);
      // Fallback response ensures graceful experience
      setGuidance({
        emotion: "Sadness & Seeking Direction",
        situation: "Facing moments of sorrow and questioning how to find success and peace in life.",
        understanding: "It is natural to feel weighed down when outcomes are unclear. The Gita reminds you that your inner light and strength remain unbroken.",
        chapter: 2,
        verse: 47,
        sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
        transliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
        translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, nor be attached to inaction.",
        guidance: "Do not let anxiety about success paralyze you today. Release the burden of demanding immediate triumph. Channel all your heart into the honest duty before you right now — peace and genuine success naturally follow steadfast action.",
        reflection: "When you act with dedication without clinging to results, your mind becomes still, clear, and fearless.",
        action: "Take one small constructive action today with complete focus and sincerity, offering the results to the divine."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset back to Slide 1 (Default home screen with Krishna)
  const handleResetToDefault = () => {
    setSubmittedQuery(null);
    setGuidance(null);
    setIsAnalyzing(false);
    setThought('');
    setIsSaved(false);
    setIsJournalAdded(false);
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
        reflection: guidance.reflection || guidance.guidance
      });
    }
  };

  const handlePlayShlokaAudio = () => {
    if (!guidance) return;
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const textToSpeak = guidance.sanskrit || guidance.translation;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.88;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Audio speech synthesis not supported in this browser.");
    }
  };

  const isQueryMode = submittedQuery !== null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#FAF7F2',
      color: '#1F1C18',
      position: 'relative'
    }}>
      {/* ───────────────────────────────────────────────────────────
          TOP APP BAR (Maargdarshan + Hamburger Menu)
          Present in both Slide 1 and Slide 2
      ─────────────────────────────────────────────────────────── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px 10px',
        background: '#FAF7F2',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        {/* Hamburger Menu Icon Button */}
        <div style={{ width: '34px', display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1F1C18',
              borderRadius: '8px'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3.5" y1="6.5" x2="20.5" y2="6.5" />
              <line x1="3.5" y1="12" x2="20.5" y2="12" />
              <line x1="3.5" y1="17.5" x2="20.5" y2="17.5" />
            </svg>
          </button>
        </div>

        {/* Center Title: Maargdarshan */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          fontWeight: 600,
          color: '#1F1C18',
          margin: 0,
          letterSpacing: '0.015em',
          textAlign: 'center',
          flex: 1
        }}>
          Maargdarshan
        </h1>

        {/* Right Slot: Return to Home icon in query mode, or empty spacer for centering */}
        <div style={{ width: '34px', display: 'flex', justifyContent: 'flex-end' }}>
          {isQueryMode && (
            <button
              onClick={handleResetToDefault}
              title="Return to Home screen"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6F6B64',
                padding: '6px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────
          SLIDE 1: DEFAULT HOME SCREEN (With Little Krishna & Golden Dune)
      ─────────────────────────────────────────────────────────── */}
      {!isQueryMode && (
        <div className="animate-fade-up" style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          paddingBottom: 100
        }}>
          {/* Hero Illustration: Golden Dune Curve + Little Krishna with Peacock Feather */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '280px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start'
          }}>
            {/* Ambient Warm Golden Glow behind Krishna */}
            <div style={{
              position: 'absolute',
              top: '8%',
              left: '10%',
              width: '300px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(254, 228, 148, 0.4) 0%, rgba(250, 247, 242, 0) 70%)',
              pointerEvents: 'none'
            }} />

            {/* Golden Sand Dune SVG Wave */}
            <svg
              viewBox="0 0 430 260"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            >
              <defs>
                <linearGradient id="goldenDuneGrad" x1="0%" y1="20%" x2="100%" y2="80%">
                  <stop offset="0%" stopColor="#F5BE47" stopOpacity="0.95" />
                  <stop offset="42%" stopColor="#F8D878" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#FCF0CD" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* The rising golden dune curve matching the screenshot */}
              <path
                d="M -10,185 C 85,135 220,115 445,130 L 445,260 L -10,260 Z"
                fill="url(#goldenDuneGrad)"
              />
            </svg>

            {/* Character: Little Krishna holding peacock feather */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              marginLeft: '16px',
              marginBottom: '10px'
            }}>
              <img
                src="/krishna.png"
                alt="Bal Krishna with peacock feather"
                style={{
                  height: '240px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'drop-shadow(0 6px 14px rgba(210, 150, 40, 0.15))'
                }}
              />
            </div>
          </div>

          {/* Heading & Subtext matching left slide */}
          <div style={{ padding: '12px 24px 16px' }}>
            <p style={{
              fontSize: '14.5px',
              color: '#706C64',
              fontWeight: 400,
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em'
            }}>
              {greeting}
            </p>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 700,
              color: '#1F1C18',
              lineHeight: 1.18,
              margin: '0 0 10px 0',
              letterSpacing: '-0.015em'
            }}>
              What's on your mind?
            </h2>

            <p style={{
              fontSize: '15px',
              color: '#706C64',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '340px'
            }}>
              Share what you're going through. We'll help you explore it through the wisdom of the Gita.
            </p>
          </div>

          {/* Subtle quick test chip for the user's exact query */}
          <div style={{ padding: '4px 24px 24px' }}>
            <button
              onClick={() => handleSubmitQuery(DEFAULT_SAMPLE_QUERY, 'Sad')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(30, 94, 58, 0.05)',
                border: '1px solid rgba(30, 94, 58, 0.18)',
                borderRadius: '20px',
                padding: '6px 14px',
                color: '#1E5E3A',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(30, 94, 58, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(30, 94, 58, 0.05)';
              }}
            >
              <span>Try sample query from slide: "I am very sad today..."</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Calming spacious breathing room below, matching the screenshot */}
          <div style={{ flex: 1, minHeight: '120px' }} />
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          SLIDE 2: QUERY MODE SCREEN (User bubble on right + Wisdom answer)
          Character illustration is hidden as instructed
      ─────────────────────────────────────────────────────────── */}
      {isQueryMode && (
        <div className="animate-fade-up" style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '12px 22px 110px'
        }}>
          {/* Top text area shifted comfortably up, exactly as on the right slide */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{
              fontSize: '14.5px',
              color: '#706C64',
              fontWeight: 400,
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em'
            }}>
              {greeting}
            </p>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 700,
              color: '#1F1C18',
              lineHeight: 1.18,
              margin: '0 0 10px 0',
              letterSpacing: '-0.015em'
            }}>
              What's on your mind?
            </h2>

            <p style={{
              fontSize: '15px',
              color: '#706C64',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '350px'
            }}>
              Share what you're going through. We'll help you explore it through the wisdom of the Gita.
            </p>
          </div>

          {/* User's Query Bubble: Soft Sage Green, aligned to right, matching Slide 2 */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '26px'
          }}>
            <div style={{
              background: '#D5E2D6',
              color: '#222E25',
              padding: '16px 20px',
              borderRadius: '20px 20px 4px 20px',
              maxWidth: '85%',
              fontSize: '14.5px',
              lineHeight: 1.45,
              fontWeight: 400,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              wordBreak: 'break-word'
            }}>
              {submittedQuery}
            </div>
          </div>

          {/* Loading State: Consulting the Gita */}
          {isAnalyzing && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '36px 20px',
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #ECE6DD',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              gap: '14px',
              textAlign: 'center'
            }}>
              <div className="animate-pulse-soft" style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(30, 94, 58, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1E5E3A'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>

              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1F1C18',
                  margin: '0 0 4px 0'
                }}>
                  Consulting the Gita corpus...
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#706C64',
                  margin: 0,
                  maxWidth: '260px',
                  lineHeight: 1.5
                }}>
                  Retrieving relevant shlokas for your inquiry.
                </p>
              </div>

              {isSlowResponse && (
                <div style={{
                  fontSize: '12px',
                  color: '#8A6D3B',
                  background: '#FFF9E6',
                  border: '1px solid #F3E5AB',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  marginTop: '4px'
                }}>
                  Waking up cloud server... (Render free tier may take up to 30s)
                </div>
              )}
            </div>
          )}

          {/* Response State: Guidance Card in light aesthetic */}
          {guidance && !isAnalyzing && (
            <div className="animate-fade-up" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Card Container */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #ECE6DD',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
              }}>
                {/* Header Tag / Chapter Pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  borderBottom: '1px solid #F4EFE6',
                  paddingBottom: '14px'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(30, 94, 58, 0.08)',
                    color: '#1E5E3A',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.04em'
                  }}>
                    <span>Bhagavad Gita {guidance.chapter}.{guidance.verse}</span>
                  </div>

                  {/* Audio pronounce button */}
                  <button
                    onClick={handlePlayShlokaAudio}
                    title="Listen to Shloka"
                    style={{
                      background: isPlayingAudio ? 'rgba(30, 94, 58, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: isPlayingAudio ? '#1E5E3A' : '#706C64',
                      transition: 'all 0.15s'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </button>
                </div>

                {/* Empathy / Emotional Resonance */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#1E5E3A',
                    marginBottom: '4px'
                  }}>
                    Insight on your state
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '19px',
                    fontWeight: 600,
                    color: '#1F1C18',
                    lineHeight: 1.3,
                    margin: '0 0 8px 0'
                  }}>
                    {guidance.emotion}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#706C64',
                    lineHeight: 1.55,
                    margin: 0
                  }}>
                    {guidance.understanding}
                  </p>
                </div>

                {/* Sanskrit Shloka Box */}
                {guidance.sanskrit && (
                  <div style={{
                    background: '#FAF7F2',
                    borderRadius: '16px',
                    border: '1px solid #ECE5DC',
                    padding: '16px',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '16.5px',
                      color: '#1F1C18',
                      lineHeight: 1.8,
                      margin: '0 0 8px 0',
                      whiteSpace: 'pre-line',
                      fontWeight: 600
                    }}>
                      {guidance.sanskrit}
                    </p>
                    {guidance.transliteration && (
                      <p style={{
                        fontSize: '12.5px',
                        fontStyle: 'italic',
                        color: '#7A756D',
                        lineHeight: 1.6,
                        margin: 0
                      }}>
                        {guidance.transliteration}
                      </p>
                    )}
                  </div>
                )}

                {/* English Translation */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#8C867D',
                    marginBottom: '6px'
                  }}>
                    Verse Translation
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#2E2B27',
                    lineHeight: 1.65,
                    fontStyle: 'italic',
                    margin: 0
                  }}>
                    "{guidance.translation}"
                  </p>
                </div>

                {/* Krishna's Practical Guidance */}
                <div style={{
                  background: 'rgba(30, 94, 58, 0.04)',
                  borderLeft: '3px solid #1E5E3A',
                  padding: '14px 16px',
                  borderRadius: '0 12px 12px 0',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#1E5E3A',
                    marginBottom: '6px'
                  }}>
                    Gita's Counsel For You
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#1F1C18',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    {guidance.guidance}
                  </p>
                </div>

                {/* Practical Action Step */}
                {guidance.action && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#8C867D',
                      marginBottom: '6px'
                    }}>
                      Daily Practice
                    </div>
                    <p style={{
                      fontSize: '13.5px',
                      color: '#4A463F',
                      lineHeight: 1.55,
                      margin: 0
                    }}>
                      {guidance.action}
                    </p>
                  </div>
                )}

                {/* Action Buttons: Save Teaching & Add to Journal */}
                <div style={{ display: 'flex', gap: '10px', paddingTop: '6px' }}>
                  <button
                    onClick={handleSaveTeachingClick}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: isSaved ? '#1E5E3A' : '#FAF7F2',
                      color: isSaved ? '#FFFFFF' : '#1F1C18',
                      border: isSaved ? '1px solid #1E5E3A' : '1px solid #ECE6DD',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{isSaved ? 'Saved to Profile' : 'Save Teaching'}</span>
                  </button>

                  <button
                    onClick={handleAddJournalClick}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: isJournalAdded ? '#1E5E3A' : '#FAF7F2',
                      color: isJournalAdded ? '#FFFFFF' : '#1F1C18',
                      border: isJournalAdded ? '1px solid #1E5E3A' : '1px solid #ECE6DD',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <span>{isJournalAdded ? 'Added to Journal' : 'Add to Journal'}</span>
                  </button>
                </div>
              </div>

              {/* Reset to Slide 1 CTA */}
              <button
                onClick={handleResetToDefault}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '13px 20px',
                  borderRadius: '14px',
                  background: 'transparent',
                  border: '1px solid #ECE6DD',
                  color: '#706C64',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#1E5E3A';
                  e.currentTarget.style.borderColor = '#1E5E3A';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#706C64';
                  e.currentTarget.style.borderColor = '#ECE6DD';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Ask another question (Return to Home)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          BOTTOM FLOATING INPUT PILL
          White capsule with microphone icon on right, fixed above bottom nav
      ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        bottom: 74,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        padding: '0 20px',
        boxSizing: 'border-box',
        zIndex: 50,
        pointerEvents: 'none'
      }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #ECE5DC',
          borderRadius: '30px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px 0 22px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
          pointerEvents: 'auto',
          transition: 'all 0.2s ease'
        }}>
          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={thought}
            onChange={e => setThought(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmitQuery();
              }
            }}
            placeholder="Tell me what's bothering you..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontFamily: 'inherit',
              color: '#1F1C18',
              padding: 0
            }}
          />

          {/* Send Arrow Button (Appears if user types text) */}
          {thought.trim().length > 0 && (
            <button
              onClick={() => handleSubmitQuery()}
              aria-label="Submit query"
              style={{
                background: '#1E5E3A',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                marginRight: '6px',
                transition: 'transform 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" />
              </svg>
            </button>
          )}

          {/* Microphone Icon Button */}
          <button
            onClick={handleVoiceInput}
            aria-label={isListening ? "Listening for speech" : "Start voice input"}
            title={isListening ? "Listening..." : "Speak your mind"}
            style={{
              background: isListening ? 'rgba(30, 94, 58, 0.12)' : 'none',
              border: isListening ? '1px solid #1E5E3A' : 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isListening ? '#1E5E3A' : '#5C5750',
              transition: 'all 0.18s'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
