import React from 'react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface LearnScreenProps {
  onSelectChapterPrompt?: (promptText: string) => void;
  onOpenMenu?: () => void;
  language?: Language;
  theme?: 'light' | 'dark';
}

export const LearnScreen: React.FC<LearnScreenProps> = ({
  onOpenMenu,
  language = 'en',
  theme = 'light'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isDark = theme === 'dark';

  return (
    <div style={{
      position: 'relative',
      minHeight: 'calc(100vh - 76px)',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: isDark ? '#121614' : '#FAF7F2',
      color: isDark ? '#F3F0EA' : '#1F1C18',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Background Decorative Art with Subtle Blur Effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {/* Soft background glow circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-15%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30, 94, 58, 0.18) 0%, rgba(212, 160, 80, 0.08) 50%, transparent 70%)',
          filter: 'blur(32px)'
        }} />

        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '-15%',
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200, 150, 60, 0.16) 0%, rgba(30, 94, 58, 0.08) 50%, transparent 70%)',
          filter: 'blur(36px)'
        }} />

        {/* Ambient blurred backdrop layer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: isDark ? 'rgba(18, 22, 20, 0.75)' : 'rgba(250, 247, 242, 0.65)'
        }} />
      </div>

      {/* Screen Header */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: isDark ? '1px solid #29342D' : '1px solid rgba(236, 230, 221, 0.8)'
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

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '19px',
          fontWeight: 600,
          color: isDark ? '#F3F0EA' : '#1F1C18',
          margin: 0,
          letterSpacing: '0.01em',
          textAlign: 'center',
          flex: 1
        }}>
          {t.exploreTitle}
        </h1>

        <div style={{ width: 22 }} />
      </header>

      {/* Central "Coming Soon" Hero Content with Frosted Glass Panel */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: 360,
          width: '100%',
          background: isDark ? 'rgba(26, 34, 29, 0.85)' : 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isDark ? '1.5px solid rgba(74, 222, 128, 0.22)' : '1.5px solid rgba(212, 160, 80, 0.28)',
          borderRadius: 24,
          padding: '40px 26px 36px',
          boxShadow: isDark ? '0 12px 40px rgba(0, 0, 0, 0.45)' : '0 8px 32px rgba(30, 94, 58, 0.08), 0 2px 8px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fade-up 0.5s ease-out'
        }}>
          {/* Stylized Emblem with Peacock Feather */}
          <div style={{
            position: 'relative',
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: isDark ? 'radial-gradient(circle, rgba(74, 222, 128, 0.18) 0%, rgba(200, 150, 60, 0.15) 70%)' : 'radial-gradient(circle, rgba(30, 94, 58, 0.12) 0%, rgba(212, 160, 80, 0.15) 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            border: isDark ? '1px solid rgba(74, 222, 128, 0.35)' : '1px solid rgba(30, 94, 58, 0.2)'
          }}>
            <img
              src="./peacock_feather.png"
              alt="Feather Logo"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('android_asset')) {
                  target.src = 'file:///android_asset/peacock_feather.png';
                }
              }}
              style={{
                width: 52,
                height: 52,
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))'
              }}
            />
          </div>

          {/* Under Development Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 14px',
            borderRadius: 20,
            background: isDark ? 'rgba(74, 222, 128, 0.12)' : 'rgba(30, 94, 58, 0.08)',
            border: isDark ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(30, 94, 58, 0.22)',
            fontSize: 11.5,
            fontWeight: 600,
            color: isDark ? '#4ADE80' : '#1E5E3A',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 16
          }}>
            <span style={{ fontSize: 13 }}>🪷</span>
            <span>{t.underDevelopment}</span>
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 700,
            color: isDark ? '#F3F0EA' : '#1F1C18',
            margin: '0 0 12px 0',
            letterSpacing: '-0.01em',
            lineHeight: 1.2
          }}>
            {t.comingSoonTitle}
          </h2>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14.5px',
            color: isDark ? '#9CA3AF' : '#6F6B64',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 290
          }}>
            {t.comingSoonSubtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
