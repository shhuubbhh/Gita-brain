import React, { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { LearnScreen } from './screens/LearnScreen';
import { JournalScreen } from './screens/JournalScreen';
import { JapaScreen } from './screens/JapaScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { INITIAL_REFLECTIONS, INITIAL_SAVED_TEACHINGS, INITIAL_JOURNAL_ENTRIES, JOURNAL_MOODS } from './data/gitaData';
import { ReflectionEntry, SavedTeaching, JournalEntry } from './types';

// Tab Icons
const HomeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const JournalIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const JapaIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" fill={active ? 'currentColor' : 'none'} />
  </svg>
);

const LearnIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ProfileIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const TABS = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'journal', label: 'Journal', Icon: JournalIcon },
  { id: 'japa', label: 'Japa', Icon: JapaIcon },
  { id: 'learn', label: 'Learn', Icon: LearnIcon },
  { id: 'profile', label: 'Profile', Icon: ProfileIcon }
] as const;


type TabId = typeof TABS[number]['id'];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  // Persisted journal entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('gita_journal_entries');
      return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  });

  // Legacy reflection entries for backwards compatibility
  const [reflections, setReflections] = useState<ReflectionEntry[]>(() => {
    try {
      const saved = localStorage.getItem('gita_reflections');
      return saved ? JSON.parse(saved) : INITIAL_REFLECTIONS;
    } catch {
      return INITIAL_REFLECTIONS;
    }
  });

  const [savedTeachings, setSavedTeachings] = useState<SavedTeaching[]>(() => {
    try {
      const saved = localStorage.getItem('gita_saved_teachings');
      return saved ? JSON.parse(saved) : INITIAL_SAVED_TEACHINGS;
    } catch {
      return INITIAL_SAVED_TEACHINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gita_journal_entries', JSON.stringify(journalEntries));
    } catch {}
  }, [journalEntries]);

  useEffect(() => {
    try {
      localStorage.setItem('gita_reflections', JSON.stringify(reflections));
    } catch {}
  }, [reflections]);

  useEffect(() => {
    try {
      localStorage.setItem('gita_saved_teachings', JSON.stringify(savedTeachings));
    } catch {}
  }, [savedTeachings]);

  // Handle saving a journal entry from JournalScreen
  const handleSaveJournalEntry = (entry: { date: string; mood: string; reflection: string; teaching?: string }) => {
    const foundMood = JOURNAL_MOODS.find(m => m.label.toLowerCase() === entry.mood.toLowerCase() || m.key.toLowerCase() === entry.mood.toLowerCase());
    const emoji = foundMood ? foundMood.emoji : '😊';
    const color = foundMood ? foundMood.color : '#D97706';

    const [y, m, d] = entry.date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    setJournalEntries(prev => {
      const existingIdx = prev.findIndex(item => item.date === entry.date);
      const newRecord: JournalEntry = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `j-${entry.date}-${Date.now()}`,
        date: entry.date,
        displayDate,
        mood: entry.mood,
        emoji,
        color,
        reflection: entry.reflection,
        teaching: entry.teaching,
        createdAt: Date.now()
      };
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newRecord;
        return copy;
      }
      return [newRecord, ...prev];
    });

    // Also add to legacy reflections
    const legacyEntry: ReflectionEntry = {
      id: `ref-${Date.now()}`,
      date: displayDate,
      mood: entry.mood,
      color,
      icon: emoji,
      teaching: entry.teaching || 'Bhagavad Gita Wisdom',
      reflection: entry.reflection
    };
    setReflections(prev => [legacyEntry, ...prev]);
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
  };

  // Called from HomeScreen when user taps "Add to Journal"
  const handleAddReflectionFromHome = (entry: { mood: string; teaching: string; reflection: string }) => {
    const todayStr = '2026-09-23';
    const foundMood = JOURNAL_MOODS.find(m => m.label.toLowerCase() === entry.mood.toLowerCase() || m.key.toLowerCase() === entry.mood.toLowerCase());
    const emoji = foundMood ? foundMood.emoji : '🪷';
    const color = foundMood ? foundMood.color : '#D4A050';

    const newJournal: JournalEntry = {
      id: `j-${todayStr}-${Date.now()}`,
      date: todayStr,
      displayDate: 'Sep 23, 2026',
      mood: foundMood ? foundMood.label : entry.mood,
      emoji,
      color,
      reflection: entry.reflection,
      teaching: entry.teaching,
      createdAt: Date.now()
    };

    setJournalEntries(prev => {
      const filtered = prev.filter(e => e.date !== todayStr);
      return [newJournal, ...filtered];
    });

    const newLegacyEntry: ReflectionEntry = {
      id: `ref-${Date.now()}`,
      date: 'Today',
      mood: entry.mood,
      color,
      icon: emoji,
      teaching: entry.teaching,
      reflection: entry.reflection
    };
    setReflections(prev => [newLegacyEntry, ...prev]);
  };

  const handleSaveTeaching = (teaching: { chapter: number; verse: number; preview: string }) => {
    const exists = savedTeachings.some(t => t.chapter === teaching.chapter && t.verse === teaching.verse);
    if (!exists) {
      const newTeaching: SavedTeaching = {
        id: `teach-${Date.now()}`,
        chapter: teaching.chapter,
        verse: teaching.verse,
        preview: teaching.preview
      };
      setSavedTeachings(prev => [newTeaching, ...prev]);
    }
  };

  const isLightTab = activeTab === 'journal' || activeTab === 'japa';

  return (
    <div style={{
      background: isLightTab ? '#FAF8F5' : '#0e0c1b',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      transition: 'background 0.25s ease'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 430,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: isLightTab ? '#FAF8F5' : '#0e0c1b'
      }}>
        {/* Main Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 76
        }}>
          {activeTab === 'home' && (
            <HomeScreen
              onSaveTeaching={handleSaveTeaching}
              onAddReflection={handleAddReflectionFromHome}
            />
          )}
          {activeTab === 'journal' && (
            <JournalScreen
              entries={journalEntries}
              onSaveEntry={handleSaveJournalEntry}
              onDeleteEntry={handleDeleteJournalEntry}
            />
          )}
          {activeTab === 'japa' && (
            <JapaScreen />
          )}
          {activeTab === 'learn' && (
            <LearnScreen
              onSelectChapterPrompt={() => {
                setActiveTab('home');
              }}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileScreen
              savedTeachings={savedTeachings}
            />
          )}
        </div>

        {/* Fixed Bottom Navigation Bar */}
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          background: isLightTab ? 'rgba(255, 255, 255, 0.97)' : 'rgba(20, 17, 36, 0.97)',
          borderTop: isLightTab ? '1px solid #EFEAE3' : '1px solid #2d2748',
          display: 'flex',
          zIndex: 100,
          backdropFilter: 'blur(12px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          transition: 'all 0.25s ease'
        }}>
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px 0 13px',
                  gap: 3,
                  color: isActive ? (isLightTab ? '#1D4ED8' : '#d4a050') : isLightTab ? '#9CA3AF' : '#4a4464',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.18s'
                }}
              >
                <Icon active={isActive} />
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.04em' }}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

