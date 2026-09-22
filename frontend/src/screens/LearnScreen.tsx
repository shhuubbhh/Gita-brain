import React, { useState } from 'react';
import { CHAPTERS, CHAPTER_DESCRIPTIONS } from '../data/gitaData';
import { Chapter } from '../types';

interface LearnScreenProps {
  onSelectChapterPrompt?: (promptText: string) => void;
}

export const LearnScreen: React.FC<LearnScreenProps> = ({ onSelectChapterPrompt }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentChapter: Chapter | null =
    selectedChapterIndex !== null ? CHAPTERS[selectedChapterIndex] : null;

  const filteredChapters = CHAPTERS.filter(ch => {
    const q = searchQuery.toLowerCase();
    return (
      ch.name.toLowerCase().includes(q) ||
      ch.theme.toLowerCase().includes(q) ||
      ch.key.toLowerCase().includes(q) ||
      String(ch.num).includes(q)
    );
  });

  // CHAPTER DETAIL VIEW
  if (currentChapter) {
    const color = currentChapter.color || '#d4a050';
    return (
      <div style={{ padding: '52px 20px 32px', minHeight: '100vh' }} className="animate-fade-up">
        <button
          onClick={() => setSelectedChapterIndex(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#4a4464',
            fontSize: 13,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: 28
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          All Chapters
        </button>

        {/* Big subtle number */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 80,
          color: color,
          opacity: 0.12,
          lineHeight: 1,
          fontWeight: 300,
          marginBottom: -16,
          userSelect: 'none'
        }}>
          {String(currentChapter.num).padStart(2, '0')}
        </div>

        <div style={{
          fontSize: 11,
          color: color,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 8
        }}>
          Chapter {currentChapter.num}
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          color: '#ede9f8',
          lineHeight: 1.25,
          marginBottom: 6,
          fontWeight: 400
        }}>
          {currentChapter.name}
        </h2>

        <p style={{ fontSize: 15, color: '#8b85a8', marginBottom: 28 }}>
          {currentChapter.theme}
        </p>

        <div style={{ borderTop: '1px solid #2d2748', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <div style={{ fontSize: 10, color: '#d4a050', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              About This Chapter
            </div>
            <p style={{ fontSize: 15, color: '#b8b2d0', lineHeight: 1.8 }}>
              {CHAPTER_DESCRIPTIONS[currentChapter.num] ||
                `Chapter ${currentChapter.num} explores the theme of ${currentChapter.theme.toLowerCase()} through Krishna's dialogue with Arjuna. Its teachings remain deeply relevant to modern life and inner growth.`}
            </p>
          </div>

          <div>
            <div style={{ fontSize: 10, color: '#d4a050', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              Key Themes
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {currentChapter.key.split(', ').map(k => (
                <span
                  key={k}
                  style={{
                    background: `${color}10`,
                    border: `1px solid ${color}25`,
                    borderRadius: 20,
                    padding: '7px 14px',
                    color: '#8b85a8',
                    fontSize: 13
                  }}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (onSelectChapterPrompt) {
                onSelectChapterPrompt(`What does Chapter ${currentChapter.num} (${currentChapter.name}) teach about ${currentChapter.theme}?`);
              }
            }}
            style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
              borderRadius: 14,
              padding: '16px',
              color: color,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              marginTop: 4
            }}
          >
            Explore Verses in Chapter {currentChapter.num}
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT 18 CHAPTERS LIST
  return (
    <div style={{ padding: '52px 18px 24px', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 11,
          color: '#4a4464',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 8
        }}>
          Explore
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 30,
          color: '#ede9f8',
          lineHeight: 1.2,
          fontWeight: 400,
          marginBottom: 8
        }}>
          The Bhagavad Gita
        </h2>
        <p style={{ fontSize: 14, color: '#6b6487', lineHeight: 1.6 }}>
          18 chapters of eternal wisdom.<br />
          Each teaching, a window into the self.
        </p>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: 22 }}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4a4464"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search the Gita..."
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid #2d2748',
            borderRadius: 12,
            padding: '13px 16px 13px 40px',
            color: '#b8b2d0',
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none'
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,160,80,0.35)'}
          onBlur={e => e.currentTarget.style.borderColor = '#2d2748'}
        />
      </div>

      {/* 2-Column Chapter Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
        {filteredChapters.map((ch, idx) => {
          const originalIdx = ch.num - 1;
          const color = ch.color || '#d4a050';
          return (
            <button
              key={ch.num}
              onClick={() => setSelectedChapterIndex(originalIdx)}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid #2d2748',
                borderRadius: 16,
                padding: '18px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.18s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${color}08`;
                e.currentTarget.style.borderColor = `${color}35`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = '#2d2748';
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 34,
                color: color,
                opacity: 0.35,
                lineHeight: 1,
                marginBottom: 10,
                fontWeight: 300
              }}>
                {String(ch.num).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: 12,
                color: '#c4bedd',
                fontWeight: 500,
                lineHeight: 1.4,
                marginBottom: 4
              }}>
                {ch.name.split(' ').slice(0, 3).join(' ')}
              </div>
              <div style={{ fontSize: 11, color: '#4a4464', lineHeight: 1.4 }}>
                {ch.theme}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
