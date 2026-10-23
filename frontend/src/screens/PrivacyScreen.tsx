import React from 'react';
import { Language } from '../utils/translations';

interface PrivacyScreenProps {
  onBack: () => void;
  theme?: 'light' | 'dark';
  language?: Language;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  onBack,
  theme = 'light',
  language = 'en'
}) => {
  const isDark = theme === 'dark';
  const isHi = language === 'hi';

  const privacyItems = isHi ? [
    {
      number: "01",
      title: "आपके डिवाइस पर क्या सुरक्षित रहता है",
      body: "आपकी दैनिक चिंतन प्रविष्टियां, मनोभाव इतिहास और जप सत्र केवल आपके डिवाइस पर स्थानीय रूप से सुरक्षित रहते हैं। ऐप अनइंस्टॉल करने या ऐप डेटा साफ़ करने पर ये स्थानीय प्रविष्टियां स्थायी रूप से हट सकती हैं।"
    },
    {
      number: "02",
      title: "एआई सेवा को क्या भेजा जाता है",
      body: "जब आप मार्गदर्शन पाने के लिए कोई प्रश्न लिखते या बोलते हैं, तो आपका संदेश उपयुक्त गीता श्लोकों को खोजने और व्याख्या तैयार करने के लिए सुरक्षित रूप से एआई सेवा को भेजा जाता है। यह जानकारी केवल आपका उत्तर तैयार करने के लिए उपयोग की जाती है और मार्गदर्शन के किसी भी सर्वर पर स्थायी रूप से संग्रहीत नहीं की जाती।"
    },
    {
      number: "03",
      title: "माइक्रोफ़ोन का उपयोग",
      body: "माइक्रोफ़ोन केवल तभी सक्रिय होता है जब आप स्वयं माइक्रोफ़ोन बटन दबाते हैं। आपकी आवाज़ को सीधे टेक्स्ट में बदला जाता है। ट्रांसक्रिप्शन पूरा होने के बाद कोई भी ऑडियो रिकॉर्डिंग सुरक्षित नहीं रखी जाती।"
    },
    {
      number: "04",
      title: "चिकित्सीय या मानसिक स्वास्थ्य सलाह नहीं",
      body: "मार्गदर्शन एक आध्यात्मिक चिंतन और जीवन दर्शन का साधन है। यह कोई मानसिक स्वास्थ्य या चिकित्सीय एप्लिकेशन नहीं है और न ही यह कोई चिकित्सीय, मनोवैज्ञानिक या क्लीनिकल सलाह प्रदान करता है। किसी गंभीर संकट की स्थिति में कृपया किसी योग्य विशेषज्ञ या आपातकालीन सेवाओं से संपर्क करें।"
    }
  ] : [
    {
      number: "01",
      title: "What stays on your device",
      body: "Your journal entries, reflection history, and Japa sessions are stored locally on your device only. Uninstalling the app or clearing app data may permanently remove your journal entries and other local content."
    },
    {
      number: "02",
      title: "What is sent to the AI",
      body: "When you type or speak to seek guidance, the text of your message is sent to an AI service to identify relevant Gita teachings and generate an explanation. This information is used only to generate your response and is not stored permanently on any server by Maargdarshan."
    },
    {
      number: "03",
      title: "Microphone access",
      body: "The microphone is accessed only when you explicitly tap the microphone button. Voice input is converted to text locally where possible. Raw audio is not retained after transcription."
    },
    {
      number: "04",
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
        paddingTop: 'max(16px, calc(env(safe-area-inset-top, 0px) + 12px))',
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
          aria-label={isHi ? "पीछे जाएं" : "Back to Settings"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>{isHi ? "पीछे" : "Back"}</span>
        </button>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 19,
          fontWeight: 600,
          color: isDark ? '#F3F0EA' : '#1C1917',
          margin: 0
        }}>
          {isHi ? "गोपनीयता नीति" : "Privacy"}
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
            fontSize: 24,
            fontWeight: 700,
            color: isDark ? '#F3F0EA' : '#1C1917',
            margin: '0 0 10px 0',
            lineHeight: 1.25,
            letterSpacing: '-0.01em'
          }}>
            {isHi ? "आपकी गोपनीयता हमारी प्राथमिकता है" : "Your privacy matters"}
          </h2>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            color: isDark ? '#9E988E' : '#6F6B64',
            lineHeight: 1.55,
            margin: 0
          }}>
            {isHi
              ? "मार्गदर्शन को एक पूर्णतः निजी और विश्वसनीय स्थान के रूप में तैयार किया गया है। यहाँ विस्तार से बताया गया है कि आपकी जानकारी कैसे सुरक्षित रखी जाती है।"
              : "Maargdarshan is designed to be a private, trustworthy space. Here is exactly what happens with your information."}
          </p>
        </div>

        {/* 4 Feature Items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20
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
              {/* Number Badge */}
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: isDark ? '#4ADE80' : '#1E5E3A',
                background: isDark ? 'rgba(74, 222, 128, 0.12)' : 'rgba(30, 94, 58, 0.08)',
                padding: '3px 8px',
                borderRadius: 6,
                marginTop: 2,
                flexShrink: 0
              }}>
                {item.number}
              </span>

              {/* Text Container */}
              <div>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: isDark ? '#F3F0EA' : '#1C1917',
                  margin: '0 0 6px 0',
                  lineHeight: 1.35
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
            {isHi
              ? "यह गोपनीयता नीति स्पष्ट करती है कि मार्गदर्शन कैसे कार्य करता है। हम आपके डेटा और गोपनीयता के प्रति पूर्ण पारदर्शिता एवं ईमानदारी के लिए प्रतिबद्ध हैं।"
              : "This privacy notice accurately reflects how Maargdarshan works. We are committed to honesty about what the app does and does not with your information."}
          </p>
        </div>
      </div>
    </div>
  );
};
