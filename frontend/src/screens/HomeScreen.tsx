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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollH, 24), 130)}px`;
    }
  }, [thought]);

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
      const result = await askGita(textToSubmit, detectedMood, language);
      setGuidance(result);
    } catch (err) {
      console.error("Failed to query Gita Brain", err);
      // Dynamic fallback based on user's inquiry ensures relevant Gita guidance
      const contextual = getGuidanceForThought(textToSubmit, detectedMood, language);
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

  // Format situation title matching reference design (e.g. "Career Confusion")
  const formatSituationTitle = (rawSituation: string, lang: Language) => {
    if (!rawSituation) return lang === 'hi' ? 'आंतरिक स्पष्टता एवं शांति' : 'Seeking Clarity';

    // If already in Hindi (Devanagari characters), return directly
    if (/[\u0900-\u097F]/.test(rawSituation)) {
      return rawSituation.trim();
    }

    const key = rawSituation.toLowerCase().trim().replace(/[-_]+/g, ' ');

    if (key === 'career confusion') {
      return lang === 'hi' ? 'कैरियर एवं कर्तव्य असमंजस' : 'Career Confusion';
    }
    if (key === 'everyday decision' || key === 'a personal decision' || key === 'practical decision') {
      return lang === 'hi' ? 'व्यक्तिगत निर्णय एवं विचार' : 'A Personal Decision';
    }
    if (key === 'general uncertainty' || key === 'seeking clarity') {
      return lang === 'hi' ? 'आंतरिक स्पष्टता एवं शांति' : 'Seeking Clarity';
    }
    if (key === 'decision conflict' || key === 'difficult decision') {
      return lang === 'hi' ? 'निर्णय एवं आंतरिक द्वंद्व' : 'Decision Conflict';
    }
    if (key === 'fear of failure') {
      return lang === 'hi' ? 'असफलता में समत्व' : 'Facing Setbacks & Failure';
    }
    if (/anxiety|fear/.test(key)) {
      return lang === 'hi' ? 'चिंता एवं भय से मुक्ति' : 'Fear & Anxiety';
    }
    if (/grief|loss/.test(key)) {
      return lang === 'hi' ? 'शोक एवं संताप' : 'Grief & Sorrow';
    }
    if (/anger|revenge/.test(key)) {
      return lang === 'hi' ? 'क्रोध एवं प्रतिशोध' : 'Anger & Resentment';
    }
    if (/money|financial/.test(key)) {
      return lang === 'hi' ? 'आर्थिक चिंता एवं समत्व' : 'Money Anxiety';
    }
    if (/procrastinat/.test(key)) {
      return lang === 'hi' ? 'आलस एवं अनुशासन' : 'Overcoming Procrastination';
    }
    if (/jealous|compar/.test(key)) {
      return lang === 'hi' ? 'ईर्ष्या एवं तुलना' : 'Comparison & Envy';
    }
    if (/lonel/.test(key)) {
      return lang === 'hi' ? 'अकेलापन एवं शांति' : 'Finding Inner Peace';
    }
    if (/purpose/.test(key)) {
      return lang === 'hi' ? 'जीवन का उद्देश्य' : 'Questioning Life Purpose';
    }
    if (/family/.test(key)) {
      return lang === 'hi' ? 'पारिवारिक दबाव' : 'Family Pressure';
    }

    return rawSituation
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  // Clean markdown and render bold/italic text properly without literal ** marks
  const renderFormattedMarkdown = (text: string) => {
    if (!text) return null;

    // Strip leading section labels (e.g. ### 1. Understanding or **1. Understanding:**)
    const cleaned = text
      .replace(/^#{1,4}\s+/gm, '')
      .replace(/^(?:\*\*)?(?:\d+[\.\)]\s+)?(?:understanding|what the gita points toward|applying it here|applying this here|reflection|daily practice|meaning|application)[\s:*#-]*(?:\*\*)?/i, '')
      .trim();

    // Split paragraphs
    const paragraphs = cleaned.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    return (
      <>
        {paragraphs.map((para, pIdx) => {
          let paraText = para.trim();
          const starCount = (paraText.match(/\*\*/g) || []).length;
          if (starCount % 2 !== 0) {
            paraText = paraText.replace(/\*\*/g, '');
          }

          const boldParts = paraText.split(/\*\*(.*?)\*\*/g);

          return (
            <p key={pIdx} style={{ margin: pIdx === 0 ? 0 : '12px 0 0 0', lineHeight: 1.7 }}>
              {boldParts.map((segment, bIdx) => {
                if (bIdx % 2 === 1) {
                  return (
                    <strong key={bIdx} style={{ fontWeight: 600, color: isDark ? '#FFFFFF' : '#111827' }}>
                      {segment}
                    </strong>
                  );
                }
                const italicParts = segment.split(/\*([^*]+)\*/g);
                if (italicParts.length > 1) {
                  return (
                    <React.Fragment key={bIdx}>
                      {italicParts.map((sub, iIdx) =>
                        iIdx % 2 === 1 ? (
                          <em key={iIdx} style={{ fontStyle: 'italic' }}>
                            {sub}
                          </em>
                        ) : (
                          sub
                        )
                      )}
                    </React.Fragment>
                  );
                }
                return segment;
              })}
            </p>
          );
        })}
      </>
    );
  };

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
      {/* ───────────────────────────────────────────────────────────
          SLIDE 1: DEFAULT HOME SCREEN (Matching Attached Design)
          Order:
          1. Text Section: Good evening, What's on your mind?, Share what you're going through...
          2. Character Illustration: Little Krishna with peacock feather
          3. Curved Green Mound: White input pill + dark notice dialogue card
      ─────────────────────────────────────────────────────────── */}
      {!isQueryMode && (
        <div className="animate-fade-up" style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          minHeight: 'calc(100vh - 65px)',
          background: isDark ? '#121614' : '#FAF7F2',
          boxSizing: 'border-box'
        }}>
          {/* 1. Top Text Section */}
          <div style={{ padding: '16px 24px 8px' }}>
            <p style={{
              fontSize: '15px',
              color: isDark ? '#9CA3AF' : '#78716C',
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
              lineHeight: 1.15,
              margin: '0 0 10px 0',
              letterSpacing: '-0.015em'
            }}>
              {language === 'hi' ? 'आपके मन में क्या चल रहा है?' : "What's on your mind?"}
            </h2>

            <p style={{
              fontSize: '14.5px',
              color: isDark ? '#9CA3AF' : '#706C64',
              lineHeight: 1.45,
              margin: 0,
              maxWidth: '340px'
            }}>
              {language === 'hi'
                ? 'अपने विचार साझा करें। गीता के शाश्वत ज्ञान से हम सही मार्गदर्शन पाने में आपकी सहायता करेंगे।'
                : "Share what you're going through. We'll help you explore it through the wisdom of the Gita."}
            </p>
          </div>

          {/* 2. Character: Little Krishna holding peacock feather, centered */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            position: 'relative',
            zIndex: 10,
            marginTop: '4px',
            marginBottom: '-14px'
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
                  : 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.08))'
              }}
            />
          </div>

          {/* 3. Curved Green Mound Section */}
          <div style={{
            position: 'relative',
            width: '100%',
            marginTop: '-18px',
            zIndex: 5
          }}>
            {/* Smooth SVG Arch Top Curve matching the screenshot */}
            <svg
              viewBox="0 0 430 70"
              preserveAspectRatio="none"
              style={{
                display: 'block',
                width: '100%',
                height: '56px',
                marginBottom: -1
              }}
            >
              <path
                d="M 0,70 Q 215,0 430,70 L 430,70 L 0,70 Z"
                fill={isDark ? '#143823' : '#185834'}
              />
            </svg>

            {/* Mound Body containing Input and Dialogue Card */}
            <div style={{
              position: 'relative',
              background: isDark ? '#143823' : '#185834',
              padding: '8px 20px calc(80px + env(safe-area-inset-bottom, 0px))',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              overflow: 'hidden'
            }}>
              {/* Swirl Pattern Overlay matching screenshot */}
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  opacity: isDark ? 0.45 : 0.65
                }}
              >
                <defs>
                  <pattern id="moundSwirls" width="80" height="80" patternUnits="userSpaceOnUse">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.2" />
                    <circle cx="40" cy="40" r="24" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.2" />
                    <circle cx="40" cy="40" r="14" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.1" />
                    <path d="M 0,0 Q 40,25 80,0" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.2" />
                    <path d="M 0,80 Q 40,55 80,80" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#moundSwirls)" />
              </svg>

              {/* White Input Pill */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                maxWidth: '390px',
                background: '#FFFFFF',
                borderRadius: '30px',
                minHeight: '54px',
                display: 'flex',
                alignItems: 'center',
                padding: '6px 12px 6px 20px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
                boxSizing: 'border-box',
                gap: '8px'
              }}>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={thought}
                  onChange={e => setThought(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
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
                    color: '#1F1C18',
                    padding: '6px 0',
                    resize: 'none',
                    lineHeight: 1.45,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowY: 'auto',
                    maxHeight: '120px',
                    boxSizing: 'border-box'
                  }}
                />

                {/* Send Button if text typed */}
                {thought.trim().length > 0 && (
                  <button
                    onClick={() => handleSubmitQuery()}
                    aria-label="Submit query"
                    style={{
                      background: '#1E5E3A',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      minWidth: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(30, 94, 58, 0.25)',
                      transition: 'transform 0.15s',
                      alignSelf: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(1px)' }}>
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
                    background: isListening ? '#DC2626' : 'none',
                    border: 'none',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    minWidth: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isListening ? '#FFFFFF' : '#5C5750',
                    alignSelf: 'center'
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

              {/* Dialogue Box matching image */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                maxWidth: '390px',
                background: 'rgba(10, 36, 20, 0.72)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '18px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                boxSizing: 'border-box'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255, 255, 255, 0.9)', flexShrink: 0 }}>
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                </svg>
                <div style={{
                  fontSize: '12.5px',
                  color: 'rgba(255, 255, 255, 0.92)',
                  lineHeight: 1.45,
                  fontWeight: 400
                }}>
                  {language === 'hi' ? (
                    <>
                      <div>ध्यान दें कि प्रत्येक अनुरोध एक नया मार्गदर्शन लाता है।</div>
                      <div>एक नया अनुरोध समान या भिन्न सीख ला सकता है।</div>
                    </>
                  ) : (
                    <>
                      <div>Note that each request brings a fresh guidance.</div>
                      <div>A new request may bring a similar or different teaching.</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          SLIDE 2: QUERY MODE SCREEN (User bubble on right + Wisdom answer)
          Chat section shifted comfortably up
      ─────────────────────────────────────────────────────────── */}
      {isQueryMode && (
        <div className="animate-fade-up" style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '6px 20px 40px',
          overflowY: 'auto'
        }}>
          {/* Top compact navigation / indicator: shifted up */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingTop: '2px'
          }}>
            <button
              onClick={handleResetToDefault}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isDark ? '#9CA3AF' : '#706C64',
                padding: '4px 0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 500
              }}
              aria-label="Return to Home"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>{t.home || 'Home'}</span>
            </button>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: isDark ? '#4ADE80' : '#1E5E3A',
              background: isDark ? 'rgba(74, 222, 128, 0.12)' : 'rgba(30, 94, 58, 0.08)',
              padding: '3px 10px',
              borderRadius: '12px'
            }}>
              Gita Brain
            </div>
          </div>

          {/* User's Query Bubble: Soft Sage Green, aligned to right */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '18px'
          }}>
            <div style={{
              background: isDark ? '#1F3526' : '#D5E2D6',
              color: isDark ? '#E8F5E9' : '#222E25',
              border: isDark ? '1px solid #2B4E37' : 'none',
              padding: '14px 18px',
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
              {/* Card Container: Formatted Answer matching reference design */}
              <div style={{
                background: isDark ? '#1C241F' : '#FFFFFF',
                borderRadius: '26px',
                border: isDark ? '1px solid #28372C' : '1px solid #ECE6DD',
                padding: '24px 22px',
                boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.35)' : '0 4px 20px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* 1. Scripture Reference Pill Badge (e.g. Bhagavad Gita 18.47) */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: isDark ? 'rgba(74, 222, 128, 0.12)' : '#EAF2EC',
                  borderRadius: '16px',
                  padding: '5px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isDark ? '#4ADE80' : '#1E5E3A',
                  width: 'fit-content',
                  marginBottom: '14px'
                }}>
                  {language === 'hi'
                    ? `श्रीमद्भगवद्गीता ${guidance.chapter || 2}.${guidance.verse || 47}`
                    : `Bhagavad Gita ${guidance.chapter || 2}.${guidance.verse || 47}`}
                </div>

                {/* 2. Subtle Divider */}
                <div style={{
                  height: '1px',
                  background: isDark ? '#26332A' : '#F0ECE4',
                  marginBottom: '16px'
                }} />

                {/* 3. Eyebrow Category */}
                <div style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: isDark ? '#4ADE80' : '#1E5E3A',
                  textTransform: 'uppercase',
                  marginBottom: '6px'
                }}>
                  {language === 'hi' ? 'आपकी स्थिति पर अंतर्दृष्टि' : 'INSIGHT ON YOUR STATE'}
                </div>

                {/* 4. Main Issue Heading (Large Serif) */}
                <h2 style={{
                  fontFamily: 'var(--font-display, "Fraunces", Georgia, serif)',
                  fontSize: '23px',
                  fontWeight: 700,
                  color: isDark ? '#F3F0EA' : '#1C1917',
                  margin: '0 0 16px 0',
                  lineHeight: 1.25,
                  letterSpacing: '-0.01em'
                }}>
                  {formatSituationTitle(guidance.situation || guidance.emotion, language)}
                </h2>

                {/* 5. Empathetic Explanation Body (No raw ** marks) */}
                <div style={{
                  fontSize: '15px',
                  color: isDark ? '#D1D5DB' : '#374151',
                  lineHeight: 1.7,
                  marginBottom: '20px'
                }}>
                  {renderFormattedMarkdown(
                    guidance.understanding ||
                    guidance.guidance?.split('\n\n')[0] ||
                    guidance.meaning ||
                    ''
                  )}
                </div>

                {/* 6. Relevant Shlokas Container (Matching Reference Shloka Box) */}
                {(guidance.sanskrit || guidance.translation) && (
                  <div style={{
                    background: isDark ? '#141B16' : '#F5F0E9',
                    border: `1px solid ${isDark ? '#253528' : '#E8E1D5'}`,
                    borderRadius: '18px',
                    padding: '18px 20px',
                    marginBottom: '18px'
                  }}>
                    {/* Sanskrit Shloka in Devanagari */}
                    {guidance.sanskrit && (
                      <div style={{
                        fontFamily: 'var(--font-sanskrit, "Noto Serif Devanagari", "Tiro Devanagari Sanskrit", Georgia, serif)',
                        fontSize: '16.5px',
                        fontWeight: 600,
                        lineHeight: 1.8,
                        color: isDark ? '#F3F0EA' : '#1E1B18',
                        textAlign: 'center',
                        whiteSpace: 'pre-line',
                        marginBottom: (guidance.transliteration || guidance.translation) ? '12px' : 0,
                        letterSpacing: '0.015em'
                      }}>
                        {guidance.sanskrit}
                      </div>
                    )}

                    {/* Roman Transliteration */}
                    {guidance.transliteration && (
                      <div style={{
                        fontSize: '12.5px',
                        fontStyle: 'italic',
                        color: isDark ? '#A1A1AA' : '#6B7280',
                        textAlign: 'center',
                        lineHeight: 1.55,
                        marginBottom: guidance.translation ? '12px' : 0
                      }}>
                        {guidance.transliteration}
                      </div>
                    )}

                    {/* Subtle divider inside shloka box */}
                    {guidance.translation && guidance.sanskrit && (
                      <div style={{
                        height: '1px',
                        background: isDark ? '#253528' : '#E5DDD0',
                        margin: '12px 0 14px 0'
                      }} />
                    )}

                    {/* Shloka Translation */}
                    {guidance.translation && (
                      <div>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: isDark ? '#4ADE80' : '#1E5E3A',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          marginBottom: '6px'
                        }}>
                          {language === 'hi' ? 'श्लोक अनुवाद' : 'VERSE TRANSLATION'}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          lineHeight: 1.65,
                          color: isDark ? '#D1D5DB' : '#374151'
                        }}>
                          {renderFormattedMarkdown(guidance.translation)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 7. What the Gita Points Toward / Deeper Wisdom (if distinct from understanding) */}
                {guidance.meaning && guidance.meaning !== guidance.understanding && guidance.meaning !== guidance.translation && (
                  <div style={{
                    marginBottom: '16px',
                    padding: '16px 18px',
                    background: isDark ? 'rgba(255,255,255,0.02)' : '#FAF8F5',
                    borderRadius: '16px',
                    border: `1px solid ${isDark ? '#26312A' : '#EDE7DE'}`
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.07em',
                      color: isDark ? '#4ADE80' : '#1E5E3A',
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}>
                      {language === 'hi' ? 'गीता का शाश्वत संदेश' : 'WHAT THE GITA POINTS TOWARD'}
                    </div>
                    <div style={{
                      fontSize: '14.5px',
                      lineHeight: 1.7,
                      color: isDark ? '#D1D5DB' : '#374151'
                    }}>
                      {renderFormattedMarkdown(guidance.meaning)}
                    </div>
                  </div>
                )}

                {/* 8. Applying it here (if available) */}
                {guidance.application && guidance.application !== guidance.meaning && (
                  <div style={{
                    marginBottom: '16px',
                    padding: '16px 18px',
                    background: isDark ? 'rgba(74, 222, 128, 0.05)' : 'rgba(30, 94, 58, 0.03)',
                    borderRadius: '16px',
                    border: `1px solid ${isDark ? 'rgba(74, 222, 128, 0.18)' : 'rgba(30, 94, 58, 0.12)'}`
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.07em',
                      color: isDark ? '#4ADE80' : '#1E5E3A',
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}>
                      {language === 'hi' ? 'दैनिक जीवन में अनुप्रयोग' : 'APPLYING THIS IN LIFE'}
                    </div>
                    <div style={{
                      fontSize: '14.5px',
                      lineHeight: 1.7,
                      color: isDark ? '#D1D5DB' : '#374151'
                    }}>
                      {renderFormattedMarkdown(guidance.application)}
                    </div>
                  </div>
                )}

                {/* 9. Practical Action / Daily Reflection */}
                {guidance.action && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px 16px',
                    background: isDark ? '#1C2920' : '#EDF4EE',
                    borderRadius: '16px',
                    border: `1px solid ${isDark ? '#2D4433' : '#D2E4D5'}`,
                    marginTop: '2px'
                  }}>
                    <span style={{ fontSize: '18px', lineHeight: 1.2, marginTop: '2px' }}>🌱</span>
                    <div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: isDark ? '#4ADE80' : '#1E5E3A',
                        textTransform: 'uppercase',
                        marginBottom: '3px'
                      }}>
                        {language === 'hi' ? 'आज का व्यावहारिक अभ्यास' : 'MINDFUL PRACTICE'}
                      </div>
                      <div style={{
                        fontSize: '13.5px',
                        lineHeight: 1.55,
                        color: isDark ? '#E5E7EB' : '#2D3748',
                        fontWeight: 450
                      }}>
                        {renderFormattedMarkdown(guidance.action)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dialogue Box: Advisory notice */}
              <div style={{
                background: isDark ? 'rgba(74, 222, 128, 0.08)' : 'rgba(30, 94, 58, 0.05)',
                border: isDark ? '1px solid rgba(74, 222, 128, 0.22)' : '1px solid rgba(30, 94, 58, 0.16)',
                borderRadius: '16px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <span style={{ fontSize: '18px', lineHeight: 1.2 }}>🪷</span>
                <p style={{
                  fontSize: '13.5px',
                  color: isDark ? '#D1D5DB' : '#4A463F',
                  lineHeight: 1.55,
                  margin: 0,
                  fontWeight: 450
                }}>
                  {language === 'hi'
                    ? 'यह मार्गदर्शन आपके वर्तमान संदेश पर आधारित है। एक नया अनुरोध एक अलग या समान सीख ला सकता है।'
                    : 'This guidance is based on your current message. A new request may bring a different or similar teaching'}
                </p>
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
    </div>
  );
};
