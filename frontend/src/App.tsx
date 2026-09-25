import React, { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { LearnScreen } from './screens/LearnScreen';
import { JournalScreen } from './screens/JournalScreen';
import { JapaScreen } from './screens/JapaScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SplashScreen } from './screens/SplashScreen';
import { InformationScreen } from './screens/InformationScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';
import { INITIAL_REFLECTIONS, INITIAL_SAVED_TEACHINGS, INITIAL_JOURNAL_ENTRIES, JOURNAL_MOODS } from './data/gitaData';
import { ReflectionEntry, SavedTeaching, JournalEntry } from './types';

// Tab Icons matching the user's screenshot
const HomeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const JournalIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const JapaIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

const ExploreIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={active ? 'currentColor' : 'none'} />
  </svg>
);

// 4 Bottom Navigation tabs matching the screenshot
const TABS = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'journal', label: 'Journal', Icon: JournalIcon },
  { id: 'japa', label: 'Japa', Icon: JapaIcon },
  { id: 'explore', label: 'Explore', Icon: ExploreIcon }
] as const;

type TabId = typeof TABS[number]['id'] | 'profile' | 'settings' | 'about' | 'privacy';
type AppFlowState = 'splash' | 'info' | 'main';

export const App: React.FC = () => {
  const [appFlow, setAppFlow] = useState<AppFlowState>('splash');
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [previousTab, setPreviousTab] = useState<TabId>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // App Theme & Language state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('gita_app_theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    try {
      return (localStorage.getItem('gita_app_language') as 'en' | 'hi') || 'en';
    } catch {
      return 'en';
    }
  });

  const [japaSoundEnabled, setJapaSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('gita_japa_sound');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('gita_app_theme', theme);
    } catch {}
  }, [theme]);

  // Persisted journal entries (empty initially, filled only once user writes their first reflection)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('gita_journal_entries');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter((e: any) => !['j-2026-09-23', 'j-2026-09-18', 'j-2026-09-14', 'j-2026-09-10', 'j-2026-09-06'].includes(e.id));
      }
      return INITIAL_JOURNAL_ENTRIES;
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
    const color = foundMood ? foundMood.color : '#1E5E3A';

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

  const handleAddReflectionFromHome = (entry: { mood: string; teaching: string; reflection: string }) => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const foundMood = JOURNAL_MOODS.find(m => m.label.toLowerCase() === entry.mood.toLowerCase() || m.key.toLowerCase() === entry.mood.toLowerCase());
    const emoji = foundMood ? foundMood.emoji : '🪷';
    const color = foundMood ? foundMood.color : '#1E5E3A';

    const newJournal: JournalEntry = {
      id: `j-${todayStr}-${Date.now()}`,
      date: todayStr,
      displayDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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

  const handleSplashProceed = () => {
    try {
      const hasSeenInfo = localStorage.getItem('gita_seen_info_screen') === 'true';
      if (hasSeenInfo) {
        setAppFlow('main');
      } else {
        setAppFlow('info');
      }
    } catch {
      setAppFlow('info');
    }
  };

  const handleInfoContinue = () => {
    try {
      localStorage.setItem('gita_seen_info_screen', 'true');
    } catch {}
    setAppFlow('main');
  };

  const handleToggleJapaSound = (enabled: boolean) => {
    setJapaSoundEnabled(enabled);
    try {
      localStorage.setItem('gita_japa_sound', enabled.toString());
      window.dispatchEvent(new Event('japa-sound-changed'));
    } catch {}
  };

  const handleClearJournalEntries = () => {
    setJournalEntries([]);
    try {
      localStorage.removeItem('gita_journal_entries');
    } catch {}
  };

  const handleClearSavedTeachings = () => {
    setSavedTeachings([]);
    try {
      localStorage.removeItem('gita_saved_teachings');
    } catch {}
  };

  return (
    <div style={{
      background: theme === 'dark' ? '#0A0D0B' : '#EAE6DD',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      transition: 'background 0.25s ease'
    }}>
      {/* Mobile Shell / Screen Container */}
      <div style={{
        width: '100%',
        maxWidth: 430,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: theme === 'dark' ? '#121614' : '#FAF7F2',
        color: theme === 'dark' ? '#F3F0EA' : '#1F1C18',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.12)',
        transition: 'background 0.25s ease, color 0.25s ease'
      }}>
        {/* 1. Splash Screen */}
        {appFlow === 'splash' && (
          <SplashScreen onProceed={handleSplashProceed} />
        )}

        {/* 2. Information Screen (Shown once on first launch) */}
        {appFlow === 'info' && (
          <InformationScreen onContinue={handleInfoContinue} />
        )}

        {/* 3. Main App Screens & Navigation */}
        {appFlow === 'main' && (
          <>
            {/* Main Content Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingBottom: ['settings', 'about', 'privacy'].includes(activeTab) ? 0 : 76
            }}>
              {activeTab === 'home' && (
                <HomeScreen
                  onSaveTeaching={handleSaveTeaching}
                  onAddReflection={handleAddReflectionFromHome}
                  onOpenMenu={() => setIsDrawerOpen(true)}
                />
              )}
              {activeTab === 'journal' && (
                <JournalScreen
                  entries={journalEntries}
                  onSaveEntry={handleSaveJournalEntry}
                  onDeleteEntry={handleDeleteJournalEntry}
                  onOpenMenu={() => setIsDrawerOpen(true)}
                />
              )}
              {activeTab === 'japa' && (
                <JapaScreen
                  onOpenMenu={() => setIsDrawerOpen(true)}
                />
              )}
              {activeTab === 'explore' && (
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
              {activeTab === 'settings' && (
                <SettingsScreen
                  onBack={() => setActiveTab(previousTab || 'home')}
                  theme={theme}
                  onThemeChange={setTheme}
                  language={language}
                  onLanguageChange={(lang) => {
                    setLanguage(lang);
                    try {
                      localStorage.setItem('gita_app_language', lang);
                    } catch {}
                  }}
                  journalEntriesCount={journalEntries.length}
                  savedTeachingsCount={savedTeachings.length}
                  onClearJournalEntries={handleClearJournalEntries}
                  onClearSavedTeachings={handleClearSavedTeachings}
                  japaSoundEnabled={japaSoundEnabled}
                  onToggleJapaSound={handleToggleJapaSound}
                  onOpenPrivacy={() => setActiveTab('privacy')}
                  onOpenAbout={() => setActiveTab('about')}
                />
              )}
              {activeTab === 'about' && (
                <AboutScreen
                  onBack={() => setActiveTab('settings')}
                  theme={theme}
                />
              )}
              {activeTab === 'privacy' && (
                <PrivacyScreen
                  onBack={() => setActiveTab('settings')}
                  theme={theme}
                />
              )}
            </div>

            {/* ───────────────────────────────────────────────────────────
                SLIDE-OUT MENU DRAWER (Triggered by Hamburger Icon)
            ─────────────────────────────────────────────────────────── */}
            {isDrawerOpen && (
              <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 200,
                display: 'flex',
                justifyContent: 'flex-start'
              }}>
                {/* Backdrop */}
                <div
                  onClick={() => setIsDrawerOpen(false)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(15, 18, 16, 0.55)',
                    backdropFilter: 'blur(3px)',
                    animation: 'fade-up 0.2s ease'
                  }}
                />

                {/* Drawer Content */}
                <div style={{
                  position: 'relative',
                  width: '82%',
                  maxWidth: 320,
                  height: '100%',
                  background: theme === 'dark' ? '#18201B' : '#FAF7F2',
                  color: theme === 'dark' ? '#F3F0EA' : '#1F1C18',
                  boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 10,
                  animation: 'fade-up 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)'
                }}>
                  {/* Drawer Header */}
                  <div style={{
                    padding: '28px 22px 20px',
                    borderBottom: `1px solid ${theme === 'dark' ? '#27342C' : '#ECE6DD'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src="/peacock_feather.png" alt="Logo" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
                      <div>
                        <h2 style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '18px',
                          color: theme === 'dark' ? '#F3F0EA' : '#1F1C18',
                          margin: 0,
                          fontWeight: 600
                        }}>
                          Maargdarshan
                        </h2>
                        <p style={{ fontSize: '11.5px', color: theme === 'dark' ? '#9E988E' : '#6F6B64', margin: 0 }}>
                          Eternal Gita Wisdom
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: theme === 'dark' ? '#9E988E' : '#6F6B64',
                        padding: '6px'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {/* Drawer Links */}
                  <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    {[
                      { id: 'home', label: 'Home Screen', icon: '🏠' },
                      { id: 'journal', label: 'Journal & Reflections', icon: '📖' },
                      { id: 'japa', label: 'Japa Mala Counter', icon: '📿' },
                      { id: 'explore', label: 'Explore 18 Chapters', icon: '🧭' },
                      { id: 'profile', label: 'Saved Teachings', icon: '🔖' },
                      { id: 'settings', label: 'Settings', icon: '⚙️' }
                    ].map(item => {
                      const isCurrent = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.id === 'settings') {
                              setPreviousTab(activeTab);
                            }
                            setActiveTab(item.id as TabId);
                            setIsDrawerOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: isCurrent ? (theme === 'dark' ? 'rgba(41, 122, 76, 0.2)' : 'rgba(30, 94, 58, 0.08)') : 'transparent',
                            color: isCurrent ? (theme === 'dark' ? '#4ADE80' : '#1E5E3A') : (theme === 'dark' ? '#EAE5DB' : '#2F2B26'),
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14.5px',
                            fontWeight: isCurrent ? 600 : 400,
                            textAlign: 'left',
                            transition: 'background 0.15s'
                          }}
                        >
                          <span style={{ fontSize: '18px' }}>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}

                    {/* Additional Options */}
                    <div style={{ height: 1, background: theme === 'dark' ? '#27342C' : '#ECE6DD', margin: '8px 12px' }} />

                    <button
                      onClick={() => {
                        setPreviousTab(activeTab);
                        setActiveTab('privacy');
                        setIsDrawerOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        background: 'transparent',
                        color: theme === 'dark' ? '#B3ACA1' : '#44403C',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13.5px',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '17px' }}>🛡️</span>
                      <span>Privacy & Data Protection</span>
                    </button>

                    <button
                      onClick={() => {
                        setAppFlow('splash');
                        setIsDrawerOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        background: 'transparent',
                        color: theme === 'dark' ? '#B3ACA1' : '#44403C',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13.5px',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '17px' }}>🪷</span>
                      <span>View Splash Screen</span>
                    </button>
                  </div>

                  {/* Bottom Quote & Reset in Drawer */}
                  <div style={{
                    padding: '16px 20px',
                    borderTop: `1px solid ${theme === 'dark' ? '#27342C' : '#ECE6DD'}`,
                    background: theme === 'dark' ? '#141A16' : '#F4EFE6'
                  }}>
                    <p style={{
                      fontSize: '12px',
                      fontStyle: 'italic',
                      color: theme === 'dark' ? '#9E988E' : '#6F6B64',
                      lineHeight: 1.5,
                      margin: '0 0 4px 0'
                    }}>
                      "Yoga is the journey of the self, through the self, to the self."
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <span style={{ fontSize: '11px', color: theme === 'dark' ? '#4ADE80' : '#1E5E3A', fontWeight: 600 }}>
                        Bhagavad Gita 6.20
                      </span>

                      <button
                        onClick={() => {
                          try {
                            localStorage.removeItem('gita_seen_info_screen');
                          } catch {}
                          setAppFlow('splash');
                          setIsDrawerOpen(false);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: theme === 'dark' ? '#8C8578' : '#78716C',
                          fontSize: '10.5px',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                        title="Reset first-time intro to test both splash & info screens again"
                      >
                        Reset intro
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────
                FIXED BOTTOM NAVIGATION BAR
                4 Tabs: Home, Journal, Japa, Explore
                Hidden on Settings, About, and Privacy screens
            ─────────────────────────────────────────────────────────── */}
            {!['settings', 'about', 'privacy'].includes(activeTab) && (
              <nav style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: 430,
                background: theme === 'dark' ? 'rgba(18, 22, 20, 0.96)' : 'rgba(250, 247, 242, 0.96)',
                borderTop: `1px solid ${theme === 'dark' ? '#29342D' : '#ECE6DD'}`,
                display: 'flex',
                zIndex: 100,
                backdropFilter: 'blur(12px)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                height: '66px',
                boxSizing: 'border-box'
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
                        justifyContent: 'center',
                        padding: '6px 0 8px',
                        gap: 3,
                        color: isActive ? (theme === 'dark' ? '#4ADE80' : '#1E5E3A') : (theme === 'dark' ? '#827B70' : '#5C5750'),
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.18s',
                        userSelect: 'none'
                      }}
                    >
                      <Icon active={isActive} />
                      <span style={{
                        fontSize: 10.5,
                        fontWeight: isActive ? 600 : 400,
                        letterSpacing: '0.02em',
                        color: isActive ? (theme === 'dark' ? '#4ADE80' : '#1E5E3A') : (theme === 'dark' ? '#827B70' : '#5C5750')
                      }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};
