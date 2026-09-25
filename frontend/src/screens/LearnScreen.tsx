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
    const color = '#1E5E3A';
    return (
      <div style={{ padding: '42px 20px 32px', minHeight: '100vh', background: '#FAF7F2' }} className="animate-fade-up">
        <button
          onClick={() => setSelectedChapterIndex(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#6F6B64',
            fontSize: 13,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: 24
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
          opacity: 0.15,
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
          color: '#1F1C18',
          lineHeight: 1.25,
          marginBottom: 6,
          fontWeight: 600
        }}>
          {currentChapter.name}
        </h2>

        <p style={{ fontSize: 15, color: '#6F6B64', marginBottom: 28 }}>
          {currentChapter.theme}
        </p>

        <div style={{ borderTop: '1px solid #ECE6DD', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <div style={{ fontSize: 11, color: '#1E5E3A', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              About This Chapter
            </div>
            <p style={{ fontSize: 14.5, color: '#3A3630', lineHeight: 1.75 }}>
              {CHAPTER_DESCRIPTIONS[currentChapter.num] ||
                `Chapter ${currentChapter.num} explores the theme of ${currentChapter.theme.toLowerCase()} through Krishna's dialogue with Arjuna. Its teachings remain deeply relevant to modern life and inner growth.`}
            </p>
          </div>

          <div>
            <div style={{ fontSize: 11, color: '#1E5E3A', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              Key Themes
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {currentChapter.key.split(', ').map(k => (
                <span
                  key={k}
                  style={{
                    background: 'rgba(30, 94, 58, 0.08)',
                    border: '1px solid rgba(30, 94, 58, 0.2)',
                    borderRadius: 20,
                    padding: '7px 14px',
                    color: '#1E5E3A',
                    fontSize: 13,
                    fontWeight: 500
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
              background: '#1E5E3A',
              border: 'none',
              borderRadius: 14,
              padding: '16px',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              marginTop: 8,
              boxShadow: '0 4px 14px rgba(30, 94, 58, 0.2)'
            }}
          >
            Explore Wisdom in Chapter {currentChapter.num}
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT 18 CHAPTERS LIST
  return (
    <div style={{ padding: '36px 18px 24px', minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 11,
          color: '#1E5E3A',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 6
        }}>
          Explore
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          color: '#1F1C18',
          lineHeight: 1.2,
          fontWeight: 600,
          marginBottom: 8
        }}>
          The Bhagavad Gita
        </h2>
        <p style={{ fontSize: 14, color: '#6F6B64', lineHeight: 1.5 }}>
          18 chapters of eternal wisdom. Each teaching, a window into self-discovery.
        </p>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9C978F"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search chapters, themes, or Sanskrit names..."
          style={{
            width: '100%',
            background: '#FFFFFF',
            border: '1px solid #ECE6DD',
            borderRadius: 14,
            padding: '13px 16px 13px 44px',
            color: '#1F1C18',
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#1E5E3A'}
          onBlur={e => e.currentTarget.style.borderColor = '#ECE6DD'}
        />
      </div>

      {/* 2-Column Chapter Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
        {filteredChapters.map((ch) => {
          const originalIdx = ch.num - 1;
          return (
            <button
              key={ch.num}
              onClick={() => setSelectedChapterIndex(originalIdx)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #ECE6DD',
                borderRadius: 16,
                padding: '16px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.18s',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#1E5E3A';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(30, 94, 58, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#ECE6DD';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.02)';
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                color: '#1E5E3A',
                opacity: 0.35,
                lineHeight: 1,
                marginBottom: 8,
                fontWeight: 400
              }}>
                {String(ch.num).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: 13,
                color: '#1F1C18',
                fontWeight: 600,
                lineHeight: 1.35,
                marginBottom: 4
              }}>
                {ch.name.split(' ').slice(0, 3).join(' ')}
              </div>
              <div style={{ fontSize: 11.5, color: '#6F6B64', lineHeight: 1.4 }}>
                {ch.theme}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
