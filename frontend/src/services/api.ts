import { GuidanceData } from '../types';
import { FALLBACK_GUIDANCE, getGuidanceForThought } from '../data/gitaData';
import { Language } from '../utils/translations';

const DEFAULT_SERVER_URL = 'https://gita-brain.onrender.com';
const STORAGE_KEY_SERVER_URL = 'gita_brain_server_url';

export function getServerUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage ? localStorage.getItem(STORAGE_KEY_SERVER_URL) : null;
    if (saved) return saved;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8080';
    }
    return DEFAULT_SERVER_URL;
  }
  return DEFAULT_SERVER_URL;
}

export function setServerUrl(url: string): void {
  const cleaned = url.trim().replace(/\/+$/, '');
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(STORAGE_KEY_SERVER_URL, cleaned);
  }
}

export async function checkServerHealth(
  customUrl?: string,
  onStatusUpdate?: (status: string) => void
): Promise<{ ok: boolean; statusText: string; data?: any }> {
  const base = (customUrl || getServerUrl()).replace(/\/+$/, '');
  try {
    const controller = new AbortController();
    // 50s timeout for Render free tier spin-up
    const timeout = setTimeout(() => controller.abort(), 50000);

    // After 3 seconds, let the user know the server is connecting
    const warmNotice = setTimeout(() => {
      if (onStatusUpdate) {
        onStatusUpdate('Connecting to server... Please wait a moment');
      }
    }, 3000);

    const res = await fetch(`${base}/v1/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeout);
    clearTimeout(warmNotice);

    if (res.ok) {
      const data = await res.json();
      return { ok: true, statusText: 'Connected to Gita Brain v0.8.0', data };
    }
    return { ok: false, statusText: `Server error: ${res.status}` };
  } catch (err: any) {
    return {
      ok: false,
      statusText: err.name === 'AbortError'
        ? 'Connection timed out. Please try again later.'
        : 'Cannot reach server'
    };
  }
}

// Background proactive ping to wake up Render container upon app startup
export function wakeUpServer(): void {
  try {
    const base = getServerUrl().replace(/\/+$/, '');
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 45000);
    fetch(`${base}/v1/health`, {
      method: 'GET',
      signal: controller.signal
    }).catch(() => {
      // Background warm-up ping silent fail is expected if offline
    });
  } catch {
    // Ignore error in non-blocking warm-up
  }
}

export async function askGita(thought: string, mood = 'neutral', language: Language = 'en'): Promise<GuidanceData> {
  const base = getServerUrl().replace(/\/+$/, '');

  const attemptFetch = async (timeoutMs = 60000): Promise<GuidanceData> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(`${base}/v1/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        thought,
        mood,
        top_k: 3,
        language
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
      const evList = Array.isArray(data.evidence) ? data.evidence : [];
      const firstEv = evList[0] || {};
      const v = (s.verse && s.verse.sanskrit) ? s.verse : (firstEv.sanskrit ? firstEv : (s.verse || firstEv));
      
      const chapter = Number(v.chapter || firstEv.chapter || 2);
      const verse = Number(v.verse || firstEv.verse || 47);
      const sanskrit = v.sanskrit || firstEv.sanskrit || '';
      const transliteration = v.transliteration || firstEv.transliteration || '';
      const translation = v.translation || firstEv.translation || '';
      
      return {
        emotion: s.emotion || (language === 'hi' ? 'मार्गदर्शन एवं विचार' : 'Seeking + Reflection'),
        situation: s.situation || (language === 'hi' ? 'आंतरिक स्पष्टता' : 'A moment of honest searching'),
        understanding: s.understanding || '',
        meaning: s.meaning || '',
        guidance: s.meaning || s.application || s.understanding || '',
        application: s.application || '',
        reflection: s.reflection || (language === 'hi' ? 'आज आप अपने जीवन में कौन सा सकारात्मक निर्णय ले सकते हैं?' : 'What choice will you make today that honours your highest self?'),
        action: s.action || (language === 'hi' ? '3 गहरी शांत सांसें लें, अपने कर्तव्य पर ध्यान केंद्रित करें, और चिंता को ईश्वर पर छोड़ दें।' : 'Take a deep breath, ground yourself in your duty, and proceed with courage.'),
        chapter,
        verse,
        sanskrit,
        transliteration,
        translation
      };
    }

    // Fallback parsing if structured not directly attached
    const evList = Array.isArray(data.evidence) ? data.evidence : [];
    const firstEvidence = evList[0] || {};
    const primarySituation = (data.situation?.primary || (language === 'hi' ? 'आंतरिक स्पष्टता' : 'Seeking Clarity'))
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
    
    const rawAnswer = data.answer || '';
    let parsedUnderstanding = '';
    let parsedMeaning = '';
    let parsedApplication = '';
    
    const underMatch = rawAnswer.match(/(?:###|\*\*)\s*(?:\d+[\.\)]\s+)?(?:Understanding|समझ)[\s:*#\n]*([\s\S]*?)(?=(?:###|\*\*)\s*(?:\d+[\.\)]\s+)?(?:What the Gita|गीता का मार्गदर्शन|Applying|जीवन में अनुप्रयोग|Reflection|चिंतन|Daily Practice|दैनिक अभ्यास)|$)/i);
    if (underMatch) parsedUnderstanding = underMatch[1].trim();
    
    const meaningMatch = rawAnswer.match(/(?:###|\*\*)\s*(?:\d+[\.\)]\s+)?(?:What the Gita points toward|Wisdom|Meaning|गीता का मार्गदर्शन|मार्गदर्शन)[\s:*#\n]*([\s\S]*?)(?=(?:###|\*\*)\s*(?:\d+[\.\)]\s+)?(?:Applying|जीवन में अनुप्रयोग|Reflection|चिंतन|Daily Practice|दैनिक अभ्यास)|$)/i);
    if (meaningMatch) parsedMeaning = meaningMatch[1].trim();
    
    const applyMatch = rawAnswer.match(/(?:###|\*\*)\s*(?:\d+[\.\)]\s+)?(?:Applying it here|Application|जीवन में अनुप्रयोग|अनुप्रयोग)[\s:*#\n]*([\s\S]*?)(?=(?:###|\*\*)\s*(?:\d+[\.\)]\s+)?(?:Reflection|चिंतन|Daily Practice|दैनिक अभ्यास)|$)/i);
    if (applyMatch) parsedApplication = applyMatch[1].trim();

    return {
      emotion: primarySituation,
      situation: primarySituation,
      understanding: parsedUnderstanding || rawAnswer.slice(0, 300) || '',
      meaning: parsedMeaning || rawAnswer || '',
      guidance: rawAnswer || '',
      application: parsedApplication || (language === 'hi' ? 'विचार करें कि यह ज्ञान आपकी वर्तमान परिस्थिति पर कैसे लागू होता है।' : 'Reflect on how this applies to your present circumstances.'),
      reflection: language === 'hi' ? 'आज आप समत्व भाव के साथ आगे कैसे बढ़ सकते हैं?' : 'In what ways can you move forward with equanimity?',
      action: language === 'hi' ? 'अपने तात्कालिक कर्तव्य पर ध्यान दें और परिणाम की चिंता छोड़ दें।' : 'Focus on your immediate effort and let go of anxiety over results.',
      chapter: Number(firstEvidence.chapter || 2),
      verse: Number(firstEvidence.verse || 47),
      sanskrit: firstEvidence.sanskrit || '',
      transliteration: firstEvidence.transliteration || '',
      translation: firstEvidence.translation || ''
    };
  };

  try {
    return await attemptFetch(60000);
  } catch (error: any) {
    // If the first call failed, Render might have just finished cold boot.
    // Try one automatic retry after 2.5s before falling back to offline.
    console.warn('Initial Gita Brain backend request error, attempting retry:', error);
    try {
      await new Promise(r => setTimeout(r, 2500));
      return await attemptFetch(45000);
    } catch (retryError: any) {
      console.warn('Gita Brain retry also failed:', retryError);
      // Contextual offline fallback so app never crashes and always answers relevantly
      const fallback = getGuidanceForThought(thought, mood, language);
      return {
        ...fallback,
        understanding: language === 'hi'
          ? `${fallback.understanding}\n\n(सूचना: ऑफ़लाइन मोड में काम कर रहा है। सुनिश्चित करें कि गीता सर्वर ${base} पर चल रहा है)`
          : `${fallback.understanding}\n\n(Note: Operating in offline mode. Ensure Gita server is running at ${base} or check Settings)`
      };
    }
  }
}
