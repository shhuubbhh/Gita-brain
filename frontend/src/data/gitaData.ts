import { Chapter, GuidanceData, JournalEntry, MoodItem, ReflectionEntry, SavedTeaching, Mantra } from '../types';
import { Language } from '../utils/translations';

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

export const JOURNAL_MOODS: MoodItem[] = [
  { key: 'Sad', label: 'Sad', emoji: '😢', color: '#2563EB', bgLight: '#DBEAFE' },
  { key: 'Happy', label: 'Happy', emoji: '😊', color: '#D97706', bgLight: '#FEF3C7' },
  { key: 'Excited', label: 'Excited', emoji: '🤩', color: '#DB2777', bgLight: '#FCE7F3' },
  { key: 'Confused', label: 'Confused', emoji: '🤔', color: '#7C3AED', bgLight: '#EDE9FE' },
  { key: 'Anxious', label: 'Anxious', emoji: '😰', color: '#0284C7', bgLight: '#E0F2FE' },
  { key: 'Stressed', label: 'Stressed', emoji: '😫', color: '#EA580C', bgLight: '#FFEDD5' },
  { key: 'Angry', label: 'Angry', emoji: '😡', color: '#DC2626', bgLight: '#FEE2E2' },
  { key: 'Neutral', label: 'Neutral', emoji: '😐', color: '#57534E', bgLight: '#F5F5F4' },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [];

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

export const INITIAL_SAVED_TEACHINGS: SavedTeaching[] = [];

export const FALLBACK_GUIDANCE: Record<string, GuidanceData> = {
  default: {
    emotion: "Seeking + Clarity",
    situation: "Seeking direction and inner calm",
    understanding: "There is a quiet courage in simply pausing and looking inward. You don't need to have all the answers right now — the Gita meets you exactly where you are.",
    chapter: 6,
    verse: 5,
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् |\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ||",
    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    translation: "Elevate yourself through the power of your mind, and do not degrade yourself, for the mind can be the friend and also the enemy of the self.",
    meaning: "Krishna places the responsibility of our inner state within ourselves — not as a burden, but as a recognition of our profound potential. The mind that worries can also be guided into stillness and wisdom.",
    application: "Whatever you are navigating today, remember you carry within you the capacity to respond with patience and wisdom rather than reaction.",
    reflection: "In what small way can you be a true friend to yourself today?",
    action: "Take three mindful breaths. Choose one small constructive task and approach it with quiet sincerity."
  },
  anger: {
    emotion: "Anger + Release",
    situation: "Experiencing frustration, resentment, or broken trust",
    understanding: "When hurt, betrayal, or unmet expectations arise, anger naturally burns in the mind. The Gita teaches us to look underneath the flame of anger.",
    chapter: 2,
    verse: 62,
    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते |\nसङ्गात्संजायते कामः कामात्क्रोधोऽभिजायते ||",
    transliteration: "dhyāyato viṣhayān puṁsaḥ saṅgas teṣhūpajāyate | saṅgāt sañjāyate kāmaḥ kāmāt krodho 'bhijāyate",
    translation: "When a person constantly dwells on external objects or expectations, attachment is born. From attachment arises burning desire, and when desire is obstructed, anger blazes forth.",
    meaning: "Krishna reveals that anger is never the root — it is the smoke of an obstructed expectation. By understanding what expectation you were clinging to, the fury loses its power over your judgment.",
    application: "Do not let the actions of others hijack your inner dignity. Step back from the heat of the moment before reacting or retaliating.",
    reflection: "What expectation or desire sitting underneath this anger can you surrender for your own peace?",
    action: "Pause before speaking or deciding. Drink water, take a walk, and choose not to let resentment poison your day."
  },
  sadness: {
    emotion: "Sorrow + Comfort",
    situation: "Walking through grief, deep sorrow, or emotional pain",
    understanding: "Grief and sadness are not signs of weakness; they show how deeply you value love and life. The Gita wraps your heart in eternal perspective.",
    chapter: 2,
    verse: 20,
    sanskrit: "न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः |\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे ||",
    transliteration: "na jāyate mriyate vā kadāchin nāyaṁ bhūtvā bhavitā vā na bhūyaḥ | ajo nityaḥ śhāśhvato 'yaṁ purāṇo na hanyate hanyamāne śharīre",
    translation: "The soul is never born nor does it ever die; nor having once been, does it ever cease to be. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.",
    meaning: "Krishna consoles Arjuna in his deepest sorrow by showing him that the core essence of being — consciousness itself — is indestructible and eternal. Pain belongs to the shifting forms of life, but peace belongs to the eternal self.",
    application: "Allow yourself to grieve without self-reproach, yet know with certainty that the dark cloud will pass. Your inner spirit remains unbroken.",
    reflection: "Can you offer gentle compassion to yourself as you heal from this sorrow?",
    action: "Place your hand on your heart, take a slow deep breath, and whisper: 'This pain is passing; my inner strength endures.'"
  },
  anxiety: {
    emotion: "Anxiety + Surrender",
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
  },
  failure: {
    emotion: "Resilience + Equanimity",
    situation: "Facing setback, exam/job disappointment, or feeling inadequate",
    understanding: "A temporary setback does not define your worth or potential. In the arena of life, every valiant seeker meets moments that test their resolve.",
    chapter: 2,
    verse: 48,
    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय |\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ||",
    transliteration: "yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya | siddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga uchyate",
    translation: "Be steadfast in yoga, O Arjuna. Perform your duty without attachment to outcome, remaining poised and equal in both success and failure. Such equanimity of mind is called Yoga.",
    meaning: "Krishna redefines success: true mastery is not winning every contest, but keeping the heart unbroken and balanced whether you meet praise or defeat.",
    application: "Treat this setback as a lesson and a stepping stone. Failure is an event in time, not an identity.",
    reflection: "What insight or inner resilience did this setback uncover within you?",
    action: "Dust off your feet, forgive yourself for any mistakes, and begin anew with quiet determination."
  },
  confusion: {
    emotion: "Purpose + Dharma",
    situation: "Dilemma about career, life path, or ethical decision",
    understanding: "Standing at the crossroads of life brings legitimate tension. Arjuna stood in the same paralysis before Krishna illuminated his path.",
    chapter: 3,
    verse: 35,
    sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् |\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः ||",
    transliteration: "śhreyān swa-dharmo viguṇaḥ para-dharmāt sv-anuṣhṭhitāt | swa-dharme nidhanaṁ śhreyaḥ para-dharmo bhayāvahaḥ",
    translation: "It is far better to perform one's own natural duty, though imperfectly, than to attempt another's duty perfectly. By fulfilling your own nature, you find true peace.",
    meaning: "Krishna cautions against living life to satisfy other people's standards or imitating someone else's path. Your own calling, lived authentically, leads to fulfillment.",
    application: "Stop comparing your journey to others. Focus on what aligns with your genuine skills, responsibilities, and values.",
    reflection: "What does your own inner compass say is your authentic duty right now?",
    action: "Write down the two choices before you. Choose the one that serves your long-term character and peace rather than short-term ego."
  },
  mind: {
    emotion: "Peace + Mindfulness",
    situation: "Restless overthinking, distracted focus, or mental fatigue",
    understanding: "When thousands of racing thoughts crowd your mind, it feels exhausting. The Gita treats the restless mind with understanding, not harsh judgment.",
    chapter: 6,
    verse: 26,
    sanskrit: "यतो यतो निश्चरति मनश्चञ्चलमस्थिरम् |\nततस्ततो नियम्यैतदात्मन्येव वशं नयेत् ||",
    transliteration: "yato yato niśhcharati manaśh chañchalam asthiram | tatas tato niyamyaitad ātmany eva vaśhaṁ nayet",
    translation: "From whatever direction the restless, wandering mind strays, one should gently rein it in and bring it back under the refuge of the self.",
    meaning: "Krishna emphasizes the word 'gently' (tatas tato). You do not battle the mind with violence; you notice it wandering without shame, and kindly guide it back to the present.",
    application: "You do not have to believe every thought your mind generates. Notice the thoughts like passing clouds.",
    reflection: "Can you permit your mind to rest right now, knowing this moment is enough?",
    action: "Close your eyes for 60 seconds. Notice each breath moving in and out, returning gently whenever a thought appears."
  },
  devotion: {
    emotion: "Grace + Gratitude",
    situation: "Seeking spiritual connection, surrender, or divine shelter",
    understanding: "When you open your heart in sincere reverence, you recognize that you are held by a cosmic intelligence greater than your individual worries.",
    chapter: 9,
    verse: 22,
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते |\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ||",
    transliteration: "ananyāśh chintayanto māṁ ye janāḥ paryupāsate | teṣhāṁ nityābhiyuktānāṁ yoga-kṣhemaṁ vahāmy aham",
    translation: "To those who always remember Me with singular devotion and meditation, I carry what they lack and preserve what they already possess.",
    meaning: "Krishna offers the ultimate assurance: when your heart is anchored in love and surrender, divine grace supports and preserves your welfare.",
    application: "Rest your anxieties at the feet of the divine. You do not have to carry the entire universe on your shoulders.",
    reflection: "What can you gratefully surrender to the care of the divine today?",
    action: "Chant a mantra or take a quiet moment of gratitude for the gift of life and the blessings already given to you."
  }
};

export const FALLBACK_GUIDANCE_HI: Record<string, GuidanceData> = {
  default: {
    emotion: "मार्गदर्शन एवं शांति",
    situation: "सद्बुद्धि, कर्तव्य और आंतरिक शांति की खोज",
    understanding: "जीवन की उलझनों के बीच रुककर आत्म-मंथन करना ही वास्तविक जागृति का लक्षण है। आपको तुरंत सब कुछ समझने की आवश्यकता नहीं है—गीता आपको हर मोड़ पर दिशा देती है।",
    chapter: 6,
    verse: 5,
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् |\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ||",
    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    translation: "मनुष्य को अपने मन के द्वारा अपना उद्धार करना चाहिए, अपना पतन नहीं; क्योंकि यह मन ही मनुष्य का सबसे बड़ा मित्र है और यही सबसे बड़ा शत्रु भी है।",
    meaning: "श्री कृष्ण समझाते हैं कि हमारे जीवन की दिशा हमारे अपने दृष्टिकोण और कर्मों पर निर्भर करती है। संतुलित मन हर परिस्थिति में विजय दिलाता है।",
    application: "परिस्थितियों से घबराने के बजाय धैर्य और विवेक के साथ आगे बढ़ें। आप में हर बाधा पार करने का सामर्थ्य है।",
    reflection: "आज आप अपने प्रति एक सच्चे मित्र जैसा व्यवहार कैसे कर सकते हैं?",
    action: "3 शांत गहरी सांसें लें, एक सकारात्मक संकल्प करें, और शांत चित्त से आगे बढ़ें।"
  },
  anger: {
    emotion: "क्रोध शमन एवं आत्म-नियंत्रण",
    situation: "निराशा, विश्वासघात या कटु व्यवहार से उपजा क्रोध",
    understanding: "जब हमारी अपेक्षाएं टूटती हैं या कोई आहत करता है, तो मन में क्रोध की ज्वाला उठना स्वाभाविक है। परंतु गीता सिखाती है कि क्रोध सबसे पहले स्वयं को ही जलाता है।",
    chapter: 2,
    verse: 62,
    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते |\nसङ्गात्संजायते कामः कामात्क्रोधोऽभिजायते ||",
    transliteration: "dhyāyato viṣhayān puṁsaḥ saṅgas teṣhūpajāyate | saṅgāt sañjāyate kāmaḥ kāmāt krodho 'bhijāyate",
    translation: "विषयों का निरंतर चिंतन करने से उनमें आसक्ति उत्पन्न होती है। आसक्ति से तीव्र कामना जन्म लेती है, और जब कामना में बाधा आती है, तो क्रोध उत्पन्न होता है।",
    meaning: "श्री कृष्ण बताते हैं कि क्रोध का मूल बाहरी व्यक्ति नहीं, बल्कि हमारी आंतरिक अपेक्षाएं हैं। जब आप अपेक्षा को समझ लेते हैं, तो क्रोध का वेग शांत हो जाता है।",
    application: "दूसरों के कटु व्यवहार को अपनी आंतरिक गरिमा नष्ट न करने दें। प्रतिक्रिया देने से पहले शांत होना ही सच्चा बल है।",
    reflection: "इस क्रोध के पीछे आपकी कौन सी अपेक्षा छिपी है जिसे आप अपनी शांति के लिए छोड़ सकते हैं?",
    action: "तुरंत कोई उत्तर न दें। थोड़ा जल पिएं, कुछ क्षण मौन रहें, और अपने मन को शांत होने का समय दें।"
  },
  sadness: {
    emotion: "शोक सांत्वना एवं आत्म-बल",
    situation: "गहरा दुःख, किसी अपने का वियोग या उदासी",
    understanding: "दुःख और उदासी कमजोरी का लक्षण नहीं हैं, बल्कि यह दर्शाते हैं कि आपका हृदय कितना संवेदनशील है। गीता का ज्ञान आपके हृदय को शाश्वत सांत्वना और शक्ति प्रदान करता है।",
    chapter: 2,
    verse: 20,
    sanskrit: "न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः |\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे ||",
    transliteration: "na jāyate mriyate vā kadāchin nāyaṁ bhūtvā bhavitā vā na bhūyaḥ | ajo nityaḥ śhāśhvato 'yaṁ purāṇo na hanyate hanyamāne śharīre",
    translation: "आत्मा न कभी जन्म लेती है और न कभी मरती है। यह अजन्मा, नित्य, शाश्वत और पुरातन है। शरीर के नष्ट होने पर भी आत्मा का नाश नहीं होता।",
    meaning: "श्री कृष्ण अर्जुन को समझाते हैं कि भौतिक रूप बदलते रहते हैं, परंतु हमारी चेतना और आत्मा अमर है। समय के साथ यह कठिन दौर भी बीत जाएगा।",
    application: "अपने दुःख को महसूस करने दें, किंतु यह विश्वास रखें कि आपकी आंतरिक चेतना अडिग और समर्थ है।",
    reflection: "क्या आप इस दुःख की घड़ी में स्वयं के प्रति करुणा और धैर्य रख सकते हैं?",
    action: "हृदय पर हाथ रखें, एक लंबी सांस लें, और मन में कहें: 'यह समय भी बीत जाएगा, मेरी आत्मशक्ति अटूट है।'"
  },
  anxiety: {
    emotion: "चिंता मुक्ति एवं समर्पण",
    situation: "भविष्य के परिणाम और अनिश्चितता का भय",
    understanding: "अनिश्चितता के बीच मन में चिंता और घबराहट होना बहुत स्वाभाविक है। जब हम उस भविष्य को नियंत्रित करने की चेष्टा करते हैं जो हमारे हाथ में नहीं है, तब मन अशांत हो जाता है।",
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||",
    transliteration: "karmaṇy-evādhikāras te mā phaleṣhu kadāchana | mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    translation: "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए कर्म के फल के प्रति आसक्त मत हो, और न ही अकर्मण्यता (कर्म न करने) में तुम्हारी रुचि हो।",
    meaning: "श्री कृष्ण सिखाते हैं कि आपका सच्चा अधिकार केवल वर्तमान प्रयास पर है। जब आप फल की चिंता छोड़ते हैं, तो मन तुरंत शांत और एकाग्र हो जाता है।",
    application: "जिस भविष्य का आपको भय है, वह केवल कल्पना में है। आपके पास केवल यह वर्तमान क्षण है—इसमें निष्ठा से कर्म करें।",
    reflection: "आज आपके नियंत्रण में कौन सा एक छोटा और सार्थक कदम है जिसे आप शांत भाव से कर सकते हैं?",
    action: "3 बार गहरी और धीमी सांस लें। परिणाम की चिंता ईश्वर को समर्पित करें और अपने कार्य में एकाग्र हो जाएं।"
  },
  failure: {
    emotion: "धैर्य एवं समत्व",
    situation: "असफलता, असंतोष या परीक्षा/कार्य में निराशा",
    understanding: "एक असफलता आपके पूरे जीवन या आपकी योग्यता को परिभाषित नहीं करती। जीवन के इस रणक्षेत्र में हर साहसी साधक के सामने ऐसी परीक्षाएं आती हैं।",
    chapter: 2,
    verse: 48,
    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय |\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ||",
    transliteration: "yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya | siddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga uchyate",
    translation: "हे धनञ्जय! आसक्ति को त्यागकर, सफलता और असफलता में समान भाव रखकर अपने कर्तव्य का पालन करो। यही समत्व भाव 'योग' कहलाता है।",
    meaning: "श्री कृष्ण वास्तविक विजय को परिभाषित करते हैं: हर बार जीतना नहीं, बल्कि जय और पराजय दोनों में मन की शांति बनाए रखना ही वास्तविक योग है।",
    application: "इस असफलता को एक सीख और नया अवसर मानें। पुनः नए उत्साह और अनुभव के साथ प्रयास करें।",
    reflection: "इस अनुभव ने आपके भीतर कौन सी नई समझ या शक्ति उजागर की है?",
    action: "अपनी गलतियों को क्षमा करें, नए सिरे से योजना बनाएं और विश्वास के साथ आगे बढ़ें।"
  },
  confusion: {
    emotion: "मार्गदर्शन एवं कर्तव्य",
    situation: "निर्णय, करियर या जीवन के मार्ग में असमंजस",
    understanding: "जीवन के किसी भी मोड़ पर जब निर्णय लेने में असमंजस या उलझन महसूस हो, तो यह बहुत स्वाभाविक है। स्वयं अर्जुन भी कुरुक्षेत्र में कर्तव्य और निर्णय के ऐसे ही द्वंद्व में खड़े थे।",
    chapter: 18,
    verse: 47,
    sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् |\nस्वभावनियतं कर्म कुर्वन्नाप्नोति किल्बिषम् ||",
    transliteration: "śhreyān swa-dharmo viguṇaḥ para-dharmāt sv-anuṣhṭhitāt | swabhāva-niyataṁ karma kurvan nāpnoti kilbiṣham",
    translation: "दूसरों के मार्ग का पूर्णता से अनुकरण करने की तुलना में अपने स्वाभाविक धर्म और कर्तव्य का पालन करना कहीं अधिक कल्याणकारी है। अपने स्वभाव के अनुसार कर्म करने से मनुष्य को शांति और सिद्धि मिलती है।",
    meaning: "भगवान श्री कृष्ण अर्जुन को समझाते हैं कि समाज या दूसरों की अपेक्षाओं में बहने के बजाय, अपनी अंतरात्मा और स्वाभाविक प्रकृति के अनुसार निर्णय लेना चाहिए।",
    application: "अपनी तुलना दूसरों से करना बंद करें। जो निर्णय आपके सच्चे स्वभाव, मर्यादा और आंतरिक शांति के अनुकूल हो, उसी को चुनें।",
    reflection: "इस समय आपका अंतर्मन आपको किस स्वाभाविक और सच्चे कर्तव्य की ओर प्रेरित कर रहा है?",
    action: "एक गहरी सांस लें, अपने विकल्पों को शांत मन से देखें, और जो आपकी अंतरात्मा को सही लगे, बिना संकोच वह कदम उठाएं।"
  },
  mind: {
    emotion: "मानसिक शांति एवं एकाग्रता",
    situation: "अशांत विचार, अत्यधिक सोचना (ओवरथिंकिंग) या मानसिक थकान",
    understanding: "जब मन में अनगिनत विचार एक साथ दौड़ रहे हों, तो थकान और बेचैनी होना स्वाभाविक है। गीता मन की चंचलता को दोष नहीं देती, बल्कि उसे स्नेह से साधना सिखाती है।",
    chapter: 6,
    verse: 26,
    sanskrit: "यतो यतो निश्चरति मनश्चञ्चलमस्थिरम् |\nततस्ततो नियम्यैतदात्मन्येव वशं नयेत् ||",
    transliteration: "yato yato niśhcharati manaśh chañchalam asthiram | tatas tato niyamyaitad ātmany eva vaśhaṁ nayet",
    translation: "यह चंचल और अस्थिर मन जहाँ-जहाँ भी भटके, वहाँ-वहाँ से इसे धैर्यपूर्वक रोककर पुनः आत्मा में ही स्थिर करना चाहिए।",
    meaning: "श्री कृष्ण 'धीरे-धीरे' (ततस्ततो) मन को वापस लाने का निर्देश देते हैं। मन से युद्ध नहीं करना है, बल्कि उसे बच्चे की तरह स्नेह से वर्तमान में लौटाना है।",
    application: "मन में आने वाले हर विचार पर विश्वास करना अनिवार्य नहीं है। विचारों को आकाश में बादलों की तरह आते-जाते देखें।",
    reflection: "क्या आप इस पल अपने मन को विश्राम की अनुमति दे सकते हैं?",
    action: "1 मिनट के लिए आंखें बंद करें। अपनी सांसों के आने-जाने पर ध्यान दें और विचारों को शांत होने दें।"
  },
  devotion: {
    emotion: "दिव्य कृपा एवं कृतज्ञता",
    situation: "ईश्वर भक्ति, आत्म-समर्पण और परम शांति की खोज",
    understanding: "जब आप विनम्र भाव से ईश्वर के सम्मुख समर्पण करते हैं, तो आपको अनुभव होता है कि आप अकेले नहीं हैं—एक दिव्य शक्ति निरंतर आपका संबल बनी हुई है।",
    chapter: 9,
    verse: 22,
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते |\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ||",
    transliteration: "ananyāśh chintayanto māṁ ye janāḥ paryupāsate | teṣhāṁ nityābhiyuktānāṁ yoga-kṣhemaṁ vahāmy aham",
    translation: "जो अनन्य भाव से मेरा स्मरण करते हुए मेरी उपासना करते हैं, उन नित्य युक्त भक्तों के योग और क्षेम का वहन मैं स्वयं करता हूँ।",
    meaning: "श्री कृष्ण परम आश्वासन देते हैं: जब आपका हृदय प्रेम और विश्वास से जुड़ा होता है, तो परमात्मा स्वयं आपके कल्याण का दायित्व संभालते हैं।",
    application: "अपनी चिंताओं को प्रभु के चरणों में समर्पित करें। सारा भार अकेले उठाने की आवश्यकता नहीं है।",
    reflection: "आज आप जीवन में मिले किस उपहार के लिए ईश्वर के प्रति कृतज्ञता व्यक्त करना चाहेंगे?",
    action: "एक छोटा सा मंत्र जपें या शांत बैठकर प्रभु की कृपा के लिए धन्यवाद करें।"
  }
};

/**
 * Intelligent helper to match user text and mood to appropriate Gita guidance
 * Supports both English and Hindi.
 */
export function getGuidanceForThought(thought: string, mood = 'neutral', language: Language = 'en'): GuidanceData {
  const t = (thought || '').toLowerCase();
  const m = (mood || '').toLowerCase();
  const map = language === 'hi' ? FALLBACK_GUIDANCE_HI : FALLBACK_GUIDANCE;

  // 1. Anger cues
  if (m === 'angry' || /anger|angry|furious|rage|betray|cheat|lied|disrespect|unfair|fight|quarrel|mad at|क्रोध|गुस्सा|नाराज|धोखा|बदला/i.test(t)) {
    return map.anger;
  }

  // 2. Grief / sorrow / loss cues
  if (/crying|death|died|loss|grief|sorrow|passed away|mourning|heartbroken|depressed|lost someone|रोना|शोक|दुख|उदासी|मृत्यु|अकेलापन/i.test(t)) {
    return map.sadness;
  }

  // 3. Sadness / feeling down
  if (m === 'sad' || /sad|unhappy|hopeless|gloomy|lonely|down|hurting|empty|उदास|निराश|बेबस/i.test(t)) {
    return map.sadness;
  }

  // 4. Failure / setback cues
  if (/fail|failed|failure|exam|interview|rejection|rejected|loser|incompetent|disappointment|loss|असफल|हार|परीक्षा|नाकाम/i.test(t)) {
    return map.failure;
  }

  // 5. Confusion / career / decision cues
  if (m === 'confused' || /confus|career|choice|what should i do|what to do|dilemma|path|purpose|future job|lost in life|photographer|असमंजस|उलझन|क्या करूं|निर्णय|करियर|मार्ग/i.test(t)) {
    return map.confusion;
  }

  // 6. Overthinking / mind / focus cues
  if (/mind|overthink|racing thoughts|focus|concentrat|meditat|distract|headache|mental peace|peace of mind|मन|सोच|चिंता|एकाग्रता|ध्यान|शांति/i.test(t)) {
    return map.mind;
  }

  // 7. Anxiety / fear cues
  if (m === 'anxious' || m === 'stressed' || /anxious|anxiety|fear|scared|worried|worry|nervous|panic|stress|overwhelm|डर|भय|घबराहट|तनाव/i.test(t)) {
    return map.anxiety;
  }

  // 8. Gratitude / devotion cues
  if (m === 'happy' || m === 'excited' || /thank|grateful|gratitude|bhakti|krishna|god|divine|prayer|love|joy|blessed|प्रभु|कृष्ण|ईश्वर|भक्ति|धन्यवाद|कृतज्ञता/i.test(t)) {
    return map.devotion;
  }

  // 9. Comparison / jealousy cues
  if (/jealous|envy|compare|comparing|inferior|better than me|ईर्ष्या|जलन|तुलना/i.test(t)) {
    return map.confusion;
  }

  return map[m] || map.default;
}

export const JAPA_MANTRAS: Mantra[] = [
  {
    id: "hare-krishna",
    name: "Hare Krishna Hare Krishna, Krishna Krishna Hare Hare",
    shortName: "Hare Krishna",
    fullText: "Hare Krishna Hare Krishna, Krishna Krishna Hare Hare, Hare Rama Hare Rama, Rama Rama Hare Hare",
    sanskrit: "हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे",
    meaning: "The Maha-mantra for inner peace, pure love, and transcendental consciousness.",
    nameHi: "हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे",
    shortNameHi: "हरे कृष्ण",
    fullTextHi: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे\nहरे राम हरे राम राम राम हरे हरे",
    meaningHi: "आंतरिक शांति, दिव्य प्रेम और परम चेतना के लिए महामंत्र।"
  },
  {
    id: "gayatri-mantra",
    name: "Gayatri Mantra",
    shortName: "Gayatri Mantra",
    fullText: "Om Bhur Bhuvaḥ Svaḥ, Tat-savitur Vareṇyaṁ Bhargo Devasya Dhīmahi, Dhiyo Yo Naḥ Prachodayāt",
    sanskrit: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",
    meaning: "A universal prayer for spiritual illumination, wisdom, and clarity of mind.",
    nameHi: "गायत्री मंत्र",
    shortNameHi: "गायत्री मंत्र",
    fullTextHi: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",
    meaningHi: "आध्यात्मिक प्रकाश, सद्बुद्धि और मानसिक स्पष्टता के लिए सार्वभौमिक प्रार्थना।"
  },
  {
    id: "radha-radha",
    name: "Radha Radha",
    shortName: "Radha Radha",
    fullText: "Radhe Radhe Radhe, Shri Radha Radhe Radhe",
    sanskrit: "श्री राधा राधे राधे, राधे राधे",
    meaning: "An intimate remembrance of divine devotion, sweet grace, and surrender.",
    nameHi: "राधा नाम",
    shortNameHi: "राधा राधा",
    fullTextHi: "राधे राधे राधे श्री राधा राधे राधे\nराधे राधे गोविंद राधे राधे गोपाला",
    meaningHi: "दिव्य भक्ति, कृपा और आत्म-समर्पण का पावन स्मरण।"
  },
  {
    id: "om-namo-bhagavate",
    name: "Om Namo Bhagavate Vasudevaya",
    shortName: "Om Namo Bhagavate",
    fullText: "Om Namo Bhagavate Vasudevaya",
    sanskrit: "ॐ नमो भगवते वासुदेवाय",
    meaning: "Salutations to the Supreme Lord Sri Krishna who resides within all living beings.",
    nameHi: "ॐ नमो भगवते वासुदेवाय",
    shortNameHi: "ॐ नमो भगवते",
    fullTextHi: "ॐ नमो भगवते वासुदेवाय",
    meaningHi: "सभी जीवों के हृदय में वास करने वाले परम प्रभु श्री कृष्ण को सादर नमन।"
  }
];

