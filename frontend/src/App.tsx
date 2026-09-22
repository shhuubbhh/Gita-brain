import React, { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { LearnScreen } from './screens/LearnScreen';
import { JourneyScreen } from './screens/JourneyScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { INITIAL_REFLECTIONS, INITIAL_SAVED_TEACHINGS } from './data/gitaData';
import { ReflectionEntry, SavedTeaching } from './types';

// Tab Icons
const HomeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LearnIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const JourneyIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
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
  { id: 'learn', label: 'Learn', Icon: LearnIcon },
  { id: 'journey', label: 'Journey', Icon: JourneyIcon },
  { id: 'profile', label: 'Profile', Icon: ProfileIcon }
] as const;

type TabId = typeof TABS[number]['id'];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  // Persisted state
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
      localStorage.setItem('gita_reflections', JSON.stringify(reflections));
    } catch {}
  }, [reflections]);

  useEffect(() => {
    try {
      localStorage.setItem('gita_saved_teachings', JSON.stringify(savedTeachings));
    } catch {}
  }, [savedTeachings]);

  const handleAddReflection = (entry: { mood: string; teaching: string; reflection: string }) => {
    const newEntry: ReflectionEntry = {
      id: `ref-${Date.now()}`,
      date: 'Today',
      mood: entry.mood,
      color: '#D4A050',
      icon: '🪷',
      teaching: entry.teaching,
      reflection: entry.reflection
    };
    setReflections(prev => [newEntry, ...prev]);
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

  return (
    <div style={{
      background: '#0e0c1b',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 430,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: '#0e0c1b'
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
              onAddReflection={handleAddReflection}
            />
          )}
          {activeTab === 'learn' && (
            <LearnScreen
              onSelectChapterPrompt={() => {
                setActiveTab('home');
              }}
            />
          )}
          {activeTab === 'journey' && (
            <JourneyScreen
              reflections={reflections}
              onAddReflection={handleAddReflection}
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
          background: 'rgba(20, 17, 36, 0.97)',
          borderTop: '1px solid #2d2748',
          display: 'flex',
          zIndex: 100,
          backdropFilter: 'blur(12px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
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
                  color: isActive ? '#d4a050' : '#4a4464',
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
