import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Mantra } from '../types';
import { JAPA_MANTRAS } from '../data/gitaData';
import { japaAudio } from '../utils/japaAudio';

interface JapaScreenProps {
  onMantraComplete?: (mantraName: string, roundNumber: number) => void;
  onOpenMenu?: () => void;
}

const BEAD_COUNT = 108;
const SVG_SIZE = 320;
const CENTER_X = SVG_SIZE / 2;
const CENTER_Y = SVG_SIZE / 2;
const MALA_RADIUS = 116;
const BEAD_RADIUS = 3.35; // mathematically touches at 108 beads around circumference 728px

interface JapaHistoryItem {
  dateStr: string; // "2026-09-24"
  displayDate: string; // "24 September 2026"
  totalMalas: number;
  totalRepetitions: number;
  mantraCounts: Record<string, number>;
}

export const JapaScreen: React.FC<JapaScreenProps> = ({
  onMantraComplete,
  onOpenMenu
}) => {
  // Screen navigation state: 'counter' (Screen 1) | 'complete' (Screen 2) | 'progress' (Screen 3)
  const [currentView, setCurrentView] = useState<'counter' | 'complete' | 'progress'>('counter');

  // Initial count defaults strictly to 0 for a new session
  const [count, setCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('gita_japa_count');
      const parsed = saved ? parseInt(saved, 10) : 0;
      if (parsed >= BEAD_COUNT || isNaN(parsed) || parsed < 0) {
        return 0;
      }
      return parsed;
    } catch {
      return 0;
    }
  });

  const [selectedMantraId, setSelectedMantraId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('gita_japa_mantra_id');
      return saved || 'gayatri-mantra';
    } catch {
      return 'gayatri-mantra';
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('gita_japa_sound');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // User history starts strictly at empty (0 malas, 0 repetitions) until rounds are completed
  const [history, setHistory] = useState<JapaHistoryItem[]>(() => {
    try {
      // Clear legacy mock seed if present
      localStorage.removeItem('gita_japa_history_v2');
      const saved = localStorage.getItem('gita_japa_user_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tapScale, setTapScale] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [soundToast, setSoundToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setSoundToast(next ? "Sound: ON 🔔" : "Sound: MUTED 🔇");
      toastTimeoutRef.current = setTimeout(() => {
        setSoundToast(null);
      }, 1800);
      if (next) {
        japaAudio.playBeadChime();
      }
      return next;
    });
  };

  // Pre-initialize and keep audio hardware responsive on user interactions
  useEffect(() => {
    japaAudio.init();
    const handleUserInteraction = () => {
      japaAudio.unlock();
    };
    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gita_japa_count', count.toString());
    } catch {}
  }, [count]);

  useEffect(() => {
    try {
      localStorage.setItem('gita_japa_mantra_id', selectedMantraId);
    } catch {}
  }, [selectedMantraId]);

  useEffect(() => {
    try {
      localStorage.setItem('gita_japa_sound', soundEnabled.toString());
    } catch {}
  }, [soundEnabled]);

  // Synchronize sound status when modified in Settings screen
  useEffect(() => {
    const syncSound = () => {
      try {
        const saved = localStorage.getItem('gita_japa_sound');
        if (saved !== null) {
          setSoundEnabled(saved === 'true');
        }
      } catch {}
    };
    syncSound();
    window.addEventListener('storage', syncSound);
    window.addEventListener('japa-sound-changed', syncSound);
    return () => {
      window.removeEventListener('storage', syncSound);
      window.removeEventListener('japa-sound-changed', syncSound);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('gita_japa_user_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const currentMantra: Mantra = useMemo(() => {
    return JAPA_MANTRAS.find(m => m.id === selectedMantraId) || JAPA_MANTRAS[1] || JAPA_MANTRAS[0];
  }, [selectedMantraId]);

  // Pre-calculate 108 bead coordinates starting at 12 o'clock (-PI/2) clockwise
  const beads = useMemo(() => {
    return Array.from({ length: BEAD_COUNT }, (_, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / BEAD_COUNT;
      const x = CENTER_X + MALA_RADIUS * Math.cos(angle);
      const y = CENTER_Y + MALA_RADIUS * Math.sin(angle);
      return { index: i, x, y };
    });
  }, []);

  // Record completed round in history
  const recordCompletedRound = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const displayDate = `${now.getDate()} ${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()}`;
    const mantraName = currentMantra.shortName || currentMantra.name;

    setHistory(prev => {
      const existingIdx = prev.findIndex(item => item.dateStr === dateStr);
      if (existingIdx >= 0) {
        const item = prev[existingIdx];
        const updatedCounts = {
          ...item.mantraCounts,
          [mantraName]: (item.mantraCounts[mantraName] || 0) + 1
        };
        const updatedItem: JapaHistoryItem = {
          ...item,
          totalMalas: item.totalMalas + 1,
          totalRepetitions: (item.totalMalas + 1) * BEAD_COUNT,
          mantraCounts: updatedCounts
        };
        const copy = [...prev];
        copy[existingIdx] = updatedItem;
        return copy;
      } else {
        const newItem: JapaHistoryItem = {
          dateStr,
          displayDate,
          totalMalas: 1,
          totalRepetitions: BEAD_COUNT,
          mantraCounts: {
            [mantraName]: 1
          }
        };
        return [newItem, ...prev];
      }
    });

    if (onMantraComplete) {
      onMantraComplete(currentMantra.name, totalMalasCount + 1);
    }
  };

  // Tap handler: increments count, adds one bead
  const handleTap = () => {
    if (count >= BEAD_COUNT) {
      setCurrentView('complete');
      return;
    }

    const nextCount = count + 1;
    setCount(nextCount);

    setTapScale(true);
    setTimeout(() => setTapScale(false), 120);

    try {
      if (navigator.vibrate) {
        navigator.vibrate(12);
      }
    } catch {}

    if (soundEnabled) {
      if (nextCount === BEAD_COUNT) {
        japaAudio.playCompletionChime();
      } else {
        japaAudio.playBeadChime();
      }
    }

    // When 108 taps are reached, record progress and transition to Screen 2!
    if (nextCount === BEAD_COUNT) {
      recordCompletedRound();
      setTimeout(() => {
        setCurrentView('complete');
      }, 350);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleStartAgain = () => {
    setCount(0);
    setCurrentView('counter');
  };

  // Total user progress counts across all recorded days
  const totalMalasCount = useMemo(() => {
    return history.reduce((acc, h) => acc + h.totalMalas, 0);
  }, [history]);

  const totalRepetitionsCount = totalMalasCount * BEAD_COUNT;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      background: '#FAF8F3',
      color: '#1F1C18',
      fontFamily: 'var(--font-sans)',
      userSelect: 'none'
    }}>
      <style>{`
        @keyframes featherFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1.5deg);
          }
        }
        @keyframes featherGlow {
          0%, 100% {
            filter: drop-shadow(0 4px 14px rgba(30, 94, 58, 0.16));
          }
          50% {
            filter: drop-shadow(0 10px 24px rgba(30, 94, 58, 0.32));
          }
        }
      `}</style>

      {/* ═════════════════════════════════════════════════════════════
          SCREEN 1: CHANTING SCREEN (Mala Circle with Taps)
      ═════════════════════════════════════════════════════════════ */}
      {currentView === 'counter' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 20 }}>
          {/* Header Bar */}
          <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px 8px',
            background: '#FAF8F3'
          }}>
            <button
              onClick={onOpenMenu}
              aria-label="Open menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 0',
                display: 'flex',
                alignItems: 'center',
                color: '#1F1C18'
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3.5" y1="6.5" x2="20.5" y2="6.5" />
                <line x1="3.5" y1="12" x2="20.5" y2="12" />
                <line x1="3.5" y1="17.5" x2="20.5" y2="17.5" />
              </svg>
            </button>

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
              Japa / Maala
            </h1>

            {/* Quick link to view Progress (Screen 3) */}
            <button
              onClick={() => setCurrentView('progress')}
              title="View Maala Progress"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1E5E3A',
                fontSize: '12.5px',
                fontWeight: 600,
                padding: '4px 0'
              }}
            >
              Progress
            </button>
          </header>

          <div style={{ padding: '0 20px' }}>
            {/* Subtext */}
            <p style={{
              margin: '4px 0 14px',
              fontSize: '13px',
              color: '#706C64',
              fontWeight: 400
            }}>
              108 repetitions- A meditative practice
            </p>

            {/* Mantra Dropdown Selector */}
            <div style={{ position: 'relative', marginBottom: 18 }} ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FFFFFF',
                  border: isDropdownOpen ? '1px solid #1E5E3A' : '1px solid #E5DFD5',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14.5px',
                  fontWeight: 500,
                  color: '#1F1C18',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{currentMantra.shortName || currentMantra.name}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#706C64"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.18s'
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown Options Menu */}
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  background: '#FFFFFF',
                  border: '1px solid #ECE6DD',
                  borderRadius: '14px',
                  boxShadow: '0 8px 24px rgba(30, 25, 20, 0.1)',
                  zIndex: 90,
                  overflow: 'hidden',
                  padding: '6px 0'
                }}>
                  {JAPA_MANTRAS.map(m => {
                    const isSelected = m.id === selectedMantraId;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMantraId(m.id);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '11px 16px',
                          background: isSelected ? 'rgba(30, 94, 58, 0.08)' : 'transparent',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer'
                        }}
                      >
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: isSelected ? 600 : 500,
                            color: isSelected ? '#1E5E3A' : '#1F1C18'
                          }}>
                            {m.shortName || m.name}
                          </div>
                        </div>
                        {isSelected && (
                          <span style={{ color: '#1E5E3A', fontSize: '15px', fontWeight: 700 }}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Circular Mala Visual Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              margin: '0 auto'
            }}>
              <div
                onClick={handleTap}
                style={{
                  position: 'relative',
                  width: SVG_SIZE,
                  height: SVG_SIZE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transform: tapScale ? 'scale(0.985)' : 'scale(1)',
                  transition: 'transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                <svg
                  width={SVG_SIZE}
                  height={SVG_SIZE}
                  viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    {/* Realistic 3D pearl bead gradient matching Screen 1 */}
                    <radialGradient id="pearlShine" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="28%" stopColor="#F9EFE6" />
                      <stop offset="65%" stopColor="#DFD1C2" />
                      <stop offset="100%" stopColor="#A89784" />
                    </radialGradient>
                    <filter id="pearlDropShadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="rgba(80, 60, 40, 0.28)" />
                    </filter>
                  </defs>

                  {/* Circular guideline track */}
                  <circle
                    cx={CENTER_X}
                    cy={CENTER_Y}
                    r={MALA_RADIUS}
                    fill="none"
                    stroke="#EBE4D8"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />

                  {/* 108 Beads: Every tap makes ONE bead appear! Full circle at 108 */}
                  {beads.map(({ index, x, y }) => {
                    const isVisible = index < count;
                    if (!isVisible) return null;

                    const isCurrent = index === count - 1;

                    return (
                      <g key={index}>
                        {isCurrent && (
                          <circle
                            cx={x}
                            cy={y}
                            r={BEAD_RADIUS + 2.4}
                            fill="none"
                            stroke="#1E5E3A"
                            strokeWidth="1.2"
                            opacity="0.75"
                          />
                        )}
                        <circle
                          cx={x}
                          cy={y}
                          r={BEAD_RADIUS + (isCurrent ? 0.4 : 0)}
                          fill="url(#pearlShine)"
                          filter="url(#pearlDropShadow)"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Central Tap Target Area (Initial count is 0) */}
                <div
                  onClick={handleTap}
                  style={{
                    position: 'absolute',
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transform: tapScale ? 'scale(0.95)' : 'scale(1)',
                    transition: 'transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '44px',
                    fontWeight: 700,
                    color: '#1E5E3A',
                    lineHeight: 1
                  }}>
                    {count}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#8C867D',
                    marginTop: '4px'
                  }}>
                    / {BEAD_COUNT}
                  </div>
                </div>

                {/* Sound Toggle Button (Bottom-Right of Bead Circle) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSound();
                  }}
                  title={soundEnabled ? "Sound enabled - Tap to mute" : "Sound muted - Tap to enable"}
                  style={{
                    position: 'absolute',
                    bottom: 24,
                    right: 24,
                    background: soundEnabled ? '#FFFFFF' : '#FEF2F2',
                    border: soundEnabled ? '1px solid #ECE6DD' : '1px solid #FCA5A5',
                    borderRadius: '50%',
                    width: 38,
                    height: 38,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: soundEnabled ? '0 2px 6px rgba(0,0,0,0.06)' : '0 2px 8px rgba(220, 38, 38, 0.16)',
                    color: soundEnabled ? '#1E5E3A' : '#DC2626',
                    transition: 'all 0.18s ease',
                    zIndex: 10
                  }}
                >
                  {soundEnabled ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  )}
                </button>

                {/* Floating Toast Notification when Sound is Toggled */}
                {soundToast && (
                  <div style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 14,
                    background: '#1F1C18',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: '18px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
                    zIndex: 30,
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap'
                  }}>
                    {soundToast}
                  </div>
                )}
              </div>

              {/* Mantra Title & Text Section */}
              <div style={{
                textAlign: 'center',
                margin: '12px auto 20px',
                maxWidth: 340,
                padding: '0 10px'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#1F1C18',
                  margin: '0 0 8px 0'
                }}>
                  {currentMantra.shortName || currentMantra.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '13.5px',
                  color: '#3A3630',
                  lineHeight: 1.65,
                  margin: 0,
                  whiteSpace: 'pre-line'
                }}>
                  {selectedMantraId === 'gayatri-mantra' ? (
                    "Om Bhur Bhuvah Svah Tat Savitur Varenyam\nBhargo Devasya Dhimahi Dhiyo Yo Nah\nPrachodayat"
                  ) : selectedMantraId === 'hare-krishna' ? (
                    "Hare Krishna Hare Krishna Krishna Krishna Hare Hare\nHare Rama Hare Rama Rama Rama Hare Hare"
                  ) : selectedMantraId === 'radha-radha' ? (
                    "Radhe Radhe Radhe Shri Radha Radhe Radhe\nRadhe Radhe Govinda Radhe Radhe Gopala"
                  ) : (
                    currentMantra.fullText
                  )}
                </p>
              </div>

              {/* Primary Tap to Count Button */}
              <button
                onClick={handleTap}
                style={{
                  width: '100%',
                  maxWidth: 320,
                  background: '#16532D',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '28px',
                  height: '52px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 83, 45, 0.25)',
                  transition: 'transform 0.1s ease',
                  marginBottom: '12px'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Tap to count
              </button>

              {/* Reset Option */}
              <button
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#706C64',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '6px 16px'
                }}
              >
                Reset
              </button>

              {/* Dev Test Button to quickly trigger 108 */}
              <button
                onClick={() => {
                  setCount(BEAD_COUNT);
                  recordCompletedRound();
                  setCurrentView('complete');
                }}
                style={{
                  marginTop: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#1E5E3A',
                  fontSize: '11px',
                  opacity: 0.55,
                  cursor: 'pointer'
                }}
              >
                [ Test 108 Complete → Screen 2 ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SCREEN 2: 108 REPETITIONS COMPLETE (Animated Feather, No 'K')
      ═════════════════════════════════════════════════════════════ */}
      {currentView === 'complete' && (
        <div className="animate-fade-up" style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '16px 20px 40px'
        }}>
          {/* Header Bar */}
          <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px'
          }}>
            <button
              onClick={() => setCurrentView('counter')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1E5E3A',
                fontSize: '14.5px',
                fontWeight: 600,
                padding: '4px 0'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>Back</span>
            </button>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 600,
              color: '#1F1C18',
              margin: 0,
              flex: 1,
              textAlign: 'center',
              paddingRight: '48px'
            }}>
              Japa
            </h1>
          </header>

          {/* Animated Feather Emblem (using user uploaded feather image, NO 'K' badge) */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '18px 0 24px',
            position: 'relative'
          }}>
            <div style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'featherFloat 3.4s ease-in-out infinite, featherGlow 3.4s ease-in-out infinite'
            }}>
              {/* Soft ambient green/golden aura behind feather */}
              <div style={{
                position: 'absolute',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(30, 94, 58, 0.12) 0%, rgba(250, 248, 243, 0) 70%)',
                pointerEvents: 'none'
              }} />

              {/* The user-provided feather image */}
              <img
                src="/peacock_feather.png"
                alt="Peacock Feather"
                style={{
                  width: '125px',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          </div>

          {/* Heading & Subtext */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 700,
              color: '#1F1C18',
              margin: '0 0 8px 0',
              letterSpacing: '-0.01em'
            }}>
              108 repetitions complete
            </h2>
            <p style={{
              fontSize: '14.5px',
              color: '#706C64',
              margin: 0,
              lineHeight: 1.5
            }}>
              Take a quiet moment before you continue.
            </p>
          </div>

          {/* Action Options matching Screen 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: 340, width: '100%', margin: '0 auto' }}>
            {/* 1. View progress (Outline button) */}
            <button
              onClick={() => setCurrentView('progress')}
              style={{
                width: '100%',
                background: '#FFFFFF',
                border: '1.5px solid #16532D',
                borderRadius: '26px',
                height: '50px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#16532D',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(22, 83, 45, 0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
            >
              View progress
            </button>

            {/* 2. Start Again (Solid green button) */}
            <button
              onClick={handleStartAgain}
              style={{
                width: '100%',
                background: '#16532D',
                border: 'none',
                borderRadius: '26px',
                height: '50px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(22, 83, 45, 0.25)',
                transition: 'transform 0.1s ease'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Start Again
            </button>

            {/* 3. Done link */}
            <button
              onClick={() => setCurrentView('counter')}
              style={{
                background: 'none',
                border: 'none',
                color: '#706C64',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                padding: '8px 0',
                marginTop: '4px'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SCREEN 3: MAALA PROGRESS (0 Malas Initially, Increments On Completion)
      ═════════════════════════════════════════════════════════════ */}
      {currentView === 'progress' && (
        <div className="animate-fade-up" style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '16px 20px 40px'
        }}>
          {/* Header Bar */}
          <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => setCurrentView('counter')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1E5E3A',
                fontSize: '14.5px',
                fontWeight: 600,
                padding: '4px 0'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>Back</span>
            </button>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 600,
              color: '#1F1C18',
              margin: 0,
              flex: 1,
              textAlign: 'center',
              paddingRight: '48px'
            }}>
              Maala Progress
            </h1>
          </header>

          {/* Top Two Stats Cards (Side by side) */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '28px'
          }}>
            {/* Card 1: TOTAL MALAS (Green Card) */}
            <div style={{
              flex: 1,
              background: '#16532D',
              borderRadius: '16px',
              padding: '16px 18px',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(22, 83, 45, 0.2)'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                opacity: 0.88,
                marginBottom: '8px'
              }}>
                TOTAL MALAS
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '36px',
                fontWeight: 700,
                lineHeight: 1
              }}>
                {totalMalasCount}
              </div>
            </div>

            {/* Card 2: REPETITIONS (White Card) */}
            <div style={{
              flex: 1,
              background: '#FFFFFF',
              border: '1px solid #ECE6DD',
              borderRadius: '16px',
              padding: '16px 18px',
              color: '#1F1C18',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#706C64',
                marginBottom: '8px'
              }}>
                REPETITIONS
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '36px',
                fontWeight: 700,
                lineHeight: 1
              }}>
                {totalRepetitionsCount}
              </div>
            </div>
          </div>

          {/* History Section */}
          <div>
            <div style={{
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#8C867D',
              marginBottom: '12px'
            }}>
              HISTORY
            </div>

            {/* If user hasn't completed any rounds yet */}
            {history.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #ECE6DD',
                borderRadius: '18px',
                padding: '28px 20px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>📿</div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#1F1C18',
                  marginBottom: '6px'
                }}>
                  No Japa malas recorded today
                </div>
                <p style={{
                  fontSize: '13px',
                  color: '#706C64',
                  margin: 0,
                  lineHeight: 1.5,
                  maxWidth: '280px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                  Complete your first round of 108 repetitions to begin recording your daily progress.
                </p>
              </div>
            ) : (
              /* History Cards with completed rounds */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {history.map((item, idx) => (
                  <div
                    key={item.dateStr || idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #ECE6DD',
                      borderRadius: '18px',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                    }}
                  >
                    {/* Date Title & Summary */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{
                        fontSize: '15.5px',
                        fontWeight: 600,
                        color: '#1F1C18',
                        marginBottom: '3px'
                      }}>
                        {item.displayDate}
                      </div>
                      <div style={{
                        fontSize: '12.5px',
                        color: '#706C64'
                      }}>
                        {item.totalMalas} {item.totalMalas === 1 ? 'Mala' : 'Malas'} · {item.totalRepetitions} repetitions
                      </div>
                    </div>

                    {/* List of Mantras Chanted That Day */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      borderTop: '1px solid #F4EFE6',
                      paddingTop: '12px'
                    }}>
                      {Object.entries(item.mantraCounts).map(([mName, roundCount]) => (
                        <div
                          key={mName}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '14px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#E28743', fontSize: '16px', lineHeight: 1 }}>•</span>
                            <span style={{ color: '#2B2723', fontWeight: 500 }}>{mName}</span>
                          </div>
                          <div style={{
                            color: '#16532D',
                            fontWeight: 600,
                            fontSize: '13.5px'
                          }}>
                            {roundCount} ×
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
