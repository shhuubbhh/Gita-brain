import { Chapter, GuidanceData, ReflectionEntry, SavedTeaching } from '../types';

export const CHAPTERS: Chapter[] = [
  { num: 1, name: 'Arjuna Vishada Yoga', theme: 'The Grief of Arjuna', key: 'grief, confusion, duty, despair, surrender', color: '#9B7AA0' },
  { num: 2, name: 'Sankhya Yoga', theme: 'Transcendent Knowledge', key: 'self, immortality, duty, equanimity, action', color: '#7A9BAA' },
  { num: 3, name: 'Karma Yoga', theme: 'Path of Action', key: 'selfless action, duty, service, detachment', color: '#D4A050' },
  { num: 4, name: 'Jnana Karma Sanyasa Yoga', theme: 'Knowledge & Action', key: 'wisdom, sacrifice, liberation, divine knowledge', color: '#5B8A6F' },
  { num: 5, name: 'Karma Sanyasa Yoga', theme: 'Renunciation of Action', key: 'renunciation, non-attachment, inner peace', color: '#C17B8A' },
  { num: 6, name: 'Dhyana Yoga', theme: 'Path of Meditation', key: 'meditation, self-control, mind, yoga, balance', color: '#7A8DAA' },
  { num: 7, name: 'Jnana Vijnana Yoga', theme: 'Knowledge of the Absolute', key: 'divine knowledge, nature, illusion, reality', color: '#C4955A' },
  { num: 8, name: 'Aksara Brahma Yoga', theme: 'The Imperishable Absolute', key: 'ultimate reality, consciousness, death, eternity', color: '#8A9B7A' },
  { num: 9, name: 'Raja Vidya Raja Guhya Yoga', theme: 'The Royal Path', key: 'devotion, divine sovereignty, worship, surrender', color: '#A07A9B' },
  { num: 10, name: 'Vibhuti Yoga', theme: 'Divine Manifestations', key: 'divine glories, power, consciousness, Krishna', color: '#7AABA0' },
  { num: 11, name: 'Vishwarupa Darshana Yoga', theme: 'The Cosmic Form', key: 'universal form, awe, transcendence, time', color: '#C47A7A' },
  { num: 12, name: 'Bhakti Yoga', theme: 'Path of Devotion', key: 'devotion, love, surrender, grace, compassion', color: '#9BAA7A' },
  { num: 13, name: 'Ksetra Ksetrajna Vibhaga Yoga', theme: 'The Field & Its Knower', key: 'body, soul, nature, consciousness, wisdom', color: '#7A7AAA' },
  { num: 14, name: 'Gunatraya Vibhaga Yoga', theme: 'The Three Modes of Nature', key: 'qualities, nature, liberation, sattva, rajas, tamas', color: '#AA9B7A' },
  { num: 15, name: 'Purushottama Yoga', theme: 'The Supreme Self', key: 'supreme reality, the perishable and eternal self', color: '#7AAA8A' },
  { num: 16, name: 'Daivasura Sampad Vibhaga Yoga', theme: 'Divine & Demoniac Nature', key: 'virtues, vices, divine nature, character, fear', color: '#9B7A7A' },
  { num: 17, name: 'Shraddhatraya Vibhaga Yoga', theme: 'The Three Divisions of Faith', key: 'faith, food, worship, austerity, sacrifice', color: '#7A9BAA' },
  { num: 18, name: 'Moksha Sanyasa Yoga', theme: 'Liberation Through Renunciation', key: 'final teachings, surrender, liberation, duty, action', color: '#D4A050' },
];

export const CHAPTER_DESCRIPTIONS: Record<number, string> = {
  1: "Arjuna, standing between the two armies at Kurukshetra, is overcome by grief and refuses to fight. His moral crisis becomes the occasion for Krishna's teachings — one of the most profound conversations in all of human literature.",
  2: "Krishna begins his teaching by addressing Arjuna's grief. He introduces the concept of the eternal self — the soul that is neither born nor dies. This chapter lays the philosophical foundation for the entire Gita.",
  3: "Krishna explains that action is unavoidable — even the act of not acting is a form of action. The key is to act without attachment to results, as a form of service rather than self-seeking.",
  4: "Krishna reveals that he has transmitted this knowledge in previous ages. He introduces the concept of sacrifice and explains how wisdom is the highest purifier available to the seeker.",
  5: "Krishna reconciles the path of renunciation with the path of action, showing that they lead to the same destination when pursued with the right understanding.",
  6: "This chapter focuses on the practice of meditation and the importance of self-discipline. Krishna describes the ideal yogi — one who has mastered the mind and achieved equanimity.",
  7: "Krishna reveals his divine nature and explains the distinction between his lower material nature and his higher spiritual nature. He addresses why some seek him and some do not.",
  8: "Krishna explains the ultimate reality — the imperishable Brahman — and describes what determines one's state at the moment of death and after.",
  9: "Often called the \"king of knowledge,\" this chapter contains Krishna's most direct teachings on devotion and the nature of his relationship with all beings.",
  10: "Krishna describes his divine manifestations — the various ways in which his presence can be recognized in the world. He is the brilliance of the brilliant, the courage of the courageous.",
  11: "Arjuna is granted the divine vision to see Krishna's universal form — a terrifying and magnificent revelation of the entire cosmos within one divine being.",
  12: "Krishna explains the nature of devotion and describes the qualities of one who is truly dear to him. This chapter is often considered the heart of the Gita.",
  13: "Krishna distinguishes between the field (the body and material world) and the knower of the field (the soul/consciousness). Understanding this distinction is the path to liberation.",
  14: "Krishna explains the three fundamental qualities or modes of nature — sattva (goodness), rajas (passion), and tamas (ignorance) — and how they shape all experience.",
  15: "Krishna describes the supreme self — the Purushottama — who transcends both the perishable material world and the imperishable soul. Knowing this is the highest knowledge.",
  16: "Krishna describes two types of human beings — those with divine qualities and those with demoniac qualities — and the different paths they walk.",
  17: "Krishna explains how the three modes of nature shape one's faith, food choices, sacrifice, austerity, and charity — and why sincerity of intent matters above all.",
  18: "The final chapter synthesizes all of the Gita's teachings. Krishna asks Arjuna to surrender completely — not as defeat, but as the highest act of trust and wisdom."
};

export const QUICK_START_CHIPS = [
  { label: "I'm anxious", key: "anxiety" },
  { label: "I'm angry", key: "anger" },
  { label: "I'm confused", key: "confused" },
  { label: "I feel lost", key: "lost" },
  { label: "I failed", key: "failure" },
  { label: "Need motivation", key: "motivation" },
  { label: "Overthinking", key: "anxiety" },
  { label: "Need peace", key: "peace" }
];

export const INITIAL_REFLECTIONS: ReflectionEntry[] = [
  {
    id: "ref-1",
    date: "Sep 18",
    mood: "Anxious",
    color: "#9B7AA0",
    icon: "🌫",
    teaching: "Bhagavad Gita 2.47",
    reflection: "Wrote about my fear of failing the interview. The teaching on action without attachment helped me focus on preparation, not outcome."
  },
  {
    id: "ref-2",
    date: "Sep 14",
    mood: "Confused",
    color: "#7A9BAA",
    icon: "🌀",
    teaching: "Bhagavad Gita 3.35",
    reflection: "I was comparing myself to friends. Reading about dharma made me realize I have been measuring myself by entirely the wrong ruler."
  },
  {
    id: "ref-3",
    date: "Sep 10",
    mood: "Calm",
    color: "#5B8A6F",
    icon: "🌿",
    teaching: "Bhagavad Gita 6.5",
    reflection: "A good day. Meditated in the morning. Felt like I was moving at my own pace for once — without the usual pressure."
  },
  {
    id: "ref-4",
    date: "Sep 6",
    mood: "Angry",
    color: "#C17B8A",
    icon: "🔥",
    teaching: "Bhagavad Gita 2.62",
    reflection: "Had a conflict with a colleague. The teaching on anger helped me see what expectation was sitting underneath the feeling."
  },
  {
    id: "ref-5",
    date: "Sep 2",
    mood: "Hopeful",
    color: "#D4A050",
    icon: "✨",
    teaching: "Bhagavad Gita 4.38",
    reflection: "Started the 18-day journey. Feeling genuinely open and curious about what I might discover along the way."
  }
];

export const INITIAL_SAVED_TEACHINGS: SavedTeaching[] = [
  {
    id: "teach-1",
    chapter: 2,
    verse: 47,
    preview: "You have the right to perform your duties, but you are not entitled to the fruits of your actions...",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||",
    transliteration: "karmaṇy-evādhikāras te mā phaleṣhu kadāchana | mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    translation: "You have the right to act, never to the fruits of action. Never let the fruit be your motive, and never let inaction be your refuge."
  },
  {
    id: "teach-2",
    chapter: 3,
    verse: 35,
    preview: "It is far better to perform one's own duties imperfectly than to perform another's duties perfectly...",
    sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् |\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः ||",
    transliteration: "śhreyān swa-dharmo viguṇaḥ para-dharmāt sv-anuṣhṭhitāt | swa-dharme nidhanaṁ śhreyaḥ para-dharmo bhayāvahaḥ",
    translation: "It is far better to perform one's own duties imperfectly than to perform another's duties perfectly. Acting in another's role brings danger and fear."
  },
  {
    id: "teach-3",
    chapter: 6,
    verse: 5,
    preview: "Elevate yourself through the power of your mind, and do not degrade yourself...",
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् |\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ||",
    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    translation: "Elevate yourself through the power of your mind, and do not degrade yourself, for the mind can be the friend and also the enemy of the self."
  },
  {
    id: "teach-4",
    chapter: 4,
    verse: 38,
    preview: "In this world, there is nothing as purifying as divine knowledge...",
    sanskrit: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते |\nतत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति ||",
    transliteration: "na hi jñānena sadṛiśhaṁ pavitram iha vidyate | tat svayaṁ yoga-sansiddhaḥ kālenātmani vindati",
    translation: "In this world, there is nothing as purifying as divine knowledge. One who has attained purity through yoga finds this wisdom within in due course."
  }
];

export const FALLBACK_GUIDANCE: Record<string, GuidanceData> = {
  default: {
    emotion: "Seeking + Reflection",
    situation: "A moment of honest searching",
    understanding: "There is a quiet courage in simply pausing and looking inward. You don't need to have it all figured out — the Gita meets you exactly where you are.",
    chapter: 6,
    verse: 5,
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् |\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ||",
    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    translation: "Elevate yourself through the power of your mind, and do not degrade yourself, for the mind can be the friend and also the enemy of the self.",
    meaning: "Krishna places the responsibility of our inner life squarely within ourselves — not as a burden, but as a recognition of our profound capacity. The same mind that creates suffering can be trained to create peace. You are not trapped by your thoughts; you are their author.",
    application: "Whatever you are going through, you carry within you the capacity to meet it — not by suppressing it, but by understanding it and choosing how to respond. The mind is your most powerful tool. Tend to it.",
    reflection: "In what ways are you being a friend to yourself today, and in what ways an enemy?",
    action: "Choose one small act of self-compassion today — something you would offer a close friend who was going through exactly what you are."
  },
  anxiety: {
    emotion: "Anxiety + Fear",
    situation: "Worry about future outcomes and uncertainty",
    understanding: "There is a heavy weight in uncertainty, especially when decisions carry consequence. It is natural to feel hesitance when facing what you cannot control.",
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||",
    transliteration: "karmaṇy-evādhikāras te mā phaleṣhu kadāchana | mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    translation: "You have the right to perform your duties, but you are not entitled to the fruits of your actions. Never let the fruit be your motive, and never let inaction be your refuge.",
    meaning: "Krishna points out that your sincere effort is your true domain. The outcome lives in forces larger than any individual effort. When you surrender anxiety over outcomes, your mind regains clarity.",
    application: "The future you fear lives only in anticipation. The only thing truly yours is the sincere quality of what you do in this present moment.",
    reflection: "What is the single most constructive step you can take today that is genuinely within your control?",
    action: "Take one clear, well-intentioned step forward today without measuring the ultimate result. Release the need for immediate certainty."
  }
};
