import React, { useState, useMemo } from 'react';
import { JournalEntry, MoodItem } from '../types';
import { JOURNAL_MOODS } from '../data/gitaData';

interface JournalScreenProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: { date: string; mood: string; reflection: string; teaching?: string }) => void;
  onDeleteEntry?: (id: string) => void;
  onOpenMenu?: () => void;
}

type SubScreen = 'landing' | 'write' | 'calendar' | 'history';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Gita teaching for the monthly reflection card & modal
const FEATURED_MONTHLY_TEACHING = {
  ref: "BG 2.47 • Sānkhya Yoga",
  shortQuote: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself...",
  fullQuote: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
  sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
  transliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo 'stvakarmaṇi ||",
  chapterName: "Chapter 2: Sānkhya Yoga (The Yoga of Knowledge)",
  practicalWisdom: "When your daily reflections uncover anxiety, pressure, or comparison, Krishna offers the ultimate liberation: focus with all your heart on your sincere effort today, while surrendering anxiety over future outcomes. True peace of mind belongs to one whose actions are pure and unburdened by expectations."
};

// Calculate streak based on recorded entries
function calculateStreak(entries: JournalEntry[]): number {
  if (!entries || entries.length === 0) return 0;
  const uniqueDates = Array.from(new Set(entries.map(e => e.date))).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  let streak = 1;
  let prevDate = new Date(uniqueDates[0]);
  for (let i = 1; i < uniqueDates.length; i++) {
    const curDate = new Date(uniqueDates[i]);
    const diffTime = Math.abs(prevDate.getTime() - curDate.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
      prevDate = curDate;
    } else {
      break;
    }
  }
  return streak;
}

export const JournalScreen: React.FC<JournalScreenProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  onOpenMenu
}) => {
  // Navigation between the 4 screens: 'landing' (1) -> 'write' (2) -> 'calendar' (3) -> 'history' (4)
  const [currentScreen, setCurrentScreen] = useState<SubScreen>('landing');

  // Today reference (defaults to September 23, 2026 to harmonize with app corpus)
  const today = useMemo(() => new Date(2026, 8, 23), []);

  // Calendar view month & year state
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(8); // September = 8 (0-indexed)

  // Write reflection state
  const [selectedDateStr, setSelectedDateStr] = useState<string>("2026-09-23");
  const [selectedMood, setSelectedMood] = useState<string>("Happy");
  const [reflectionText, setReflectionText] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  // Modals state
  const [showFullTeachingModal, setShowFullTeachingModal] = useState<boolean>(false);
  const [selectedDayEntryModal, setSelectedDayEntryModal] = useState<JournalEntry | null>(null);

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Map entries by date "YYYY-MM-DD"
  const entriesByDate = useMemo(() => {
    const map: Record<string, JournalEntry> = {};
    entries.forEach(e => {
      map[e.date] = e;
    });
    return map;
  }, [entries]);

  // Current month's entries
  const currentMonthEntries = useMemo(() => {
    const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    return entries.filter(e => e.date.startsWith(monthPrefix));
  }, [entries, viewYear, viewMonth]);

  // Calendar day calculation for month grid
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const days: Array<{
      dayNum: number | null;
      dateStr: string | null;
      isToday: boolean;
      entry?: JournalEntry;
    }> = [];

    // Preceding empty slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNum: null, dateStr: null, isToday: false });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && d === today.getDate();
      const entry = entriesByDate[dateStr];

      days.push({
        dayNum: d,
        dateStr,
        isToday,
        entry
      });
    }

    return days;
  }, [viewYear, viewMonth, entriesByDate, today]);

  // Formatted date string for write screen
  const formattedSelectedDate = useMemo(() => {
    try {
      const [y, m, d] = selectedDateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return "23 September 2026";
    }
  }, [selectedDateStr]);

  // Handle Save Reflection from Screen 2
  const handleSaveReflection = () => {
    if (!reflectionText.trim()) {
      setValidationError("Please write a few words about your day before saving.");
      return;
    }

    setValidationError("");
    onSaveEntry({
      date: selectedDateStr,
      mood: selectedMood,
      reflection: reflectionText.trim(),
      teaching: FEATURED_MONTHLY_TEACHING.ref
    });

    // Reset reflection form
    setReflectionText("");

    // Lead to 3rd screen (Calendar tracking journal) as specified
    setCurrentScreen('calendar');
  };

  // Streak count
  const streakCount = useMemo(() => calculateStreak(entries), [entries]);

  // Sorted entries for history (Screen 4) - newest first
  const sortedHistoryEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt;
    });
  }, [entries]);

  // Format date helper for history cards: e.g. "24 Sep 2026"
  const formatHistoryDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN 1: My Journal Landing
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentScreen === 'landing') {
    return (
      <div style={{
        background: '#FAF7F2',
        minHeight: '100%',
        padding: '24px 18px 40px',
        color: '#1C1917',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header: Hamburger | Title | + New */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          paddingTop: 8
        }}>
          <button
            onClick={onOpenMenu}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1C1917',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Open Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            color: '#1C1917',
            fontWeight: 600,
            margin: 0
          }}>
            My Journal
          </h1>

          <button
            onClick={() => setCurrentScreen('write')}
            style={{
              background: '#1E5E3A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 20,
              padding: '6px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 8px rgba(30, 94, 58, 0.25)',
              transition: 'transform 0.15s ease'
            }}
          >
            + New
          </button>
        </div>

        {/* Informational Guidance Banner Card */}
        <div style={{
          background: '#FFF9EE',
          border: '1px solid #EFE4D0',
          borderRadius: 20,
          padding: '24px 20px',
          marginBottom: 36,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
        }}>
          <p style={{
            fontSize: 14.5,
            lineHeight: 1.6,
            color: '#2A2621',
            margin: '0 0 14px 0'
          }}>
            Journal your thoughts and experiences each day.
          </p>
          <p style={{
            fontSize: 14.5,
            lineHeight: 1.6,
            color: '#2A2621',
            margin: 0
          }}>
            At the end of the month, reflect on your overall mood and receive a{' '}
            <strong style={{ fontWeight: 600, color: '#1C1917' }}>
              personalized, relevant Gita teaching
            </strong>{' '}
            to help you understand your journey and move forward with greater clarity.
          </p>
        </div>

        {/* Middle Empty / Status State */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '10px 10px 30px'
        }}>
          {/* Notepad Pencil Icon */}
          <div style={{
            fontSize: 48,
            marginBottom: 16,
            lineHeight: 1
          }}>
            📝
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 19,
            color: '#1C1917',
            fontWeight: 500,
            marginBottom: 8
          }}>
            {entries.length === 0 ? 'No reflections yet' : `${entries.length} reflections recorded`}
          </h2>

          <p style={{
            fontSize: 13.5,
            color: '#78716C',
            lineHeight: 1.5,
            maxWidth: 260,
            marginBottom: 28
          }}>
            {entries.length === 0
              ? 'Your thoughts can become a place to pause and understand yourself.'
              : 'Keep nurturing your daily reflections to cultivate inner equanimity.'}
          </p>

          {/* Primary Action Button */}
          <button
            onClick={() => setCurrentScreen('write')}
            style={{
              width: '100%',
              maxWidth: 340,
              background: '#1E5E3A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 24,
              height: 48,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(30, 94, 58, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.2s ease, transform 0.15s ease'
            }}
          >
            {entries.length === 0 ? 'Write your first reflection' : 'Write your reflection'}
          </button>
        </div>

        {/* Bottom Button: View mood calendar */}
        <button
          onClick={() => setCurrentScreen('calendar')}
          style={{
            background: '#FFFFFF',
            border: '1px solid #ECE6DD',
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
            transition: 'background 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: 6,
              background: '#E0F2FE',
              color: '#0284C7'
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <span style={{
              fontSize: 14,
              fontWeight: 500,
              color: '#1C1917'
            }}>
              View mood calendar
            </span>
          </div>

          <span style={{ fontSize: 16, color: '#A8A29E' }}>→</span>
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN 2: Write Reflection & Select Emotion
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentScreen === 'write') {
    return (
      <div style={{
        background: '#FAF7F2',
        minHeight: '100%',
        padding: '24px 18px 40px',
        color: '#1C1917',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header: Back / Hamburger | Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
          paddingTop: 8
        }}>
          <button
            onClick={() => setCurrentScreen('landing')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1C1917',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
            aria-label="Back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            color: '#1C1917',
            fontWeight: 600,
            margin: 0
          }}>
            My Journal
          </h1>

          <div style={{ width: 32 }} />
        </div>

        {/* Date capsule bar matching screenshot: "Today" | "23 September 2026" */}
        <div style={{
          background: '#F1ECE3',
          borderRadius: 20,
          padding: '5px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16
        }}>
          <span style={{
            background: '#FFFFFF',
            borderRadius: 14,
            padding: '3px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: '#1C1917',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            Today
          </span>

          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#57534E'
          }}>
            {formattedSelectedDate}
          </span>
        </div>

        {/* Main Writing & Emotion Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #ECE6DD',
          borderRadius: 20,
          padding: '18px 18px 20px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
          marginBottom: 18,
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Text Area */}
          <textarea
            value={reflectionText}
            onChange={(e) => {
              setReflectionText(e.target.value);
              if (validationError) setValidationError("");
            }}
            placeholder="Write what's on your mind..."
            style={{
              width: '100%',
              minHeight: 180,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 15,
              lineHeight: 1.6,
              color: '#1C1917',
              fontFamily: 'inherit',
              resize: 'none',
              marginBottom: 16
            }}
          />

          {validationError && (
            <div style={{
              fontSize: 12.5,
              color: '#DC2626',
              marginBottom: 12,
              padding: '6px 12px',
              background: '#FEE2E2',
              borderRadius: 8
            }}>
              {validationError}
            </div>
          )}

          {/* Emotion / Mood Selector Header */}
          <div style={{
            borderTop: '1px solid #F4EFE6',
            paddingTop: 16,
            marginTop: 'auto'
          }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#78716C',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 10
            }}>
              How are you feeling today?
            </div>

            {/* 8 Emotions Grid matching requirements: sad, happy, excited, confused, anxious, stressed, angry, neutral */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8
            }}>
              {JOURNAL_MOODS.map(m => {
                const isSelected = selectedMood === m.label;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setSelectedMood(m.label)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 4px',
                      borderRadius: 14,
                      border: isSelected ? '1.5px solid #1E5E3A' : '1px solid #ECE6DD',
                      background: isSelected ? 'rgba(30, 94, 58, 0.08)' : '#FAF8F5',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: 20, marginBottom: 2 }}>{m.emoji}</span>
                    <span style={{
                      fontSize: 11,
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? '#1E5E3A' : '#57534E'
                    }}>
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buttons: Save (Dark green) & Cancel (Outlined) */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 16
        }}>
          <button
            onClick={handleSaveReflection}
            style={{
              flex: 1,
              background: '#1E5E3A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 24,
              height: 48,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(30, 94, 58, 0.22)'
            }}
          >
            Save
          </button>

          <button
            onClick={() => setCurrentScreen('landing')}
            style={{
              flex: 1,
              background: '#FFFFFF',
              color: '#1E5E3A',
              border: '1.5px solid #1E5E3A',
              borderRadius: 24,
              height: 48,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>

        {/* Bottom Button: View mood calendar */}
        <button
          onClick={() => setCurrentScreen('calendar')}
          style={{
            background: '#FFFFFF',
            border: '1px solid #ECE6DD',
            borderRadius: 16,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 22,
              borderRadius: 6,
              background: '#E0F2FE',
              color: '#0284C7'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: '#1C1917' }}>
              View mood calendar
            </span>
          </div>
          <span style={{ fontSize: 15, color: '#A8A29E' }}>→</span>
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN 3: Calendar Tracking Journal
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentScreen === 'calendar') {
    return (
      <div style={{
        background: '#FAF7F2',
        minHeight: '100%',
        padding: '24px 18px 40px',
        color: '#1C1917',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header: Back / Hamburger | Title: Calendar | + New button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingTop: 8
        }}>
          <button
            onClick={() => setCurrentScreen('landing')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1C1917',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Back to Journal Home"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            color: '#1C1917',
            fontWeight: 600,
            margin: 0
          }}>
            Calendar
          </h1>

          <button
            onClick={() => setCurrentScreen('write')}
            style={{
              background: '#1E5E3A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 20,
              padding: '6px 14px',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + New
          </button>
        </div>

        {/* Interactive Month Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          marginBottom: 16
        }}>
          <button
            onClick={handlePrevMonth}
            style={{
              background: '#FFFFFF',
              border: '1px solid #ECE6DD',
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              color: '#57534E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Previous Month"
          >
            ‹
          </button>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            color: '#1C1917',
            fontWeight: 600,
            margin: 0
          }}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h2>

          <button
            onClick={handleNextMonth}
            style={{
              background: '#FFFFFF',
              border: '1px solid #ECE6DD',
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              color: '#57534E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Next Month"
          >
            ›
          </button>
        </div>

        {/* Calendar Grid Container */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #ECE6DD',
          borderRadius: 20,
          padding: '16px 12px 18px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
          marginBottom: 20
        }}>
          {/* Weekday Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            marginBottom: 10
          }}>
            {WEEKDAY_NAMES.map(day => (
              <div
                key={day}
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#A8A29E',
                  padding: '4px 0'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Month Days */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            rowGap: 8,
            columnGap: 2
          }}>
            {calendarDays.map((item, idx) => {
              if (item.dayNum === null) {
                return <div key={`empty-${idx}`} style={{ height: 46 }} />;
              }

              const hasEntry = Boolean(item.entry);
              const isToday = item.isToday;

              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => {
                    if (item.entry) {
                      setSelectedDayEntryModal(item.entry);
                    } else if (item.dateStr) {
                      setSelectedDateStr(item.dateStr);
                      setCurrentScreen('write');
                    }
                  }}
                  style={{
                    height: 46,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: hasEntry
                      ? '#FAF6EE'
                      : isToday
                      ? 'rgba(30, 94, 58, 0.04)'
                      : 'transparent',
                    border: hasEntry
                      ? '1.5px solid #C89B3C'
                      : isToday
                      ? '1px dashed #1E5E3A'
                      : '1.5px solid transparent',
                    borderRadius: 12,
                    cursor: 'pointer',
                    padding: 2,
                    transition: 'all 0.15s ease'
                  }}
                  title={hasEntry ? `Reflection: ${item.entry?.mood}` : `Journal for ${item.dateStr}`}
                >
                  <span style={{
                    fontSize: 13,
                    fontWeight: hasEntry || isToday ? 600 : 400,
                    color: hasEntry ? '#1C1917' : isToday ? '#1E5E3A' : '#44403C',
                    lineHeight: 1
                  }}>
                    {item.dayNum}
                  </span>

                  {/* Display recorded mood emoji under the date as shown in the screenshot! */}
                  {hasEntry ? (
                    <span style={{ fontSize: 13, marginTop: 2, lineHeight: 1 }}>
                      {item.entry?.emoji || '😊'}
                    </span>
                  ) : isToday ? (
                    <span style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: '#1E5E3A',
                      marginTop: 3
                    }} />
                  ) : (
                    <span style={{ height: 12 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* THIS MONTH'S TEACHING Card */}
        <div style={{
          background: '#FFF9EE',
          border: '1px solid #F3EBDD',
          borderRadius: 20,
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
          marginBottom: 16
        }}>
          <div style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#B45309',
            textTransform: 'uppercase',
            marginBottom: 6
          }}>
            THIS MONTH'S TEACHING
          </div>

          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#1C1917',
            marginBottom: 8
          }}>
            {FEATURED_MONTHLY_TEACHING.ref}
          </div>

          <p style={{
            fontSize: 13.5,
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: '#44403C',
            margin: '0 0 16px 0'
          }}>
            "{FEATURED_MONTHLY_TEACHING.shortQuote}"
          </p>

          <button
            onClick={() => setShowFullTeachingModal(true)}
            style={{
              width: '100%',
              background: '#C88A2C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 20,
              height: 44,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(200, 138, 44, 0.25)'
            }}
          >
            View full teaching
          </button>
        </div>

        {/* Bottom Button Requested by User: 'Journal History' that leads to 4th screen */}
        <button
          onClick={() => setCurrentScreen('history')}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #1E5E3A',
            color: '#1E5E3A',
            borderRadius: 20,
            padding: '15px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14.5,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
            transition: 'background 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📖</span>
            <span>Journal History</span>
          </div>
          <span style={{ fontSize: 16 }}>→</span>
        </button>

        {/* Modal: Full Gita Teaching */}
        {showFullTeachingModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(20, 18, 14, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 18,
            zIndex: 300
          }}>
            <div style={{
              background: '#FAF7F2',
              borderRadius: 24,
              width: '100%',
              maxWidth: 400,
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '24px 22px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 16
              }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    Gita Teaching for {MONTH_NAMES[viewMonth]}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: '#1C1917', margin: 0 }}>
                    {FEATURED_MONTHLY_TEACHING.ref}
                  </h3>
                </div>

                <button
                  onClick={() => setShowFullTeachingModal(false)}
                  style={{
                    background: '#EAE5DB',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#57534E'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Sanskrit Verse Card */}
              <div style={{
                background: '#FFF9EE',
                border: '1px solid #EFE4D0',
                borderRadius: 16,
                padding: '16px',
                textAlign: 'center',
                marginBottom: 16
              }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 16,
                  color: '#78350F',
                  fontWeight: 600,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line',
                  marginBottom: 10
                }}>
                  {FEATURED_MONTHLY_TEACHING.sanskrit}
                </div>
                <div style={{
                  fontSize: 12.5,
                  fontStyle: 'italic',
                  color: '#92400E',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line'
                }}>
                  {FEATURED_MONTHLY_TEACHING.transliteration}
                </div>
              </div>

              {/* Translation */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#78716C', textTransform: 'uppercase', marginBottom: 6 }}>
                  English Translation
                </div>
                <p style={{ fontSize: 14, fontStyle: 'italic', color: '#1C1917', lineHeight: 1.6, margin: 0 }}>
                  "{FEATURED_MONTHLY_TEACHING.fullQuote}"
                </p>
              </div>

              {/* Practical Guidance */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#78716C', textTransform: 'uppercase', marginBottom: 6 }}>
                  Wisdom for Your Reflections
                </div>
                <p style={{ fontSize: 13, color: '#57534E', lineHeight: 1.65, margin: 0 }}>
                  {FEATURED_MONTHLY_TEACHING.practicalWisdom}
                </p>
              </div>

              <button
                onClick={() => setShowFullTeachingModal(false)}
                style={{
                  width: '100%',
                  background: '#1E5E3A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 20,
                  height: 44,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal: View Single Day Entry */}
        {selectedDayEntryModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(20, 18, 14, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 18,
            zIndex: 300
          }}>
            <div style={{
              background: '#FAF7F2',
              borderRadius: 22,
              width: '100%',
              maxWidth: 380,
              padding: '22px 20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 24 }}>{selectedDayEntryModal.emoji}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1C1917' }}>
                      {selectedDayEntryModal.mood}
                    </div>
                    <div style={{ fontSize: 12, color: '#78716C' }}>
                      {formatHistoryDate(selectedDayEntryModal.date)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDayEntryModal(null)}
                  style={{
                    background: '#EAE5DB',
                    border: 'none',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#57534E'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{
                background: '#FFFFFF',
                border: '1px solid #ECE6DD',
                borderRadius: 14,
                padding: '14px 16px',
                fontSize: 14,
                color: '#292524',
                lineHeight: 1.6,
                marginBottom: 16,
                maxHeight: 220,
                overflowY: 'auto'
              }}>
                {selectedDayEntryModal.reflection}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {onDeleteEntry && (
                  <button
                    onClick={() => {
                      onDeleteEntry(selectedDayEntryModal.id);
                      setSelectedDayEntryModal(null);
                    }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: '1px solid #FCA5A5',
                      color: '#DC2626',
                      borderRadius: 16,
                      height: 40,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Delete Entry
                  </button>
                )}
                <button
                  onClick={() => setSelectedDayEntryModal(null)}
                  style={{
                    flex: 1,
                    background: '#1E5E3A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 16,
                    height: 40,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
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
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN 4: Journal History
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: '#FAF7F2',
      minHeight: '100%',
      padding: '24px 18px 40px',
      color: '#1C1917',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header: < Back | Title: Journal history */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingTop: 8
      }}>
        <button
          onClick={() => setCurrentScreen('calendar')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#1C1917',
            padding: '6px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 14,
            fontWeight: 500
          }}
          aria-label="Back to Calendar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 19,
          color: '#1C1917',
          fontWeight: 600,
          margin: 0
        }}>
          Journal history
        </h1>

        <div style={{ width: 44 }} />
      </div>

      {/* Streak Banner Card matching Screenshot: Dark Green with big number and flame */}
      <div style={{
        background: '#1E5E3A',
        borderRadius: 18,
        padding: '18px 22px',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        boxShadow: '0 4px 16px rgba(30, 94, 58, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1
          }}>
            {streakCount}
          </div>

          <div style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            lineHeight: 1.4,
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            DAYS<br />JOURNALING STREAK
          </div>
        </div>

        <div style={{ fontSize: 30, lineHeight: 1 }}>
          🔥
        </div>
      </div>

      {/* Section Title: HISTORY */}
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: '#78716C',
        textTransform: 'uppercase',
        marginBottom: 12,
        paddingLeft: 4
      }}>
        HISTORY
      </div>

      {/* History Entries List: Empty initially until user writes their first reflection */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 20
      }}>
        {sortedHistoryEntries.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #ECE6DD',
            borderRadius: 18,
            padding: '36px 20px',
            textAlign: 'center',
            color: '#78716C'
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📖</div>
            <div style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#1C1917',
              marginBottom: 6
            }}>
              No reflections recorded yet
            </div>
            <p style={{
              fontSize: 13,
              color: '#78716C',
              lineHeight: 1.5,
              maxWidth: 240,
              margin: '0 auto 20px auto'
            }}>
              Write your first reflection to start your journal history and build your streak.
            </p>
            <button
              onClick={() => setCurrentScreen('write')}
              style={{
                background: '#1E5E3A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 20,
                padding: '10px 20px',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Write your first reflection
            </button>
          </div>
        ) : (
          sortedHistoryEntries.map(entry => (
            <div
              key={entry.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #ECE6DD',
                borderRadius: 16,
                padding: '16px 18px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8
              }}>
                <div style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#1C1917'
                }}>
                  {formatHistoryDate(entry.date)}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: '#F5F2EB',
                  padding: '3px 8px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#44403C'
                }}>
                  <span>{entry.emoji}</span>
                  <span>{entry.mood}</span>
                </div>
              </div>

              <p style={{
                fontSize: 13.5,
                color: '#44403C',
                lineHeight: 1.6,
                margin: 0
              }}>
                {entry.reflection}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Bottom Action: View mood calendar */}
      <button
        onClick={() => setCurrentScreen('calendar')}
        style={{
          background: '#FFFFFF',
          border: '1px solid #ECE6DD',
          borderRadius: 16,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginTop: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: 6,
            background: '#E0F2FE',
            color: '#0284C7'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 500, color: '#1C1917' }}>
            View mood calendar
          </span>
        </div>
        <span style={{ fontSize: 15, color: '#A8A29E' }}>→</span>
      </button>
    </div>
  );
};
