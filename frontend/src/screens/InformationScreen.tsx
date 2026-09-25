import React from 'react';

interface InformationScreenProps {
  onContinue: () => void;
}

export const InformationScreen: React.FC<InformationScreenProps> = ({ onContinue }) => {
  const privacyPoints = [
    {
      title: "Stored on your device",
      description: "Your journal entries, saved teachings, and personal reflections are stored locally on this device — not on any server."
    },
    {
      title: "AI guidance uses your words temporarily",
      description: "When you request guidance, your message is processed by an AI service. Your words are not stored beyond that session."
    },
    {
      title: "No account required",
      description: "You can use Maargdarshan fully without creating an account or sharing any personal information."
    },
    {
      title: "You control your data",
      description: "You can clear your journal, saved teachings, or all local data at any time from Settings."
    }
  ];

  return (
    <div style={{
      background: '#FAF7F2',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '52px 24px 34px',
      color: '#1C1917',
      boxSizing: 'border-box',
      animation: 'fade-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      {/* Top Header & Points Section */}
      <div>
        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 27,
          fontWeight: 700,
          color: '#1C1917',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          margin: '0 0 12px 0'
        }}>
          Your reflections stay with you
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 14.5,
          color: '#6F6B64',
          lineHeight: 1.5,
          margin: '0 0 32px 0'
        }}>
          Maargdarshan is designed with your privacy at the center.
        </p>

        {/* List of Privacy Points */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 22
        }}>
          {privacyPoints.map((point, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              {/* Bullet Dot */}
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#1E5E3A',
                marginTop: 7,
                flexShrink: 0
              }} />

              <div>
                <h3 style={{
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: '#1C1917',
                  margin: '0 0 4px 0',
                  lineHeight: 1.3
                }}>
                  {point.title}
                </h3>
                <p style={{
                  fontSize: 13.5,
                  color: '#6F6B64',
                  lineHeight: 1.55,
                  margin: 0
                }}>
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Warning Note + Continue Button */}
      <div style={{ marginTop: 32 }}>
        {/* Soft Sage Alert Box */}
        <div style={{
          background: '#DCE6DF',
          borderRadius: 16,
          padding: '14px 18px',
          marginBottom: 20
        }}>
          <p style={{
            fontSize: 12.5,
            color: '#264E35',
            lineHeight: 1.5,
            margin: 0,
            fontWeight: 400
          }}>
            If you uninstall the app or clear app data, your locally stored journal entries and saved teachings may be permanently removed.
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          style={{
            width: '100%',
            background: '#144626',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 24,
            height: 50,
            fontSize: 15.5,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(20, 70, 38, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s ease, transform 0.1s ease',
            outline: 'none'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1A5A32'}
          onMouseLeave={e => e.currentTarget.style.background = '#144626'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
