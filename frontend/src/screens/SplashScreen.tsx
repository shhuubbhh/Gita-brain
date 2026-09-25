import React from 'react';

interface SplashScreenProps {
  onProceed: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onProceed }) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      minHeight: '100%',
      overflow: 'hidden',
      background: '#040F0B',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      userSelect: 'none'
    }}>
      {/* Background Krishna Artwork */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/splash_krishna_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        filter: 'brightness(0.78) contrast(1.06)',
        zIndex: 1
      }} />

      {/* Atmospheric Spiritual Dark Vignette & Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(3, 12, 8, 0.38) 0%, rgba(3, 12, 8, 0.48) 42%, rgba(2, 9, 6, 0.70) 100%)',
        zIndex: 2
      }} />

      {/* Subtle Mystical Radial Glow behind center content */}
      <div style={{
        position: 'absolute',
        top: '42%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 340,
        height: 340,
        background: 'radial-gradient(circle, rgba(30, 94, 58, 0.28) 0%, rgba(212, 160, 80, 0.08) 50%, transparent 75%)',
        pointerEvents: 'none',
        zIndex: 3
      }} />

      {/* Upper Spacer */}
      <div style={{ zIndex: 10, height: 60 }} />

      {/* Center Branding Content: Peacock Feather + Maargdarshan + Subtitle */}
      <div style={{
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 24px',
        animation: 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        {/* Stylized Peacock Feather Emblem */}
        <div style={{
          width: 82,
          height: 82,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          filter: 'drop-shadow(0 6px 18px rgba(0, 0, 0, 0.6))'
        }}>
          <img
            src="/peacock_feather.png"
            alt="Maargdarshan Feather"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 27,
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '-0.01em',
          margin: '0 0 10px 0',
          textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)'
        }}>
          Maargdarshan
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 15,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.88)',
          lineHeight: 1.45,
          maxWidth: 240,
          margin: 0,
          textShadow: '0 1px 8px rgba(0, 0, 0, 0.5)'
        }}>
          Find perspective through the wisdom of the Gita.
        </p>
      </div>

      {/* Lower Action: Glowing Halo Ripple with Central Arrow Button */}
      <div style={{
        zIndex: 10,
        marginBottom: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Outer Halo Ripple Ring 1 */}
        <div style={{
          position: 'absolute',
          width: 136,
          height: 136,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200, 160, 60, 0.16) 0%, rgba(30, 94, 58, 0.18) 55%, transparent 72%)',
          animation: 'pulse-soft 2.8s ease-in-out infinite',
          pointerEvents: 'none'
        }} />

        {/* Middle Halo Ring 2 */}
        <div style={{
          position: 'absolute',
          width: 98,
          height: 98,
          borderRadius: '50%',
          border: '1px solid rgba(212, 160, 80, 0.28)',
          background: 'rgba(20, 65, 38, 0.35)',
          backdropFilter: 'blur(2px)',
          pointerEvents: 'none'
        }} />

        {/* Center Interactive Circular Button */}
        <button
          onClick={onProceed}
          aria-label="Enter Maargdarshan"
          style={{
            position: 'relative',
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1E5E3A 0%, #144626 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(20, 70, 40, 0.65), 0 0 16px rgba(212, 160, 80, 0.25)',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(30, 94, 58, 0.8), 0 0 22px rgba(212, 160, 80, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(20, 70, 40, 0.65), 0 0 16px rgba(212, 160, 80, 0.25)';
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
        >
          {/* Right Chevron / Arrow Icon */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginLeft: 2 }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
