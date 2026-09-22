import React, { useState, useEffect } from 'react';
import { SavedTeaching } from '../types';
import { getServerUrl, setServerUrl, checkServerHealth } from '../services/api';

interface ProfileScreenProps {
  savedTeachings: SavedTeaching[];
  onOpenTeaching?: (teaching: SavedTeaching) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  savedTeachings,
  onOpenTeaching
}) => {
  const [dailyNotification, setDailyNotification] = useState(true);
  const [reflectionReminders, setReflectionReminders] = useState(false);
  const [journalPrivacy, setJournalPrivacy] = useState(true);

  // Backend connection state
  const [serverUrlInput, setServerUrlInput] = useState(getServerUrl());
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [isHealthOk, setIsHealthOk] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Initial silent ping to verify connection
    checkServerHealth().then(res => {
      setIsHealthOk(res.ok);
      setHealthStatus(res.statusText);
    });
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setServerUrl(serverUrlInput);
    const res = await checkServerHealth(serverUrlInput);
    setIsTesting(false);
    setIsHealthOk(res.ok);
    setHealthStatus(res.statusText);
  };

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(prev => !prev);
  };

  const renderToggle = (on: boolean, onToggle: () => void) => (
    <button
      onClick={onToggle}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        background: on ? '#d4a050' : '#2d2748',
        position: 'relative',
        cursor: 'pointer',
        border: 'none',
        flexShrink: 0,
        transition: 'background 0.22s'
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: on ? '#0e0c1b' : '#6b6487',
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          transition: 'left 0.22s, background 0.22s'
        }}
      />
    </button>
  );

  return (
    <div style={{ padding: '52px 20px 32px', minHeight: '100vh' }}>
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(212,160,80,0.3), rgba(193,123,138,0.3))',
          border: '1.5px solid rgba(212,160,80,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26
        }}>
          🪷
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            color: '#ede9f8',
            fontWeight: 400,
            marginBottom: 3
          }}>
            Your Profile
          </div>
          <div style={{ fontSize: 13, color: '#6b6487' }}>
            7 days of reflection
          </div>
        </div>
      </div>

      {/* 18-Day Journey Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(36,32,60,0.9), rgba(22,18,44,0.95))',
        border: '1px solid rgba(212,160,80,0.2)',
        borderRadius: 20,
        padding: 22,
        marginBottom: 28
      }}>
        <div style={{
          fontSize: 10,
          color: '#d4a050',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 8
        }}>
          18-Day Journey
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          color: '#ede9f8',
          marginBottom: 8,
          fontWeight: 400
        }}>
          18 Days of Gita Wisdom
        </div>
        <p style={{ fontSize: 13, color: '#6b6487', lineHeight: 1.65, marginBottom: 16 }}>
          One chapter per day. One teaching, one reflection, one small action.
        </p>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b6487', marginBottom: 7 }}>
            <span>Day 7 of 18</span>
            <span>39%</span>
          </div>
          <div style={{ height: 4, background: '#2d2748', borderRadius: 2 }}>
            <div style={{
              width: '39%',
              height: '100%',
              background: 'linear-gradient(90deg, #d4a050, #e8c97a)',
              borderRadius: 2
            }} />
          </div>
        </div>

        <button style={{
          background: '#d4a050',
          color: '#0e0c1b',
          borderRadius: 11,
          padding: '12px 22px',
          fontWeight: 600,
          fontSize: 13,
          border: 'none',
          cursor: 'pointer'
        }}>
          Continue Journey →
        </button>
      </div>

      {/* Backend Server Connection Settings */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(212,160,80,0.2)',
        borderRadius: 18,
        padding: 20,
        marginBottom: 28
      }}>
        <div style={{
          fontSize: 10,
          color: '#d4a050',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 10
        }}>
          Gita Brain Server Connection
        </div>
        <p style={{ fontSize: 13, color: '#8b85a8', lineHeight: 1.5, marginBottom: 14 }}>
          Connect your Android phone to the backend server running on your PC:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          <input
            value={serverUrlInput}
            onChange={e => setServerUrlInput(e.target.value)}
            placeholder="http://192.168.x.x:8080"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid #2d2748',
              borderRadius: 10,
              padding: '12px 14px',
              color: '#ede9f8',
              fontSize: 14,
              fontFamily: 'monospace',
              outline: 'none'
            }}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              style={{
                flex: 1,
                background: '#d4a050',
                color: '#0e0c1b',
                border: 'none',
                borderRadius: 10,
                padding: '11px',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>

        {/* Live Status Indicator */}
        {healthStatus && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 8,
            background: isHealthOk ? 'rgba(91,138,111,0.15)' : 'rgba(193,123,138,0.15)',
            border: `1px solid ${isHealthOk ? 'rgba(91,138,111,0.3)' : 'rgba(193,123,138,0.3)'}`,
            fontSize: 12,
            color: isHealthOk ? '#7aba94' : '#e68a9b'
          }}>
            <span style={{ fontSize: 14 }}>{isHealthOk ? '●' : '▲'}</span>
            <span>{healthStatus}</span>
          </div>
        )}
      </div>

      {/* Saved Teachings */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 10,
          color: '#d4a050',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 14
        }}>
          Saved Teachings ({savedTeachings.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {savedTeachings.map((t, idx) => (
            <div
              key={t.id || idx}
              onClick={() => onOpenTeaching && onOpenTeaching(t)}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid #2d2748',
                borderRadius: 14,
                padding: '15px 16px',
                cursor: 'pointer',
                transition: 'border-color 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,160,80,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2d2748'}
            >
              <div style={{ fontSize: 11, color: '#d4a050', fontWeight: 600, marginBottom: 6 }}>
                Gita {t.chapter}.{t.verse}
              </div>
              <p style={{ fontSize: 13, color: '#7a7494', lineHeight: 1.65 }}>
                {t.preview}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div>
        <div style={{
          fontSize: 10,
          color: '#4a4464',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 16
        }}>
          Preferences
        </div>

        {[
          { label: 'Daily Wisdom Notification', desc: '7:00 AM every morning', on: dailyNotification, toggle: () => handleToggle(setDailyNotification) },
          { label: 'Reflection Reminders', desc: 'Every evening at 9:00 PM', on: reflectionReminders, toggle: () => handleToggle(setReflectionReminders) },
          { label: 'Journal Privacy', desc: 'All entries are encrypted and private', on: journalPrivacy, toggle: () => handleToggle(setJournalPrivacy) }
        ].map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px 0',
              borderBottom: '1px solid #1e1a32'
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: '#c4bedd', fontWeight: 500, marginBottom: 2 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 12, color: '#4a4464' }}>
                {s.desc}
              </div>
            </div>
            {renderToggle(s.on, s.toggle)}
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {['Privacy Policy', 'Export Reflections', 'Clear Conversation History', 'About Gita Companion'].map(link => (
          <button
            key={link}
            style={{
              textAlign: 'left',
              padding: '13px 0',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid #1a1730',
              color: '#4a4464',
              fontSize: 13,
              cursor: 'pointer',
              width: '100%',
              transition: 'color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#8b85a8'}
            onMouseLeave={e => e.currentTarget.style.color = '#4a4464'}
          >
            {link}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#2d2748' }}>
        Gita Companion · v1.0 · Powered by Gita Brain
      </div>
    </div>
  );
};
