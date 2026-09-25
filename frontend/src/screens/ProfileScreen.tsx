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
    checkServerHealth().then(res => {
      setIsHealthOk(res.ok);
      setHealthStatus(res.statusText);
    });
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setServerUrl(serverUrlInput);
    setHealthStatus('Checking connection...');
    const res = await checkServerHealth(serverUrlInput, (statusMsg) => {
      setHealthStatus(statusMsg);
    });
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
        background: on ? '#1E5E3A' : '#D5CFC5',
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
          background: '#FFFFFF',
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          transition: 'left 0.22s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
        }}
      />
    </button>
  );

  return (
    <div style={{ padding: '36px 20px 32px', minHeight: '100vh', background: '#FAF7F2' }}>
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'rgba(30, 94, 58, 0.1)',
          border: '1.5px solid rgba(30, 94, 58, 0.2)',
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
            color: '#1F1C18',
            fontWeight: 600,
            marginBottom: 3
          }}>
            Your Profile
          </div>
          <div style={{ fontSize: 13, color: '#6F6B64' }}>
            Daily Gita Sadhana & Wisdom
          </div>
        </div>
      </div>

      {/* 18-Day Journey Card */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #ECE6DD',
        borderRadius: 20,
        padding: 22,
        marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{
          fontSize: 10,
          color: '#1E5E3A',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 6
        }}>
          18-Day Journey
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          color: '#1F1C18',
          marginBottom: 8,
          fontWeight: 600
        }}>
          18 Days of Gita Wisdom
        </div>
        <p style={{ fontSize: 13, color: '#6F6B64', lineHeight: 1.6, marginBottom: 16 }}>
          One chapter per day. One teaching, one reflection, one small action.
        </p>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6F6B64', marginBottom: 7 }}>
            <span>Day 7 of 18</span>
            <span style={{ fontWeight: 600, color: '#1E5E3A' }}>39%</span>
          </div>
          <div style={{ height: 6, background: '#ECE6DD', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              width: '39%',
              height: '100%',
              background: 'linear-gradient(90deg, #1E5E3A, #2E8A54)',
              borderRadius: 3
            }} />
          </div>
        </div>

        <button style={{
          background: '#1E5E3A',
          color: '#FFFFFF',
          borderRadius: 12,
          padding: '12px 22px',
          fontWeight: 600,
          fontSize: 13,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 3px 10px rgba(30, 94, 58, 0.2)'
        }}>
          Continue Journey →
        </button>
      </div>

      {/* Backend Server Connection Settings */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #ECE6DD',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{
          fontSize: 10,
          color: '#1E5E3A',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 8
        }}>
          Gita Brain Cloud Server
        </div>
        <p style={{ fontSize: 13, color: '#6F6B64', lineHeight: 1.5, marginBottom: 14 }}>
          Connect your app to the AI backend server:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          <input
            value={serverUrlInput}
            onChange={e => setServerUrlInput(e.target.value)}
            placeholder="https://gita-brain.onrender.com"
            style={{
              background: '#FAF7F2',
              border: '1px solid #ECE6DD',
              borderRadius: 10,
              padding: '12px 14px',
              color: '#1F1C18',
              fontSize: 13.5,
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
                background: '#1E5E3A',
                color: '#FFFFFF',
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

        {healthStatus && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 8,
            background: isHealthOk ? 'rgba(30, 94, 58, 0.08)' : 'rgba(217, 83, 79, 0.08)',
            border: `1px solid ${isHealthOk ? 'rgba(30, 94, 58, 0.2)' : 'rgba(217, 83, 79, 0.2)'}`,
            fontSize: 12,
            color: isHealthOk ? '#1E5E3A' : '#C9302C'
          }}>
            <span style={{ fontSize: 14 }}>{isHealthOk ? '●' : '▲'}</span>
            <span>{healthStatus}</span>
          </div>
        )}
      </div>

      {/* Saved Teachings */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 10,
          color: '#1E5E3A',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 12
        }}>
          Saved Teachings ({savedTeachings.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {savedTeachings.length === 0 ? (
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #ECE6DD',
              borderRadius: 14,
              padding: '18px',
              color: '#6F6B64',
              fontSize: '13.5px',
              textAlign: 'center'
            }}>
              No saved verses yet. Save teachings from the Home guidance screen!
            </div>
          ) : (
            savedTeachings.map((t, idx) => (
              <div
                key={t.id || idx}
                onClick={() => onOpenTeaching && onOpenTeaching(t)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #ECE6DD',
                  borderRadius: 14,
                  padding: '15px 16px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#1E5E3A'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#ECE6DD'}
              >
                <div style={{ fontSize: 12, color: '#1E5E3A', fontWeight: 600, marginBottom: 6 }}>
                  Bhagavad Gita {t.chapter}.{t.verse}
                </div>
                <p style={{ fontSize: 13, color: '#4A463F', lineHeight: 1.6, margin: 0 }}>
                  {t.preview}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Settings */}
      <div>
        <div style={{
          fontSize: 10,
          color: '#9C978F',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 12
        }}>
          Preferences
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #ECE6DD', borderRadius: 16, padding: '4px 16px' }}>
          {[
            { label: 'Daily Wisdom Notification', desc: '7:00 AM every morning', on: dailyNotification, toggle: () => handleToggle(setDailyNotification) },
            { label: 'Reflection Reminders', desc: 'Every evening at 9:00 PM', on: reflectionReminders, toggle: () => handleToggle(setReflectionReminders) },
            { label: 'Journal Privacy', desc: 'All reflections are stored locally & encrypted', on: journalPrivacy, toggle: () => handleToggle(setJournalPrivacy) }
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: i < 2 ? '1px solid #F4EFE6' : 'none'
              }}
            >
              <div>
                <div style={{ fontSize: 14, color: '#1F1C18', fontWeight: 500, marginBottom: 2 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 12, color: '#6F6B64' }}>
                  {s.desc}
                </div>
              </div>
              {renderToggle(s.on, s.toggle)}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#9C978F' }}>
        Maargdarshan · Powered by Gita Brain
      </div>
    </div>
  );
};
