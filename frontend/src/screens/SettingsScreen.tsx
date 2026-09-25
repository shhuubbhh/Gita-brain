import React, { useState } from 'react';

interface SettingsScreenProps {
  onBack: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
  journalEntriesCount: number;
  savedTeachingsCount: number;
  onClearJournalEntries: () => void;
  onClearSavedTeachings: () => void;
  japaSoundEnabled: boolean;
  onToggleJapaSound: (enabled: boolean) => void;
  onOpenPrivacy: () => void;
  onOpenAbout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  journalEntriesCount,
  savedTeachingsCount,
  onClearJournalEntries,
  onClearSavedTeachings,
  japaSoundEnabled,
  onToggleJapaSound,
  onOpenPrivacy,
  onOpenAbout
}) => {
  // Notification toggles state
  const [dailyShlokEnabled, setDailyShlokEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gita_daily_shlok') !== 'false';
    } catch {
      return true;
    }
  });

  const [reflectionReminderEnabled, setReflectionReminderEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gita_reflection_reminder') === 'true';
    } catch {
      return false;
    }
  });

  // Modal states
  const [showClearJournalModal, setShowClearJournalModal] = useState<boolean>(false);
  const [showClearTeachingsModal, setShowClearTeachingsModal] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleToggleDailyShlok = () => {
    setDailyShlokEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('gita_daily_shlok', String(next));
      } catch {}
      showToast(next ? "Daily Shlok notifications: Enabled 🌅" : "Daily Shlok notifications: Disabled");
      return next;
    });
  };

  const handleToggleReflectionReminder = () => {
    setReflectionReminderEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('gita_reflection_reminder', String(next));
        if (next && 'Notification' in window && Notification.permission !== 'granted') {
          Notification.requestPermission();
        }
      } catch {}
      showToast(next ? "Reflection Reminder: Set for 8:00 PM 🪷" : "Reflection Reminder: Disabled");
      return next;
    });
  };

  const handleToggleSound = () => {
    const next = !japaSoundEnabled;
    onToggleJapaSound(next);
    showToast(next ? "Japa Sound: ON 🔔" : "Japa Sound: MUTED 🔇");
  };

  const handleConfirmClearJournal = () => {
    onClearJournalEntries();
    setShowClearJournalModal(false);
    showToast("All journal reflections cleared");
  };

  const handleConfirmClearTeachings = () => {
    onClearSavedTeachings();
    setShowClearTeachingsModal(false);
    showToast("All saved teachings cleared");
  };

  const isDark = theme === 'dark';

  // Toggle Switch Component matching reference design
  const renderToggle = (checked: boolean, onToggle: () => void) => (
    <button
      type="button"
      onClick={onToggle}
      aria-checked={checked}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        background: checked ? (isDark ? '#297A4C' : '#1E5E3A') : (isDark ? '#38433C' : '#D6CFC4'),
        position: 'relative',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        transition: 'background 0.2s ease',
        flexShrink: 0
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 23 : 3,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
          transition: 'left 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      />
    </button>
  );

  return (
    <div style={{
      background: isDark ? '#121614' : '#FAF7F2',
      color: isDark ? '#F3F0EA' : '#1C1917',
      minHeight: '100%',
      padding: '24px 18px 48px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background 0.2s ease, color 0.2s ease'
    }}>
      {/* Top Header: < Back | Settings */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingTop: 8
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDark ? '#297A4C' : '#1E5E3A',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 14.5,
            fontWeight: 600,
            padding: '4px 0'
          }}
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 600,
          color: isDark ? '#F3F0EA' : '#1C1917',
          margin: 0
        }}>
          Settings
        </h1>

        <div style={{ width: 48 }} />
      </div>

      {/* ───────────────────────────────────────────────────────────
          1. APPEARANCE
      ─────────────────────────────────────────────────────────── */}
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: isDark ? '#928C82' : '#78716C',
        textTransform: 'uppercase',
        marginBottom: 8,
        paddingLeft: 4
      }}>
        APPEARANCE
      </div>

      <div style={{
        background: isDark ? '#1C241F' : '#FFFFFF',
        border: `1px solid ${isDark ? '#2A362E' : '#ECE6DD'}`,
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        marginBottom: 22
      }}>
        {/* Theme Row */}
        <div style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${isDark ? '#26312A' : '#F3EDE4'}`
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F3F0EA' : '#1C1917' }}>
              Theme
            </div>
          </div>

          {/* Theme Pill Toggle [ Light | Dark ] */}
          <div style={{
            background: isDark ? '#253028' : '#EFEAE3',
            borderRadius: 16,
            padding: 3,
            display: 'flex',
            gap: 2
          }}>
            <button
              onClick={() => onThemeChange('light')}
              style={{
                background: !isDark ? '#1E5E3A' : 'transparent',
                color: !isDark ? '#FFFFFF' : (isDark ? '#9E988E' : '#57534E'),
                border: 'none',
                borderRadius: 13,
                padding: '5px 14px',
                fontSize: 12.5,
                fontWeight: !isDark ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              Light
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              style={{
                background: isDark ? '#297A4C' : 'transparent',
                color: isDark ? '#FFFFFF' : '#57534E',
                border: 'none',
                borderRadius: 13,
                padding: '5px 14px',
                fontSize: 12.5,
                fontWeight: isDark ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Language Row */}
        <div style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F3F0EA' : '#1C1917' }}>
              Language
            </div>
            <div style={{ fontSize: 12, color: isDark ? '#928C82' : '#78716C', marginTop: 2 }}>
              Content language preference
            </div>
          </div>

          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as 'en' | 'hi')}
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                background: isDark ? '#253028' : '#EFEAE3',
                border: `1px solid ${isDark ? '#314036' : '#DDD6CB'}`,
                borderRadius: 12,
                padding: '6px 28px 6px 14px',
                fontSize: 13,
                fontWeight: 500,
                color: isDark ? '#F3F0EA' : '#1C1917',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
            </select>
            <span style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 10,
              color: isDark ? '#9E988E' : '#78716C',
              pointerEvents: 'none'
            }}>
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          2. NOTIFICATIONS
      ─────────────────────────────────────────────────────────── */}
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: isDark ? '#928C82' : '#78716C',
        textTransform: 'uppercase',
        marginBottom: 8,
        paddingLeft: 4
      }}>
        NOTIFICATIONS
      </div>

      <div style={{
        background: isDark ? '#1C241F' : '#FFFFFF',
        border: `1px solid ${isDark ? '#2A362E' : '#ECE6DD'}`,
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        marginBottom: 22
      }}>
        {/* Daily Shlok */}
        <div style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${isDark ? '#26312A' : '#F3EDE4'}`
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F3F0EA' : '#1C1917' }}>
              Daily Shlok
            </div>
            <div style={{ fontSize: 12, color: isDark ? '#928C82' : '#78716C', marginTop: 2 }}>
              A teaching each morning
            </div>
          </div>
          {renderToggle(dailyShlokEnabled, handleToggleDailyShlok)}
        </div>

        {/* Reflection reminder */}
        <div style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F3F0EA' : '#1C1917' }}>
              Reflection reminder
            </div>
            <div style={{ fontSize: 12, color: isDark ? '#928C82' : '#78716C', marginTop: 2 }}>
              Gentle nudge to journal
            </div>
          </div>
          {renderToggle(reflectionReminderEnabled, handleToggleReflectionReminder)}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          3. SOUND
      ─────────────────────────────────────────────────────────── */}
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: isDark ? '#928C82' : '#78716C',
        textTransform: 'uppercase',
        marginBottom: 8,
        paddingLeft: 4
      }}>
        SOUND
      </div>

      <div style={{
        background: isDark ? '#1C241F' : '#FFFFFF',
        border: `1px solid ${isDark ? '#2A362E' : '#ECE6DD'}`,
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        marginBottom: 22
      }}>
        {/* Japa sounds */}
        <div style={{
          padding: '15px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F3F0EA' : '#1C1917' }}>
              Japa sounds
            </div>
          </div>
          {renderToggle(japaSoundEnabled, handleToggleSound)}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          4. PRIVACY & DATA
      ─────────────────────────────────────────────────────────── */}
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: isDark ? '#928C82' : '#78716C',
        textTransform: 'uppercase',
        marginBottom: 8,
        paddingLeft: 4
      }}>
        PRIVACY & DATA
      </div>

      <div style={{
        background: isDark ? '#1C241F' : '#FFFFFF',
        border: `1px solid ${isDark ? '#2A362E' : '#ECE6DD'}`,
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        marginBottom: 22
      }}>
        {/* Privacy policy link */}
        <button
          onClick={onOpenPrivacy}
          style={{
            width: '100%',
            padding: '15px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            borderBottom: `1px solid ${isDark ? '#26312A' : '#F3EDE4'}`,
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F3F0EA' : '#1C1917' }}>
            Privacy policy
          </span>
          <span style={{ fontSize: 15, color: isDark ? '#4ADE80' : '#1E5E3A' }}>→</span>
        </button>

        {/* Journal entries clear row */}
        <div style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${isDark ? '#26312A' : '#F3EDE4'}`
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F3F0EA' : '#1C1917' }}>
              Journal entries
            </div>
            <div style={{ fontSize: 12, color: isDark ? '#928C82' : '#78716C', marginTop: 2 }}>
              {journalEntriesCount} stored on this device
            </div>
          </div>

          <button
            onClick={() => setShowClearJournalModal(true)}
            style={{
              background: 'transparent',
              border: '1px solid #DC2626',
              color: '#DC2626',
              borderRadius: 10,
              padding: '5px 14px',
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
          >
            Clear
          </button>
        </div>

        {/* Saved teachings clear row */}
        <div style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F3F0EA' : '#1C1917' }}>
              Saved teachings
            </div>
            <div style={{ fontSize: 12, color: isDark ? '#928C82' : '#78716C', marginTop: 2 }}>
              {savedTeachingsCount} stored on this device
            </div>
          </div>

          <button
            onClick={() => setShowClearTeachingsModal(true)}
            style={{
              background: 'transparent',
              border: '1px solid #DC2626',
              color: '#DC2626',
              borderRadius: 10,
              padding: '5px 14px',
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          5. ABOUT
      ─────────────────────────────────────────────────────────── */}
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: isDark ? '#928C82' : '#78716C',
        textTransform: 'uppercase',
        marginBottom: 8,
        paddingLeft: 4
      }}>
        ABOUT
      </div>

      <div style={{
        background: isDark ? '#1C241F' : '#FFFFFF',
        border: `1px solid ${isDark ? '#2A362E' : '#ECE6DD'}`,
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        marginBottom: 20
      }}>
        {/* About Maargdarshan link */}
        <button
          onClick={onOpenAbout}
          style={{
            width: '100%',
            padding: '15px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            borderBottom: `1px solid ${isDark ? '#26312A' : '#F3EDE4'}`,
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F3F0EA' : '#1C1917' }}>
            About Maargdarshan
          </span>
          <span style={{ fontSize: 15, color: '#A8A29E' }}>→</span>
        </button>

        {/* App version row */}
        <div style={{
          padding: '15px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${isDark ? '#26312A' : '#F3EDE4'}`
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F3F0EA' : '#1C1917' }}>
            App version
          </span>
          <span style={{ fontSize: 13, color: isDark ? '#9E988E' : '#78716C' }}>
            1.0.0
          </span>
        </div>

        {/* Disclaimer box at bottom of About card */}
        <div style={{
          padding: '16px 18px',
          background: isDark ? '#18201C' : '#FAF8F5'
        }}>
          <p style={{
            fontSize: 12.5,
            color: isDark ? '#A6A095' : '#78716C',
            lineHeight: 1.55,
            margin: 0
          }}>
            AI explanations are interpretive and distinct from verified scripture. All Gita verses are attributed to their sources.
          </p>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          MODALS
      ─────────────────────────────────────────────────────────── */}

      {/* Modal: Clear Journal Entries Confirmation */}
      {showClearJournalModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 18, 16, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          zIndex: 400
        }}>
          <div style={{
            background: isDark ? '#1C241F' : '#FAF7F2',
            borderRadius: 22,
            width: '100%',
            maxWidth: 380,
            padding: '24px 22px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: `1px solid ${isDark ? '#2A362E' : '#ECE6DD'}`
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 600,
              color: isDark ? '#F3F0EA' : '#1C1917',
              margin: '0 0 10px 0'
            }}>
              Clear All Journal Entries?
            </h3>
            <p style={{
              fontSize: 13.5,
              color: isDark ? '#A6A095' : '#57534E',
              lineHeight: 1.55,
              margin: '0 0 20px 0'
            }}>
              This will permanently delete all {journalEntriesCount} written reflections stored locally on this device. This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowClearJournalModal(false)}
                style={{
                  flex: 1,
                  background: isDark ? '#253028' : '#EFEAE3',
                  color: isDark ? '#F3F0EA' : '#292524',
                  border: 'none',
                  borderRadius: 16,
                  height: 42,
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmClearJournal}
                style={{
                  flex: 1,
                  background: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 16,
                  height: 42,
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Clear Saved Teachings Confirmation */}
      {showClearTeachingsModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 18, 16, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          zIndex: 400
        }}>
          <div style={{
            background: isDark ? '#1C241F' : '#FAF7F2',
            borderRadius: 22,
            width: '100%',
            maxWidth: 380,
            padding: '24px 22px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: `1px solid ${isDark ? '#2A362E' : '#ECE6DD'}`
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 600,
              color: isDark ? '#F3F0EA' : '#1C1917',
              margin: '0 0 10px 0'
            }}>
              Clear Saved Teachings?
            </h3>
            <p style={{
              fontSize: 13.5,
              color: isDark ? '#A6A095' : '#57534E',
              lineHeight: 1.55,
              margin: '0 0 20px 0'
            }}>
              This will permanently delete all {savedTeachingsCount} bookmarked Gita verses and teachings from this device.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowClearTeachingsModal(false)}
                style={{
                  flex: 1,
                  background: isDark ? '#253028' : '#EFEAE3',
                  color: isDark ? '#F3F0EA' : '#292524',
                  border: 'none',
                  borderRadius: 16,
                  height: 42,
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmClearTeachings}
                style={{
                  flex: 1,
                  background: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 16,
                  height: 42,
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          background: isDark ? '#297A4C' : '#1E5E3A',
          color: '#FFFFFF',
          padding: '10px 20px',
          borderRadius: 24,
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          zIndex: 500,
          animation: 'fade-up 0.2s ease',
          whiteSpace: 'nowrap'
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};
