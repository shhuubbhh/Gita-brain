export type Language = 'en' | 'hi';

export interface Translations {
  // Navigation & Drawer
  navHome: string;
  navJournal: string;
  navJapa: string;
  navExplore: string;
  drawerTitle: string;
  drawerSubtitle: string;
  drawerHome: string;
  drawerJournal: string;
  drawerJapa: string;
  drawerExplore: string;
  drawerSettings: string;
  drawerPrivacy: string;
  drawerSplash: string;
  drawerResetIntro: string;
  drawerQuote: string;
  drawerQuoteRef: string;

  // Splash Screen
  splashTitle: string;
  splashSubtitle: string;
  splashEnterAria: string;

  // Home Screen
  greetingMorning: string;
  greetingMorningSub: string;
  greetingAfternoon: string;
  greetingAfternoonSub: string;
  greetingEvening: string;
  greetingEveningSub: string;
  greetingNight: string;
  greetingNightSub: string;
  feelingsTitle: string;
  feelingsSubtitle: string;
  searchPlaceholder: string;
  seekGuidance: string;
  suggestedInquiries: string;
  verifiedTeaching: string;
  bhagavadGita: string;
  saveTeaching: string;
  saved: string;
  reflectInJournal: string;
  aiInterpretation: string;
  practicalApplication: string;
  reflectionQuestion: string;
  chapter: string;
  verse: string;
  findingWisdom: string;

  // Moods
  moodAnxious: string;
  moodPeaceful: string;
  moodConfused: string;
  moodGrateful: string;
  moodAngry: string;
  moodSad: string;
  moodSeeking: string;

  // Japa Screen
  japaTitle: string;
  japaSubtitle: string;
  progressTitle: string;
  tapToCount: string;
  reset: string;
  completedTitle: string;
  completedSubtitle: string;
  viewProgress: string;
  startAgain: string;
  done: string;
  malaProgress: string;
  totalMalas: string;
  repetitions: string;
  history: string;
  noJapaRecorded: string;
  noJapaDesc: string;
  back: string;
  soundOn: string;
  soundMuted: string;
  malaWordSingular: string;
  malaWordPlural: string;

  // Journal Screen
  journalTitle: string;
  journalTagline: string;
  todayLabel: string;
  startTodayReflection: string;
  calendarTab: string;
  historyTab: string;
  dayStreak: string;
  totalEntries: string;
  howWasDay: string;
  selectFeeling: string;
  writePlaceholder: string;
  saveReflection: string;
  cancel: string;
  validationError: string;
  reflectionSaved: string;
  calendarTitle: string;
  calendarDesc: string;
  thisMonthTeaching: string;
  historyTitle: string;
  noReflectionsSaved: string;
  onlyTodayAllowed: string;

  // Explore Screen
  exploreTitle: string;
  comingSoonTitle: string;
  comingSoonSubtitle: string;
  underDevelopment: string;

  // Settings Screen
  settingsTitle: string;
  appearanceSection: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  languageLabel: string;
  languageDesc: string;
  notificationsSection: string;
  dailyShlokLabel: string;
  dailyShlokDesc: string;
  reflectionReminderLabel: string;
  reflectionReminderDesc: string;
  soundSection: string;
  japaSoundsLabel: string;
  privacySection: string;
  privacyPolicyLabel: string;
  journalEntriesLabel: string;
  savedTeachingsLabel: string;
  storedOnDevice: string;
  clearButton: string;
  aboutSection: string;
  aboutLabel: string;
  appVersionLabel: string;
  clearJournalTitle: string;
  clearJournalDesc: string;
  clearTeachingsTitle: string;
  clearTeachingsDesc: string;
  clearAllConfirm: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    navHome: "Home",
    navJournal: "Journal",
    navJapa: "Japa",
    navExplore: "Explore",
    drawerTitle: "Maargdarshan",
    drawerSubtitle: "Eternal Gita Wisdom",
    drawerHome: "Home",
    drawerJournal: "Daily Journal",
    drawerJapa: "Japa Mala",
    drawerExplore: "Explore Wisdom",
    drawerSettings: "Settings",
    drawerPrivacy: "Privacy & Data Protection",
    drawerSplash: "View Splash Screen",
    drawerResetIntro: "Reset intro",
    drawerQuote: '"Yoga is the journey of the self, through the self, to the self."',
    drawerQuoteRef: "Bhagavad Gita 6.20",

    splashTitle: "Maargdarshan",
    splashSubtitle: "Find perspective through the wisdom of the Gita.",
    splashEnterAria: "Enter Maargdarshan",

    greetingMorning: "Good morning",
    greetingMorningSub: "Rise with mindful perspective and inner clarity.",
    greetingAfternoon: "Good afternoon",
    greetingAfternoonSub: "Pause, breathe, and find balance amidst your tasks.",
    greetingEvening: "Good evening",
    greetingEveningSub: "Unwind, center yourself, and reflect upon your day.",
    greetingNight: "Good night",
    greetingNightSub: "Rest in calm stillness and surrender your worries.",
    feelingsTitle: "How are you feeling today?",
    feelingsSubtitle: "Select an emotion or express what is on your mind to find perspective from the Gita.",
    searchPlaceholder: "What is on your mind? (e.g. anxiety, purpose, decision)",
    seekGuidance: "Seek Guidance",
    suggestedInquiries: "Suggested Inquiries",
    verifiedTeaching: "VERIFIED TEACHING",
    bhagavadGita: "Bhagavad Gita",
    saveTeaching: "Save Teaching",
    saved: "Saved",
    reflectInJournal: "Reflect in Journal",
    aiInterpretation: "AI Interpretation",
    practicalApplication: "Practical Application",
    reflectionQuestion: "Reflection Question",
    chapter: "Chapter",
    verse: "Verse",
    findingWisdom: "Finding Gita guidance...",

    moodAnxious: "Anxious",
    moodPeaceful: "Peaceful",
    moodConfused: "Confused",
    moodGrateful: "Grateful",
    moodAngry: "Angry",
    moodSad: "Sad",
    moodSeeking: "Seeking",

    japaTitle: "Japa / Maala",
    japaSubtitle: "108 repetitions · A meditative practice",
    progressTitle: "Progress",
    tapToCount: "Tap to count",
    reset: "Reset",
    completedTitle: "108 repetitions complete",
    completedSubtitle: "Take a quiet moment before you continue.",
    viewProgress: "View progress",
    startAgain: "Start Again",
    done: "Done",
    malaProgress: "Maala Progress",
    totalMalas: "TOTAL MALAS",
    repetitions: "REPETITIONS",
    history: "HISTORY",
    noJapaRecorded: "No Japa malas recorded today",
    noJapaDesc: "Complete your first round of 108 repetitions to begin recording your daily progress.",
    back: "Back",
    soundOn: "Sound: ON 🔔",
    soundMuted: "Sound: MUTED 🔇",
    malaWordSingular: "Mala",
    malaWordPlural: "Malas",

    journalTitle: "Daily Reflection",
    journalTagline: "A quiet space to reflect on the day through the lens of timeless wisdom.",
    todayLabel: "Today",
    startTodayReflection: "START TODAY'S REFLECTION",
    calendarTab: "Calendar",
    historyTab: "History",
    dayStreak: "Day Streak",
    totalEntries: "Total Entries",
    howWasDay: "How was your day?",
    selectFeeling: "Select your predominant feeling",
    writePlaceholder: "Write your reflection here. What taught you something today? What are you grateful for?",
    saveReflection: "Save Reflection",
    cancel: "Cancel",
    validationError: "Please write a few words about your day before saving.",
    reflectionSaved: "Reflection saved to your journal 🪷",
    calendarTitle: "Reflection Calendar",
    calendarDesc: "Track your daily consistency",
    thisMonthTeaching: "THIS MONTH'S TEACHING",
    historyTitle: "Reflection History",
    noReflectionsSaved: "No reflections written yet.",
    onlyTodayAllowed: "Journaling is available for today only.",

    exploreTitle: "Explore",
    comingSoonTitle: "Coming Soon",
    comingSoonSubtitle: "We are crafting a deeper exploration of Bhagavad Gita teachings, audio recitations, and guided chapter wisdom.",
    underDevelopment: "In Development",

    settingsTitle: "Settings",
    appearanceSection: "APPEARANCE",
    themeLabel: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    languageLabel: "Language",
    languageDesc: "Content language preference",
    notificationsSection: "NOTIFICATIONS",
    dailyShlokLabel: "Daily Shlok",
    dailyShlokDesc: "A teaching each morning",
    reflectionReminderLabel: "Reflection reminder",
    reflectionReminderDesc: "Gentle nudge to journal",
    soundSection: "SOUND",
    japaSoundsLabel: "Japa sounds",
    privacySection: "PRIVACY & DATA",
    privacyPolicyLabel: "Privacy policy",
    journalEntriesLabel: "Journal entries",
    savedTeachingsLabel: "Saved teachings",
    storedOnDevice: "stored on this device",
    clearButton: "Clear",
    aboutSection: "ABOUT",
    aboutLabel: "About Maargdarshan",
    appVersionLabel: "App version",
    clearJournalTitle: "Clear All Journal Entries?",
    clearJournalDesc: "This will permanently delete all written reflections stored locally on this device.",
    clearTeachingsTitle: "Clear Saved Teachings?",
    clearTeachingsDesc: "This will permanently delete all bookmarked Gita verses and teachings.",
    clearAllConfirm: "Clear All"
  },

  hi: {
    navHome: "होम",
    navJournal: "चिंतन",
    navJapa: "जप",
    navExplore: "अन्वेषण",
    drawerTitle: "मार्गदर्शन",
    drawerSubtitle: "शाश्वत गीता ज्ञान",
    drawerHome: "होम",
    drawerJournal: "दैनिक चिंतन",
    drawerJapa: "जप माला",
    drawerExplore: "ज्ञान अन्वेषण",
    drawerSettings: "सेटिंग्स",
    drawerPrivacy: "गोपनीयता और डेटा",
    drawerSplash: "प्रारंभिक स्क्रीन देखें",
    drawerResetIntro: "रीसेट करें",
    drawerQuote: '"योग स्वयं की, स्वयं के माध्यम से, स्वयं तक की यात्रा है।"',
    drawerQuoteRef: "भगवद्गीता ६.२०",

    splashTitle: "मार्गदर्शन",
    splashSubtitle: "गीता के शाश्वत ज्ञान से जीवन में स्पष्टता और शांति पाएं।",
    splashEnterAria: "मार्गदर्शन में प्रवेश करें",

    greetingMorning: "शुभ प्रभात",
    greetingMorningSub: "सकारात्मक दृष्टिकोण और मानसिक शांति के साथ दिन प्रारंभ करें।",
    greetingAfternoon: "शुभ दोपहर",
    greetingAfternoonSub: "ठहरें, श्वास लें और अपने कार्यों में संतुलन पाएं।",
    greetingEvening: "शुभ संध्या",
    greetingEveningSub: "विश्राम करें, शांत हों और अपने दिन का अवलोकन करें।",
    greetingNight: "शुभ रात्रि",
    greetingNightSub: "आंतरिक शांति में विश्राम करें और अपनी चिंताओं को समर्पित करें।",
    feelingsTitle: "आज आप कैसा महसूस कर रहे हैं?",
    feelingsSubtitle: "श्रीमद्भगवद्गीता से मार्गदर्शन पाने के लिए अपनी भावना चुनें या विचार लिखें।",
    searchPlaceholder: "आपके मन में क्या चल रहा है? (जैसे चिंता, कर्तव्य, निर्णय)",
    seekGuidance: "मार्गदर्शन पाएं",
    suggestedInquiries: "सुझाए गए प्रश्न",
    verifiedTeaching: "प्रामाणिक उपदेश",
    bhagavadGita: "श्रीमद्भगवद्गीता",
    saveTeaching: "उपदेश सहेजें",
    saved: "सहेजा गया",
    reflectInJournal: "चिंतन में जोड़ें",
    aiInterpretation: "व्याख्या एवं मार्गदर्शन",
    practicalApplication: "व्यावहारिक अनुप्रयोग",
    reflectionQuestion: "आत्म-चिंतन प्रश्न",
    chapter: "अध्याय",
    verse: "श्लोक",
    findingWisdom: "गीता ज्ञान खोज रहे हैं...",

    moodAnxious: "चिंतित",
    moodPeaceful: "शांत",
    moodConfused: "भ्रमित",
    moodGrateful: "कृतज्ञ",
    moodAngry: "क्रोधित",
    moodSad: "उदास",
    moodSeeking: "जिज्ञासु",

    japaTitle: "जप / माला",
    japaSubtitle: "१०८ पुनरावृत्ति · एक ध्यान साधना",
    progressTitle: "प्रगति",
    tapToCount: "गिनने के लिए स्पर्श करें",
    reset: "रीसेट",
    completedTitle: "१०८ जप पूर्ण हुए",
    completedSubtitle: "आगे बढ़ने से पूर्व कुछ क्षण शांत मन से बैठें।",
    viewProgress: "प्रगति देखें",
    startAgain: "पुनः प्रारंभ करें",
    done: "पूर्ण",
    malaProgress: "माला प्रगति",
    totalMalas: "कुल मालाएं",
    repetitions: "कुल पुनरावृत्ति",
    history: "इतिहास",
    noJapaRecorded: "आज कोई जप माला दर्ज नहीं है",
    noJapaDesc: "अपनी दैनिक प्रगति दर्ज करने के लिए १०८ पुनरावृत्तियों का अपना पहला चक्र पूरा करें।",
    back: "पीछे",
    soundOn: "ध्वनि: चालू 🔔",
    soundMuted: "ध्वनि: म्यूट 🔇",
    malaWordSingular: "माला",
    malaWordPlural: "मालाएं",

    journalTitle: "दैनिक चिंतन",
    journalTagline: "शाश्वत ज्ञान के आलोक में दिन का अवलोकन करने का एक शांत स्थान।",
    todayLabel: "आज",
    startTodayReflection: "आज का चिंतन प्रारंभ करें",
    calendarTab: "कैलेंडर",
    historyTab: "इतिहास",
    dayStreak: "दिन की निरंतरता",
    totalEntries: "कुल प्रविष्टियां",
    howWasDay: "आज का दिन कैसा रहा?",
    selectFeeling: "अपनी प्रमुख भावना चुनें",
    writePlaceholder: "अपने विचार और चिंतन यहाँ लिखें। आज आपने क्या नया सीखा? आप किसके प्रति आभारी हैं?",
    saveReflection: "चिंतन सहेजें",
    cancel: "रद्द करें",
    validationError: "कृपया सहेजने से पहले अपने दिन के बारे में कुछ शब्द लिखें।",
    reflectionSaved: "चिंतन आपकी डायरी में सहेज लिया गया 🪷",
    calendarTitle: "चिंतन कैलेंडर",
    calendarDesc: "अपनी दैनिक नियमितता देखें",
    thisMonthTeaching: "इस माह का पावन उपदेश",
    historyTitle: "चिंतन इतिहास",
    noReflectionsSaved: "अभी तक कोई चिंतन नहीं लिखा गया है।",
    onlyTodayAllowed: "चिंतन केवल आज के दिन के लिए ही लिखा जा सकता है।",

    exploreTitle: "अन्वेषण",
    comingSoonTitle: "शीघ्र आ रहा है",
    comingSoonSubtitle: "हम भगवद्गीता के उपदेशों, श्लोक पाठ और अध्यायवार अध्ययन का एक गहन अनुभव तैयार कर रहे हैं।",
    underDevelopment: "निर्माणाधीन",

    settingsTitle: "सेटिंग्स",
    appearanceSection: "दिखावट",
    themeLabel: "थीम",
    themeLight: "लाइट",
    themeDark: "डार्क",
    languageLabel: "भाषा",
    languageDesc: "सामग्री भाषा प्राथमिकता",
    notificationsSection: "सूचनाएं",
    dailyShlokLabel: "दैनिक श्लोक",
    dailyShlokDesc: "प्रत्येक सुबह एक प्रेरक श्लोक",
    reflectionReminderLabel: "चिंतन अनुस्मारक",
    reflectionReminderDesc: "चिंतन लिखने की याद दिलाना",
    soundSection: "ध्वनि",
    japaSoundsLabel: "जप ध्वनि",
    privacySection: "गोपनीयता एवं डेटा",
    privacyPolicyLabel: "गोपनीयता नीति",
    journalEntriesLabel: "चिंतन प्रविष्टियां",
    savedTeachingsLabel: "सहेजे गए उपदेश",
    storedOnDevice: "इस डिवाइस पर सुरक्षित",
    clearButton: "हटाएं",
    aboutSection: "के बारे में",
    aboutLabel: "मार्गदर्शन के बारे में",
    appVersionLabel: "ऐप संस्करण",
    clearJournalTitle: "क्या सभी चिंतन प्रविष्टियां हटाएं?",
    clearJournalDesc: "यह इस डिवाइस पर संग्रहीत सभी लिखित चिंतन स्थायी रूप से हटा देगा।",
    clearTeachingsTitle: "क्या सहेजे गए उपदेश हटाएं?",
    clearTeachingsDesc: "यह सभी बुकमार्क किए गए गीता श्लोक और उपदेश स्थायी रूप से हटा देगा।",
    clearAllConfirm: "सब हटाएं"
  }
};
