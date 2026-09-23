import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Mantra } from '../types';
import { JAPA_MANTRAS } from '../data/gitaData';

interface JapaScreenProps {
  onMantraComplete?: (mantraName: string, roundNumber: number) => void;
}

const BEAD_COUNT = 108;
const SVG_SIZE = 320;
const CENTER_X = SVG_SIZE / 2;
const CENTER_Y = SVG_SIZE / 2;
const MALA_RADIUS = 125;
const INNER_CIRCLE_RADIUS = 76;

export const JapaScreen: React.FC<JapaScreenProps> = ({ onMantraComplete }) => {
  // Persisted state
  const [count, setCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('gita_japa_count');
      return saved ? Math.min(Math.max(parseInt(saved, 10), 0), BEAD_COUNT) : 0;
    } catch {
      return 0;
    }
  });

  const [selectedMantraId, setSelectedMantraId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('gita_japa_mantra_id');
      return saved || 'hare-krishna';
    } catch {
      return 'hare-krishna';
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

  const [completedRounds, setCompletedRounds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('gita_japa_completed_rounds');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [tapScale, setTapScale] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    try {
      localStorage.setItem('gita_japa_completed_rounds', completedRounds.toString());
    } catch {}
  }, [completedRounds]);

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
    return JAPA_MANTRAS.find(m => m.id === selectedMantraId) || JAPA_MANTRAS[0];
  }, [selectedMantraId]);

  // Pre-calculate 108 bead positions around the circle
  // Starts at 12 o'clock (-PI/2) and progresses clockwise
  const beads = useMemo(() => {
    return Array.from({ length: BEAD_COUNT }, (_, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / BEAD_COUNT;
      const x = CENTER_X + MALA_RADIUS * Math.cos(angle);
      const y = CENTER_Y + MALA_RADIUS * Math.sin(angle);
      return { index: i, x, y };
    });
  }, []);

  // Web Audio chime synthesis (zero external files, instant, 100% offline)
  const playBeadChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Gentle meditation bell tone (528Hz ramped down softly)
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(264, ctx.currentTime + 0.11);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {}
  };

  const playCompletionChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Triple harmonizing temple chimes
      [396, 528, 639].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = ctx.currentTime + i * 0.14;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.40);
      });
    } catch {}
  };

  // Center tap counter logic
  const handleTap = () => {
    if (count >= BEAD_COUNT) {
      setShowCompletionModal(true);
      return;
    }

    const nextCount = count + 1;
    setCount(nextCount);

    // Spring tap animation
    setTapScale(true);
    setTimeout(() => setTapScale(false), 140);

    // Subtle vibration haptic
    try {
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch {}

    // Subtle audio feedback
    if (soundEnabled) {
      if (nextCount === BEAD_COUNT) {
        playCompletionChime();
      } else {
        playBeadChime();
      }
    }

    // Reached 108: complete round
    if (nextCount === BEAD_COUNT) {
      const newTotal = completedRounds + 1;
      setCompletedRounds(newTotal);
      if (onMantraComplete) {
        onMantraComplete(currentMantra.name, newTotal);
      }
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 300);
    }
  };

  const handleStartAgain = () => {
    setCount(0);
    setShowCompletionModal(false);
  };

  const handleDone = () => {
    setShowCompletionModal(false);
  };

  return (
    <div style={{
      background: '#FAF8F5',
      minHeight: '100%',
      padding: '24px 20px 40px',
      color: '#1F1D1A',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none'
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
          fontSize: 32,
          fontWeight: 700,
          color: '#1F1D1A',
          margin: 0,
          letterSpacing: '-0.02em',
          lineHeight: 1.15
        }}>
          Japa
        </h1>
        <p style={{
          margin: '4px 0 0',
          fontSize: 14,
          color: '#78716C',
          fontWeight: 400,
          letterSpacing: '0.01em'
        }}>
          108 repetitions · Meditative practice
        </p>
      </div>

      {/* Mantra Selector & Sound Toggle Row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', marginBottom: 24, position: 'relative' }} ref={dropdownRef}>
        {/* Dropdown Container */}
        <div style={{ flex: 1, position: 'relative' }}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FFFFFF',
              border: isDropdownOpen ? '1px solid #D4A050' : '1px solid #E5DFD5',
              borderRadius: 14,
              padding: '12px 14px',
              fontSize: 14,
              fontWeight: 500,
              color: '#262422',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              transition: 'all 0.18s ease',
              textAlign: 'left'
            }}
          >
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              paddingRight: 8,
              letterSpacing: '0.01em'
            }}>
              {currentMantra.name}
            </span>
            <span style={{
              color: '#8A8275',
              fontSize: 11,
              transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
              display: 'inline-block'
            }}>
              ▼
            </span>
          </button>

          {/* Dropdown Options Sheet */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: '#FFFFFF',
              border: '1px solid #E5DFD5',
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(40, 30, 20, 0.12)',
              zIndex: 90,
              overflow: 'hidden',
              padding: '6px 0',
              animation: 'fadeInDown 0.15s ease-out'
            }}>
              <div style={{ padding: '6px 14px', fontSize: 11, fontWeight: 700, color: '#A8A29E', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Select Mantra
              </div>
              {JAPA_MANTRAS.map((mantra) => {
                const isSelected = mantra.id === selectedMantraId;
                return (
                  <button
                    key={mantra.id}
                    onClick={() => {
                      setSelectedMantraId(mantra.id);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '11px 14px',
                      background: isSelected ? '#FAF5ED' : 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div>
                      <div style={{
                        fontSize: 13.5,
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? '#936118' : '#262422'
                      }}>
                        {mantra.name}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: '#8A8275',
                        marginTop: 2
                      }}>
                        {mantra.sanskrit}
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ color: '#D4A050', fontSize: 16, fontWeight: 700, marginLeft: 8 }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sound On / Off Toggle Pill */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Sound is On (Click to mute)' : 'Sound is Off (Click to unmute)'}
          style={{
            background: soundEnabled ? '#F5EFEB' : '#F1EBE4',
            border: soundEnabled ? '1px solid #D8CCBD' : '1px solid #E5DFD5',
            borderRadius: 14,
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            fontSize: 12.5,
            fontWeight: 500,
            color: soundEnabled ? '#644A1E' : '#9CA3AF',
            transition: 'all 0.18s ease',
            flexShrink: 0
          }}
        >
          {soundEnabled ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
              <span>On</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
              <span>Off</span>
            </>
          )}
        </button>
      </div>

      {/* Circular Mala Visual Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0 18px',
        position: 'relative'
      }}>
        <div style={{
          position: 'relative',
          width: SVG_SIZE,
          height: SVG_SIZE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Active bead radial glow */}
              <radialGradient id="activeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E5B566" stopOpacity="1" />
                <stop offset="100%" stopColor="#B37C24" stopOpacity="1" />
              </radialGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Subtle guideline track */}
            <circle
              cx={CENTER_X}
              cy={CENTER_Y}
              r={MALA_RADIUS}
              fill="none"
              stroke="#ECE5DA"
              strokeWidth="0.8"
              strokeDasharray="2 3"
            />

            {/* 108 Beads */}
            {beads.map(({ index, x, y }) => {
              const isActive = index < count;
              const isCurrent = index === count - 1;

              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={isCurrent ? 3.6 : isActive ? 3.0 : 2.2}
                  fill={isActive ? 'url(#activeGlow)' : '#E7E0D8'}
                  stroke={isActive ? '#9C6E20' : '#D6CEC2'}
                  strokeWidth={isCurrent ? 1.0 : 0.6}
                  filter={isCurrent ? 'url(#softGlow)' : undefined}
                  style={{
                    transition: 'r 0.15s ease, fill 0.15s ease, stroke 0.15s ease'
                  }}
                />
              );
            })}

            {/* Central Tap Target Circle */}
            <circle
              cx={CENTER_X}
              cy={CENTER_Y}
              r={INNER_CIRCLE_RADIUS}
              fill="#FAF8F5"
              stroke="#E0D6C8"
              strokeWidth="1.2"
              onClick={handleTap}
              style={{
                cursor: 'pointer',
                transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
                transform: tapScale ? 'scale(0.97)' : 'scale(1)',
                transition: 'transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)',
                filter: 'drop-shadow(0 2px 8px rgba(100, 80, 50, 0.04))'
              }}
            />
          </svg>

          {/* Interactive Center Content HTML (rendered on top of SVG center circle) */}
          <div
            onClick={handleTap}
            style={{
              position: 'absolute',
              width: INNER_CIRCLE_RADIUS * 2,
              height: INNER_CIRCLE_RADIUS * 2,
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              transform: tapScale ? 'scale(0.97)' : 'scale(1)',
              transition: 'transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div style={{
              fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
              fontSize: 44,
              fontWeight: 700,
              color: '#1F1D1A',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              transition: 'color 0.15s'
            }}>
              {count}
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#8A8275',
              marginTop: 4,
              letterSpacing: '0.02em'
            }}>
              / {BEAD_COUNT}
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 500,
              color: count === 0 ? '#9C9283' : count === BEAD_COUNT ? '#B37C24' : '#A8A092',
              marginTop: 4,
              letterSpacing: '0.04em',
              textTransform: 'lowercase'
            }}>
              {count === 0 ? 'tap to begin' : count === BEAD_COUNT ? 'round complete' : 'tap to count'}
            </div>
          </div>
        </div>

        {/* Sanskrit Mantra Display underneath mala */}
        <div style={{
          marginTop: 18,
          marginBottom: 16,
          textAlign: 'center',
          maxWidth: 320,
          minHeight: 28
        }}>
          <div style={{
            fontSize: 16,
            fontWeight: 500,
            color: '#6D675E',
            letterSpacing: '0.02em',
            lineHeight: 1.45
          }}>
            {currentMantra.sanskrit}
          </div>
        </div>
      </div>

      {/* Start Again Action Button */}
      <button
        onClick={handleStartAgain}
        style={{
          width: '100%',
          background: '#F2ECE1',
          border: '1px solid #E5DFD5',
          borderRadius: 14,
          padding: '13px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 15,
          fontWeight: 600,
          color: '#1E293B',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          transition: 'all 0.15s ease',
          marginBottom: 16
        }}
      >
        <span style={{ fontSize: 16 }}>🔄</span>
        <span>Start again</span>
      </button>

      {/* Guidance Card */}
      <div style={{
        background: '#F4EFEB',
        border: '1px solid #E8E0D5',
        borderRadius: 18,
        padding: '16px 20px',
        color: '#78716C',
        fontSize: 13.5,
        lineHeight: 1.55,
        fontWeight: 400
      }}>
        Tap the center of the mala to count each repetition. One full round is 108 beads. Allow each tap to be deliberate and unhurried.
      </div>

      {/* Completed Rounds Counter badge if any */}
      {completedRounds > 0 && (
        <div style={{
          marginTop: 14,
          textAlign: 'center',
          fontSize: 12,
          color: '#8A8275',
          fontWeight: 500,
          letterSpacing: '0.02em'
        }}>
          🪷 {completedRounds} {completedRounds === 1 ? 'round' : 'rounds'} completed today
        </div>
      )}

      {/* Japa Completion Modal (At 108 / 108) */}
      {showCompletionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(25, 20, 15, 0.45)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: 20
        }}>
          <div style={{
            width: '100%',
            maxWidth: 360,
            background: '#FAF8F5',
            borderRadius: 24,
            padding: '28px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            border: '1px solid #E8DFD3',
            animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Meditative Icon */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#F3E9DA',
              border: '1px solid #DFCDB8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 26
            }}>
              🪷
            </div>

            {/* Title */}
            <h2 style={{
              fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
              fontSize: 24,
              fontWeight: 700,
              color: '#1F1D1A',
              margin: '0 0 8px',
              lineHeight: 1.2
            }}>
              108 repetitions complete
            </h2>

            {/* Mantra tag */}
            <div style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: '#936118',
              background: '#F5EBDD',
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: 20,
              marginBottom: 14
            }}>
              {currentMantra.shortName}
            </div>

            {/* Supporting message */}
            <p style={{
              fontSize: 15,
              color: '#6B655D',
              lineHeight: 1.5,
              margin: '0 0 24px',
              fontStyle: 'italic'
            }}>
              "Take a quiet moment before you continue."
            </p>

            {/* Actions: Start Again & Done */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={handleStartAgain}
                style={{
                  width: '100%',
                  background: '#D4A050',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 14,
                  padding: '13px 0',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(212, 160, 80, 0.28)',
                  transition: 'background 0.15s ease'
                }}
              >
                Start Again
              </button>

              <button
                onClick={handleDone}
                style={{
                  width: '100%',
                  background: '#F0EAE0',
                  color: '#4B463E',
                  border: '1px solid #E2D7C8',
                  borderRadius: 14,
                  padding: '12px 0',
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
