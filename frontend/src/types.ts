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

export interface SavedTeaching {
  id: string;
  chapter: number;
  verse: number;
  preview: string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
}
