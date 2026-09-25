import React from 'react';

interface PrivacyScreenProps {
  onBack: () => void;
  theme?: 'light' | 'dark';
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack, theme = 'light' }) => {
  const isDark = theme === 'dark';

  const privacyItems = [
    {
      icon: "📱",
      title: "What stays on your device",
      body: "Your journal entries, saved teachings, mood history, and Japa sessions are stored locally on your device only. Uninstalling the app or clearing app data may permanently remove your journal entries, saved teachings, and other content."
    },
    {
      icon: "🤖",
      title: "What is sent to the AI",
      body: "When you type or speak to seek guidance, the text of your message is sent to an AI service to identify relevant Gita teachings and generate an explanation. This information is used only to generate your response and is not stored permanently on any server by Maargdarshan."
    },
    {
      icon: "🎙️",
      title: "Microphone access",
      body: "The microphone is accessed only when you explicitly tap the microphone button. Voice input is converted to text locally where possible. Raw audio is not retained after transcription."
    },
    {
      icon: "🏥",
      title: "Not a health application",
      body: "Maargdarshan is a spiritual reflection tool. It is not a mental health application and does not provide medical, psychological, or clinical advice. If you are in crisis, please contact a qualified professional or emergency services."
    }
  ];

  return (
    <div style={{
      background: isDark ? '#121614' : '#FAF7F2',
      color: isDark ? '#F3F0EA' : '#1C1917',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background 0.2s ease, color 0.2s ease'
    }}>
      {/* Sticky Header: < Back | Privacy */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: isDark ? 'rgba(18, 22, 20, 0.95)' : 'rgba(250, 247, 242, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${isDark ? '#27342C' : '#ECE6DD'}`,
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDark ? '#4ADE80' : '#1E5E3A',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 14.5,
            fontWeight: 600,
            padding: '4px 0'
          }}
          aria-label="Back to Settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 19,
          fontWeight: 600,
          color: isDark ? '#F3F0EA' : '#1C1917',
          margin: 0
        }}>
          Privacy
        </h1>

        <div style={{ width: 48 }} />
      </div>

      {/* Scrollable Body Content */}
      <div style={{
        padding: '24px 20px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }}>
        {/* Top Headline & Subtitle */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 25,
            fontWeight: 700,
            color: isDark ? '#F3F0EA' : '#1C1917',
            margin: '0 0 10px 0',
            lineHeight: 1.25,
            letterSpacing: '-0.01em'
          }}>
            Your privacy matters
          </h2>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            color: isDark ? '#9E988E' : '#6F6B64',
            lineHeight: 1.55,
            margin: 0
          }}>
            Maargdarshan is designed to be a private, trustworthy space. Here is exactly what happens with your information.
          </p>
        </div>

        {/* 4 Feature Items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 22
        }}>
          {privacyItems.map((item, idx) => (
            <div
              key={item.title}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                paddingBottom: idx === privacyItems.length - 1 ? 0 : 20,
                borderBottom: idx === privacyItems.length - 1 ? 'none' : `1px solid ${isDark ? '#27342C' : '#ECE6DD'}`
              }}
            >
              {/* Icon */}
              <span style={{ fontSize: 24, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>
                {item.icon}
              </span>

              {/* Text Container */}
              <div>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: isDark ? '#F3F0EA' : '#1C1917',
                  margin: '0 0 6px 0',
                  lineHeight: 1.3
                }}>
                  {item.title}
                </h3>

                <p style={{
                  fontSize: 13.5,
                  color: isDark ? '#A6A095' : '#57534E',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Sage Callout Box */}
        <div style={{
          background: isDark ? '#1C2921' : '#DDE6DF',
          border: `1px solid ${isDark ? '#2B3F33' : '#C9D8CD'}`,
          borderRadius: 16,
          padding: '16px 18px',
          marginTop: 6
        }}>
          <p style={{
            fontSize: 13,
            color: isDark ? '#BCE3CA' : '#274C34',
            lineHeight: 1.55,
            margin: 0,
            fontWeight: 400
          }}>
            This privacy notice accurately reflects how Maargdarshan works. We are committed to honesty about what the app does and does not with your information.
          </p>
        </div>
      </div>
    </div>
  );
};
