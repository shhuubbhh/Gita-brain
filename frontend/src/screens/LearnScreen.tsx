import React, { useState, useMemo } from 'react';
import { CHAPTER_SUMMARIES, ChapterSummary } from '../data/chapterSummaries';
import { ChapterDetailScreen } from './ChapterDetailScreen';
import { Language, TRANSLATIONS } from '../utils/translations';

interface LearnScreenProps {
  onSelectChapterPrompt?: (promptText: string) => void;
  onOpenMenu?: () => void;
  language?: Language;
  theme?: 'light' | 'dark';
  selectedChapterId?: number | null;
  onSelectChapter?: (chapterId: number | null) => void;
}

export const LearnScreen: React.FC<LearnScreenProps> = ({
  onOpenMenu,
  language = 'en',
  theme = 'light',
  selectedChapterId: externalChapterId,
  onSelectChapter
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isDark = theme === 'dark';
  const isHindi = language === 'hi';

  // Internal state if not controlled externally
  const [internalChapterId, setInternalChapterId] = useState<number | null>(null);
  const activeChapterId = externalChapterId !== undefined ? externalChapterId : internalChapterId;

  const setActiveChapterId = (id: number | null) => {
    if (onSelectChapter) {
      onSelectChapter(id);
    } else {
      setInternalChapterId(id);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  // Selected Chapter object
  const selectedChapter = useMemo(() => {
    if (!activeChapterId) return null;
    return CHAPTER_SUMMARIES.find(c => c.chapter === activeChapterId) || null;
  }, [activeChapterId]);

  // Filtered Chapters based on search
  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CHAPTER_SUMMARIES;

    return CHAPTER_SUMMARIES.filter(c => {
      const matchNum = c.chapter.toString() === q;
      const matchSanskrit = c.sanskrit_name.toLowerCase().includes(q);
      const matchTranslit = c.sanskrit_name_translit.toLowerCase().includes(q);
      const matchEnTitle = c.english_name.toLowerCase().includes(q);
      const matchHiTitle = c.hindi_name.toLowerCase().includes(q);
      const matchEnSummary = c.summary.en.toLowerCase().includes(q);
      const matchHiSummary = c.summary.hi.toLowerCase().includes(q);
      const matchThemesEn = c.themes.en.some(th => th.toLowerCase().includes(q));
      const matchThemesHi = c.themes.hi.some(th => th.toLowerCase().includes(q));

      return matchNum || matchSanskrit || matchTranslit || matchEnTitle || matchHiTitle ||
             matchEnSummary || matchHiSummary || matchThemesEn || matchThemesHi;
    });
  }, [searchQuery]);

  // If a chapter is selected, show ChapterDetailScreen
  if (selectedChapter) {
    return (
      <ChapterDetailScreen
        chapter={selectedChapter}
        onBack={() => setActiveChapterId(null)}
        language={language}
        theme={theme}
      />
    );
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: 'calc(100vh - 76px)',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: isDark ? '#121614' : '#FAF7F2',
      color: isDark ? '#F3F0EA' : '#1F1C18',
      overflowX: 'hidden',
      boxSizing: 'border-box',
      paddingBottom: '90px'
    }}>
      {/* Background Soft Glow Circles */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '-5%',
          right: '-10%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(30, 94, 58, 0.2) 0%, rgba(212, 160, 80, 0.08) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(30, 94, 58, 0.12) 0%, rgba(212, 160, 80, 0.1) 50%, transparent 70%)',
          filter: 'blur(36px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '-10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(200, 150, 60, 0.16) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(200, 150, 60, 0.12) 0%, transparent 70%)',
          filter: 'blur(36px)'
        }} />
      </div>

      {/* Screen Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        paddingTop: 'max(16px, calc(env(safe-area-inset-top, 0px) + 12px))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: isDark ? 'rgba(18, 22, 20, 0.88)' : 'rgba(250, 247, 242, 0.88)',
        borderBottom: isDark ? '1px solid #29342D' : '1px solid rgba(236, 230, 221, 0.85)'
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
            color: isDark ? '#F3F0EA' : '#1F1C18'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3.5" y1="6.5" x2="20.5" y2="6.5" />
            <line x1="3.5" y1="12" x2="20.5" y2="12" />
            <line x1="3.5" y1="17.5" x2="20.5" y2="17.5" />
          </svg>
        </button>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '19px',
            fontWeight: 600,
            color: isDark ? '#F3F0EA' : '#1F1C18',
            margin: 0,
            letterSpacing: '0.01em'
          }}>
            {t.exploreTitle}
          </h1>
          <p style={{
            fontSize: '11px',
            color: isDark ? '#9CA3AF' : '#6F6B64',
            margin: '2px 0 0 0'
          }}>
            {t.allChaptersCount}
          </p>
        </div>

        <div style={{ width: 22 }} />
      </header>

      {/* Main Container */}
      <main style={{
        position: 'relative',
        zIndex: 5,
        padding: '16px 18px',
        maxWidth: 720,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: isDark ? 'rgba(26, 34, 29, 0.85)' : '#FFFFFF',
          border: isDark ? '1px solid #29342D' : '1px solid #ECE6DD',
          borderRadius: 16,
          padding: '2px 14px',
          boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#9CA3AF' : '#6F6B64'} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: 10 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchChaptersPlaceholder}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              color: isDark ? '#F3F0EA' : '#1F1C18',
              padding: '12px 0'
            }}
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isDark ? '#9CA3AF' : '#6F6B64',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Chapters List */}
        {filteredChapters.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 20px',
            color: isDark ? '#9CA3AF' : '#6F6B64'
          }}>
            <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>🔍</span>
            <p style={{ margin: 0, fontSize: '15px' }}>{t.noChaptersFound}</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          }}>
            {filteredChapters.map((ch) => {
              const displayTitle = isHindi ? ch.hindi_name : ch.english_name;
              const displaySummary = isHindi ? ch.summary.hi : ch.summary.en;
              const displayThemes = isHindi ? ch.themes.hi : ch.themes.en;

              return (
                <button
                  key={ch.chapter}
                  onClick={() => setActiveChapterId(ch.chapter)}
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(26, 34, 29, 0.85) 0%, rgba(20, 26, 22, 0.75) 100%)'
                      : '#FFFFFF',
                    border: isDark ? '1px solid #29342D' : '1px solid #ECE6DD',
                    borderRadius: 18,
                    padding: '18px 18px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    boxShadow: isDark
                      ? '0 4px 16px rgba(0, 0, 0, 0.28)'
                      : '0 4px 14px rgba(30, 94, 58, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
                    transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = isDark ? '#E5B466' : '#1E5E3A';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = isDark ? '#29342D' : '#ECE6DD';
                  }}
                >
                  {/* Card Header: Emblem + Sanskrit Title + Verse Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Chapter Number Emblem */}
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: isDark
                          ? 'radial-gradient(circle, rgba(229, 180, 102, 0.2) 0%, rgba(41, 122, 76, 0.15) 100%)'
                          : 'radial-gradient(circle, rgba(212, 160, 80, 0.18) 0%, rgba(30, 94, 58, 0.08) 100%)',
                        border: isDark ? '1px solid rgba(229, 180, 102, 0.4)' : '1px solid rgba(212, 160, 80, 0.35)',
                        color: isDark ? '#E5B466' : '#9B6E20',
                        fontFamily: 'var(--font-display)',
                        fontSize: '15px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {ch.chapter.toString().padStart(2, '0')}
                      </div>

                      <div>
                        {/* Sanskrit Name in Devanagari */}
                        <h2 style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '18px',
                          fontWeight: 700,
                          color: isDark ? '#FAF7F2' : '#1C1917',
                          margin: 0,
                          lineHeight: 1.25
                        }}>
                          {ch.sanskrit_name}
                        </h2>

                        {/* English / Hindi Translated Title */}
                        <div style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13.5px',
                          fontWeight: 500,
                          color: isDark ? '#D1D5DB' : '#4B5563',
                          marginTop: 2
                        }}>
                          {displayTitle}
                        </div>
                      </div>
                    </div>

                    {/* Verse Count Pill */}
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      background: isDark ? 'rgba(74, 222, 128, 0.12)' : 'rgba(30, 94, 58, 0.08)',
                      border: isDark ? '1px solid rgba(74, 222, 128, 0.25)' : '1px solid rgba(30, 94, 58, 0.18)',
                      color: isDark ? '#4ADE80' : '#1E5E3A',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      flexShrink: 0,
                      whiteSpace: 'nowrap'
                    }}>
                      {ch.verse_count} {t.verseCountLabel}
                    </div>
                  </div>

                  {/* Summary Preview */}
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13.5px',
                    lineHeight: 1.55,
                    color: isDark ? '#9CA3AF' : '#6F6B64',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {displaySummary}
                  </p>

                  {/* Bottom Footer: Themes & Arrow */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingTop: 4,
                    borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.04)'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      flex: 1,
                      overflow: 'hidden'
                    }}>
                      {displayThemes.slice(0, 2).map((themeItem, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '11px',
                            color: isDark ? '#E5B466' : '#9B6E20',
                            background: isDark ? 'rgba(229, 180, 102, 0.08)' : 'rgba(212, 160, 80, 0.08)',
                            padding: '2px 8px',
                            borderRadius: 10,
                            border: isDark ? '1px solid rgba(229, 180, 102, 0.18)' : '1px solid rgba(212, 160, 80, 0.18)'
                          }}
                        >
                          {themeItem}
                        </span>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: isDark ? '#4ADE80' : '#1E5E3A',
                      fontSize: '12px',
                      fontWeight: 600,
                      flexShrink: 0
                    }}>
                      <span>{isHindi ? 'अध्ययन करें' : 'Explore'}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
