import React, { useState, useEffect, useRef } from 'react';
import { GuidanceData } from '../types';
import { askGita, wakeUpServer } from '../services/api';
import { getGuidanceForThought } from '../data/gitaData';
import { Language, TRANSLATIONS } from '../utils/translations';

interface HomeScreenProps {
  onAddReflection?: (entry: { mood: string; teaching: string; reflection: string }) => void;
  onOpenMenu?: () => void;
  language?: Language;
  theme?: 'light' | 'dark';
}

const DEFAULT_SAMPLE_QUERY = "hi i am very sad today, i dont know what to do and how i will succeed in my life, can you help me anyhow ?";

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onAddReflection,
  onOpenMenu,
  language = 'en',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Navigation / Query state
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [thought, setThought] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [guidance, setGuidance] = useState<GuidanceData | null>(null);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Proactively ping server on launch
  useEffect(() => {
    wakeUpServer();
  }, []);

  // Compute time-based greeting, defaulting to "Good evening" if past 4pm or evening
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return t.greetingMorning;
    if (hour >= 12 && hour < 16) return t.greetingAfternoon;
    if (hour >= 16 && hour < 21) return t.greetingEvening;
    return t.greetingNight;
  };

  const greeting = getGreeting();

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

    const detectedMood = mood !== 'neutral' ? mood : (
      /anger|angry|furious|rage|betray|cheat|lied|disrespect|unfair|fight|quarrel/i.test(textToSubmit) ? 'angry' :
      /sad|crying|sorrow|grief|lost someone|death|died|hopeless|hurt|depressed/i.test(textToSubmit) ? 'sad' :
      /fail|failed|failure|exam|interview|rejection|rejected|loser/i.test(textToSubmit) ? 'failure' :
      /confus|career|choice|what should i do|what to do|dilemma|path|purpose/i.test(textToSubmit) ? 'confused' :
      /anxious|anxiety|fear|scared|worried|worry|nervous|panic|stress|overwhelm/i.test(textToSubmit) ? 'anxious' :
      /mind|overthink|focus|concentrat|meditat|distract|peace of mind/i.test(textToSubmit) ? 'mind' :
      /thank|grateful|gratitude|bhakti|krishna|god|divine|prayer|joy/i.test(textToSubmit) ? 'devotion' :
      'neutral'
    );

    try {
      const result = await askGita(textToSubmit, detectedMood);
      setGuidance(result);
    } catch (err) {
      console.error("Failed to query Gita Brain", err);
      // Dynamic fallback based on user's inquiry ensures relevant Gita guidance
      const contextual = getGuidanceForThought(textToSubmit, detectedMood);
      setGuidance(contextual);
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
  };

  const isQueryMode = submittedQuery !== null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 76px)',
      flex: 1,
      background: isDark ? '#121614' : '#FAF7F2',
      color: isDark ? '#F3F0EA' : '#1F1C18',
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
        paddingTop: 'max(16px, calc(env(safe-area-inset-top, 0px) + 12px))',
        background: isDark ? '#121614' : '#FAF7F2',
        borderBottom: isDark ? '1px solid #29342D' : 'none',
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
              color: isDark ? '#F3F0EA' : '#1F1C18',
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
          color: isDark ? '#F3F0EA' : '#1F1C18',
          margin: 0,
          letterSpacing: '0.015em',
          textAlign: 'center',
          flex: 1
        }}>
          {t.drawerTitle}
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
                color: isDark ? '#9CA3AF' : '#6F6B64',
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
              background: isDark
                ? 'radial-gradient(circle, rgba(212, 160, 80, 0.22) 0%, rgba(18, 22, 20, 0) 70%)'
                : 'radial-gradient(circle, rgba(254, 228, 148, 0.4) 0%, rgba(250, 247, 242, 0) 70%)',
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
                  <stop offset="0%" stopColor={isDark ? "#C9942A" : "#F5BE47"} stopOpacity={isDark ? 0.80 : 0.95} />
                  <stop offset="42%" stopColor={isDark ? "#8C661D" : "#F8D878"} stopOpacity={isDark ? 0.60 : 0.85} />
                  <stop offset="80%" stopColor={isDark ? "#3A2D14" : "#FCF0CD"} stopOpacity={isDark ? 0.35 : 0.4} />
                  <stop offset="100%" stopColor={isDark ? "#121614" : "#FAF7F2"} stopOpacity="0.0" />
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
                src="./krishna.png"
                alt="Bal Krishna with peacock feather"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('android_asset')) {
                    target.src = 'file:///android_asset/krishna.png';
                  }
                }}
                style={{
                  height: '240px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  filter: isDark
                    ? 'drop-shadow(0 6px 16px rgba(0, 0, 0, 0.4))'
                    : 'drop-shadow(0 6px 14px rgba(210, 150, 40, 0.15))'
                }}
              />
            </div>
          </div>

          {/* Heading & Subtext matching left slide */}
          <div style={{ padding: '12px 24px 16px' }}>
            <p style={{
              fontSize: '14.5px',
              color: isDark ? '#9CA3AF' : '#706C64',
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
              color: isDark ? '#F3F0EA' : '#1F1C18',
              lineHeight: 1.18,
              margin: '0 0 10px 0',
              letterSpacing: '-0.015em'
            }}>
              {language === 'hi' ? 'आपके मन में क्या चल रहा है?' : "What's on your mind?"}
            </h2>

            <p style={{
              fontSize: '15px',
              color: isDark ? '#9CA3AF' : '#706C64',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '340px'
            }}>
              {language === 'hi'
                ? 'अपने विचार साझा करें। गीता के शाश्वत ज्ञान से हम सही मार्गदर्शन पाने में आपकी सहायता करेंगे।'
                : "Share what you're going through. We'll help you explore it through the wisdom of the Gita."}
            </p>
          </div>

          {/* Subtle quick test chip for the user's exact query */}
          <div style={{ padding: '4px 24px 24px' }}>
            <button
              onClick={() => handleSubmitQuery(language === 'hi' ? "नमस्ते, आज मैं बहुत उदास हूँ, मुझे समझ नहीं आ रहा क्या करूँ, क्या आप मार्गदर्शन कर सकते हैं?" : DEFAULT_SAMPLE_QUERY, 'Sad')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: isDark ? 'rgba(74, 222, 128, 0.1)' : 'rgba(30, 94, 58, 0.05)',
                border: isDark ? '1px solid rgba(74, 222, 128, 0.25)' : '1px solid rgba(30, 94, 58, 0.18)',
                borderRadius: '20px',
                padding: '6px 14px',
                color: isDark ? '#4ADE80' : '#1E5E3A',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? 'rgba(74, 222, 128, 0.18)' : 'rgba(30, 94, 58, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isDark ? 'rgba(74, 222, 128, 0.1)' : 'rgba(30, 94, 58, 0.05)';
              }}
            >
              <span>{language === 'hi' ? 'नमूना प्रश्न आजमाएं: "आज मैं बहुत उदास हूँ..."' : 'Try sample query from slide: "I am very sad today..."'}</span>
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
              color: isDark ? '#9CA3AF' : '#706C64',
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
              color: isDark ? '#F3F0EA' : '#1F1C18',
              lineHeight: 1.18,
              margin: '0 0 10px 0',
              letterSpacing: '-0.015em'
            }}>
              {language === 'hi' ? 'आपके मन में क्या चल रहा है?' : "What's on your mind?"}
            </h2>

            <p style={{
              fontSize: '15px',
              color: isDark ? '#9CA3AF' : '#706C64',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '350px'
            }}>
              {language === 'hi'
                ? 'अपने विचार साझा करें। गीता के शाश्वत ज्ञान से हम सही मार्गदर्शन पाने में आपकी सहायता करेंगे।'
                : "Share what you're going through. We'll help you explore it through the wisdom of the Gita."}
            </p>
          </div>

          {/* User's Query Bubble: Soft Sage Green, aligned to right, matching Slide 2 */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '26px'
          }}>
            <div style={{
              background: isDark ? '#1F3526' : '#D5E2D6',
              color: isDark ? '#E8F5E9' : '#222E25',
              border: isDark ? '1px solid #2B4E37' : 'none',
              padding: '16px 20px',
              borderRadius: '20px 20px 4px 20px',
              maxWidth: '85%',
              fontSize: '14.5px',
              lineHeight: 1.45,
              fontWeight: 400,
              boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
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
              background: isDark ? '#1E2621' : '#FFFFFF',
              borderRadius: '24px',
              border: isDark ? '1px solid #29342D' : '1px solid #ECE6DD',
              boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.35)' : '0 4px 20px rgba(0, 0, 0, 0.04)',
              gap: '14px',
              textAlign: 'center'
            }}>
              <div className="animate-pulse-soft" style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: isDark ? 'rgba(74, 222, 128, 0.15)' : 'rgba(30, 94, 58, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#4ADE80' : '#1E5E3A'
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
                  color: isDark ? '#F3F0EA' : '#1F1C18',
                  margin: '0 0 4px 0'
                }}>
                  {language === 'hi' ? 'गीता ज्ञान से परामर्श ले रहे हैं...' : 'Consulting the Gita corpus...'}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: isDark ? '#9CA3AF' : '#706C64',
                  margin: 0,
                  maxWidth: '260px',
                  lineHeight: 1.5
                }}>
                  {language === 'hi' ? 'आपके प्रश्न के लिए उपयुक्त श्लोक खोजे जा रहे हैं।' : 'Retrieving relevant shlokas for your inquiry.'}
                </p>
              </div>
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
                background: isDark ? '#1E2621' : '#FFFFFF',
                borderRadius: '24px',
                border: isDark ? '1px solid #29342D' : '1px solid #ECE6DD',
                padding: '24px',
                boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.35)' : '0 4px 20px rgba(0, 0, 0, 0.04)'
              }}>
                {/* Header Tag / Chapter Pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  borderBottom: isDark ? '1px solid #29342D' : '1px solid #F4EFE6',
                  paddingBottom: '14px'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: isDark ? 'rgba(74, 222, 128, 0.15)' : 'rgba(30, 94, 58, 0.08)',
                    color: isDark ? '#4ADE80' : '#1E5E3A',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.04em'
                  }}>
                    <span>Bhagavad Gita {guidance.chapter}.{guidance.verse}</span>
                  </div>
                </div>

                {/* Empathy / Emotional Resonance */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isDark ? '#4ADE80' : '#1E5E3A',
                    marginBottom: '4px'
                  }}>
                    Insight on your state
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '19px',
                    fontWeight: 600,
                    color: isDark ? '#F3F0EA' : '#1F1C18',
                    lineHeight: 1.3,
                    margin: '0 0 8px 0'
                  }}>
                    {guidance.emotion}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: isDark ? '#D1D5DB' : '#706C64',
                    lineHeight: 1.55,
                    margin: 0
                  }}>
                    {guidance.understanding}
                  </p>
                </div>

                {/* Sanskrit Shloka Box */}
                {guidance.sanskrit && (
                  <div style={{
                    background: isDark ? '#161C18' : '#FAF7F2',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #2B372F' : '1px solid #ECE5DC',
                    padding: '16px',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '16.5px',
                      color: isDark ? '#F3F0EA' : '#1F1C18',
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
                        color: isDark ? '#9CA3AF' : '#7A756D',
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
                    color: isDark ? '#9CA3AF' : '#8C867D',
                    marginBottom: '6px'
                  }}>
                    Verse Translation
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: isDark ? '#E5E7EB' : '#2E2B27',
                    lineHeight: 1.65,
                    fontStyle: 'italic',
                    margin: 0
                  }}>
                    "{guidance.translation}"
                  </p>
                </div>

                {/* Krishna's Practical Guidance */}
                <div style={{
                  background: isDark ? 'rgba(74, 222, 128, 0.08)' : 'rgba(30, 94, 58, 0.04)',
                  borderLeft: isDark ? '3px solid #4ADE80' : '3px solid #1E5E3A',
                  padding: '14px 16px',
                  borderRadius: '0 12px 12px 0',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isDark ? '#4ADE80' : '#1E5E3A',
                    marginBottom: '6px'
                  }}>
                    Gita's Counsel For You
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: isDark ? '#F3F0EA' : '#1F1C18',
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
                      color: isDark ? '#9CA3AF' : '#8C867D',
                      marginBottom: '6px'
                    }}>
                      Daily Practice
                    </div>
                    <p style={{
                      fontSize: '13.5px',
                      color: isDark ? '#D1D5DB' : '#4A463F',
                      lineHeight: 1.55,
                      margin: 0
                    }}>
                      {guidance.action}
                    </p>
                  </div>
                )}

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
                  border: isDark ? '1px solid #29342D' : '1px solid #ECE6DD',
                  color: isDark ? '#9CA3AF' : '#706C64',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = isDark ? '#1E2621' : '#FFFFFF';
                  e.currentTarget.style.color = isDark ? '#4ADE80' : '#1E5E3A';
                  e.currentTarget.style.borderColor = isDark ? '#4ADE80' : '#1E5E3A';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = isDark ? '#9CA3AF' : '#706C64';
                  e.currentTarget.style.borderColor = isDark ? '#29342D' : '#ECE6DD';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>{language === 'hi' ? 'अन्य प्रश्न पूछें (मुख्य पृष्ठ पर लौटें)' : 'Ask another question (Return to Home)'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          BOTTOM FLOATING INPUT PILL
          Only visible when NOT in query response mode (Slide 1)
      ─────────────────────────────────────────────────────────── */}
      {!isQueryMode && (
        <div style={{
          position: 'fixed',
          bottom: 'calc(74px + env(safe-area-inset-bottom, 0px))',
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
          background: isDark ? '#1E2621' : '#FFFFFF',
          border: isDark ? '1px solid #29342D' : '1px solid #ECE5DC',
          borderRadius: '30px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px 0 22px',
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.45)'
            : '0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
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
            placeholder={language === 'hi' ? 'बताएं, आपके मन में क्या चल रहा है...' : "Tell me what's bothering you..."}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontFamily: 'inherit',
              color: isDark ? '#F3F0EA' : '#1F1C18',
              padding: 0
            }}
          />

          {/* Send Arrow Button (Appears if user types text) */}
          {thought.trim().length > 0 && (
            <button
              onClick={() => handleSubmitQuery()}
              aria-label="Submit query"
              style={{
                background: isDark ? '#4ADE80' : '#1E5E3A',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                minWidth: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isDark ? '#0F172A' : '#FFFFFF',
                marginRight: '6px',
                boxShadow: isDark ? '0 2px 8px rgba(74, 222, 128, 0.3)' : '0 2px 8px rgba(30, 94, 58, 0.25)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(1px)' }}>
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
              background: isListening
                ? (isDark ? 'rgba(74, 222, 128, 0.2)' : 'rgba(30, 94, 58, 0.12)')
                : 'none',
              border: isListening
                ? (isDark ? '1px solid #4ADE80' : '1px solid #1E5E3A')
                : 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isListening
                ? (isDark ? '#4ADE80' : '#1E5E3A')
                : (isDark ? '#9CA3AF' : '#5C5750'),
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
      )}
    </div>
  );
};
