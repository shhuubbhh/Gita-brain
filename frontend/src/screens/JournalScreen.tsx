import React, { useState, useMemo } from 'react';
import { JournalEntry, MoodItem } from '../types';
import { JOURNAL_MOODS } from '../data/gitaData';

interface JournalScreenProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: { date: string; mood: string; reflection: string; teaching?: string }) => void;
  onDeleteEntry?: (id: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Generates a spiritual Gita synthesis based on monthly mood patterns
function generateMonthlyGitaSummary(entries: JournalEntry[], monthName: string): { title: string; quote: string; verse: string; insight: string } {
  if (entries.length === 0) {
    return {
      title: "A Blank Page for Self-Discovery",
      quote: "Yoga is the journey of the self, through the self, to the self.",
      verse: "Bhagavad Gita 6.20",
      insight: "Begin recording your daily reflections to cultivate self-awareness and equanimity."
    };
  }

  // Count mood categories
  const moodCounts: Record<string, number> = {};
  entries.forEach(e => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });

  const dominantMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);

  if (['Peaceful', 'Calm', 'Grateful', 'Happy'].includes(dominantMood)) {
    return {
      title: `A Month of Sattvic Equanimity`,
      quote: "Perform your duty with an even mind, abandoning all attachment to success or failure. Such equanimity is called Yoga.",
      verse: "Bhagavad Gita 2.48",
      insight: `Throughout ${monthName}, your reflections reflected grounded peace, gratitude, and joy. In the Gita, Krishna teaches that steady inner contentment (samatva) is the true mark of wisdom. You navigated your days with stillness and grace.`
    };
  } else if (['Anxious', 'Sad'].includes(dominantMood)) {
    return {
      title: `A Month of Inner Transformation`,
      quote: "Elevate yourself through the power of your mind, and do not degrade yourself, for the mind can be the friend and also the enemy of the self.",
      verse: "Bhagavad Gita 6.5",
      insight: `During ${monthName}, you encountered moments of vulnerability, heavy feelings, and honest searching. The Gita reminds us that spiritual strength is forged inside the furnace of uncertainty. Every reflection you wrote was a conscious step toward self-mastery.`
    };
  } else if (['Angry', 'Excited'].includes(dominantMood)) {
    return {
      title: `Channelling Energy into Purpose`,
      quote: "Therefore, without being attached to the fruits of activities, one should act as a matter of duty.",
      verse: "Bhagavad Gita 3.19",
      insight: `In ${monthName}, you experienced potent, dynamic emotions. Krishna guides Arjuna to direct fiery intensity not into conflict or frantic chasing, but into sincere, selfless action (Karma Yoga), where passion turns into purpose.`
    };
  }

  return {
    title: `A Balanced Path of Reflection`,
    quote: "One who is satisfied with whatever comes by chance, who is free from duality, is never entangled.",
    verse: "Bhagavad Gita 4.22",
    insight: `You walked a diverse emotional landscape in ${monthName}. Observing the changing waves of mind without being swept away is the very essence of spiritual practice.`
  };
}

export const JournalScreen: React.FC<JournalScreenProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry
}) => {
  // Calendar navigation state (defaults to September 2026 matching app corpus)
  const today = new Date(2026, 8, 23); // 2026-09-23
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(8); // 0-indexed: 8 = September

  // Selected date ISO string, defaults to today "2026-09-23"
  const [selectedDateStr, setSelectedDateStr] = useState<string>("2026-09-23");

  // Form input state
  const [selectedMood, setSelectedMood] = useState<string>("Happy");
  const [reflectionText, setReflectionText] = useState<string>("");
  const [teachingRef, setTeachingRef] = useState<string>("");
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);

  // Monthly summary modal state
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

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

  // Most common mood this month
  const mostCommonMoodInfo = useMemo(() => {
    if (currentMonthEntries.length === 0) {
      return { mood: 'None', emoji: '🪷', count: 0 };
    }
    const counts: Record<string, number> = {};
    currentMonthEntries.forEach(e => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    let topMood = currentMonthEntries[0].mood;
    let maxCount = 0;
    Object.entries(counts).forEach(([m, cnt]) => {
      if (cnt > maxCount) {
        maxCount = cnt;
        topMood = m;
      }
    });
    const foundMood = JOURNAL_MOODS.find(m => m.label === topMood || m.key === topMood);
    return {
      mood: topMood,
      emoji: foundMood ? foundMood.emoji : '😊',
      count: maxCount
    };
  }, [currentMonthEntries]);

  // Calendar day calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const days: Array<{
      dayNum: number | null;
      dateStr: string | null;
      isToday: boolean;
      isSelected: boolean;
      entry?: JournalEntry;
    }> = [];

    // Preceding empty slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNum: null, dateStr: null, isToday: false, isSelected: false });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && d === today.getDate();
      const isSelected = dateStr === selectedDateStr;
      const entry = entriesByDate[dateStr];

      days.push({
        dayNum: d,
        dateStr,
        isToday,
        isSelected,
        entry
      });
    }

    return days;
  }, [viewYear, viewMonth, selectedDateStr, entriesByDate, today]);

  // When a day is clicked
  const handleSelectDay = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setIsSavedFeedback(false);
    const existing = entriesByDate[dateStr];
    if (existing) {
      setSelectedMood(existing.mood);
      setReflectionText(existing.reflection);
      setTeachingRef(existing.teaching || "");
    } else {
      setSelectedMood("Happy");
      setReflectionText("");
      setTeachingRef("");
    }
  };

  // Save current day's reflection
  const handleSave = () => {
    if (!reflectionText.trim()) {
      alert("Please write a few words about your day before saving.");
      return;
    }

    onSaveEntry({
      date: selectedDateStr,
      mood: selectedMood,
      reflection: reflectionText.trim(),
      teaching: teachingRef.trim() || undefined
    });

    setIsSavedFeedback(true);
    setTimeout(() => {
      setIsSavedFeedback(false);
    }, 2800);
  };

  // Formatted date string for selected date
  const selectedDateFormatted = useMemo(() => {
    try {
      const [y, m, d] = selectedDateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const isToday = y === today.getFullYear() && (m - 1) === today.getMonth() && d === today.getDate();
      const formatted = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      return isToday ? `Today, ${formatted}` : formatted;
    } catch {
      return selectedDateStr;
    }
  }, [selectedDateStr, today]);

  // Current selected day's entry
  const activeDayEntry = entriesByDate[selectedDateStr];

  // Monthly summary data
  const monthlySummary = useMemo(() => {
    return generateMonthlyGitaSummary(currentMonthEntries, MONTH_NAMES[viewMonth]);
  }, [currentMonthEntries, viewMonth]);

  return (
    <div style={{
      background: '#FAF8F5',
      minHeight: '100vh',
      padding: '48px 18px 40px',
      color: '#1C1917'
    }}>
      {/* 1. Header (Matching reference: Serif "Calendar", "Your mood and reflection history") */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 34,
          color: '#1C1917',
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: 6
        }}>
          Calendar
        </h1>
        <p style={{
          fontSize: 14,
          color: '#78716C',
          lineHeight: 1.5,
          fontWeight: 400
        }}>
          Your mood and reflection history
        </p>
      </div>

      {/* 2. Interactive Calendar Card */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #EFEAE3',
        borderRadius: 22,
        padding: '22px 16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
        marginBottom: 20
      }}>
        {/* Month Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
          padding: '0 6px'
        }}>
          <button
            onClick={handlePrevMonth}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#57534E',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8
            }}
            aria-label="Previous Month"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 21,
            color: '#1C1917',
            fontWeight: 400,
            letterSpacing: '-0.01em'
          }}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h2>

          <button
            onClick={handleNextMonth}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#57534E',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8
            }}
            aria-label="Next Month"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Weekday Names */}
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
                fontSize: 12,
                fontWeight: 600,
                color: '#A8A29E',
                padding: '4px 0'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          rowGap: 10,
          columnGap: 4
        }}>
          {calendarDays.map((item, idx) => {
            if (item.dayNum === null) {
              return <div key={`empty-${idx}`} style={{ height: 48 }} />;
            }

            const isSelected = item.isSelected;
            const hasEntry = Boolean(item.entry);

            return (
              <button
                key={item.dateStr}
                onClick={() => item.dateStr && handleSelectDay(item.dateStr)}
                style={{
                  height: 48,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSelected
                    ? 'rgba(212, 160, 80, 0.12)'
                    : 'transparent',
                  border: isSelected
                    ? '1.5px solid #D4A050'
                    : '1.5px solid transparent',
                  borderRadius: 14,
                  cursor: 'pointer',
                  padding: 2,
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{
                  fontSize: 14,
                  fontWeight: isSelected || item.isToday ? 600 : 400,
                  color: isSelected ? '#1C1917' : item.isToday ? '#B45309' : '#292524',
                  lineHeight: 1.1
                }}>
                  {item.dayNum}
                </span>

                {/* Display recorded mood emoji under the date */}
                {hasEntry ? (
                  <span style={{ fontSize: 13, marginTop: 2, lineHeight: 1 }}>
                    {item.entry?.emoji || '🪷'}
                  </span>
                ) : item.isToday ? (
                  <span style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#D4A050',
                    marginTop: 4
                  }} />
                ) : (
                  <span style={{ height: 15 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Daily Reflection Card (Shows when a date is clicked) */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #EFEAE3',
        borderRadius: 22,
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
        marginBottom: 20
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14
        }}>
          <div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#D4A050',
              textTransform: 'uppercase',
              marginBottom: 3
            }}>
              Daily Journal
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 19,
              color: '#1C1917',
              fontWeight: 400
            }}>
              {selectedDateFormatted}
            </h3>
          </div>

          {activeDayEntry && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: '#F5F2EB',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              color: '#57534E'
            }}>
              <span>{activeDayEntry.emoji}</span>
              <span>{activeDayEntry.mood}</span>
            </div>
          )}
        </div>

        {/* Mood selection row */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 11,
            color: '#78716C',
            fontWeight: 500,
            marginBottom: 8
          }}>
            How is your mind & mood today?
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 7
          }}>
            {JOURNAL_MOODS.map(m => {
              const isChosen = selectedMood === m.label;
              return (
                <button
                  key={m.key}
                  onClick={() => setSelectedMood(m.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 12px',
                    borderRadius: 20,
                    border: isChosen ? `1.5px solid ${m.color}` : '1px solid #E7E0D8',
                    background: isChosen ? m.bgLight : '#FFFFFF',
                    color: isChosen ? m.color : '#57534E',
                    fontSize: 13,
                    fontWeight: isChosen ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: 14 }}>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Reflection Input */}
        <div style={{ marginBottom: 14 }}>
          <textarea
            value={reflectionText}
            onChange={e => setReflectionText(e.target.value)}
            placeholder="Write your reflections, how you responded to circumstances, or what you learned from the Gita..."
            rows={4}
            style={{
              width: '100%',
              background: '#FAF8F5',
              border: '1px solid #E7E0D8',
              borderRadius: 14,
              padding: '14px 16px',
              fontSize: 14,
              lineHeight: 1.6,
              color: '#1C1917',
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'none',
              transition: 'border-color 0.18s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#D4A050'}
            onBlur={e => e.currentTarget.style.borderColor = '#E7E0D8'}
          />
        </div>

        {/* Optional Gita Teaching Field */}
        <div style={{ marginBottom: 16 }}>
          <input
            value={teachingRef}
            onChange={e => setTeachingRef(e.target.value)}
            placeholder="Related Gita Verse (e.g. Bhagavad Gita 2.47) - optional"
            style={{
              width: '100%',
              background: '#FAF8F5',
              border: '1px solid #E7E0D8',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 13,
              color: '#1C1917',
              fontFamily: 'inherit',
              outline: 'none'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#D4A050'}
            onBlur={e => e.currentTarget.style.borderColor = '#E7E0D8'}
          />
        </div>

        {/* Save button & feedback */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              background: isSavedFeedback ? '#059669' : '#D4A050',
              color: isSavedFeedback ? '#FFFFFF' : '#0E0C1B',
              border: 'none',
              borderRadius: 12,
              padding: '13px',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s ease'
            }}
          >
            {isSavedFeedback ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saved to Journal
              </>
            ) : activeDayEntry ? (
              'Update Reflection'
            ) : (
              'Save Reflection'
            )}
          </button>

          {activeDayEntry && onDeleteEntry && (
            <button
              onClick={() => onDeleteEntry(activeDayEntry.id)}
              style={{
                background: 'transparent',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                borderRadius: 12,
                padding: '13px 16px',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* 4. THIS MONTH Card (Matching reference image) */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #EFEAE3',
        borderRadius: 22,
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
        marginBottom: 20
      }}>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#A8A29E',
          textTransform: 'uppercase',
          marginBottom: 12
        }}>
          THIS MONTH
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            fontSize: 42,
            lineHeight: 1,
            flexShrink: 0
          }}>
            {mostCommonMoodInfo.emoji}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#1C1917',
              marginBottom: 3
            }}>
              {currentMonthEntries.length} {currentMonthEntries.length === 1 ? 'reflection' : 'reflections'} recorded
            </div>
            <div style={{
              fontSize: 13,
              color: '#78716C',
              marginBottom: 8
            }}>
              Most common mood: {mostCommonMoodInfo.mood}
            </div>

            <button
              onClick={() => setShowSummaryModal(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#2563EB',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              View all journal entries →
            </button>
          </div>
        </div>
      </div>

      {/* 5. MOOD KEY Card (Matching reference image) */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #EFEAE3',
        borderRadius: 22,
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
        marginBottom: 28
      }}>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#A8A29E',
          textTransform: 'uppercase',
          marginBottom: 14
        }}>
          MOOD KEY
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8
        }}>
          {JOURNAL_MOODS.slice(0, 6).map(m => (
            <div
              key={m.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#FAF8F5',
                border: '1px solid #EFEAE3',
                borderRadius: 14,
                padding: '9px 10px',
                fontSize: 12,
                color: '#44403C',
                fontWeight: 500
              }}
            >
              <span style={{ fontSize: 14 }}>{m.emoji}</span>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Monthly Mood & Journal Summary Modal */}
      {showSummaryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(28, 25, 23, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          zIndex: 200
        }}>
          <div style={{
            background: '#FAF8F5',
            borderRadius: 24,
            width: '100%',
            maxWidth: 420,
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 22px 16px',
              borderBottom: '1px solid #EFEAE3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#D4A050', textTransform: 'uppercase' }}>
                  Monthly Review
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#1C1917', fontWeight: 400 }}>
                  {MONTH_NAMES[viewMonth]} {viewYear} Summary
                </h3>
              </div>

              <button
                onClick={() => setShowSummaryModal(false)}
                style={{
                  background: '#E7E0D8',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#57534E'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body Scroll */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>
              {/* Gita Insight Synthesis Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(212,160,80,0.1), rgba(254,243,199,0.5))',
                border: '1px solid rgba(212,160,80,0.25)',
                borderRadius: 18,
                padding: '18px 20px',
                marginBottom: 20
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', marginBottom: 6 }}>
                  {monthlySummary.title}
                </div>
                <div style={{
                  fontSize: 14,
                  fontStyle: 'italic',
                  color: '#1C1917',
                  lineHeight: 1.6,
                  marginBottom: 8
                }}>
                  "{monthlySummary.quote}"
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#D4A050', marginBottom: 12 }}>
                  — {monthlySummary.verse}
                </div>
                <p style={{ fontSize: 13, color: '#57534E', lineHeight: 1.7 }}>
                  {monthlySummary.insight}
                </p>
              </div>

              {/* Monthly Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginBottom: 20
              }}>
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #EFEAE3',
                  borderRadius: 14,
                  padding: '14px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#1C1917', fontWeight: 500 }}>
                    {currentMonthEntries.length}
                  </div>
                  <div style={{ fontSize: 11, color: '#78716C' }}>Reflections Written</div>
                </div>

                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #EFEAE3',
                  borderRadius: 14,
                  padding: '14px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 22, lineHeight: 1.2 }}>
                    {mostCommonMoodInfo.emoji}
                  </div>
                  <div style={{ fontSize: 11, color: '#78716C', marginTop: 2 }}>{mostCommonMoodInfo.mood}</div>
                </div>
              </div>

              {/* Entries list for this month */}
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#78716C',
                textTransform: 'uppercase',
                marginBottom: 12
              }}>
                Entries in {MONTH_NAMES[viewMonth]}
              </div>

              {currentMonthEntries.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '24px 0',
                  color: '#A8A29E',
                  fontSize: 14
                }}>
                  No entries recorded yet in {MONTH_NAMES[viewMonth]}.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {currentMonthEntries.map(entry => (
                    <div
                      key={entry.id}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #EFEAE3',
                        borderRadius: 14,
                        padding: '14px 16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>{entry.emoji}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#1C1917' }}>{entry.mood}</span>
                        </div>
                        <span style={{ fontSize: 11, color: '#78716C' }}>{entry.displayDate}</span>
                      </div>
                      {entry.teaching && (
                        <div style={{ fontSize: 11, color: '#B45309', fontWeight: 500, marginBottom: 4 }}>
                          {entry.teaching}
                        </div>
                      )}
                      <p style={{ fontSize: 13, color: '#44403C', lineHeight: 1.6 }}>
                        {entry.reflection}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 22px',
              borderTop: '1px solid #EFEAE3',
              background: '#FFFFFF'
            }}>
              <button
                onClick={() => setShowSummaryModal(false)}
                style={{
                  width: '100%',
                  background: '#D4A050',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#0E0C1B',
                  cursor: 'pointer'
                }}
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
