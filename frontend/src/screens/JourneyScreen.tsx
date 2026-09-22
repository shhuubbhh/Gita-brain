import React, { useState } from 'react';
import { ReflectionEntry } from '../types';

interface JourneyScreenProps {
  reflections: ReflectionEntry[];
  onAddReflection: (entry: { mood: string; teaching: string; reflection: string }) => void;
}

const MOOD_COLORS: Record<string, string> = {
  Anxious: '#9B7AA0',
  Confused: '#7A9BAA',
  Calm: '#5B8A6F',
  Angry: '#C17B8A',
  Hopeful: '#D4A050',
  Lost: '#7A8DAA',
  Sad: '#6B8FA8',
  Seeking: '#D4A050'
};

const MOOD_ICONS: Record<string, string> = {
  Anxious: '🌫',
  Confused: '🌀',
  Calm: '🌿',
  Angry: '🔥',
  Hopeful: '✨',
  Lost: '🧭',
  Sad: '🌧',
  Seeking: '🪷'
};

export const JourneyScreen: React.FC<JourneyScreenProps> = ({
  reflections,
  onAddReflection
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMood, setModalMood] = useState('Calm');
  const [modalTeaching, setModalTeaching] = useState('Bhagavad Gita 2.47');
  const [modalText, setModalText] = useState('');

  const handleSaveModal = () => {
    if (!modalText.trim()) return;
    onAddReflection({
      mood: modalMood,
      teaching: modalTeaching,
      reflection: modalText.trim()
    });
    setModalText('');
    setShowAddModal(false);
  };

  return (
    <div style={{ padding: '52px 20px 32px', minHeight: '100vh' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 11,
          color: '#4a4464',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 8
        }}>
          My Journey
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 30,
          color: '#ede9f8',
          lineHeight: 1.2,
          fontWeight: 400,
          marginBottom: 8
        }}>
          Reflection Journal
        </h2>
        <p style={{ fontSize: 14, color: '#6b6487', lineHeight: 1.6 }}>
          Your path, one reflection at a time.
        </p>
      </div>

      {/* 3 Metric Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 32 }}>
        {[
          { label: 'Reflections', value: String(reflections.length) },
          { label: 'Day Streak', value: '5' },
          { label: 'Teachings', value: '9' }
        ].map(item => (
          <div
            key={item.label}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid #2d2748',
              borderRadius: 14,
              padding: '16px 12px',
              textAlign: 'center'
            }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30,
              color: '#d4a050',
              fontWeight: 400,
              lineHeight: 1,
              marginBottom: 4
            }}>
              {item.value}
            </div>
            <div style={{ fontSize: 11, color: '#4a4464', fontWeight: 500 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline List */}
      <div style={{
        fontSize: 10,
        color: '#d4a050',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: 20
      }}>
        Recent Reflections
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {reflections.map((entry, idx) => {
          const color = MOOD_COLORS[entry.mood] || entry.color || '#d4a050';
          const icon = MOOD_ICONS[entry.mood] || entry.icon || '🪷';
          const isLast = idx === reflections.length - 1;

          return (
            <div key={entry.id || idx} style={{ display: 'flex', gap: 16, paddingBottom: isLast ? 0 : 22 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 38 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: `${color}18`,
                  border: `1.5px solid ${color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                  flexShrink: 0
                }}>
                  {icon}
                </div>
                {!isLast && (
                  <div style={{
                    width: 1,
                    flex: 1,
                    background: 'linear-gradient(to bottom, #2d2748, transparent)',
                    marginTop: 6,
                    minHeight: 24
                  }} />
                )}
              </div>

              <div style={{ flex: 1, paddingTop: 2, paddingBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#ede9f8' }}>
                    {entry.mood}
                  </span>
                  <span style={{ fontSize: 11, color: '#3a3458' }}>
                    {entry.date}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: color, marginBottom: 8, fontWeight: 500 }}>
                  {entry.teaching}
                </div>
                <p style={{ fontSize: 13, color: '#7a7494', lineHeight: 1.7 }}>
                  {entry.reflection}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Reflection Button */}
      <button
        onClick={() => setShowAddModal(true)}
        style={{
          width: '100%',
          background: 'rgba(212,160,80,0.05)',
          border: '1px dashed rgba(212,160,80,0.25)',
          borderRadius: 14,
          padding: '16px',
          color: '#d4a050',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          marginTop: 24,
          transition: 'all 0.15s'
        }}
      >
        + Add new reflection
      </button>

      {/* Calendar Grid */}
      <div style={{
        marginTop: 28,
        padding: '18px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid #2d2748',
        borderRadius: 14
      }}>
        <div style={{ fontSize: 10, color: '#4a4464', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
          September 2026
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {reflections.slice().reverse().map((r, i) => {
            const color = MOOD_COLORS[r.mood] || r.color || '#d4a050';
            const icon = MOOD_ICONS[r.mood] || r.icon || '🪷';
            return (
              <div
                key={i}
                title={`${r.date}: ${r.mood}`}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `${color}30`,
                  border: `1px solid ${color}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  cursor: 'default'
                }}
              >
                {icon}
              </div>
            );
          })}
          {Array.from({ length: 9 }, (_, t) => (
            <div
              key={`empty-${t}`}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid #2d2748'
              }}
            />
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(14, 12, 27, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          zIndex: 200
        }}>
          <div style={{
            background: '#161328',
            border: '1px solid #2d2748',
            borderRadius: 18,
            padding: 24,
            width: '100%',
            maxWidth: 380,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#ede9f8' }}>
              Add Reflection
            </h3>

            <div>
              <label style={{ fontSize: 12, color: '#6b6487', display: 'block', marginBottom: 6 }}>Mood</label>
              <select
                value={modalMood}
                onChange={e => setModalMood(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1d1933',
                  border: '1px solid #2d2748',
                  borderRadius: 10,
                  padding: '10px 12px',
                  color: '#ede9f8',
                  outline: 'none'
                }}
              >
                {Object.keys(MOOD_ICONS).map(m => (
                  <option key={m} value={m}>{MOOD_ICONS[m]} {m}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#6b6487', display: 'block', marginBottom: 6 }}>Teaching Reference</label>
              <input
                value={modalTeaching}
                onChange={e => setModalTeaching(e.target.value)}
                placeholder="e.g. Bhagavad Gita 2.47"
                style={{
                  width: '100%',
                  background: '#1d1933',
                  border: '1px solid #2d2748',
                  borderRadius: 10,
                  padding: '10px 12px',
                  color: '#ede9f8',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#6b6487', display: 'block', marginBottom: 6 }}>Reflection</label>
              <textarea
                value={modalText}
                onChange={e => setModalText(e.target.value)}
                rows={4}
                placeholder="What did you learn today? How did you respond to your circumstances?"
                style={{
                  width: '100%',
                  background: '#1d1933',
                  border: '1px solid #2d2748',
                  borderRadius: 10,
                  padding: '10px 12px',
                  color: '#ede9f8',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 6 }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #2d2748',
                  borderRadius: 12,
                  padding: 12,
                  color: '#6b6487',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                style={{
                  background: '#d4a050',
                  border: 'none',
                  borderRadius: 12,
                  padding: 12,
                  color: '#0e0c1b',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
