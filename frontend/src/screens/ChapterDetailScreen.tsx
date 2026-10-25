import React, { useState } from 'react';
import { ChapterSummary, VERSE_DETAILS, CanonicalVerseDetail } from '../data/chapterSummaries';
import { Language, TRANSLATIONS } from '../utils/translations';

interface ChapterDetailScreenProps {
  chapter: ChapterSummary;
  onBack: () => void;
  language?: Language;
  theme?: 'light' | 'dark';
}

const formatShlokaText = (text: string): string => {
  if (!text) return '';
  if (text.includes('\n')) return text;
  // Break on single danda (|) into traditional poetic half-verses
  return text.replace(/\s*\|\s*/g, ' |\n').trim();
};

export const ChapterDetailScreen: React.FC<ChapterDetailScreenProps> = ({
  chapter,
  onBack,
  language = 'en',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeVerse, setActiveVerse] = useState<CanonicalVerseDetail | null>(null);

  const isHindi = language === 'hi';
  const chapterTitle = isHindi ? chapter.hindi_name : chapter.english_name;
  const summaryText = isHindi ? chapter.summary.hi : chapter.summary.en;
  const teachingsList = isHindi ? chapter.key_teachings.hi : chapter.key_teachings.en;
  const themesList = isHindi ? chapter.themes.hi : chapter.themes.en;
  const practicalText = isHindi ? chapter.practical_application.hi : chapter.practical_application.en;

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: isDark ? '#121614' : '#FAF7F2',
      color: isDark ? '#F3F0EA' : '#1F1C18',
      boxSizing: 'border-box',
      paddingBottom: '90px'
    }}>
      {/* Top Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 280,
        background: isDark
          ? 'radial-gradient(ellipse at 50% 0%, rgba(30, 94, 58, 0.22) 0%, rgba(212, 160, 80, 0.12) 40%, transparent 75%)'
          : 'radial-gradient(ellipse at 50% 0%, rgba(30, 94, 58, 0.12) 0%, rgba(212, 160, 80, 0.15) 45%, transparent 75%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Screen Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        paddingTop: 'max(14px, calc(env(safe-area-inset-top, 0px) + 10px))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: isDark ? 'rgba(18, 22, 20, 0.88)' : 'rgba(250, 247, 242, 0.90)',
        borderBottom: isDark ? '1px solid #29342D' : '1px solid rgba(236, 230, 221, 0.85)'
      }}>
        <button
          onClick={onBack}
          aria-label={t.backToChapters}
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 20,
            cursor: 'pointer',
            padding: '7px 14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: isDark ? '#F3F0EA' : '#1F1C18',
            fontSize: '13.5px',
            fontWeight: 500,
            transition: 'background 0.15s ease'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>{t.backToChapters}</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '12px',
          fontWeight: 600,
          color: isDark ? '#4ADE80' : '#1E5E3A',
          background: isDark ? 'rgba(74, 222, 128, 0.12)' : 'rgba(30, 94, 58, 0.08)',
          padding: '4px 10px',
          borderRadius: 12,
          border: isDark ? '1px solid rgba(74, 222, 128, 0.25)' : '1px solid rgba(30, 94, 58, 0.18)'
        }}>
          <span>{isHindi ? `अध्याय ${chapter.chapter}` : `Chapter ${chapter.chapter}`}</span>
          <span>•</span>
          <span>{chapter.verse_count} {t.verseCountLabel}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        position: 'relative',
        zIndex: 5,
        padding: '20px 18px 40px',
        maxWidth: 720,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 22
      }}>

        {/* Hero Title Section */}
        <section style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(26, 34, 29, 0.95) 0%, rgba(20, 26, 22, 0.9) 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F8F4EC 100%)',
          border: isDark ? '1.5px solid rgba(212, 160, 80, 0.3)' : '1.5px solid rgba(212, 160, 80, 0.35)',
          borderRadius: 22,
          padding: '24px 20px',
          boxShadow: isDark
            ? '0 10px 30px rgba(0, 0, 0, 0.45)'
            : '0 8px 24px rgba(30, 94, 58, 0.06), 0 2px 6px rgba(0, 0, 0, 0.02)',
          textAlign: 'center',
          animation: 'fade-up 0.35s ease'
        }}>
          {/* Chapter Number Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: isDark
              ? 'radial-gradient(circle, rgba(229, 180, 102, 0.25) 0%, rgba(41, 122, 76, 0.2) 100%)'
              : 'radial-gradient(circle, rgba(212, 160, 80, 0.2) 0%, rgba(30, 94, 58, 0.12) 100%)',
            border: isDark ? '1.5px solid rgba(229, 180, 102, 0.5)' : '1.5px solid rgba(212, 160, 80, 0.45)',
            color: isDark ? '#E5B466' : '#9B6E20',
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: 14
          }}>
            {chapter.chapter}
          </div>

          {/* Sanskrit Devanagari Name */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '30px',
            fontWeight: 700,
            color: isDark ? '#FAF7F2' : '#1C1917',
            margin: '0 0 6px 0',
            lineHeight: 1.25,
            letterSpacing: '0.01em'
          }}>
            {chapter.sanskrit_name}
          </h1>

          {/* Transliterated Sanskrit */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '15px',
            color: isDark ? '#E5B466' : '#B8822B',
            marginBottom: 8
          }}>
            {chapter.sanskrit_name_translit}
          </div>

          {/* English / Hindi Translated Title */}
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '17px',
            fontWeight: 600,
            color: isDark ? '#D1D5DB' : '#374151',
            margin: '0 0 16px 0',
            lineHeight: 1.35
          }}>
            {chapterTitle}
          </div>

          {/* Golden Ornamental Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            margin: '0 auto 14px',
            maxWidth: 220
          }}>
            <div style={{ flex: 1, height: 1, background: isDark ? 'rgba(212, 160, 80, 0.3)' : 'rgba(212, 160, 80, 0.35)' }} />
            <span style={{ fontSize: 13, color: isDark ? '#E5B466' : '#D4A050' }}>🪷</span>
            <div style={{ flex: 1, height: 1, background: isDark ? 'rgba(212, 160, 80, 0.3)' : 'rgba(212, 160, 80, 0.35)' }} />
          </div>

          {/* Stats Bar */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            fontSize: '12.5px',
            color: isDark ? '#9CA3AF' : '#6F6B64'
          }}>
            <span>📖 {chapter.verse_count} {t.verseCountLabel}</span>
            <span>•</span>
            <span>⭐ {chapter.important_verses.length} {t.importantVersesTitle}</span>
          </div>
        </section>

        {/* Section 1: Chapter Summary */}
        <section style={{
          background: isDark ? 'rgba(26, 34, 29, 0.7)' : '#FFFFFF',
          border: isDark ? '1px solid #29342D' : '1px solid #ECE6DD',
          borderRadius: 20,
          padding: '22px 20px',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 14
          }}>
            <span style={{ fontSize: 18 }}>📜</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              color: isDark ? '#F3F0EA' : '#1F1C18',
              margin: 0
            }}>
              {t.chapterSummaryTitle}
            </h2>
          </div>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            lineHeight: 1.7,
            color: isDark ? '#D1D5DB' : '#374151',
            margin: 0,
            whiteSpace: 'pre-line'
          }}>
            {summaryText}
          </p>
        </section>

        {/* Section 2: Key Teachings */}
        <section style={{
          background: isDark ? 'rgba(26, 34, 29, 0.7)' : '#FFFFFF',
          border: isDark ? '1px solid #29342D' : '1px solid #ECE6DD',
          borderRadius: 20,
          padding: '22px 20px',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16
          }}>
            <span style={{ fontSize: 18 }}>✨</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              color: isDark ? '#F3F0EA' : '#1F1C18',
              margin: 0
            }}>
              {t.keyTeachingsTitle}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {teachingsList.map((teaching, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(250, 247, 242, 0.85)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(236, 230, 221, 0.7)'
                }}
              >
                <div style={{
                  minWidth: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: isDark ? 'rgba(74, 222, 128, 0.15)' : 'rgba(30, 94, 58, 0.1)',
                  color: isDark ? '#4ADE80' : '#1E5E3A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  marginTop: 2
                }}>
                  {idx + 1}
                </div>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14.5px',
                  lineHeight: 1.55,
                  color: isDark ? '#E5E7EB' : '#27272A',
                  margin: 0,
                  flex: 1
                }}>
                  {teaching}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Core Themes */}
        <section style={{
          background: isDark ? 'rgba(26, 34, 29, 0.7)' : '#FFFFFF',
          border: isDark ? '1px solid #29342D' : '1px solid #ECE6DD',
          borderRadius: 20,
          padding: '20px',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 14
          }}>
            <span style={{ fontSize: 18 }}>🏷️</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              color: isDark ? '#F3F0EA' : '#1F1C18',
              margin: 0
            }}>
              {t.themesTitle}
            </h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {themesList.map((themeItem, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 14px',
                  borderRadius: 16,
                  background: isDark ? 'rgba(229, 180, 102, 0.12)' : 'rgba(212, 160, 80, 0.1)',
                  border: isDark ? '1px solid rgba(229, 180, 102, 0.28)' : '1px solid rgba(212, 160, 80, 0.25)',
                  color: isDark ? '#E5B466' : '#9B6E20',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                {themeItem}
              </span>
            ))}
          </div>
        </section>

        {/* Section 4: Practical Reflection */}
        <section style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(30, 94, 58, 0.15) 0%, rgba(26, 34, 29, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(212, 226, 216, 0.5) 0%, #FFFFFF 100%)',
          border: isDark ? '1.5px solid rgba(74, 222, 128, 0.3)' : '1.5px solid rgba(30, 94, 58, 0.3)',
          borderRadius: 20,
          padding: '22px 20px',
          boxShadow: isDark ? '0 4px 18px rgba(0,0,0,0.35)' : '0 4px 16px rgba(30, 94, 58, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12
          }}>
            <span style={{ fontSize: 20 }}>🌿</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              color: isDark ? '#4ADE80' : '#1E5E3A',
              margin: 0
            }}>
              {t.practicalReflectionTitle}
            </h2>
          </div>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            lineHeight: 1.65,
            color: isDark ? '#F3F0EA' : '#1F1C18',
            margin: 0,
            fontStyle: 'normal'
          }}>
            {practicalText}
          </p>
        </section>

        {/* Section 5: Important Verses */}
        <section style={{
          background: isDark ? 'rgba(26, 34, 29, 0.7)' : '#FFFFFF',
          border: isDark ? '1px solid #29342D' : '1px solid #ECE6DD',
          borderRadius: 20,
          padding: '22px 20px',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>⭐</span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: isDark ? '#F3F0EA' : '#1F1C18',
                margin: 0
              }}>
                {t.importantVersesTitle}
              </h2>
            </div>
            <span style={{
              fontSize: '11.5px',
              color: isDark ? '#9CA3AF' : '#6F6B64'
            }}>
              {t.tapToViewVerse}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 12,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            {chapter.important_verses.map((vid) => {
              const vDetail = VERSE_DETAILS[vid];
              if (!vDetail) return null;

              return (
                <button
                  key={vid}
                  onClick={() => setActiveVerse(vDetail)}
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(250, 247, 242, 0.9)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(236, 230, 221, 0.85)',
                    borderRadius: 14,
                    padding: '14px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    transition: 'transform 0.12s ease, border-color 0.15s ease, background 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = isDark ? '#E5B466' : '#1E5E3A';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(236, 230, 221, 0.85)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: 8,
                        background: isDark ? 'rgba(74, 222, 128, 0.12)' : 'rgba(30, 94, 58, 0.08)',
                        color: isDark ? '#4ADE80' : '#1E5E3A',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        flexShrink: 0
                      }}>
                        BG {vDetail.reference}
                      </span>
                      <span style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF', flexShrink: 0 }}>
                        {vid}
                      </span>
                    </div>

                    <span style={{
                      fontSize: '12px',
                      color: isDark ? '#E5B466' : '#1E5E3A',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      flexShrink: 0
                    }}>
                      <span>{isHindi ? 'देखें' : 'Read'}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>

                  {/* Sanskrit Full Shloka with Word-Wrap across lines */}
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: isDark ? '#FAF7F2' : '#1F1C18',
                    margin: 0,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box'
                  }}>
                    {formatShlokaText(vDetail.sanskrit)}
                  </p>

                  {/* Transliteration with Word-Wrap */}
                  {vDetail.transliteration && (
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontSize: '13px',
                      lineHeight: 1.5,
                      color: isDark ? '#A6A095' : '#6F6B64',
                      margin: 0,
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      width: '100%',
                      maxWidth: '100%',
                      minWidth: 0,
                      boxSizing: 'border-box'
                    }}>
                      {formatShlokaText(vDetail.transliteration)}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

      </main>

      {/* ───────────────────────────────────────────────────────────
          IN-PLACE CANONICAL VERSE MODAL / BOTTOM SHEET
      ─────────────────────────────────────────────────────────── */}
      {activeVerse && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          boxSizing: 'border-box'
        }}>
          {/* Backdrop */}
          <div
            onClick={() => setActiveVerse(null)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 14, 12, 0.65)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              animation: 'fade-up 0.18s ease'
            }}
          />

          {/* Modal Card */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: 'min(540px, calc(100vw - 32px))',
            width: '100%',
            maxHeight: '88vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            background: isDark ? '#18201B' : '#FAF7F2',
            color: isDark ? '#F3F0EA' : '#1F1C18',
            borderRadius: 24,
            padding: '24px 20px 20px',
            border: isDark ? '1.5px solid rgba(74, 222, 128, 0.25)' : '1.5px solid rgba(212, 160, 80, 0.35)',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.45)',
            animation: 'fade-up 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: isDark ? '1px solid #29342D' : '1px solid #ECE6DD',
              paddingBottom: 14,
              boxSizing: 'border-box',
              width: '100%'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 2
                }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: isDark ? '#4ADE80' : '#1E5E3A',
                    background: isDark ? 'rgba(74, 222, 128, 0.12)' : 'rgba(30, 94, 58, 0.08)',
                    padding: '3px 8px',
                    borderRadius: 6
                  }}>
                    {activeVerse.id}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#F3F0EA' : '#1F1C18' }}>
                    {isHindi ? `भगवद्गीता अध्याय ${activeVerse.chapter}, श्लोक ${activeVerse.verse}` : `Bhagavad Gita ${activeVerse.reference}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveVerse(null)}
                aria-label={t.closeButton}
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isDark ? '#F3F0EA' : '#1F1C18',
                  flexShrink: 0
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Sanskrit Shloka Box */}
            <div style={{
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
              border: isDark ? '1px solid rgba(229, 180, 102, 0.25)' : '1px solid rgba(212, 160, 80, 0.35)',
              borderRadius: 16,
              padding: '18px 16px',
              textAlign: 'center',
              boxSizing: 'border-box',
              maxWidth: '100%',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              overflowX: 'hidden'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                color: isDark ? '#E5B466' : '#9B6E20',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 10
              }}>
                {t.verseModalTitle}
              </div>

              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '17px',
                lineHeight: 1.75,
                fontWeight: 600,
                color: isDark ? '#FAF7F2' : '#1F1C18',
                margin: '0 0 12px 0',
                whiteSpace: 'pre-line',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}>
                {formatShlokaText(activeVerse.sanskrit)}
              </p>

              {activeVerse.transliteration && (
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  color: isDark ? '#A6A095' : '#6F6B64',
                  margin: 0,
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}>
                  {formatShlokaText(activeVerse.transliteration)}
                </p>
              )}
            </div>

            {/* Translation / Meaning Box */}
            {(activeVerse.hindi_translation || activeVerse.english_translation) && (
              <div style={{
                background: isDark ? 'rgba(30, 94, 58, 0.12)' : 'rgba(212, 226, 216, 0.45)',
                border: isDark ? '1px solid rgba(74, 222, 128, 0.2)' : '1px solid rgba(30, 94, 58, 0.2)',
                borderRadius: 16,
                padding: '16px 16px',
                boxSizing: 'border-box',
                maxWidth: '100%',
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}>
                <div style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: isDark ? '#4ADE80' : '#1E5E3A',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: 8
                }}>
                  {isHindi
                    ? (activeVerse.hindi_translation ? 'श्लोक अर्थ (स्वामी रामसुखदास — गीताप्रेस / हँसी गीता भवन)' : 'प्रामाणिक अर्थ (Canonical Interpretation)')
                    : 'Canonical Primary Meaning'}
                </div>

                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14.5px',
                  lineHeight: 1.65,
                  color: isDark ? '#E5E7EB' : '#1F1C18',
                  margin: 0,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}>
                  {isHindi
                    ? (activeVerse.hindi_translation || activeVerse.english_translation)
                    : (activeVerse.english_translation || activeVerse.hindi_translation)}
                </p>

                {isHindi && activeVerse.hindi_translation && activeVerse.english_translation && (
                  <details style={{ marginTop: 12, paddingTop: 10, borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)' }}>
                    <summary style={{ fontSize: '12px', color: isDark ? '#E5B466' : '#9B6E20', cursor: 'pointer', outline: 'none' }}>
                      English Interpretation
                    </summary>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.5, color: isDark ? '#9CA3AF' : '#6F6B64', margin: '6px 0 0 0' }}>
                      {activeVerse.english_translation}
                    </p>
                  </details>
                )}
              </div>
            )}

            {/* Footer Source Note */}
            <div style={{
              fontSize: '11px',
              color: isDark ? '#6B7280' : '#9CA3AF',
              textAlign: 'center',
              lineHeight: 1.4
            }}>
              {t.canonicalNote} • BORI 700-verse standard • Reference IIT Kanpur Gita Supersite
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                width: '100%',
                background: isDark ? '#297A4C' : '#1E5E3A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 14,
                padding: '12px 18px',
                fontSize: '14.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: isDark ? '0 4px 16px rgba(41, 122, 76, 0.3)' : '0 4px 16px rgba(30, 94, 58, 0.25)',
                outline: 'none',
                marginTop: 2
              }}
            >
              {t.closeButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
