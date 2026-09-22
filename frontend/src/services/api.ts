import { GuidanceData } from '../types';
import { FALLBACK_GUIDANCE } from '../data/gitaData';

const DEFAULT_SERVER_URL = 'https://gita-brain.onrender.com';
const STORAGE_KEY_SERVER_URL = 'gita_brain_server_url';

export function getServerUrl(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(STORAGE_KEY_SERVER_URL) || DEFAULT_SERVER_URL;
  }
  return DEFAULT_SERVER_URL;
}

export function setServerUrl(url: string): void {
  const cleaned = url.trim().replace(/\/+$/, '');
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(STORAGE_KEY_SERVER_URL, cleaned);
  }
}

export async function checkServerHealth(customUrl?: string): Promise<{ ok: boolean; statusText: string; data?: any }> {
  const base = (customUrl || getServerUrl()).replace(/\/+$/, '');
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${base}/v1/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      return { ok: true, statusText: 'Connected to Gita Brain v0.8.0', data };
    }
    return { ok: false, statusText: `Server error: ${res.status}` };
  } catch (err: any) {
    return { ok: false, statusText: err.name === 'AbortError' ? 'Connection timed out' : 'Cannot reach server' };
  }
}

export async function askGita(thought: string, mood = 'neutral'): Promise<GuidanceData> {
  const base = getServerUrl().replace(/\/+$/, '');
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000); // 35s LLM generation allowance

    const res = await fetch(`${base}/v1/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        thought,
        mood,
        top_k: 3
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Server returned ${res.status}: ${errBody}`);
    }

    const data = await res.json();

    // If backend returns structured format
    if (data.structured) {
      const s = data.structured;
      const v = s.verse || {};
      return {
        emotion: s.emotion || 'Seeking + Reflection',
        situation: s.situation || 'A moment of honest searching',
        understanding: s.understanding || '',
        meaning: s.meaning || '',
        application: s.application || '',
        reflection: s.reflection || 'What choice will you make today that honours your highest self?',
        action: s.action || 'Take a deep breath, ground yourself in your duty, and proceed with courage.',
        chapter: v.chapter || 2,
        verse: v.verse || 47,
        sanskrit: v.sanskrit || '',
        transliteration: v.transliteration || '',
        translation: v.translation || ''
      };
    }

    // Fallback parsing if structured not directly attached
    const firstEvidence = data.evidence?.[0] || {};
    return {
      emotion: (data.situation?.primary || 'Clarity + Duty').replace(/_/g, ' ').toUpperCase(),
      situation: 'Guiding perspective from Gita Brain',
      understanding: data.answer?.slice(0, 300) || '',
      meaning: data.answer || '',
      application: 'Reflect on how this applies to your present circumstances.',
      reflection: 'In what ways can you move forward with equanimity?',
      action: 'Focus on your immediate effort and let go of anxiety over results.',
      chapter: firstEvidence.chapter || 2,
      verse: firstEvidence.verse || 47,
      sanskrit: firstEvidence.sanskrit || '',
      transliteration: firstEvidence.transliteration || '',
      translation: firstEvidence.translation || ''
    };
  } catch (error: any) {
    console.warn('Gita Brain backend request error:', error);
    // Offline fallback so app never crashes
    const fallback = FALLBACK_GUIDANCE[mood] || FALLBACK_GUIDANCE.default;
    return {
      ...fallback,
      understanding: `${fallback.understanding}\n\n(Note: Operating in offline mode. Ensure Gita server is running at ${base} or check Settings)`
    };
  }
}
