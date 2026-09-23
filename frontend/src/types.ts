export interface VerseInfo {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
}

export interface GuidanceData {
  emotion: string;
  situation: string;
  understanding: string;
  meaning: string;
  application: string;
  reflection: string;
  action: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
}

export interface Chapter {
  num: number;
  name: string;
  theme: string;
  key: string;
  description?: string;
  color: string;
}

export interface ReflectionEntry {
  id: string;
  date: string;
  mood: string;
  color: string;
  icon: string;
  teaching: string;
  reflection: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO "YYYY-MM-DD" e.g. "2026-09-23"
  displayDate: string; // e.g. "Sep 23, 2026"
  mood: string; // e.g. "Happy", "Peaceful", "Grateful"
  emoji: string; // e.g. "😊", "😌", "🙏"
  color: string;
  reflection: string;
  teaching?: string;
  createdAt: number;
}

export interface MoodItem {
  key: string;
  label: string;
  emoji: string;
  color: string;
  bgLight: string;
}

export interface SavedTeaching {
  id: string;
  chapter: number;
  verse: number;
  preview: string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
}

export interface Mantra {
  id: string;
  name: string;
  shortName: string;
  fullText: string;
  sanskrit: string;
  meaning?: string;
}

