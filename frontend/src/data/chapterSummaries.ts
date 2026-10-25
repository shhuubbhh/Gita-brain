// Auto-generated from authoritative data/gita_chapters.json, data/chapters.json, and data/processed/verses.json
// DO NOT MODIFY DIRECTLY. Run scripts/build_chapter_summaries.py to regenerate.

export interface ChapterSummary {
  chapter: number;
  sanskrit_name: string;
  sanskrit_name_translit: string;
  english_name: string;
  hindi_name: string;
  verse_count: number;
  summary: {
    en: string;
    hi: string;
  };
  key_teachings: {
    en: string[];
    hi: string[];
  };
  themes: {
    en: string[];
    hi: string[];
  };
  practical_application: {
    en: string;
    hi: string;
  };
  important_verses: string[];
}

export interface CanonicalVerseDetail {
  id: string;
  chapter: number;
  verse: number;
  reference: string;
  sanskrit: string;
  transliteration: string;
  english_translation: string;
  hindi_translation?: string;
  has_hindi_translation: boolean;
}

export const VERSE_TRANSLATION_SOURCE = {
  "name": "Hansi Gita Bhawan Trust",
  "url": "https://heritage.iitk.ac.in/SBG",
  "attribution_required": true,
  "translator": "Swami Ramsukhdas",
  "work": "Śrīmadbhagavadgītā — Sādhaka Sañjīvanī",
  "platform": "Heritage IITKanpur (Carried forward from Gita Supersite, IIT Kanpur)",
  "license_notice": "Heritage Content Access Licence (HCAL-1.1). Stored offline for non-commercial educational display in Margdarshan Explore section with attribution."
};

export const CHAPTER_SUMMARIES: ChapterSummary[] = [
  {
    "chapter": 1,
    "sanskrit_name": "अर्जुनविषादयोग",
    "sanskrit_name_translit": "Arjuna Viṣāda Yoga",
    "english_name": "The Yoga of Arjuna’s Despondency",
    "hindi_name": "अर्जुन के विषाद का योग",
    "verse_count": 47,
    "summary": {
      "en": "At Kurukshetra, Arjuna asks Krishna to place the chariot between the armies. Seeing teachers, relatives, and friends on both sides, he is overcome by grief and moral uncertainty. He fears that victory will come at the cost of family bonds and social responsibilities. His body trembles, his resolve collapses, and he puts down his bow. Krishna’s full teaching has not yet begun; the chapter establishes the crisis that makes guidance necessary. Arjuna’s distress shows how emotion, attachment, and fear can complicate judgment. His willingness to admit confusion and seek help becomes the starting point for the dialogue.",
      "hi": "कुरुक्षेत्र में अर्जुन कृष्ण से रथ को दोनों सेनाओं के बीच ले जाने को कहते हैं। अपने गुरुजनों, संबंधियों और मित्रों को दोनों ओर देखकर वे शोक और नैतिक दुविधा से भर जाते हैं। उन्हें लगता है कि विजय की कीमत परिवार और सामाजिक जिम्मेदारियों का विनाश होगी। उनका शरीर काँपता है, साहस टूटता है और वे धनुष रख देते हैं। कृष्ण का विस्तृत उपदेश अभी शुरू नहीं होता; यह अध्याय उस संकट को सामने रखता है जिसके कारण मार्गदर्शन आवश्यक बनता है। अर्जुन का दुःख दिखाता है कि भावना, आसक्ति और भय निर्णय को जटिल बना सकते हैं। अपने भ्रम को स्वीकार करना और सहायता माँगना संवाद की शुरुआत बनता है।"
    },
    "key_teachings": {
      "en": [
        "A moral dilemma can unsettle even a capable person.",
        "Distinguish immediate emotion from considered judgment.",
        "Admitting confusion can begin a learning process.",
        "Consider the wider consequences of a decision."
      ],
      "hi": [
        "नैतिक दुविधा सक्षम व्यक्ति को भी विचलित कर सकती है।",
        "तत्काल भावना और सोच-विचार से बने निर्णय में अंतर करें।",
        "भ्रम स्वीकार करना सीखने की शुरुआत हो सकता है।",
        "निर्णय के व्यापक परिणामों पर विचार करें।"
      ]
    },
    "themes": {
      "en": [
        "Grief and moral conflict",
        "Duty and relationships",
        "Seeking guidance"
      ],
      "hi": [
        "शोक और नैतिक संघर्ष",
        "कर्तव्य और संबंध",
        "मार्गदर्शन की खोज"
      ]
    },
    "practical_application": {
      "en": "Pause during a difficult choice and identify the values, responsibilities, and people affected.",
      "hi": "कठिन निर्णय में रुककर उससे जुड़े मूल्यों, जिम्मेदारियों और प्रभावित लोगों पर विचार करें।"
    },
    "important_verses": [
      "BG_1_28",
      "BG_1_31",
      "BG_1_47"
    ]
  },
  {
    "chapter": 2,
    "sanskrit_name": "साङ्ख्ययोग",
    "sanskrit_name_translit": "Sāṅkhya Yoga",
    "english_name": "The Yoga of Knowledge",
    "hindi_name": "ज्ञान योग",
    "verse_count": 72,
    "summary": {
      "en": "Krishna begins teaching Arjuna, explaining the distinction between the changing body and the enduring self. He urges Arjuna to understand duty without being ruled by grief or fear. Krishna introduces disciplined action: a person can choose and perform an action but cannot fully control its results, so attachment to outcomes should not dominate the mind. He describes the steady-minded person, who meets pleasure and pain without being swept away. Knowledge, duty, self-mastery, and equanimity are connected rather than separate pursuits. The chapter lays a foundation for the Gita’s later teachings and presents steadiness as something cultivated through practice and discernment.",
      "hi": "कृष्ण अर्जुन को उपदेश देते हुए बदलते शरीर और स्थायी आत्मा का अंतर समझाते हैं। वे शोक और भय के वश में हुए बिना कर्तव्य निभाने को कहते हैं। कृष्ण अनुशासित कर्म का विचार प्रस्तुत करते हैं: मनुष्य कर्म चुन और कर सकता है, लेकिन परिणामों पर उसका पूर्ण नियंत्रण नहीं होता; इसलिए फल की आसक्ति मन पर हावी न हो। वे स्थितप्रज्ञ व्यक्ति का वर्णन करते हैं, जो सुख-दुःख में संतुलित रहता है। ज्ञान, कर्तव्य, आत्म-संयम और समभाव परस्पर जुड़े हैं। यह अध्याय आगे की शिक्षाओं की बुनियाद रखता है और बताता है कि स्थिरता अभ्यास तथा विवेक से विकसित होती है।"
    },
    "key_teachings": {
      "en": [
        "Distinguish the enduring self from changing conditions.",
        "Focus on action without assuming full control over results.",
        "Practice steadiness through pleasure, pain, gain, and loss.",
        "Use discernment rather than letting fear dictate choices."
      ],
      "hi": [
        "स्थायी आत्मा और बदलती परिस्थितियों में अंतर समझें।",
        "परिणामों पर पूर्ण नियंत्रण माने बिना कर्म पर ध्यान दें।",
        "सुख-दुःख और लाभ-हानि में संतुलन का अभ्यास करें।",
        "भय के बजाय विवेक से निर्णय लें।"
      ]
    },
    "themes": {
      "en": [
        "Self and body",
        "Duty and action",
        "Equanimity",
        "Steady wisdom"
      ],
      "hi": [
        "आत्मा और शरीर",
        "कर्तव्य और कर्म",
        "समभाव",
        "स्थिर बुद्धि"
      ]
    },
    "practical_application": {
      "en": "Choose one responsibility today and focus on doing it carefully instead of rehearsing every possible outcome.",
      "hi": "आज एक जिम्मेदारी चुनें और हर संभावित परिणाम की चिंता के बजाय उसे सावधानी से पूरा करें।"
    },
    "important_verses": [
      "BG_2_14",
      "BG_2_47",
      "BG_2_48",
      "BG_2_55"
    ]
  },
  {
    "chapter": 3,
    "sanskrit_name": "कर्मयोग",
    "sanskrit_name_translit": "Karma Yoga",
    "english_name": "The Yoga of Action",
    "hindi_name": "कर्म योग",
    "verse_count": 43,
    "summary": {
      "en": "Arjuna asks why action is necessary if knowledge is so valuable. Krishna explains that no one can remain entirely inactive; nature continually moves people toward action. The key question is how and why one acts. Work done as responsibility, without selfish attachment, can support inner freedom and the welfare of others. Krishna presents action as part of mutual contribution rather than merely a private pursuit of reward. He also explains that desire and anger can cloud judgment and should be understood and disciplined. The chapter does not advise abandoning responsibilities; it asks people to act with a wider purpose, a clear mind, and less possessiveness about credit or results.",
      "hi": "अर्जुन पूछते हैं कि यदि ज्ञान महत्त्वपूर्ण है, तो कर्म क्यों आवश्यक है। कृष्ण समझाते हैं कि कोई पूरी तरह निष्क्रिय नहीं रह सकता; प्रकृति मनुष्य को कर्म की ओर ले जाती है। महत्त्वपूर्ण प्रश्न यह है कि कर्म किस भावना और उद्देश्य से किया जाता है। स्वार्थपूर्ण आसक्ति के बिना जिम्मेदारी से किया गया कार्य आंतरिक स्वतंत्रता और दूसरों के कल्याण में सहायक हो सकता है। कर्म को केवल निजी लाभ नहीं, पारस्परिक योगदान का हिस्सा बताया गया है। कृष्ण बताते हैं कि कामना और क्रोध विवेक को धुँधला कर सकते हैं। यह अध्याय जिम्मेदारियों से भागने के बजाय व्यापक उद्देश्य और स्पष्ट मन से उन्हें निभाने की शिक्षा देता है।"
    },
    "key_teachings": {
      "en": [
        "Act consciously; complete inactivity is unrealistic.",
        "Treat work as contribution, not merely a route to reward.",
        "Desire and anger can distort judgment.",
        "Responsible action can benefit the wider community."
      ],
      "hi": [
        "निष्क्रिय रहने के बजाय सजगता से कर्म करें।",
        "काम को केवल पुरस्कार नहीं, योगदान के रूप में देखें।",
        "कामना और क्रोध निर्णय क्षमता बिगाड़ सकते हैं।",
        "जिम्मेदार कर्म समाज के हित में भी हो सकता है।"
      ]
    },
    "themes": {
      "en": [
        "Selfless action",
        "Duty",
        "Mutual responsibility",
        "Desire and anger"
      ],
      "hi": [
        "निष्काम कर्म",
        "कर्तव्य",
        "पारस्परिक जिम्मेदारी",
        "कामना और क्रोध"
      ]
    },
    "practical_application": {
      "en": "Do one task that benefits someone else without making praise your main goal.",
      "hi": "ऐसा एक काम करें जिससे किसी और को लाभ हो, और प्रशंसा को मुख्य उद्देश्य न बनाएँ।"
    },
    "important_verses": [
      "BG_3_8",
      "BG_3_19",
      "BG_3_30",
      "BG_3_37"
    ]
  },
  {
    "chapter": 4,
    "sanskrit_name": "ज्ञानकर्मसंन्यासयोग",
    "sanskrit_name_translit": "Jñāna Karma Sannyāsa Yoga",
    "english_name": "The Yoga of Knowledge and Renunciation of Action",
    "hindi_name": "ज्ञान और कर्म-संन्यास योग",
    "verse_count": 42,
    "summary": {
      "en": "Krishna describes the continuity of spiritual teaching and explains divine descent as a response to the decline of dharma. He explores how action, inaction, knowledge, and renunciation are subtler than they first appear. The wise learn to act without egoistic ownership and understand the wider meaning of duty. Different disciplined practices are described, while knowledge is emphasized as a means of clearing confusion and transforming how action is understood. The chapter encourages sincere learning from a capable teacher, asking questions with humility, and applying insight in life. Wisdom is not merely a collection of facts; it changes the relationship between the self, action, and responsibility.",
      "hi": "कृष्ण आध्यात्मिक ज्ञान की परंपरा का वर्णन करते हैं और धर्म में गिरावट आने पर उसके पुनर्स्थापन के लिए दिव्य अवतरण की बात बताते हैं। वे समझाते हैं कि कर्म, अकर्म, ज्ञान और संन्यास के अर्थ सूक्ष्म हैं। ज्ञानी व्यक्ति अहंकारपूर्ण स्वामित्व छोड़े हुए कर्म करना और कर्तव्य का व्यापक अर्थ समझना सीखता है। विभिन्न अनुशासित अभ्यासों का उल्लेख है, जबकि ज्ञान को भ्रम दूर करने और कर्म के प्रति दृष्टि बदलने वाला साधन बताया गया है। यह अध्याय योग्य शिक्षक से विनम्रता से सीखने, प्रश्न पूछने और समझ को जीवन में लागू करने को प्रेरित करता है। ज्ञान केवल तथ्यों का संग्रह नहीं; वह आत्मा, कर्म और जिम्मेदारी के संबंध को बदलता है।"
    },
    "key_teachings": {
      "en": [
        "Seek understanding that transforms conduct, not information alone.",
        "Learn with humility, sincere questions, and discernment.",
        "Do not treat ego as the sole owner of every action.",
        "Knowledge can clarify duty and action."
      ],
      "hi": [
        "ऐसी समझ खोजें जो आचरण बदले, केवल जानकारी न बढ़ाए।",
        "विनम्रता, सच्चे प्रश्न और विवेक से सीखें।",
        "हर कर्म का एकमात्र कर्ता अहंकार को न मानें।",
        "ज्ञान कर्तव्य और कर्म से जुड़े भ्रम को स्पष्ट कर सकता है।"
      ]
    },
    "themes": {
      "en": [
        "Restoration of dharma",
        "Knowledge and action",
        "Learning",
        "Freedom from ego"
      ],
      "hi": [
        "धर्म की पुनर्स्थापना",
        "ज्ञान और कर्म",
        "सीखना",
        "अहंकार से मुक्ति"
      ]
    },
    "practical_application": {
      "en": "Ask a trusted, knowledgeable person a sincere question about a responsibility that confuses you.",
      "hi": "जिस जिम्मेदारी को लेकर उलझन है, उसके बारे में किसी विश्वसनीय जानकार से सच्चा प्रश्न पूछें।"
    },
    "important_verses": [
      "BG_4_7",
      "BG_4_8",
      "BG_4_18",
      "BG_4_34"
    ]
  },
  {
    "chapter": 5,
    "sanskrit_name": "कर्मसंन्यासयोग",
    "sanskrit_name_translit": "Karma Sannyāsa Yoga",
    "english_name": "The Yoga of Renunciation",
    "hindi_name": "कर्म-संन्यास योग",
    "verse_count": 29,
    "summary": {
      "en": "Arjuna asks whether renouncing action or performing action is better. Krishna explains that both can lead toward freedom, but selfless action is often more accessible when done with discipline and without attachment. True renunciation is not merely abandoning duties; it includes releasing possessiveness, hatred, and the belief that identity depends on results. The wise look beyond superficial distinctions and approach others with equal regard. Inner peace grows when actions are done without egoistic grasping and the mind is not constantly pulled by desire. The chapter joins practical engagement with inner detachment: a person can participate in the world while cultivating calm and responsibility.",
      "hi": "अर्जुन पूछते हैं कि कर्म का त्याग बेहतर है या कर्म करते रहना। कृष्ण बताते हैं कि दोनों मार्ग मुक्ति की ओर ले जा सकते हैं, लेकिन अनुशासन और अनासक्ति से किया गया निष्काम कर्म कई लोगों के लिए अधिक सहज है। सच्चा संन्यास केवल जिम्मेदारियाँ छोड़ना नहीं; इसमें स्वामित्व, द्वेष और परिणामों से अपनी पहचान जोड़ने की आदत छोड़ना भी शामिल है। विवेकी व्यक्ति सतही भेदों से आगे देखकर दूसरों के प्रति समान दृष्टि रखता है। जब कर्म अहंकारपूर्ण पकड़ के बिना होते हैं और मन इच्छा के खिंचाव में नहीं बहता, तब शांति बढ़ती है। संसार में सक्रिय रहते हुए भी आंतरिक अनासक्ति और जिम्मेदारी विकसित की जा सकती है।"
    },
    "key_teachings": {
      "en": [
        "Renunciation is an inner release, not simply withdrawal.",
        "Selfless action can unite responsibility with inner freedom.",
        "Treat people with fairness beyond outward status.",
        "Peace grows when desire does not dictate every action."
      ],
      "hi": [
        "संन्यास आंतरिक पकड़ छोड़ना है, केवल पीछे हटना नहीं।",
        "निष्काम कर्म जिम्मेदारी और आंतरिक स्वतंत्रता जोड़ सकता है।",
        "बाहरी स्थिति से परे लोगों के साथ निष्पक्ष रहें।",
        "इच्छा के दबाव से मुक्त कर्म शांति बढ़ा सकता है।"
      ]
    },
    "themes": {
      "en": [
        "Action and renunciation",
        "Detachment",
        "Equal vision",
        "Peace"
      ],
      "hi": [
        "कर्म और संन्यास",
        "अनासक्ति",
        "समदृष्टि",
        "शांति"
      ]
    },
    "practical_application": {
      "en": "Meet your responsibilities while loosening one expectation or resentment today.",
      "hi": "अपनी जिम्मेदारियाँ निभाते हुए आज एक अपेक्षा या नाराज़गी की पकड़ ढीली करें।"
    },
    "important_verses": [
      "BG_5_2",
      "BG_5_10",
      "BG_5_18",
      "BG_5_29"
    ]
  },
  {
    "chapter": 6,
    "sanskrit_name": "ध्यानयोग / आत्मसंयमयोग",
    "sanskrit_name_translit": "Dhyāna Yoga / Ātma-Saṃyama Yoga",
    "english_name": "The Yoga of Meditation and Self-Mastery",
    "hindi_name": "ध्यान और आत्म-संयम योग",
    "verse_count": 47,
    "summary": {
      "en": "Krishna presents disciplined action and meditation as complementary. Steadiness grows through moderate habits, regulated effort, and trained attention rather than excess or neglect. Meditation calls for a suitable setting, a stable posture, and repeatedly returning the wandering mind to its focus. Arjuna observes that the mind is difficult to control; Krishna acknowledges this and points to practice and detachment. He also reassures that sincere effort is not wasted even if perfection is not reached immediately. The guidance is practical: progress comes through patience, consistency, and balanced living, not self-punishment or demands for instant mastery.",
      "hi": "कृष्ण अनुशासित कर्म और ध्यान को पूरक बताते हैं। संतुलित आदतों, नियमित प्रयास और प्रशिक्षित ध्यान से स्थिरता बढ़ती है; अति और उपेक्षा दोनों से बचना चाहिए। ध्यान के लिए उपयुक्त स्थान, स्थिर आसन और भटकते मन को बार-बार चुने हुए विषय पर लौटाना आवश्यक है। अर्जुन कहते हैं कि मन को नियंत्रित करना कठिन है; कृष्ण इस कठिनाई को स्वीकार कर अभ्यास और वैराग्य का मार्ग बताते हैं। वे आश्वासन देते हैं कि सच्चा प्रयास व्यर्थ नहीं जाता, भले ही तुरंत पूर्णता न मिले। प्रगति धैर्य, निरंतरता और संतुलित जीवन से आती है, आत्म-दंड या तुरंत सिद्धि की अपेक्षा से नहीं।"
    },
    "key_teachings": {
      "en": [
        "Return attention gently to the chosen focus.",
        "Balance sleep, food, activity, and rest.",
        "Practice and detachment steady a restless mind.",
        "Sincere effort matters even when progress is gradual."
      ],
      "hi": [
        "ध्यान को शांतिपूर्वक चुने हुए विषय पर लौटाएँ।",
        "नींद, भोजन, गतिविधि और विश्राम में संतुलन रखें।",
        "अभ्यास और वैराग्य चंचल मन को स्थिर करते हैं।",
        "धीमी प्रगति में भी सच्चा प्रयास मूल्यवान है।"
      ]
    },
    "themes": {
      "en": [
        "Meditation",
        "Self-discipline",
        "Balanced living",
        "Persistence"
      ],
      "hi": [
        "ध्यान",
        "आत्म-अनुशासन",
        "संतुलित जीवन",
        "निरंतर प्रयास"
      ]
    },
    "practical_application": {
      "en": "Sit quietly for five minutes; when attention wanders, notice it and return to your breath.",
      "hi": "पाँच मिनट शांत बैठें; ध्यान भटके तो उसे पहचानकर साँस पर लौटें।"
    },
    "important_verses": [
      "BG_6_5",
      "BG_6_17",
      "BG_6_26",
      "BG_6_35"
    ]
  },
  {
    "chapter": 7,
    "sanskrit_name": "ज्ञानविज्ञानयोग",
    "sanskrit_name_translit": "Jñāna Vijñāna Yoga",
    "english_name": "The Yoga of Knowledge and Realization",
    "hindi_name": "ज्ञान-विज्ञान योग",
    "verse_count": 30,
    "summary": {
      "en": "Krishna joins knowledge of the divine with realization through lived understanding. He describes material elements and consciousness, presenting existence as dependent on a deeper source. People approach the divine from different experiences: distress, curiosity, practical needs, or the search for wisdom. Yet attachment and the qualities of nature can cloud perception, making deeper reality difficult to recognize. The chapter encourages looking beyond appearances and reflecting on what sustains life. Its purpose is not merely to collect religious ideas, but to connect reflection, devotion, and experience so that understanding of the world becomes more integrated.",
      "hi": "कृष्ण दिव्य ज्ञान को जीवन-अनुभव से प्राप्त अनुभूति के साथ जोड़ते हैं। वे भौतिक तत्त्वों और चेतना का वर्णन करते हुए अस्तित्व को एक गहरे आधार पर निर्भर बताते हैं। लोग दुःख, जिज्ञासा, व्यावहारिक जरूरतों या ज्ञान की खोज जैसे अलग-अलग कारणों से ईश्वर की ओर आते हैं। आसक्ति और प्रकृति के गुण दृष्टि को ढक सकते हैं, जिससे गहरी वास्तविकता पहचानना कठिन हो जाता है। यह अध्याय बाहरी रूपों से आगे देखने और जीवन को सहारा देने वाले आधार पर विचार करने को प्रेरित करता है। उद्देश्य केवल धार्मिक विचार जमा करना नहीं, बल्कि चिंतन, भक्ति और अनुभव को जोड़कर संसार की अधिक समग्र समझ विकसित करना है।"
    },
    "key_teachings": {
      "en": [
        "Knowledge deepens when joined with lived realization.",
        "People begin inquiry from different needs and experiences.",
        "Look beyond appearances to what sustains life.",
        "Attachment can narrow perception."
      ],
      "hi": [
        "जीवन-अनुभव से जुड़ने पर ज्ञान गहरा होता है।",
        "लोग अलग-अलग जरूरतों और अनुभवों से खोज शुरू करते हैं।",
        "जीवन को सहारा देने वाले आधार को समझने के लिए बाहरी रूपों से आगे देखें।",
        "आसक्ति दृष्टि को सीमित कर सकती है।"
      ]
    },
    "themes": {
      "en": [
        "Knowledge and realization",
        "Nature and consciousness",
        "Devotion",
        "Limits of perception"
      ],
      "hi": [
        "ज्ञान और अनुभूति",
        "प्रकृति और चेतना",
        "भक्ति",
        "दृष्टि की सीमाएँ"
      ]
    },
    "practical_application": {
      "en": "Ask what experience or reflection has shaped one belief you hold strongly.",
      "hi": "अपने किसी दृढ़ विश्वास के पीछे के अनुभव या चिंतन पर विचार करें।"
    },
    "important_verses": [
      "BG_7_4",
      "BG_7_5",
      "BG_7_16",
      "BG_7_19"
    ]
  },
  {
    "chapter": 8,
    "sanskrit_name": "अक्षरब्रह्मयोग",
    "sanskrit_name_translit": "Akṣara Brahma Yoga",
    "english_name": "The Yoga of the Imperishable Absolute",
    "hindi_name": "अक्षर ब्रह्म योग",
    "verse_count": 28,
    "summary": {
      "en": "Arjuna asks Krishna to clarify foundational terms such as Brahman, the self, action, and the divine principle. Krishna relates a person’s deepest orientation to what the mind remembers and seeks, especially at life’s end. He emphasizes sustained remembrance and regular discipline rather than a last-minute effort. The chapter discusses cosmic cycles and paths associated with departure from embodied life, reflecting traditional spiritual cosmology. Its central invitation is to cultivate a steady orientation toward what is enduring throughout life, not to rely only on the circumstances of a final moment. Daily attention, values, and practice shape the mind over time.",
      "hi": "अर्जुन कृष्ण से ब्रह्म, आत्मा, कर्म और दिव्य तत्त्व जैसे मूल विचारों का अर्थ पूछते हैं। कृष्ण व्यक्ति की गहरी मानसिक दिशा को उसके स्मरण और मन के अभ्यास से जोड़ते हैं, विशेषकर जीवन के अंतिम समय में। वे नियमित साधना और निरंतर स्मरण पर जोर देते हैं, केवल अंतिम क्षण के प्रयास पर नहीं। अध्याय ब्रह्मांडीय चक्रों और देह त्याग से जुड़े मार्गों का वर्णन करता है, जो पारंपरिक आध्यात्मिक विश्व-दृष्टि का हिस्सा हैं। इसका केंद्रीय संदेश है कि स्थायी तत्त्व की ओर मन को पूरे जीवन में लगाना चाहिए। दैनिक ध्यान, मूल्य और अभ्यास समय के साथ मन की दिशा बनाते हैं।"
    },
    "key_teachings": {
      "en": [
        "Regular practice shapes the mind’s direction under pressure.",
        "Keep enduring values in view throughout life.",
        "Spiritual discipline grows through continuity.",
        "This chapter presents traditional spiritual cosmology, not a scientific model."
      ],
      "hi": [
        "नियमित अभ्यास कठिन समय में मन की दिशा बनाता है।",
        "स्थायी मूल्यों को पूरे जीवन में स्मरण रखें।",
        "आध्यात्मिक अनुशासन निरंतरता से विकसित होता है।",
        "यह अध्याय पारंपरिक आध्यात्मिक दृष्टि है, वैज्ञानिक मॉडल नहीं।"
      ]
    },
    "themes": {
      "en": [
        "Brahman and self",
        "Remembrance",
        "Practice",
        "Cosmic cycles"
      ],
      "hi": [
        "ब्रह्म और आत्मा",
        "स्मरण",
        "साधना",
        "ब्रह्मांडीय चक्र"
      ]
    },
    "practical_application": {
      "en": "Build a small daily practice around a value you want to remember in difficult times.",
      "hi": "कठिन समय में याद रखना चाहते हैं ऐसे मूल्य के लिए छोटी दैनिक साधना बनाएँ।"
    },
    "important_verses": [
      "BG_8_5",
      "BG_8_7",
      "BG_8_13",
      "BG_8_15"
    ]
  },
  {
    "chapter": 9,
    "sanskrit_name": "राजविद्याराजगुह्ययोग",
    "sanskrit_name_translit": "Rāja Vidyā Rāja Guhya Yoga",
    "english_name": "The Yoga of Royal Knowledge and Royal Mystery",
    "hindi_name": "राजविद्या राजगुह्य योग",
    "verse_count": 34,
    "summary": {
      "en": "Krishna describes knowledge that joins divine presence in existence with a personal path of devotion. The world rests in the divine, yet the divine is not limited by the world. Sincere devotion matters more than outward grandeur: even a modest offering can be meaningful when given with genuine love. Krishna invites people to direct ordinary actions, meals, gifts, and disciplines toward the sacred. The chapter also offers hope that a person’s past need not prevent a sincere change of direction. Its emphasis is on accessible devotion, inner sincerity, and remembering the sacred in daily life rather than reserving spirituality for elaborate rituals.",
      "hi": "कृष्ण ऐसा ज्ञान बताते हैं जो समस्त अस्तित्व में दिव्य उपस्थिति और व्यक्तिगत भक्ति को जोड़ता है। संसार दिव्य आधार पर स्थित है, लेकिन दिव्य तत्त्व संसार तक सीमित नहीं है। बाहरी भव्यता से अधिक सच्ची भक्ति महत्त्वपूर्ण है; प्रेम से अर्पित छोटी भेंट भी अर्थपूर्ण हो सकती है। कृष्ण दैनिक कर्म, भोजन, दान और अनुशासन को पवित्र भावना से जोड़ने के लिए प्रेरित करते हैं। यह अध्याय आशा देता है कि अतीत किसी व्यक्ति को सच्चा परिवर्तन करने से हमेशा नहीं रोकता। इसका जोर सहज भक्ति, आंतरिक ईमानदारी और रोज़मर्रा के जीवन में पवित्रता का स्मरण रखने पर है, न कि केवल भव्य अनुष्ठानों पर।"
    },
    "key_teachings": {
      "en": [
        "Sincerity matters more than outward display.",
        "Ordinary actions can become meaningful when done with devotion.",
        "A person’s past need not prevent sincere change.",
        "Remember the sacred in everyday life."
      ],
      "hi": [
        "भक्ति में दिखावे से अधिक सच्चाई महत्त्वपूर्ण है।",
        "समर्पित भावना से साधारण कर्म भी अर्थपूर्ण बन सकते हैं।",
        "अतीत सच्चे परिवर्तन को हमेशा नहीं रोकता।",
        "दैनिक जीवन में भी पवित्रता का स्मरण रखें।"
      ]
    },
    "themes": {
      "en": [
        "Devotion",
        "Divine presence",
        "Sincerity",
        "Transformation"
      ],
      "hi": [
        "भक्ति",
        "दिव्य उपस्थिति",
        "सच्चाई",
        "परिवर्तन"
      ]
    },
    "practical_application": {
      "en": "Do one ordinary task with care and gratitude without seeking recognition.",
      "hi": "आज कोई साधारण काम सावधानी और कृतज्ञता से करें, बिना प्रशंसा की अपेक्षा के।"
    },
    "important_verses": [
      "BG_9_22",
      "BG_9_26",
      "BG_9_27",
      "BG_9_30"
    ]
  },
  {
    "chapter": 10,
    "sanskrit_name": "विभूतियोग",
    "sanskrit_name_translit": "Vibhūti Yoga",
    "english_name": "The Yoga of Divine Manifestations",
    "hindi_name": "विभूति योग",
    "verse_count": 42,
    "summary": {
      "en": "Arjuna asks how to recognize Krishna’s presence in the world. Krishna names examples of excellence, power, beauty, and significance in nature, knowledge, and human experience as expressions of divine splendour. The examples are not an exhaustive list; they train the mind to notice the sacred through what is especially admirable or awe-inspiring. The chapter invites a shift from seeing disconnected objects to noticing a deeper source behind the world’s variety. It acknowledges that divine manifestations exceed any finite catalogue. The practical invitation is to let wonder, humility, and gratitude grow when encountering exceptional beauty, courage, wisdom, or natural power.",
      "hi": "अर्जुन पूछते हैं कि संसार में कृष्ण की उपस्थिति कैसे पहचानें। कृष्ण प्रकृति, ज्ञान और मानवीय अनुभव में उत्कृष्टता, शक्ति, सुंदरता और महत्त्व के उदाहरण बताते हैं, जिन्हें दिव्य वैभव की अभिव्यक्तियाँ समझा जा सकता है। यह सूची पूर्ण नहीं है; इसका उद्देश्य अद्भुत और प्रशंसनीय चीज़ों में पवित्रता पहचानना है। यह अध्याय संसार को असंबद्ध वस्तुओं के बजाय उसकी विविधता के पीछे मौजूद गहरे आधार से देखने को प्रेरित करता है। दिव्य अभिव्यक्तियाँ किसी सीमित सूची से परे हैं। व्यावहारिक संदेश है कि सुंदरता, साहस, ज्ञान या प्रकृति की शक्ति देखकर विस्मय, विनम्रता और कृतज्ञता विकसित करें।"
    },
    "key_teachings": {
      "en": [
        "Let excellence awaken wonder, not envy or arrogance.",
        "Notice sources of strength beyond personal achievement.",
        "Examples point toward a greater reality but do not exhaust it.",
        "Gratitude deepens attention to the world."
      ],
      "hi": [
        "उत्कृष्टता से ईर्ष्या या अहंकार नहीं, विस्मय जागने दें।",
        "व्यक्तिगत उपलब्धि से आगे शक्ति के स्रोत पहचानें।",
        "उदाहरण व्यापक वास्तविकता की ओर संकेत करते हैं, उसे सीमित नहीं करते।",
        "कृतज्ञता संसार के प्रति सजगता बढ़ाती है।"
      ]
    },
    "themes": {
      "en": [
        "Divine manifestations",
        "Wonder",
        "Humility",
        "Unity in diversity"
      ],
      "hi": [
        "दिव्य विभूतियाँ",
        "विस्मय",
        "विनम्रता",
        "विविधता में एकता"
      ]
    },
    "practical_application": {
      "en": "Notice one example of beauty, courage, or wisdom and appreciate it without comparison.",
      "hi": "सुंदरता, साहस या ज्ञान का एक उदाहरण देखकर तुलना के बजाय उसकी सराहना करें।"
    },
    "important_verses": [
      "BG_10_8",
      "BG_10_20",
      "BG_10_41",
      "BG_10_42"
    ]
  },
  {
    "chapter": 11,
    "sanskrit_name": "विश्वरूपदर्शनयोग",
    "sanskrit_name_translit": "Viśvarūpa Darśana Yoga",
    "english_name": "The Yoga of the Vision of the Universal Form",
    "hindi_name": "विश्वरूप दर्शन योग",
    "verse_count": 55,
    "summary": {
      "en": "At Arjuna’s request, Krishna reveals the universal form, a vision containing countless beings, powers, and the movement of time. Arjuna experiences wonder and fear as creation and destruction appear together. The vision challenges an ordinary limited view and shows events unfolding on a scale beyond one person’s perspective. Arjuna praises Krishna, acknowledges his own familiarity and mistakes, and asks to see the gentler form he knows. Krishna returns to a familiar appearance and emphasizes devotion. The chapter holds awe and humility together: insight into vastness can unsettle the ego, while devotion and responsibility help a person return to purposeful action.",
      "hi": "अर्जुन के अनुरोध पर कृष्ण विश्वरूप दिखाते हैं, जिसमें असंख्य प्राणी, शक्तियाँ और समय की गति समाहित हैं। सृष्टि और विनाश को साथ देखकर अर्जुन विस्मय और भय अनुभव करते हैं। यह दर्शन सीमित दृष्टि को चुनौती देता है और दिखाता है कि घटनाएँ एक व्यक्ति की समझ से कहीं बड़े विस्तार में घटती हैं। अर्जुन कृष्ण की स्तुति करते हैं, अपने व्यवहार की भूलें स्वीकारते हैं और परिचित सौम्य रूप देखने का अनुरोध करते हैं। कृष्ण परिचित रूप में लौटकर भक्ति का महत्त्व बताते हैं। यह अध्याय विस्मय और विनम्रता को जोड़ता है: विराटता की अनुभूति अहंकार को हिला सकती है, जबकि भक्ति और जिम्मेदारी उद्देश्यपूर्ण कर्म की ओर लौटाती हैं।"
    },
    "key_teachings": {
      "en": [
        "A wider perspective reveals the limits of personal viewpoint.",
        "The vision includes both creation and destruction.",
        "Awe can encourage humility rather than a sense of control.",
        "Return to responsible action after profound reflection."
      ],
      "hi": [
        "व्यापक दृष्टि व्यक्तिगत समझ की सीमाएँ दिखाती है।",
        "इस दर्शन में सृष्टि और विनाश दोनों शामिल हैं।",
        "विस्मय नियंत्रण के अहंकार के बजाय विनम्रता बढ़ा सकता है।",
        "गहरे चिंतन के बाद जिम्मेदार कर्म की ओर लौटें।"
      ]
    },
    "themes": {
      "en": [
        "Universal form",
        "Time and change",
        "Awe and fear",
        "Humility and devotion"
      ],
      "hi": [
        "विश्वरूप",
        "समय और परिवर्तन",
        "विस्मय और भय",
        "विनम्रता और भक्ति"
      ]
    },
    "practical_application": {
      "en": "When events feel centered on you, consider the larger forces and people involved.",
      "hi": "जब लगे कि सब कुछ आपके इर्द-गिर्द है, तो व्यापक परिस्थितियों और लोगों पर विचार करें।"
    },
    "important_verses": [
      "BG_11_12",
      "BG_11_32",
      "BG_11_45",
      "BG_11_55"
    ]
  },
  {
    "chapter": 12,
    "sanskrit_name": "भक्तियोग",
    "sanskrit_name_translit": "Bhakti Yoga",
    "english_name": "The Yoga of Devotion",
    "hindi_name": "भक्ति योग",
    "verse_count": 20,
    "summary": {
      "en": "Arjuna asks about devotion to a personal form of the divine and contemplation of the unmanifest absolute. Krishna recognizes both approaches but describes focused devotion as accessible for many people. He portrays a devotee as compassionate, patient, balanced in pleasure and pain, self-controlled, and not driven by hatred or ego. Devotion is expressed not only through worship but through character and relationships. Krishna also offers a gradual path: steady attention, regular practice, action offered in service, and relinquishing attachment to results. The chapter makes spiritual life concrete through everyday conduct and the quality of one’s heart.",
      "hi": "अर्जुन पूछते हैं कि साकार दिव्य रूप की भक्ति बेहतर है या अव्यक्त परम तत्त्व का ध्यान। कृष्ण दोनों मार्ग स्वीकारते हैं, लेकिन बताते हैं कि अनेक लोगों के लिए एकाग्र भक्ति सहज हो सकती है। वे भक्त को करुणामय, धैर्यवान, सुख-दुःख में संतुलित, आत्म-संयमी और द्वेष-अहंकार से दूर बताते हैं। भक्ति केवल पूजा में नहीं, चरित्र और संबंधों में भी प्रकट होती है। कृष्ण क्रमिक मार्ग बताते हैं: एकाग्रता, नियमित अभ्यास, सेवा-भाव से कर्म और फल की आसक्ति छोड़ना। यह अध्याय दैनिक आचरण और हृदय की गुणवत्ता के माध्यम से आध्यात्मिक जीवन को ठोस रूप देता है।"
    },
    "key_teachings": {
      "en": [
        "Devotion is reflected in compassion and freedom from hatred.",
        "Patience and steadiness are part of spiritual practice.",
        "If concentration is difficult, begin with practice and service.",
        "Character and relationships reveal devotion."
      ],
      "hi": [
        "भक्ति करुणा और द्वेष से मुक्त रहने में दिखाई देती है।",
        "धैर्य और स्थिरता आध्यात्मिक अभ्यास का हिस्सा हैं।",
        "एकाग्रता कठिन हो तो अभ्यास और सेवा से शुरू करें।",
        "चरित्र और संबंध भक्ति की गहराई दिखाते हैं।"
      ]
    },
    "themes": {
      "en": [
        "Devotion",
        "Compassion",
        "Steadiness",
        "Gradual practice"
      ],
      "hi": [
        "भक्ति",
        "करुणा",
        "स्थिरता",
        "क्रमिक साधना"
      ]
    },
    "practical_application": {
      "en": "Practice patience or compassionate listening in one conversation today.",
      "hi": "आज एक बातचीत में धैर्य या करुणापूर्ण सुनने का अभ्यास करें।"
    },
    "important_verses": [
      "BG_12_6",
      "BG_12_13",
      "BG_12_15",
      "BG_12_20"
    ]
  },
  {
    "chapter": 13,
    "sanskrit_name": "क्षेत्रक्षेत्रज्ञविभागयोग",
    "sanskrit_name_translit": "Kṣetra Kṣetrajña Vibhāga Yoga",
    "english_name": "The Yoga of the Field and Its Knower",
    "hindi_name": "क्षेत्र और क्षेत्रज्ञ का योग",
    "verse_count": 34,
    "summary": {
      "en": "Krishna distinguishes the field—the body, mind, and changing experiences—from the knower who is aware of them. This distinction supports self-inquiry: thoughts, feelings, sensations, and circumstances can be observed rather than treated as the whole of one’s identity. The chapter lists qualities associated with knowledge, including humility, patience, non-harm, self-discipline, and a sustained search for truth. It also discusses nature, consciousness, and the supreme principle. Interpretations differ across philosophical traditions, so the ideas should not be reduced to a single modern psychological claim. The central invitation is to examine experience carefully and distinguish what changes from the awareness that knows change.",
      "hi": "कृष्ण क्षेत्र—शरीर, मन और बदलते अनुभवों—तथा उन्हें जानने वाले के बीच अंतर बताते हैं। यह भेद आत्म-अन्वेषण में सहायक है: विचार, भावनाएँ और परिस्थितियाँ देखी जा सकती हैं, उन्हें पूरी पहचान मानना आवश्यक नहीं। अध्याय ज्ञान के गुणों में विनम्रता, धैर्य, अहिंसा, आत्म-अनुशासन और सत्य की खोज को शामिल करता है। प्रकृति, चेतना और परम तत्त्व पर भी विचार होता है। अलग-अलग दार्शनिक परंपराएँ इन विचारों की अलग व्याख्या करती हैं; इन्हें किसी एक आधुनिक मनोवैज्ञानिक दावे तक सीमित नहीं करना चाहिए। केंद्रीय संदेश है कि अनुभव को ध्यान से देखें और बदलती वस्तुओं तथा उन्हें जानने वाली चेतना में अंतर समझें।"
    },
    "key_teachings": {
      "en": [
        "Observe thoughts without assuming they define your whole identity.",
        "Humility, patience, non-harm, and discipline support knowledge.",
        "Distinguish changing experience from awareness of it.",
        "Philosophical interpretations may differ."
      ],
      "hi": [
        "विचारों को देखें, पर उन्हें पूरी पहचान न मानें।",
        "विनम्रता, धैर्य, अहिंसा और अनुशासन ज्ञान को सहारा देते हैं।",
        "बदलते अनुभव और उन्हें जानने वाली चेतना में अंतर करें।",
        "दार्शनिक व्याख्याएँ अलग-अलग हो सकती हैं।"
      ]
    },
    "themes": {
      "en": [
        "Field and knower",
        "Self-inquiry",
        "Qualities of knowledge",
        "Nature and consciousness"
      ],
      "hi": [
        "क्षेत्र और क्षेत्रज्ञ",
        "आत्म-अन्वेषण",
        "ज्ञान के गुण",
        "प्रकृति और चेतना"
      ]
    },
    "practical_application": {
      "en": "Describe a strong emotion as an experience you notice, not your entire identity.",
      "hi": "तीव्र भावना को अपनी पूरी पहचान नहीं, बल्कि एक अनुभव के रूप में पहचानें।"
    },
    "important_verses": [
      "BG_13_2",
      "BG_13_7",
      "BG_13_22",
      "BG_13_34"
    ]
  },
  {
    "chapter": 14,
    "sanskrit_name": "गुणत्रयविभागयोग",
    "sanskrit_name_translit": "Guṇatraya Vibhāga Yoga",
    "english_name": "The Yoga of the Three Qualities",
    "hindi_name": "तीन गुणों का विभाग योग",
    "verse_count": 27,
    "summary": {
      "en": "Krishna describes three qualities through which material nature shapes experience: sattva, associated with clarity and harmony; rajas, with activity and desire; and tamas, with inertia and obscurity. These qualities influence knowledge, action, attachment, and mood, and their prominence changes with circumstances. The teaching encourages observation rather than fixed labeling: notice which quality is active and how it affects judgment. Even clarity can become attachment when one clings to comfort or an identity of being wise. The chapter aims to understand these patterns and cultivate freedom from being controlled by them, while remaining grounded in discernment and devotion.",
      "hi": "कृष्ण प्रकृति के तीन गुण बताते हैं: सत्त्व, जो स्पष्टता और सामंजस्य से जुड़ा है; रजस्, जो गतिविधि और इच्छा से जुड़ा है; और तमस्, जो जड़ता और अस्पष्टता से जुड़ा है। ये गुण ज्ञान, कर्म, आसक्ति और मनोदशा को प्रभावित करते हैं और परिस्थितियों के अनुसार बदलते हैं। यह शिक्षा स्थायी लेबल लगाने के बजाय अवलोकन करने को कहती है: पहचानें कि कौन-सा गुण सक्रिय है और निर्णय पर उसका क्या प्रभाव है। स्पष्टता भी आसक्ति बन सकती है, यदि कोई आराम या ज्ञानी होने की पहचान से चिपक जाए। उद्देश्य इन प्रवृत्तियों को समझना और विवेक तथा भक्ति के सहारे इनके नियंत्रण से ऊपर उठना है।"
    },
    "key_teachings": {
      "en": [
        "Notice whether clarity, restless desire, or inertia shapes your response.",
        "Do not turn temporary states into permanent labels.",
        "Pleasant states can also create attachment.",
        "Self-observation creates space for deliberate response."
      ],
      "hi": [
        "पहचानें कि प्रतिक्रिया को स्पष्टता, बेचैन इच्छा या जड़ता प्रभावित कर रही है।",
        "अस्थायी मनोदशाओं को स्थायी लेबल न बनाएँ।",
        "सुखद अवस्थाएँ भी आसक्ति बना सकती हैं।",
        "आत्म-अवलोकन सोच-समझकर प्रतिक्रिया देने की जगह बनाता है।"
      ]
    },
    "themes": {
      "en": [
        "Sattva, rajas, tamas",
        "Nature and behavior",
        "Attachment",
        "Transcending the qualities"
      ],
      "hi": [
        "सत्त्व, रजस्, तमस्",
        "प्रकृति और व्यवहार",
        "आसक्ति",
        "गुणों से परे जाना"
      ]
    },
    "practical_application": {
      "en": "Notice your state before reacting and choose one small action that restores balance.",
      "hi": "प्रतिक्रिया से पहले मन की स्थिति पहचानें और संतुलन लौटाने वाला छोटा कदम चुनें।"
    },
    "important_verses": [
      "BG_14_5",
      "BG_14_6",
      "BG_14_7",
      "BG_14_8",
      "BG_14_22"
    ]
  },
  {
    "chapter": 15,
    "sanskrit_name": "पुरुषोत्तमयोग",
    "sanskrit_name_translit": "Puruṣottama Yoga",
    "english_name": "The Yoga of the Supreme Person",
    "hindi_name": "पुरुषोत्तम योग",
    "verse_count": 20,
    "summary": {
      "en": "Krishna uses the image of a tree with roots above and branches below to describe worldly existence, where forms and attachments can keep beings entangled. The tree is to be understood and cut down through detachment so the seeker can discover the enduring source beyond it. The chapter discusses the self’s journey through embodied life and describes the divine as the sustaining presence behind memory, understanding, and life. Krishna distinguishes the perishable, the imperishable, and the Supreme Person who transcends both. The teaching asks readers not to confuse temporary roles and circumstances with their deepest identity. Freedom requires discernment, non-attachment, and orientation toward what endures.",
      "hi": "कृष्ण ऊपर जड़ों और नीचे शाखाओं वाले वृक्ष का रूपक देते हैं, जो संसार और उसकी आसक्तियों को दर्शाता है। इस वृक्ष को समझकर वैराग्य से काटना आवश्यक है, ताकि साधक स्थायी आधार पहचान सके। अध्याय देहधारी जीवन में जीव की यात्रा और स्मृति, समझ तथा जीवन को सहारा देने वाली दिव्य उपस्थिति का वर्णन करता है। कृष्ण नश्वर, अविनाशी और इन दोनों से परे पुरुषोत्तम के बीच अंतर बताते हैं। यह शिक्षा अस्थायी भूमिकाओं और परिस्थितियों को अपनी गहरी पहचान न मानने के लिए प्रेरित करती है। स्वतंत्रता के लिए विवेक, अनासक्ति और स्थायी तत्त्व की ओर मन लगाना आवश्यक है।"
    },
    "key_teachings": {
      "en": [
        "Do not mistake temporary roles for your deepest identity.",
        "Discernment and detachment loosen worldly entanglement.",
        "Reflect on what sustains memory, understanding, and life.",
        "The chapter distinguishes the perishable, imperishable, and Supreme Person."
      ],
      "hi": [
        "अस्थायी भूमिकाओं को अपनी गहरी पहचान न मानें।",
        "विवेक और वैराग्य सांसारिक उलझनें कम करते हैं।",
        "स्मृति, समझ और जीवन को सहारा देने वाले आधार पर विचार करें।",
        "अध्याय नश्वर, अविनाशी और पुरुषोत्तम में अंतर बताता है।"
      ]
    },
    "themes": {
      "en": [
        "World-tree metaphor",
        "Attachment and freedom",
        "The self",
        "The Supreme Person"
      ],
      "hi": [
        "संसार-वृक्ष का रूपक",
        "आसक्ति और स्वतंत्रता",
        "जीव",
        "पुरुषोत्तम"
      ]
    },
    "practical_application": {
      "en": "Remember that a role or possession is part of your life, not the whole of you.",
      "hi": "याद रखें कि कोई भूमिका या वस्तु आपके जीवन का हिस्सा है, आपका संपूर्ण अस्तित्व नहीं।"
    },
    "important_verses": [
      "BG_15_1",
      "BG_15_3",
      "BG_15_7",
      "BG_15_15",
      "BG_15_18"
    ]
  },
  {
    "chapter": 16,
    "sanskrit_name": "दैवासुरसम्पद्विभागयोग",
    "sanskrit_name_translit": "Daivāsura Sampad Vibhāga Yoga",
    "english_name": "The Yoga of Divine and Demonic Qualities",
    "hindi_name": "दैवी और आसुरी संपदा का विभाग योग",
    "verse_count": 24,
    "summary": {
      "en": "Krishna contrasts qualities that support well-being—fearlessness, honesty, self-restraint, compassion, and humility—with patterns rooted in hypocrisy, arrogance, anger, harshness, and greed. These descriptions concern dispositions and conduct, not permission to condemn entire groups of people. Unchecked desire and ego can distort judgment and lead to harmful choices. Ethical life therefore requires attention to motives as well as outward actions. Krishna warns against being governed by impulse and encourages using sound principles as a guide. Read constructively, the chapter invites self-examination: which habits build trust and reduce harm, and which increase conflict and suffering?",
      "hi": "कृष्ण कल्याण को सहारा देने वाले गुणों—निर्भयता, ईमानदारी, आत्म-संयम, करुणा और विनम्रता—की तुलना पाखंड, अहंकार, क्रोध, कठोरता और लोभ से करते हैं। इन वर्णनों को व्यवहार और स्वभाव के संदर्भ में समझना चाहिए, पूरे समूहों की निंदा के रूप में नहीं। अनियंत्रित इच्छा और अहंकार विवेक बिगाड़कर हानिकारक निर्णयों की ओर ले जा सकते हैं। नैतिक जीवन में बाहरी कर्मों के साथ उनकी भावना पर भी ध्यान देना आवश्यक है। कृष्ण आवेग के अधीन न रहने और सिद्धांतों को मार्गदर्शक बनाने को कहते हैं। यह अध्याय आत्म-परीक्षण का निमंत्रण देता है: कौन-सी आदतें विश्वास बनाती हैं और कौन-सी संघर्ष बढ़ाती हैं?"
    },
    "key_teachings": {
      "en": [
        "Cultivate honesty, compassion, self-restraint, and humility.",
        "Notice how arrogance, anger, and greed affect choices.",
        "Evaluate conduct instead of labeling whole groups.",
        "Use ethical principles when impulses are strong."
      ],
      "hi": [
        "ईमानदारी, करुणा, आत्म-संयम और विनम्रता विकसित करें।",
        "अहंकार, क्रोध और लोभ के निर्णयों पर प्रभाव को पहचानें।",
        "पूरे समूहों को लेबल करने के बजाय व्यवहार का मूल्यांकन करें।",
        "तीव्र आवेगों में नैतिक सिद्धांतों का सहारा लें।"
      ]
    },
    "themes": {
      "en": [
        "Ethical qualities",
        "Ego and greed",
        "Self-examination",
        "Guiding principles"
      ],
      "hi": [
        "नैतिक गुण",
        "अहंकार और लोभ",
        "आत्म-परीक्षण",
        "मार्गदर्शक सिद्धांत"
      ]
    },
    "practical_application": {
      "en": "Review a disagreement and consider where patience, honesty, or humility could help.",
      "hi": "किसी मतभेद पर विचार करें और देखें कि धैर्य, ईमानदारी या विनम्रता कहाँ मदद कर सकती थी।"
    },
    "important_verses": [
      "BG_16_1",
      "BG_16_2",
      "BG_16_4",
      "BG_16_21"
    ]
  },
  {
    "chapter": 17,
    "sanskrit_name": "श्रद्धात्रयविभागयोग",
    "sanskrit_name_translit": "Śraddhātraya Vibhāga Yoga",
    "english_name": "The Yoga of the Threefold Division of Faith",
    "hindi_name": "तीन प्रकार की श्रद्धा का विभाग योग",
    "verse_count": 28,
    "summary": {
      "en": "Arjuna asks about people who worship with faith but do not follow prescribed teachings. Krishna explains that faith is shaped by disposition and relates the three qualities of nature to food, worship, discipline, and giving. He distinguishes practices that support clarity and balance from those driven by display, craving, or harmful austerity. The chapter asks readers to examine intention as well as outward form: generosity may be offered with care or used to seek recognition; discipline may be meaningful or become self-punishment. “Om Tat Sat” is presented as a sacred affirmation associated with consecrated action. The lesson is to examine the quality and purpose of faith and conduct.",
      "hi": "अर्जुन पूछते हैं कि निर्धारित शिक्षाओं का पालन किए बिना श्रद्धा से पूजा करने वालों की स्थिति क्या है। कृष्ण बताते हैं कि श्रद्धा स्वभाव से प्रभावित होती है और तीन गुण भोजन, पूजा, तप तथा दान में भी दिखाई देते हैं। वे संतुलन बढ़ाने वाले अभ्यासों और दिखावे, लालसा या हानिकारक तप से प्रेरित व्यवहार में अंतर करते हैं। अध्याय बाहरी रूप के साथ उद्देश्य देखने को कहता है: दान करुणा से दिया जा सकता है या प्रशंसा के लिए; अनुशासन सार्थक हो सकता है या आत्म-दंड बन सकता है। “ॐ तत् सत्” को समर्पित कर्म से जुड़ी पवित्र पुष्टि के रूप में प्रस्तुत किया गया है। शिक्षा है कि अपनी श्रद्धा और आचरण के उद्देश्य की जाँच करें।"
    },
    "key_teachings": {
      "en": [
        "Examine the intention behind worship, discipline, and giving.",
        "Do not confuse discipline with harmful self-punishment.",
        "Generosity is not merely a performance.",
        "Faith appears in everyday choices as well as formal practice."
      ],
      "hi": [
        "पूजा, अनुशासन और दान के पीछे की भावना जाँचें।",
        "अनुशासन को हानिकारक आत्म-दंड न बनाएँ।",
        "दान केवल दिखावा नहीं होना चाहिए।",
        "श्रद्धा दैनिक चुनावों में भी प्रकट होती है।"
      ]
    },
    "themes": {
      "en": [
        "Faith and disposition",
        "Food and practice",
        "Austerity",
        "Giving and intention"
      ],
      "hi": [
        "श्रद्धा और स्वभाव",
        "भोजन और अभ्यास",
        "तप",
        "दान और भावना"
      ]
    },
    "practical_application": {
      "en": "Before helping or following a discipline, ask whether it is kind, sustainable, and sincere.",
      "hi": "सहायता या अनुशासन से पहले पूछें कि वह करुणापूर्ण, टिकाऊ और सच्चा है या नहीं।"
    },
    "important_verses": [
      "BG_17_3",
      "BG_17_8",
      "BG_17_20",
      "BG_17_23"
    ]
  },
  {
    "chapter": 18,
    "sanskrit_name": "मोक्षसंन्यासयोग",
    "sanskrit_name_translit": "Mokṣa Sannyāsa Yoga",
    "english_name": "The Yoga of Liberation through Renunciation",
    "hindi_name": "मोक्ष और संन्यास योग",
    "verse_count": 78,
    "summary": {
      "en": "The final chapter gathers the Gita’s themes: renunciation, duty, knowledge, action, the three qualities, devotion, and liberation. Krishna distinguishes abandoning harmful attachment from refusing to act, and explains that action depends on multiple contributing factors rather than an isolated ego alone. He discusses the relation between disposition and responsibility, urging people to perform their own duty thoughtfully rather than imitate another path without discernment. The dialogue culminates in an invitation to take refuge in the divine, followed by Arjuna’s renewed clarity and readiness to act. The chapter does not erase difficult choices; it brings understanding, devotion, and responsibility together so action can proceed with awareness and commitment.",
      "hi": "अंतिम अध्याय गीता के प्रमुख विषयों—संन्यास, कर्तव्य, ज्ञान, कर्म, तीन गुण, भक्ति और मुक्ति—को समेटता है। कृष्ण हानिकारक आसक्ति छोड़ने और कर्म करने से मना कर देने के बीच अंतर बताते हैं। वे समझाते हैं कि किसी कार्य के पीछे अनेक कारक होते हैं, केवल अहंकार नहीं। अध्याय स्वभाव और जिम्मेदारी के संबंध पर विचार करता है तथा बिना विवेक दूसरों की नकल करने के बजाय अपना कर्तव्य सोच-समझकर निभाने को कहता है। संवाद के अंत में कृष्ण दिव्य शरण का निमंत्रण देते हैं और अर्जुन की स्पष्टता तथा कर्म करने की तत्परता लौट आती है। यह अध्याय कठिन निर्णय मिटाता नहीं; समझ, भक्ति और जिम्मेदारी को जोड़कर सजग कर्म का आधार बनाता है।"
    },
    "key_teachings": {
      "en": [
        "Release harmful attachment rather than using renunciation to avoid duty.",
        "Recognize the many factors contributing to action.",
        "Choose responsibility with discernment, not imitation.",
        "Bring knowledge, devotion, and action together.",
        "Reflection should lead toward responsible action."
      ],
      "hi": [
        "जिम्मेदारी से बचने के बजाय हानिकारक आसक्ति छोड़ें।",
        "समझें कि कर्म के पीछे अनेक कारक होते हैं।",
        "नकल के बजाय विवेक से अपनी जिम्मेदारी निभाएँ।",
        "ज्ञान, भक्ति और कर्म को साथ लेकर चलें।",
        "चिंतन अधिक जिम्मेदार कर्म की ओर ले जाए।"
      ]
    },
    "themes": {
      "en": [
        "Renunciation and duty",
        "Nature of action",
        "Personal responsibility",
        "Surrender and liberation"
      ],
      "hi": [
        "संन्यास और कर्तव्य",
        "कर्म का स्वरूप",
        "व्यक्तिगत जिम्मेदारी",
        "समर्पण और मुक्ति"
      ]
    },
    "practical_application": {
      "en": "Identify the responsibility that is truly yours and take the next constructive step.",
      "hi": "अपनी वास्तविक जिम्मेदारी पहचानें और अगला रचनात्मक कदम उठाएँ।"
    },
    "important_verses": [
      "BG_18_5",
      "BG_18_9",
      "BG_18_47",
      "BG_18_63",
      "BG_18_66"
    ]
  }
];

export const VERSE_DETAILS: Record<string, CanonicalVerseDetail> = {
  "BG_1_28": {
    "id": "BG_1_28",
    "chapter": 1,
    "verse": 28,
    "reference": "1.28",
    "sanskrit": "कृपया परयाविष्टो विषीदन्न् इदम् अब्रवीत् |\nदृष्ट्वेमं स्वजनं कृष्ण युयुत्सुं समुपस्थितम्",
    "transliteration": "kṛpayā parayāviṣṭo viṣīdann idam abravīt |\ndṛṣṭvemaṃ svajanaṃ kṛṣṇa yuyutsuṃ samupasthitam",
    "english_translation": "Flooded with compassion, Arjuna spoke in grief to Krishna: seeing his own people arrayed there, hungry to fight.",
    "hindi_translation": "अर्जुन बोले -- हे कृष्ण! युद्धकी इच्छावाले इस कुटुम्ब-समुदायको अपने सामने उपस्थित देखकर मेरे अङ्ग शिथिल हो रहे हैं और मुख सूख रहा है।",
    "has_hindi_translation": true
  },
  "BG_1_31": {
    "id": "BG_1_31",
    "chapter": 1,
    "verse": 31,
    "reference": "1.31",
    "sanskrit": "निमित्तानि च पश्यामि विपरीतानि केशव |\nन च श्रेयो ऽनुपश्यामि हत्वा स्वजनम् आहवे",
    "transliteration": "nimittāni ca paśyāmi viparītāni keśava |\nna ca śreyo 'nupaśyāmi hatvā svajanam āhave",
    "english_translation": "Arjuna says: I see only bad omens, Keśava, and I can find no good in killing my own people in this battle.",
    "hindi_translation": "हे केशव! मैं लक्षणों - (शकुनों) को भी विपरीत देख रहा हूँ और युद्ध में स्वजनोंको मारकर श्रेय (लाभ) भी नहीं देख रहा हूँ।",
    "has_hindi_translation": true
  },
  "BG_1_47": {
    "id": "BG_1_47",
    "chapter": 1,
    "verse": 47,
    "reference": "1.47",
    "sanskrit": "एवम् उक्त्वार्जुनः संख्ये रथोपस्थ उपाविशत् |\nविसृज्य सशरं चापं शोक-संविग्न-मानसः",
    "transliteration": "evam uktvārjunaḥ saṃkhye rathopastha upāviśat |\nvisṛjya saśaraṃ cāpaṃ śoka-saṃvigna-mānasaḥ",
    "english_translation": "Having said this on the battlefield, Arjuna sank into the chariot seat, let fall his bow and arrows, and sat there with his mind shaken by grief.",
    "hindi_translation": "संजय बोले - ऐसा कहकर शोकाकुल मनवाले अर्जुन बाणसहित धनुष का त्याग करके युद्धभूमि में रथके मध्यभाग में बैठ गये।",
    "has_hindi_translation": true
  },
  "BG_2_14": {
    "id": "BG_2_14",
    "chapter": 2,
    "verse": 14,
    "reference": "2.14",
    "sanskrit": "मात्रा-स्पर्शास् तु कौन्तेय शीतोष्ण-सुख-दुःखदाः |\nआगमापायिनो ऽनित्यास् तांस् तितिक्षस्व भारत",
    "transliteration": "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkhadāḥ |\nāgamāpāyino 'nityās tāṃs titikṣasva bhārata",
    "english_translation": "Sensations of cold, heat, pleasure, and pain come from the body's contact with the world; they rise and pass away, Arjuna, so bear them.",
    "hindi_translation": "हे कुन्तीनन्दन! इन्द्रियोंके जो विषय (जड पदार्थ) हैं, वो तो शीत (अनुकूलता) और उष्ण (प्रतिकूलता) - के द्वारा सुख और दुःख देनेवाले हैं तथा आने-जानेवाले और अनित्य हैं। हे भरतवंशोद्भव अर्जुन! उनको तुम सहन करो।",
    "has_hindi_translation": true
  },
  "BG_2_47": {
    "id": "BG_2_47",
    "chapter": 2,
    "verse": 47,
    "reference": "2.47",
    "sanskrit": "कर्मण्य् एवाधिकारस् ते मा फलेषु कदाचन |\nमा कर्म-फल-हेतुर् भूर् मा ते सङ्गो ऽस्त्व् अकर्मणि",
    "transliteration": "karmaṇy evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    "english_translation": "You have the right to act, never to the fruits of action. Never let the fruit be your motive, and never let inaction be your refuge.",
    "hindi_translation": "कर्तव्य-कर्म करनेमें ही तेरा अधिकार है, फलोंमें कभी नहीं। अतः तू कर्मफलका हेतु भी मत बन और तेरी अकर्मण्यतामें भी आसक्ति न हो।",
    "has_hindi_translation": true
  },
  "BG_2_48": {
    "id": "BG_2_48",
    "chapter": 2,
    "verse": 48,
    "reference": "2.48",
    "sanskrit": "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनंजय |\nसिद्ध्य्-असिद्ध्योः समो भूत्वा समत्वं योग उच्यते",
    "transliteration": "yogasthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanaṃjaya |\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṃ yoga ucyate",
    "english_translation": "Stand firm in yoga, act without clinging to outcomes, Arjuna, and meet success and failure with the same mind. That evenness of spirit is what yoga means.",
    "hindi_translation": "हे धनञ्जय ! तू आसक्तिका त्याग करके सिद्धि-असिद्धिमें सम होकर योगमें स्थित हुआ कर्मोंको कर; क्योंकि समत्व ही योग कहा जाता है।",
    "has_hindi_translation": true
  },
  "BG_2_55": {
    "id": "BG_2_55",
    "chapter": 2,
    "verse": 55,
    "reference": "2.55",
    "sanskrit": "प्रजहाति यदा कामान् सर्वान् पार्थ मनो-गतान् |\nआत्मन्य् एवात्मना तुष्टः स्थित-प्रज्ञस् तदोच्यते",
    "transliteration": "prajahāti yadā kāmān sarvān pārtha mano-gatān |\nātmany evātmanā tuṣṭaḥ sthita-prajñas tadocyate",
    "english_translation": "When someone casts off every desire lodged in the mind and rests content in the self alone, Krishna says, that one is called a person of steady wisdom.",
    "hindi_translation": "श्रीभगवान् बोले - हे पृथानन्दन ! जिस कालमें साधक मनोगत सम्पूर्ण कामनाओंका अच्छी तरह त्याग कर देता है और अपने-आपसे अपने-आपमें ही सन्तुष्ट रहता है, उस कालमें वह स्थितप्रज्ञ कहा जाता है।",
    "has_hindi_translation": true
  },
  "BG_3_8": {
    "id": "BG_3_8",
    "chapter": 3,
    "verse": 8,
    "reference": "3.8",
    "sanskrit": "नियतं कुरु कर्म त्वं कर्म ज्यायो ह्यकर्मणः । शरीरयात्रापि च ते न प्रसिद्ध्येदकर्मणः",
    "transliteration": "niyataṃ kuru karma tvaṃ karma jyāyo hyakarmaṇaḥ |\nśarīrayātrāpi ca te na prasiddhyedakarmaṇaḥ",
    "english_translation": "Do your prescribed duty — action is better than inaction, for without it you cannot even keep your body alive.",
    "hindi_translation": "तू शास्त्रविधिसे नियत किये हुए कर्तव्य-कर्म कर; क्योंकि कर्म न करनेकी अपेक्षा कर्म करना श्रेष्ठ है तथा कर्म न करनेसे तेरा शरीर-निर्वाह भी सिद्ध नहीं होगा।",
    "has_hindi_translation": true
  },
  "BG_3_19": {
    "id": "BG_3_19",
    "chapter": 3,
    "verse": 19,
    "reference": "3.19",
    "sanskrit": "तस्माद् असक्तः सततं कार्यं कर्म समाचर |\nअसक्तो ह्य् आचरन् कर्म परम् आप्नोति पूरुषः",
    "transliteration": "tasmād asaktaḥ satataṃ kāryaṃ karma samācara |\nasakto hy ācaran karma param āpnoti pūruṣaḥ",
    "english_translation": "Keep acting without clinging to results, and that freedom from attachment itself carries you to the highest.",
    "hindi_translation": "इसलिये तू निरन्तर आसक्तिरहित होकर कर्तव्य-कर्मका भलीभाँति आचरण कर; क्योंकि आसक्तिरहित होकर कर्म करता हुआ मनुष्य परमात्माको प्राप्त हो जाता है।",
    "has_hindi_translation": true
  },
  "BG_3_30": {
    "id": "BG_3_30",
    "chapter": 3,
    "verse": 30,
    "reference": "3.30",
    "sanskrit": "मयि सर्वाणि कर्माणि संन्यस्याध्यात्म-चेतसा |\nनिराशीर् निर्ममो भूत्वा युध्यस्व विगत-ज्वरः",
    "transliteration": "mayi sarvāṇi karmāṇi saṃnyasyādhyātma-cetasā |\nnirāśīr nirmamo bhūtvā yudhyasva vigata-jvaraḥ",
    "english_translation": "Lay all your actions at My feet, with your mind fixed on the Self; free of craving, free of mine-ness, shed the fever of grief and fight.",
    "hindi_translation": "तू विवेकवती बुद्धिके द्वारा सम्पूर्ण कर्तव्य-कर्मोंको मेरे अर्पण करके कामना, ममता और संताप-रहित होकर युद्धरूप कर्तव्य-कर्मको कर।",
    "has_hindi_translation": true
  },
  "BG_3_37": {
    "id": "BG_3_37",
    "chapter": 3,
    "verse": 37,
    "reference": "3.37",
    "sanskrit": "काम एष क्रोध एष रजो-गुण-समुद्भवः |\nमहाशनो महा-पाप्मा विद्ध्य् एनम् इह वैरिणम्",
    "transliteration": "kāma eṣa krodha eṣa rajo-guṇa-samudbhavaḥ |\nmahāśano mahā-pāpmā viddhy enam iha vairiṇam",
    "english_translation": "Desire is your enemy here, and anger is desire blocked and turned, both born of rajas, both insatiable, both generators of sin. Know this one force as the foe.",
    "hindi_translation": "श्रीभगवान् बोले - रजोगुणसे उत्पन्न हुआ यह काम ही क्रोध है। यह बहुत खानेवाला और महापापी है। इस विषयमें तू इसको ही वैरी जान।",
    "has_hindi_translation": true
  },
  "BG_4_7": {
    "id": "BG_4_7",
    "chapter": 4,
    "verse": 7,
    "reference": "4.7",
    "sanskrit": "यदा यदा हि धर्मस्य ग्लानिर् भवति भारत |\nअभ्युत्थानम् अधर्मस्य तदात्मानं सृजाम्य् अहम्",
    "transliteration": "yadā yadā hi dharmasya glānir bhavati bhārata |\nabhyutthānam adharmasya tadātmānaṃ sṛjāmy aham",
    "english_translation": "Whenever righteousness withers and lawlessness rises, Arjuna, I bring myself forth.",
    "hindi_translation": "हे भरतवंशी अर्जुन! जब-जब धर्मकी हानि और अधर्मकी वृद्धि होती है, तब-तब ही मैं अपने-आपको साकाररूपसे प्रकट करता हूँ।",
    "has_hindi_translation": true
  },
  "BG_4_8": {
    "id": "BG_4_8",
    "chapter": 4,
    "verse": 8,
    "reference": "4.8",
    "sanskrit": "परित्राणाय साधूनां विनाशाय च दुष्कृताम् । धर्मसंस्थापनार्थाय सम्भवामि युगे युगे",
    "transliteration": "paritrāṇāya sādhūnāṃ vināśāya ca duṣkṛtām |\ndharmasaṃsthāpanārthāya sambhavāmi yuge yuge",
    "english_translation": "I come into being age after age to protect the righteous, destroy evildoers, and set *dharma* firmly back on its feet.",
    "hindi_translation": "साधुओं-(भक्तों-) की रक्षा करनेके लिये, पापकर्म करनेवालोंका विनाश करनेके लिये और धर्मकी भलीभाँति स्थापना करनेके लिये मैं युग-युगमें प्रकट हुआ करता हूँ।",
    "has_hindi_translation": true
  },
  "BG_4_18": {
    "id": "BG_4_18",
    "chapter": 4,
    "verse": 18,
    "reference": "4.18",
    "sanskrit": "कर्मण्य् अकर्म यः पश्येद् अकर्मणि च कर्म यः |\nस बुद्धिमान् मनुष्येषु स युक्तः कृत्स्न-कर्म-कृत्",
    "transliteration": "karmaṇy akarma yaḥ paśyed akarmaṇi ca karma yaḥ |\nsa buddhimān manuṣyeṣu sa yuktaḥ kṛtsna-karma-kṛt",
    "english_translation": "He who sees non-action within action, and action within stillness, is wise among men and fulfilled in all his works.",
    "hindi_translation": "जो मनुष्य कर्ममें अकर्म देखता है और जो अकर्ममें कर्म देखता है, वह मनुष्योंमें बुद्धिमान् है, योगी है और सम्पूर्ण कर्मोंको करनेवाला है।",
    "has_hindi_translation": true
  },
  "BG_4_34": {
    "id": "BG_4_34",
    "chapter": 4,
    "verse": 34,
    "reference": "4.34",
    "sanskrit": "तद् विद्धि प्रणिपातेन परिप्रश्नेन सेवया |\nउपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस् तत्त्व-दर्शिनः",
    "transliteration": "tad viddhi praṇipātena paripraśnena sevayā |\nupadekṣyanti te jñānaṃ jñāninas tattva-darśinaḥ",
    "english_translation": "Go to teachers who have not just studied the truth but seen it directly, approaching with full prostration, sincere questioning, and willing service, and they will give you this knowledge.",
    "hindi_translation": "उस- (तत्त्वज्ञान-) को (तत्त्वदर्शी ज्ञानी महापुरुषोंके पास जाकर) समझ। उनको साष्टाङ्ग दण्डवत् प्रणाम करनेसे, उनकी सेवा करनेसे और सरलतापूर्वक प्रश्न करनेसे वे तत्त्वदर्शी ज्ञानी महापुरुष तुझे उस तत्त्वज्ञानका उपदेश देंगे।",
    "has_hindi_translation": true
  },
  "BG_5_2": {
    "id": "BG_5_2",
    "chapter": 5,
    "verse": 2,
    "reference": "5.2",
    "sanskrit": "संन्यासः कर्म-योगश् च निःश्रेयस-कराव् उभौ |\nतयोस् तु कर्म-संन्यासात् कर्म-योगो विशिष्यते",
    "transliteration": "saṃnyāsaḥ karma-yogaś ca niḥśreyasa-karāv ubhau |\ntayos tu karma-saṃnyāsāt karma-yogo viśiṣyate",
    "english_translation": "Both paths lead to the highest good, but karma-yoga surpasses mere renunciation of action for one not yet ready to relinquish it cleanly.",
    "hindi_translation": "श्रीभगवान् बोले -- संन्यास (सांख्ययोग) और कर्मयोग दोनों ही कल्याण करनेवाले हैं। परन्तु उन दोनोंमें भी कर्मसंन्यास- (सांख्ययोग-) से कर्मयोग श्रेष्ठ है।",
    "has_hindi_translation": true
  },
  "BG_5_10": {
    "id": "BG_5_10",
    "chapter": 5,
    "verse": 10,
    "reference": "5.10",
    "sanskrit": "ब्रह्मण्य् आधाय कर्माणि सङ्गं त्यक्त्वा करोति यः |\nलिप्यते न स पापेन पद्म-पत्रम् इवाम्भसा",
    "transliteration": "brahmaṇy ādhāya karmāṇi saṅgaṃ tyaktvā karoti yaḥ |\nlipyate na sa pāpena padma-patram ivāmbhasā",
    "english_translation": "Whoever rests all actions in Brahman and sheds attachment is not stained by sin, as a lotus leaf is not stained by water.",
    "hindi_translation": "जो (भक्तियोगी) सम्पूर्ण कर्मोंको भगवान् में अर्पण करके और आसक्तिका त्याग करके कर्म करता है, वह जलसे कमलके पत्तेकी तरह पापसे लिप्त नहीं होता।",
    "has_hindi_translation": true
  },
  "BG_5_18": {
    "id": "BG_5_18",
    "chapter": 5,
    "verse": 18,
    "reference": "5.18",
    "sanskrit": "विद्या-विनय-संपन्ने ब्राह्मणे गवि हस्तिनि |\nशुनि चैव श्वपाके च पण्डिताः सम-दर्शिनः",
    "transliteration": "vidyā-vinaya-saṃpanne brāhmaṇe gavi hastini |\nśuni caiva śvapāke ca paṇḍitāḥ sama-darśinaḥ",
    "english_translation": "The wise see the same self in a learned and gentle brahmin, in a cow, an elephant, a dog, and the lowest-born outcast.",
    "hindi_translation": "ज्ञानी महापुरुष विद्या-विनययुक्त ब्राह्मणमें और चाण्डालमें तथा गाय, हाथी एवं कुत्तेमें भी समरूप परमात्माको देखनेवाले होते हैं।",
    "has_hindi_translation": true
  },
  "BG_5_29": {
    "id": "BG_5_29",
    "chapter": 5,
    "verse": 29,
    "reference": "5.29",
    "sanskrit": "भोक्तारं यज्ञ-तपसां सर्व-लोक-महेश्वरम् |\nसुहृदं सर्व-भूतानां ज्ञात्वा मां शान्तिम् ऋच्छति",
    "transliteration": "bhoktāraṃ yajña-tapasāṃ sarva-loka-maheśvaram |\nsuhṛdaṃ sarva-bhūtānāṃ jñātvā māṃ śāntim ṛcchati",
    "english_translation": "Knowing Krishna as the one who receives every sacrifice and austerity, as the sovereign lord of all worlds, and as the unconditional friend of every living being, you reach peace.",
    "hindi_translation": "भक्त मुझे सब यज्ञों और तपोंका भोक्ता, सम्पूर्ण लोकोंका महान् ईश्वर तथा सम्पूर्ण प्राणियोंका सुहृद् (स्वार्थरहित दयालु और प्रेमी) जानकर शान्तिको प्राप्त हो जाता है।",
    "has_hindi_translation": true
  },
  "BG_6_5": {
    "id": "BG_6_5",
    "chapter": 6,
    "verse": 5,
    "reference": "6.5",
    "sanskrit": "उद्धरेद् आत्मनात्मानं नात्मानम् अवसादयेत् |\nआत्मैव ह्य् आत्मनो बन्धुर् आत्मैव रिपुर् आत्मनः",
    "transliteration": "uddhared ātmanātmānaṃ nātmānam avasādayet |\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    "english_translation": "Lift yourself up; do not let yourself sink. The self is its own best friend and its own worst enemy.",
    "hindi_translation": "अपने द्वारा अपना उद्धार करे, अपना पतन न करे; क्योंकि आप ही अपना मित्र है और आप ही अपना शत्रु है।",
    "has_hindi_translation": true
  },
  "BG_6_17": {
    "id": "BG_6_17",
    "chapter": 6,
    "verse": 17,
    "reference": "6.17",
    "sanskrit": "युक्ताहार-विहारस्य युक्त-चेष्टस्य कर्मसु |\nयुक्त-स्वप्नावबोधस्य योगो भवति दुःखहा",
    "transliteration": "yuktāhāra-vihārasya yukta-ceṣṭasya karmasu |\nyukta-svapnāvabodhasya yogo bhavati duḥkhahā",
    "english_translation": "Yoga becomes the destroyer of suffering for one whose eating and movement are measured, whose effort in action is proportioned, and whose sleep and waking keep their proper times.",
    "hindi_translation": "दुःखोंका नाश करनेवाला योग तो यथायोग्य आहार और विहार करनेवालेका, कर्मोंमें यथायोग्य चेष्टा करनेवालेका तथा यथायोग्य सोने और जागनेवालेका ही सिद्ध होता है।",
    "has_hindi_translation": true
  },
  "BG_6_26": {
    "id": "BG_6_26",
    "chapter": 6,
    "verse": 26,
    "reference": "6.26",
    "sanskrit": "यतो यतो निश्चरति मन चञ्चलम् अस्थिरम् |\nततस् ततो नियम्यैतद् आत्मन्य् एव वशं नयेत्",
    "transliteration": "yato yato niścarati mana cañcalam asthiram |\ntatas tato niyamyaitad ātmany eva vaśaṃ nayet",
    "english_translation": "Wherever the restless, unsteady mind wanders, bring it back under the Self's control, again and again.",
    "hindi_translation": "यह अस्थिर और चञ्चल मन जहाँ-जहाँ विचरण करता है, वहाँ-वहाँसे हटाकर इसको एक परमात्मामें ही लगाये।",
    "has_hindi_translation": true
  },
  "BG_6_35": {
    "id": "BG_6_35",
    "chapter": 6,
    "verse": 35,
    "reference": "6.35",
    "sanskrit": "असंशयं महाबाहो मनो दुर्णिग्रहं चलम् |\nअभ्यासेन तु कौन्तेय वैराग्येणश् च गृह्यते",
    "transliteration": "asaṃśayaṃ mahābāho mano durṇigrahaṃ calam |\nabhyāsena tu kaunteya vairāgyeṇaś ca gṛhyate",
    "english_translation": "Yes, the mind is restless and hard to hold, Krishna says, but practice and dispassion together can catch it.",
    "hindi_translation": "श्रीभगवान् बोले -- हे महाबाहो ! यह मन बड़ा चञ्चल है और इसका निग्रह करना भी बड़ा कठिन है -- यह तुम्हारा कहना बिलकुल ठीक है। परन्तु हे कुन्तीनन्दन ! अभ्यास और वैराग्यके द्वारा इसका निग्रह किया जाता है।",
    "has_hindi_translation": true
  },
  "BG_7_4": {
    "id": "BG_7_4",
    "chapter": 7,
    "verse": 4,
    "reference": "7.4",
    "sanskrit": "भूमिर् आपो ऽनलो वायुः खं मनो बुद्धिर् एव च |\nअहंकार इतीयं मे भिन्ना प्रकृतिर् अष्टधा",
    "transliteration": "bhūmir āpo 'nalo vāyuḥ khaṃ mano buddhir eva ca |\nahaṃkāra itīyaṃ me bhinnā prakṛtir aṣṭadhā",
    "english_translation": "Earth, water, fire, air, space, mind, intellect, and ego-sense: these eight are My nature, divided.",
    "hindi_translation": "पृथ्वी, जल, तेज, वायु, आकाश -- ये पञ्चमहाभूत और मन, बुद्धि तथा अहंकार -- यह आठ प्रकारके भेदोंवाली मेरी 'अपरा' प्रकृति है।",
    "has_hindi_translation": true
  },
  "BG_7_5": {
    "id": "BG_7_5",
    "chapter": 7,
    "verse": 5,
    "reference": "7.5",
    "sanskrit": "अपरेयम् इतस् त्व् अन्यां प्रकृतिं विद्धि मे पराम् |\nजीव-भूतां महाबाहो ययेदं धार्यते जगत्",
    "transliteration": "apareyam itas tv anyāṃ prakṛtiṃ viddhi me parām |\njīva-bhūtāṃ mahābāho yayedaṃ dhāryate jagat",
    "english_translation": "Beyond this lower nature, know My higher one: the conscious beings, O mighty-armed, by which this whole world is sustained.",
    "hindi_translation": "हे महाबाहो! इस अपरा प्रकृतिसे भिन्न जीवरूप बनी हुई मेरी 'परा' प्रकृतिको जान, जिसके द्वारा यह जगत् धारण किया जाता है।",
    "has_hindi_translation": true
  },
  "BG_7_16": {
    "id": "BG_7_16",
    "chapter": 7,
    "verse": 16,
    "reference": "7.16",
    "sanskrit": "चतुर्-विधा भजन्ते मां जनाः सुकृतिनो ऽर्जुन |\nआर्तो जिज्ञासुर् अर्थार्थी ज्ञानी च भरतर्षभ",
    "transliteration": "catur-vidhā bhajante māṃ janāḥ sukṛtino 'rjuna |\nārto jijñāsur arthārthī jñānī ca bharatarṣabha",
    "english_translation": "Four kinds of virtuous people come to Me, Arjuna: those in distress, those who seek to understand, those who seek worldly gain, and the wise.",
    "hindi_translation": "हे भरतवंशियोंमें श्रेष्ठ अर्जुनव ! पवित्र कर्म करनेवाले अर्थार्थी, आर्त, जिज्ञासु और ज्ञानी अर्थात् प्रेमी -- ये चार प्रकारके मनुष्य मेरा भजन करते हैं अर्थात् मेरे शरण होते हैं।",
    "has_hindi_translation": true
  },
  "BG_7_19": {
    "id": "BG_7_19",
    "chapter": 7,
    "verse": 19,
    "reference": "7.19",
    "sanskrit": "बहूनां जन्मनाम् अन्ते ज्ञानवान् मां प्रपद्यते |\nवासुदेवः सर्वम् इति स महात्मा सुदुर्लभः",
    "transliteration": "bahūnāṃ janmanām ante jñānavān māṃ prapadyate |\nvāsudevaḥ sarvam iti sa mahātmā sudurlabhaḥ",
    "english_translation": "After many births, the one in whom knowledge has fully ripened surrenders to me, knowing that Vāsudeva is all. Such a great soul is exceedingly rare.",
    "hindi_translation": "बहुत जन्मोंके अन्तमें अर्थात् मनुष्यजन्ममें 'सब कुछ परमात्मा ही है', ऐसा जो ज्ञानवान् मेरे शरण होता है, वह महात्मा अत्यन्त दुर्लभ है।",
    "has_hindi_translation": true
  },
  "BG_8_5": {
    "id": "BG_8_5",
    "chapter": 8,
    "verse": 5,
    "reference": "8.5",
    "sanskrit": "अन्त-काले च माम् एव स्मरन् मुक्त्वा कलेवरम् |\nयः प्रयाति स मद्-भावं याति नास्त्य् अत्र संशयः",
    "transliteration": "anta-kāle ca mām eva smaran muktvā kalevaram |\nyaḥ prayāti sa mad-bhāvaṃ yāti nāsty atra saṃśayaḥ",
    "english_translation": "Whoever remembers Me at the moment of death and leaves the body reaches My state, of this there is no doubt.",
    "hindi_translation": "जो मनुष्य अन्तकालमें भी मेरा स्मरण करते हुए शरीर छोड़कर जाता है, वह मेरे स्वरुप को ही प्राप्त होता है, इसमें सन्देह नहीं है।",
    "has_hindi_translation": true
  },
  "BG_8_7": {
    "id": "BG_8_7",
    "chapter": 8,
    "verse": 7,
    "reference": "8.7",
    "sanskrit": "तस्मात् सर्वेषु कालेषु माम् अनुस्मर युध्य च |\nमय्य् अर्पित-मनो-बुद्धिर् माम् एवैष्यस्य् असंशयः",
    "transliteration": "tasmāt sarveṣu kāleṣu mām anusmara yudhya ca |\nmayy arpita-mano-buddhir mām evaiṣyasy asaṃśayaḥ",
    "english_translation": "Keep remembering Me at every hour and fight; with your mind and discernment given over to Me, you will reach Me without doubt.",
    "hindi_translation": "इसलिये तू सब समयमें मेरा स्मरण कर और युद्ध भी कर। मेरेमें मन और बुद्धि अर्पित करनेवाला तू निःसन्देह मेरेको ही प्राप्त होगा।",
    "has_hindi_translation": true
  },
  "BG_8_13": {
    "id": "BG_8_13",
    "chapter": 8,
    "verse": 13,
    "reference": "8.13",
    "sanskrit": "ओम् इत्य् एकाक्षरं ब्रह्म व्याहरन् माम् अनुस्मरन् |\nयः प्रयाति त्यजन् देहं स याति परमां गतिम्",
    "transliteration": "om ity ekākṣaraṃ brahma vyāharan mām anusmaran |\nyaḥ prayāti tyajan dehaṃ sa yāti paramāṃ gatim",
    "english_translation": "Whoever leaves the body chanting the single syllable *Oṃ* and holding me in mind reaches the supreme destination.",
    "hindi_translation": "जो साधक 'ऊँ' इस एक अक्षर ब्रह्मका उच्चारण और मेरा स्मरण करता हुआ शरीरको छोड़कर जाता है, वह परमगतिको प्राप्त होता है।",
    "has_hindi_translation": true
  },
  "BG_8_15": {
    "id": "BG_8_15",
    "chapter": 8,
    "verse": 15,
    "reference": "8.15",
    "sanskrit": "माम् उपेत्य पुनर्-जन्म दुःखालयम् अशाश्वतम् |\nनाप्नुवन्ति महात्मानः संसिद्धिं परमां गताः",
    "transliteration": "mām upetya punar-janma duḥkhālayam aśāśvatam |\nnāpnuvanti mahātmānaḥ saṃsiddhiṃ paramāṃ gatāḥ",
    "english_translation": "Those great souls who reach Me do not come back to rebirth, which is a home of suffering and nothing lasting.",
    "hindi_translation": "महात्मालोग मुझे प्राप्त करके दुःखालय और अशाश्वत पुनर्जन्मको प्राप्त नहीं होते; क्योंकि वे परमसिद्धिको प्राप्त हो गये हैं अर्थात् उनको परम प्रेमकी प्राप्ति हो गयी है।",
    "has_hindi_translation": true
  },
  "BG_9_22": {
    "id": "BG_9_22",
    "chapter": 9,
    "verse": 22,
    "reference": "9.22",
    "sanskrit": "अनन्याश् चिन्तयन्तो मां ये जनाः पर्युपासते |\nतेषां नित्याभियुक्तानां योग-क्षेमं वहाम्य् अहम्",
    "transliteration": "ananyāś cintayanto māṃ ye janāḥ paryupāsate |\nteṣāṃ nityābhiyuktānāṃ yoga-kṣemaṃ vahāmy aham",
    "english_translation": "Those who think of Me alone and worship Me without turning elsewhere, I carry what they need and preserve what they have.",
    "hindi_translation": "जो अनन्य भक्त मेरा चिन्तन करते हुए मेरी उपासना करते हैं, मेरेमें निरन्तर लगे हुए उन भक्तोंका योगक्षेम (अप्राप्तकी प्राप्ति और प्राप्तकी रक्षा) मैं वहन करता हूँ।",
    "has_hindi_translation": true
  },
  "BG_9_26": {
    "id": "BG_9_26",
    "chapter": 9,
    "verse": 26,
    "reference": "9.26",
    "sanskrit": "पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति |\nतद् अहं भक्त्य्-उपहृतम् अश्नामि प्रयतात्मनः",
    "transliteration": "patraṃ puṣpaṃ phalaṃ toyaṃ yo me bhaktyā prayacchati |\ntad ahaṃ bhakty-upahṛtam aśnāmi prayatātmanaḥ",
    "english_translation": "Offer Me a leaf, a flower, a fruit, or water with devotion, and I receive it, for what I accept is the love behind the gift, not the gift itself.",
    "hindi_translation": "जो भक्त पत्र, पुष्प, फल, जल आदि (यथासाध्य प्राप्त वस्तु) को भक्तिपूर्वक मेरे अर्पण करता है, उस मेरेमें तल्लीन हुए अन्तःकरणवाले भक्तके द्वारा भक्तिपूर्वक दिये हुए उपहार-(भेंट-) को मैं खा लेता हूँ।",
    "has_hindi_translation": true
  },
  "BG_9_27": {
    "id": "BG_9_27",
    "chapter": 9,
    "verse": 27,
    "reference": "9.27",
    "sanskrit": "यत् करोषि यद् अश्नासि यज् जुहोषि ददासि यत् |\nयत् तपस्यसि कौन्तेय तत् कुरुष्व मद्-अर्पणम्",
    "transliteration": "yat karoṣi yad aśnāsi yaj juhoṣi dadāsi yat |\nyat tapasyasi kaunteya tat kuruṣva mad-arpaṇam",
    "english_translation": "Whatever you do, eat, offer in fire, give away, or endure as austerity, Arjuna, offer it all to Me.",
    "hindi_translation": "हे कुन्तीपुत्र ! तू जो कुछ करता है, जो कुछ खाता है, जो कुछ यज्ञ करता है, जो कुछ दान देता है और जो कुछ तप करता है, वह सब मेरे अर्पण कर दे।",
    "has_hindi_translation": true
  },
  "BG_9_30": {
    "id": "BG_9_30",
    "chapter": 9,
    "verse": 30,
    "reference": "9.30",
    "sanskrit": "अपि चेत् सुदुराचारो भजते माम् अनन्य-भाक् |\nसाधुर् एव स मन्तव्यः सम्यग् व्यवसितो हि सः",
    "transliteration": "api cet sudurācāro bhajate mām ananya-bhāk |\nsādhur eva sa mantavyaḥ samyag vyavasito hi saḥ",
    "english_translation": "Even the worst sinner, if he worships me with undivided devotion, is to be counted among the righteous, for his resolve is sound.",
    "hindi_translation": "अगर कोई दुराचारी-से-दुराचारी भी अनन्यभावसे मेरा भजन करता है, तो उसको साधु ही मानना चाहिये। कारण कि उसने निश्चय बहुत अच्छी तरह कर लिया है।",
    "has_hindi_translation": true
  },
  "BG_10_8": {
    "id": "BG_10_8",
    "chapter": 10,
    "verse": 8,
    "reference": "10.8",
    "sanskrit": "अहं सर्वस्य प्रभवो मत्तः सर्वं प्रवर्तते |\nइति मत्वा भजन्ते मां बुधा भाव-समन्विताः",
    "transliteration": "ahaṃ sarvasya prabhavo mattaḥ sarvaṃ pravartate |\niti matvā bhajante māṃ budhā bhāva-samanvitāḥ",
    "english_translation": "I am the origin of everything, and from me alone all of it flows. Knowing this, the wise worship me with devotion.",
    "hindi_translation": "मैं संसारमात्रका प्रभव (मूलकारण) हूँ, और मुझसे ही सारा संसार प्रवृत्त हो रहा है अर्थात् चेष्टा कर रहा है -- ऐसा मेरेको मानकर मेरेमें ही श्रद्धा-प्रेम रखते हुए बुद्धिमान् भक्त मेरा ही भजन करते हैं -- सब प्रकारसे मेरे ही शरण होते हैं।",
    "has_hindi_translation": true
  },
  "BG_10_20": {
    "id": "BG_10_20",
    "chapter": 10,
    "verse": 20,
    "reference": "10.20",
    "sanskrit": "अहम् आत्मा गुडाकेश सर्व-भूताशय-स्थितः |\nअहम् आदिश् च मध्यं च भूतानाम् अन्त एव च",
    "transliteration": "aham ātmā guḍākeśa sarva-bhūtāśaya-sthitaḥ |\naham ādiś ca madhyaṃ ca bhūtānām anta eva ca",
    "english_translation": "I am the Self seated in the heart of every being, Arjuna; I am their beginning, their middle, and their end.",
    "hindi_translation": "हे नींदको जीतनेवाले अर्जुन ! सम्पूर्ण प्राणियोंके आदि, मध्य तथा अन्तमें भी मैं ही हूँ और प्राणियोंके अन्तःकरणमें आत्मरूपसे भी मैं ही स्थित हूँ।",
    "has_hindi_translation": true
  },
  "BG_10_41": {
    "id": "BG_10_41",
    "chapter": 10,
    "verse": 41,
    "reference": "10.41",
    "sanskrit": "यद् यद् विभूतिमत् सत्त्वं श्रीमद् ऊर्जितम् एव वा |\nतत् तद् एवावगच्छ त्वं मम तेजो ऽंश-संभवम्",
    "transliteration": "yad yad vibhūtimat sattvaṃ śrīmad ūrjitam eva vā |\ntat tad evāvagaccha tvaṃ mama tejo 'ṃśa-saṃbhavam",
    "english_translation": "Whatever you see that is radiant, prosperous, or mighty, know it as born from a single spark of my brilliance.",
    "hindi_translation": "जो-जो ऐश्वर्ययुक्त, शोभायुक्त और बलयुक्त प्राणी तथा वस्तु है, उस-उसको तुम मेरे ही तेज-(योग-) के अंशसे उत्पन्न हुई समझो।",
    "has_hindi_translation": true
  },
  "BG_10_42": {
    "id": "BG_10_42",
    "chapter": 10,
    "verse": 42,
    "reference": "10.42",
    "sanskrit": "अथ वा बहुनैतेन किं ज्ञातेन तवार्जुन |\nविष्टभ्याहम् इदं कृत्स्नम् एकांशेन स्थितो जगत्",
    "transliteration": "atha vā bahunaitena kiṃ jñātena tavārjuna |\nviṣṭabhyāham idaṃ kṛtsnam ekāṃśena sthito jagat",
    "english_translation": "But why dwell on all these details, Arjuna? With just a fragment of myself I stand here, pervading and sustaining the entire universe.",
    "hindi_translation": "अथवा हे अर्जुन ! तुम्हें इस प्रकार बहुत-सी बातें जाननेकी क्या आवश्यकता है? मैं अपने किसी एक अंशसे सम्पूर्ण जगत् को व्याप्त करके स्थित हूँ।",
    "has_hindi_translation": true
  },
  "BG_11_12": {
    "id": "BG_11_12",
    "chapter": 11,
    "verse": 12,
    "reference": "11.12",
    "sanskrit": "दिवि सूर्य-सहस्रस्य भवेद् युगपद् उत्थिता |\nयदि भाः सदृशी सा स्याद् भासस् तस्य महात्मनः",
    "transliteration": "divi sūrya-sahasrasya bhaved yugapad utthitā |\nyadi bhāḥ sadṛśī sā syād bhāsas tasya mahātmanaḥ",
    "english_translation": "If a thousand suns were to rise together in the sky at once, their combined light might barely match the radiance of that great being.",
    "hindi_translation": "अगर आकाशमें एक साथ हजारों सूर्य उदित हो जायँ, तो भी उन सबका प्रकाश मिलकर उस महात्मा-(विराट् रूप परमात्मा-) के प्रकाशके समान शायद ही हो।",
    "has_hindi_translation": true
  },
  "BG_11_32": {
    "id": "BG_11_32",
    "chapter": 11,
    "verse": 32,
    "reference": "11.32",
    "sanskrit": "कालो ऽस्मि लोक-क्षय-कृत् प्रवृद्धो लोकान् समाहर्तुम् इह प्रवृत्तः |\nऋते ऽपि त्वा न भविष्यन्ति सर्वे ये ऽवस्थिताः प्रत्यनीकेषु योधाः",
    "transliteration": "kālo 'smi loka-kṣaya-kṛt pravṛddho lokān samāhartum iha pravṛttaḥ |\nṛte 'pi tvā na bhaviṣyanti sarve ye 'vasthitāḥ pratyanīkeṣu yodhāḥ",
    "english_translation": "I am Time, the destroyer of worlds, fully aroused and set in motion to consume these armies. Without you, Arjuna, not one warrior arrayed against you will survive.",
    "hindi_translation": "श्रीभगवान् बोले -- मैं सम्पूर्ण लोकोंका क्षय करनेवाला बढ़ा हुआ काल हूँ और इस समय मैं इन सब लोगोंका संहार करनेके लिये यहाँ आया हूँ। तुम्हारे प्रतिपक्षमें जो योद्धालोग खड़े हैं, वे सब तुम्हारे युद्ध किये बिना भी नहीं रहेंगे।",
    "has_hindi_translation": true
  },
  "BG_11_45": {
    "id": "BG_11_45",
    "chapter": 11,
    "verse": 45,
    "reference": "11.45",
    "sanskrit": "अदृष्ट-पूर्वं हृषितो ऽस्मि दृष्ट्वा भयेन च प्रव्यथितं मनो मे |\nतद् एव मे दर्शय देव रूपं प्रसीद देवेश जगन्-निवास",
    "transliteration": "adṛṣṭa-pūrvaṃ hṛṣito 'smi dṛṣṭvā bhayena ca pravyathitaṃ mano me |\ntad eva me darśaya deva rūpaṃ prasīda deveśa jagan-nivāsa",
    "english_translation": "I am thrilled to see what no eye has seen before, yet my mind shakes with fear. Show me that form of yours again, O Lord of gods, refuge of the world, and be gracious to me.",
    "hindi_translation": "मैंने ऐसा रुप पहले कभी नहीं देखा। इस रूपको देखकर मैं हर्षित हो रहा हूँ और (साथ-ही-साथ) भयसे मेरा मन अत्यन्त व्यथित हो रहा है। अतः आप मुझे अपने उसी देवरूपको (सौम्य विष्णुरूपको) दिखाइये। हे देवेश ! हे जगन्निवास ! आप प्रसन्न होइये।",
    "has_hindi_translation": true
  },
  "BG_11_55": {
    "id": "BG_11_55",
    "chapter": 11,
    "verse": 55,
    "reference": "11.55",
    "sanskrit": "मत्-कर्म-कृन् मत्-परमो मद्-भक्तः सङ्ग-वर्जितः |\nनिर्वैरः सर्व-भूतेषु यः स माम् एति पाण्डव",
    "transliteration": "mat-karma-kṛn mat-paramo mad-bhaktaḥ saṅga-varjitaḥ |\nnirvairaḥ sarva-bhūteṣu yaḥ sa mām eti pāṇḍava",
    "english_translation": "Act for Me, hold Me as your highest aim, devote yourself to Me, drop all attachment, and carry no enmity toward any living being; that one, Arjuna, comes to Me.",
    "hindi_translation": "हे पाण्डवन ! जो मेरे लिये ही कर्म करनेवाला, मेरे ही परायण और मेरा ही भक्त है तथा सर्वथा आसक्तिरहित और प्राणिमात्रके साथ निर्वैर है, वह भक्त मेरेको प्राप्त होता है।",
    "has_hindi_translation": true
  },
  "BG_12_6": {
    "id": "BG_12_6",
    "chapter": 12,
    "verse": 6,
    "reference": "12.6",
    "sanskrit": "ये तु सर्वाणि कर्माणि मयि संन्यस्य मत्-पराः |\nअनन्येनैव योगेन मां ध्यायन्त उपासते",
    "transliteration": "ye tu sarvāṇi karmāṇi mayi saṃnyasya mat-parāḥ |\nananyenaiva yogena māṃ dhyāyanta upāsate",
    "english_translation": "Those who surrender all their actions to Me, hold Me as their sole aim, and worship Me through undivided devotion meditate on Me with nothing else as their support.",
    "hindi_translation": "परन्तु जो कर्मोंको मेरे अर्पण करके और मेरे परायण होकर अनन्ययोगसे मेरा ही ध्यान करते हुए मेरी उपासना करते हैं।",
    "has_hindi_translation": true
  },
  "BG_12_13": {
    "id": "BG_12_13",
    "chapter": 12,
    "verse": 13,
    "reference": "12.13",
    "sanskrit": "अद्वेष्टा सर्व-भूतानां मैत्रः करुण एव च |\nनिर्ममो निरहंकारः सम-दुःख-सुखः क्षमी",
    "transliteration": "adveṣṭā sarva-bhūtānāṃ maitraḥ karuṇa eva ca |\nnirmamo nirahaṃkāraḥ sama-duḥkha-sukhaḥ kṣamī",
    "english_translation": {
      "reading_summary": "(reading summary extraction pending; ENABLE_READING_SUMMARIES=true to generate)",
      "key_cross_references": [],
      "witness_passages": [
        "sridhara_12.13"
      ],
      "score": 0.5,
      "english_rendering": "Sridhara Svami reads these eight slokas (beginning 'advesta') as the qualities that swiftly (ksipram) produce the Lord's grace (paramesvara-prasada) for the devotee already described. Advesta toward all beings is glossed in three relational registers: toward superiors one is free of envy; toward equals one moves with friendly fellow-feeling (maitri); toward those in distress one extends compassion (karuna). Nirmama and nirahankara together remove the two great obstacles — possessiveness and body-identification — and from their removal equanimity in pain and pleasure (sama-duhkha-sukha) follows naturally; ksama (forbearance) is the stabilizing virtue that holds the whole disposition steady under provocation."
    },
    "hindi_translation": "सब प्राणियोंमें द्वेषभावसे रहित, सबका मित्र (प्रेमी) और दयालु, ममतारहित, अहंकाररहित, सुखदुःखकी प्राप्तिमें सम, क्षमाशील, निरन्तर सन्तुष्ट, योगी, शरीरको वशमें किये हुए, दृढ़ निश्चयवाला? मेरेमें अर्पित मनबुद्धिवाला जो मेरा भक्त है, वह मेरेको प्रिय है।",
    "has_hindi_translation": true
  },
  "BG_12_15": {
    "id": "BG_12_15",
    "chapter": 12,
    "verse": 15,
    "reference": "12.15",
    "sanskrit": "यस्मान् नोद्विजते लोको लोकान् नोद्विजते च यः |\nहर्षामर्ष-भयोद्वेगैर् मुक्तो यः स च मे प्रियः",
    "transliteration": "yasmān nodvijate loko lokān nodvijate ca yaḥ |\nharṣāmarṣa-bhayodvegair mukto yaḥ sa ca me priyaḥ",
    "english_translation": "The one from whom the world shrinks not, and who shrinks not from the world, free from elation, resentment, fear, and anxious agitation, is dear to me.",
    "hindi_translation": "जिससे किसी प्राणीको उद्वेग नहीं होता और जिसको खुद भी किसी प्राणीसे उद्वेग नहीं होता तथा जो हर्ष, अमर्ष (ईर्ष्या), भय और उद्वेगसे रहित है, वह मुझे प्रिय है।",
    "has_hindi_translation": true
  },
  "BG_12_20": {
    "id": "BG_12_20",
    "chapter": 12,
    "verse": 20,
    "reference": "12.20",
    "sanskrit": "ये तु धर्म्यामृतम् इदं यथोक्तं पर्युपासते |\nश्रद्दधाना मत्-परमा भक्तास् ते ऽतीव मे प्रियाः",
    "transliteration": "ye tu dharmyāmṛtam idaṃ yathoktaṃ paryupāsate |\nśraddadhānā mat-paramā bhaktās te 'tīva me priyāḥ",
    "english_translation": "Those who follow this path of devoted living, exactly as taught, keeping you as their highest aim, are dearest to you of all.",
    "hindi_translation": "जो मेरेमें श्रद्धा रखनेवाले और मेरे परायण हुए भक्त पहले कहे हुए इस धर्ममय अमृतका अच्छी तरहसे सेवन करते हैं, वे मुझे अत्यन्त प्रिय हैं।",
    "has_hindi_translation": true
  },
  "BG_13_2": {
    "id": "BG_13_2",
    "chapter": 13,
    "verse": 2,
    "reference": "13.2",
    "sanskrit": "क्षेत्रज्ञं चापि मां विद्धि सर्व-क्षेत्रेषु भारत |\nक्षेत्र-क्षेत्रज्ञयोर् ज्ञानं यत् तज् ज्ञानं मतं मम",
    "transliteration": "kṣetrajñaṃ cāpi māṃ viddhi sarva-kṣetreṣu bhārata |\nkṣetra-kṣetrajñayor jñānaṃ yat taj jñānaṃ mataṃ mama",
    "english_translation": "Know me as the knower of the field in every body, Arjuna. That knowledge, of field and knower together, is the knowledge I hold to be true.",
    "hindi_translation": "हे भरतवंशोद्भव अर्जुन ! तू सम्पूर्ण क्षेत्रोंमें क्षेत्रज्ञ मेरेको ही समझ; और क्षेत्र-क्षेत्रज्ञका जो ज्ञान है, वही मेरे मतमें ज्ञान है।",
    "has_hindi_translation": true
  },
  "BG_13_7": {
    "id": "BG_13_7",
    "chapter": 13,
    "verse": 7,
    "reference": "13.7",
    "sanskrit": "अमानित्वम् अदम्भित्वम् अहिंसा क्षान्तिर् आर्जवम् |\nआचार्योपासनं शौचं स्थैर्यम् आत्म-विनिग्रहः",
    "transliteration": "amānitvam adambhitvam ahiṃsā kṣāntir ārjavam |\nācāryopāsanaṃ śaucaṃ sthairyam ātma-vinigrahaḥ",
    "english_translation": {
      "reading_summary": "(reading summary extraction pending; ENABLE_READING_SUMMARIES=true to generate)",
      "key_cross_references": [],
      "witness_passages": [
        "sridhara_13.7"
      ],
      "score": 0.5,
      "divergence_note": "Sridhara's bhashya in the payload covers 13.5-6 content. The 13.7 jnana-list rendering is inferred from his documented method. Flag: INFERRED.",
      "english_rendering": "Sridhara reads these eight qualities as the moral and epistemic conditions that make a person a fit vessel (adhikari) for the knowledge that will be unfolded in the remainder of chapter 13. Amanitvam and adambhitvam together remove the two barriers of pride and performative religiosity that prevent true receptivity; ahimsa and ksanti create the relational ground of safety in which the teacher's instruction can take root; arjavam ensures that the student's outer conduct matches inner intention. Acaryopasanam is the pivot — without it the other qualities float free of their purpose."
    },
    "hindi_translation": "मानित्व-(अपनेमें श्रेष्ठताके भाव-) का न होना, दम्भित्व-(दिखावटीपन-) का न होना, अहिंसा, क्षमा, सरलता, गुरुकी सेवा, बाहर-भीतरकी शुद्धि, स्थिरता और मनका वशमें होना।",
    "has_hindi_translation": true
  },
  "BG_13_22": {
    "id": "BG_13_22",
    "chapter": 13,
    "verse": 22,
    "reference": "13.22",
    "sanskrit": "उपद्रष्टानुमन्ता च भर्ता भोक्ता महेश्वरः |\nपरमात्मेति चाप्य् उक्तो देहे ऽस्मिन् पुरुषः परः",
    "transliteration": "upadraṣṭānumantā ca bhartā bhoktā maheśvaraḥ |\nparamātmeti cāpy ukto dehe 'smin puruṣaḥ paraḥ",
    "english_translation": "The highest Person dwelling in this body is the witness, the permitter, the sustainer, the true enjoyer, and the great Lord, called the Supreme Self.",
    "hindi_translation": "यह पुरुष प्रकृति-(शरीर-) के साथ सम्बन्ध रखनेसे 'उपद्रष्टा', उसके साथ मिलकर सम्मति, अनुमति देनेसे 'अनुमन्ता', अपनेको उसका भरणपोषण करनेवाला माननेसे 'भर्ता', उसके सङ्गसे सुखदुःख भोगनेसे 'भोक्ता', और अपनेको उसका स्वामी माननेसे 'महेश्वर' बन जाता है। परन्तु स्वरूपसे यह पुरुष 'परमात्मा' कहा जाता है। यह देहमें रहता हुआ भी देहसे पर (सम्बन्ध-रहित) ही है।",
    "has_hindi_translation": true
  },
  "BG_13_34": {
    "id": "BG_13_34",
    "chapter": 13,
    "verse": 34,
    "reference": "13.34",
    "sanskrit": "क्षेत्र-क्षेत्रज्ञयोर् एवम् अन्तरं ज्ञान-चक्षुषा |\nभूत-प्रकृति-मोक्षं च ये विदुर् यान्ति ते परम्",
    "transliteration": "kṣetra-kṣetrajñayor evam antaraṃ jñāna-cakṣuṣā |\nbhūta-prakṛti-mokṣaṃ ca ye vidur yānti te param",
    "english_translation": "Those who see with the eye of knowledge the difference between the field and its knower, and who understand how beings are released from material nature, reach the supreme.",
    "hindi_translation": "इस प्रकार जो ज्ञानरूपी नेत्रसे क्षेत्र और क्षेत्रज्ञके अन्तर-(विभाग-) को तथा कार्य-कारणसहित प्रकृतिसे स्वयंको अलग जानते हैं, वे परमात्माको प्राप्त हो जाते हैं।",
    "has_hindi_translation": true
  },
  "BG_14_5": {
    "id": "BG_14_5",
    "chapter": 14,
    "verse": 5,
    "reference": "14.5",
    "sanskrit": "सत्त्वं रजस् तम इति गुणाः प्रकृति-संभवाः |\nनिबध्नन्ति महा-बाहो देहे देहिनम् अव्ययम्",
    "transliteration": "sattvaṃ rajas tama iti guṇāḥ prakṛti-saṃbhavāḥ |\nnibadhnanti mahā-bāho dehe dehinam avyayam",
    "english_translation": "Sattva, rajas, and tamas arise from nature and bind the imperishable self within the body.",
    "hindi_translation": "हे महाबाहो ! प्रकृतिसे उत्पन्न होनेवाले सत्त्व, रज और तम -- ये तीनों गुण अविनाशी देहीको देहमें बाँध देते हैं।",
    "has_hindi_translation": true
  },
  "BG_14_6": {
    "id": "BG_14_6",
    "chapter": 14,
    "verse": 6,
    "reference": "14.6",
    "sanskrit": "तत्र सत्त्वं निर्मलत्वात् प्रकाशकम् अनामयम् |\nसुख-सङ्गेन बध्नाति ज्ञान-सङ्गेन चानघ",
    "transliteration": "tatra sattvaṃ nirmalatvāt prakāśakam anāmayam |\nsukha-saṅgena badhnāti jñāna-saṅgena cānagha",
    "english_translation": "Of the three, sattva is the purest, luminous and free from affliction, yet it still binds you, Arjuna, through attachment to happiness and to knowledge.",
    "hindi_translation": "हे पापरहित अर्जुन ! उन गुणोंमें सत्त्वगुण निर्मल (स्वच्छ) होनेके कारण प्रकाशक और निर्विकार है। वह सुख और ज्ञानकी आसक्तिसे (देहीको) बाँधता है।",
    "has_hindi_translation": true
  },
  "BG_14_7": {
    "id": "BG_14_7",
    "chapter": 14,
    "verse": 7,
    "reference": "14.7",
    "sanskrit": "रजो रागात्मकं विद्धि तृष्णासङ्ग-समुद्भवम् |\nतन् निबध्नाति कौन्तेय कर्म-सङ्गेन देहिनम्",
    "transliteration": "rajo rāgātmakaṃ viddhi tṛṣṇāsaṅga-samudbhavam |\ntan nibadhnāti kaunteya karma-saṅgena dehinam",
    "english_translation": "Know rajas as passion-natured, born of craving for what you lack and clinging to what you have; through that hunger for results, it binds the embodied soul to action.",
    "hindi_translation": "हे कुन्तीनन्दन ! तृष्णा और आसक्तिको पैदा करनेवाले रजोगुणको तुम रागस्वरूप समझो। वह कर्मोंकी आसक्तिसे शरीरधारीको बाँधता है।",
    "has_hindi_translation": true
  },
  "BG_14_8": {
    "id": "BG_14_8",
    "chapter": 14,
    "verse": 8,
    "reference": "14.8",
    "sanskrit": "तमस् त्व् अज्ञान-जं विद्धि मोहनं सर्व-देहिनाम् |\nप्रमादालस्य-निद्राभिस् तन् निबध्नाति भारत",
    "transliteration": "tamas tv ajñāna-jaṃ viddhi mohanaṃ sarva-dehinām |\npramādālasya-nidrābhis tan nibadhnāti bhārata",
    "english_translation": "Know that tamas, born of ignorance, deludes every embodied being and binds it through heedlessness, inertia, and sleep.",
    "hindi_translation": "हे भरतवंशी अर्जुन ! सम्पूर्ण देहधारियोंको मोहित करनेवाले तमोगुणको तुम अज्ञानसे उत्पन्न होनेवाला समझो। वह प्रमाद, आलस्य और निद्राके द्वारा देहधारियोंको बाँधता है।",
    "has_hindi_translation": true
  },
  "BG_14_22": {
    "id": "BG_14_22",
    "chapter": 14,
    "verse": 22,
    "reference": "14.22",
    "sanskrit": "प्रकाशं च प्रवृत्तिं च मोहम् एव च पाण्डव |\nन द्वेष्टि संप्रवृत्तानि न निवृत्तानि काङ्क्षति",
    "transliteration": "prakāśaṃ ca pravṛttiṃ ca moham eva ca pāṇḍava |\nna dveṣṭi saṃpravṛttāni na nivṛttāni kāṅkṣati",
    "english_translation": "The one gone beyond the *guṇas*, Arjuna, does not hate brightness, restlessness, or confusion when they arise, nor crave them when they pass.",
    "hindi_translation": "श्रीभगवान् बोले -- हे पाण्डव ! प्रकाश, प्रवृत्ति तथा मोह -- ये सभी अच्छी तरहसे प्रवृत्त हो जायँ तो भी गुणातीत मनुष्य इनसे द्वेष नहीं करता, और ये सभी निवृत्त हो जायँ तो इनकी इच्छा नहीं करता।",
    "has_hindi_translation": true
  },
  "BG_15_1": {
    "id": "BG_15_1",
    "chapter": 15,
    "verse": 1,
    "reference": "15.1",
    "sanskrit": "श्री-भगवान् उवाच ऊर्ध्व-मूलम् अधः-शाखम् अश्वत्थं प्राहुर् अव्ययम् |\nछन्दांसि यस्य पर्णानि यस् तं वेद स वेद-वित्",
    "transliteration": "śrī-bhagavān uvāca ūrdhva-mūlam adhaḥ-śākham aśvatthaṃ prāhur avyayam |\nchandāṃsi yasya parṇāni yas taṃ veda sa veda-vit",
    "english_translation": "The sages speak of an eternal sacred fig rooted above and branching downward, its leaves the Vedic hymns; whoever knows this tree knows all the Vedas.",
    "hindi_translation": "श्रीभगवान् बोले -- ऊपरकी ओर मूलवाले तथा नीचेकी ओर शाखावाले जिस संसाररूप अश्वत्थवृक्षको अव्यय कहते हैं और वेद जिसके पत्ते हैं, उस संसारवृक्षको जो जानता है, वह सम्पूर्ण वेदोंको जाननेवाला है।",
    "has_hindi_translation": true
  },
  "BG_15_3": {
    "id": "BG_15_3",
    "chapter": 15,
    "verse": 3,
    "reference": "15.3",
    "sanskrit": "न रूपम् अस्येह तथोपलभ्यते नान्तो न चादिर् न च संप्रतिष्ठा |\nअश्वत्थम् एनं सु-विरूढ-मूलम् असङ्ग-शस्त्रेण दृढेन छित्त्वा",
    "transliteration": "na rūpam asyeha tathopalabhyate nānto na cādir na ca saṃpratiṣṭhā |\naśvattham enaṃ su-virūḍha-mūlam asaṅga-śastreṇa dṛḍhena chittvā",
    "english_translation": "The form of this tree cannot be grasped here; no end, no beginning, no ground beneath it can be found. Cut it, deep-rooted as it is, with the firm sword of non-attachment.",
    "hindi_translation": "इस संसारवृक्षका जैसा रूप देखनेमें आता है, वैसा यहाँ (विचार करनेपर) मिलता नहीं; क्योंकि इसका न तो आदि है, न अन्त है और न स्थिति ही है। इसलिये इस दृढ़ मूलोंवाले संसाररूप अश्वत्थवृक्षको दृढ़ असङ्गतारूप शस्त्रके द्वारा काटकर --",
    "has_hindi_translation": true
  },
  "BG_15_7": {
    "id": "BG_15_7",
    "chapter": 15,
    "verse": 7,
    "reference": "15.7",
    "sanskrit": "ममैवांशो जीव-लोके जीव-भूतः सनातनः |\nमनः-षष्ठानीन्द्रियाणि प्रकृति-स्थानि कर्षति",
    "transliteration": "mamaivāṃśo jīva-loke jīva-bhūtaḥ sanātanaḥ |\nmanaḥ-ṣaṣṭhānīndriyāṇi prakṛti-sthāni karṣati",
    "english_translation": "An eternal portion of Me dwells as an individual self in the world of the living, drawing to itself the mind and five senses that rest in nature.",
    "hindi_translation": "इस संसारमें जीव बना हुआ आत्मा मेरा ही सनातन अंश है; परन्तु वह प्रकृतिमें स्थित मन और पाँचों इन्द्रियोंको आकर्षित करता है (अपना मान लेता है)।",
    "has_hindi_translation": true
  },
  "BG_15_15": {
    "id": "BG_15_15",
    "chapter": 15,
    "verse": 15,
    "reference": "15.15",
    "sanskrit": "सर्वस्य चाहं हृदि संनिविष्टो मत्तः स्मृतिर् ज्ञानम् अपोहनं च |\nवेदैश् च सर्वैर् अहम् एव वेद्यो वेदान्त-कृद् वेद-विद् एव चाहम्",
    "transliteration": "sarvasya cāhaṃ hṛdi saṃniviṣṭo mattaḥ smṛtir jñānam apohanaṃ ca |\nvedaiś ca sarvair aham eva vedyo vedānta-kṛd veda-vid eva cāham",
    "english_translation": "I am seated in the heart of every being; from me alone come memory, knowledge, and their loss. All the Vedas point to me, I am the author of Vedanta, and I alone truly know what the Veda means.",
    "hindi_translation": "मैं सम्पूर्ण प्राणियोंके हृदयमें स्थित हूँ। मेरेसे ही स्मृति, ज्ञान और अपोहन (संशय आदि दोषोंका नाश) होता है। सम्पूर्ण वेदोंके द्वारा मैं ही जाननेयोग्य हूँ। वेदोंके तत्त्वका निर्णय करनेवाला और वेदोंको जाननेवाला भी मैं ही हूँ।",
    "has_hindi_translation": true
  },
  "BG_15_18": {
    "id": "BG_15_18",
    "chapter": 15,
    "verse": 18,
    "reference": "15.18",
    "sanskrit": "यस्मात् क्षरम् अतीतो ऽहम् अक्षराद् अपि चोत्तमः |\nअतो ऽस्मि लोके वेदे च प्रथितः पुरुषोत्तमः",
    "transliteration": "yasmāt kṣaram atīto 'ham akṣarād api cottamaḥ |\nato 'smi loke vede ca prathitaḥ puruṣottamaḥ",
    "english_translation": "Because I stand above the perishable and am higher still than the imperishable, I am celebrated in scripture and in the world as *Puruṣottama*, the Highest Person.",
    "hindi_translation": "मैं क्षरसे अतीत हूँ और अक्षरसे भी उत्तम हूँ, इसलिये लोकमें और वेदमें पुरुषोत्तम नामसे प्रसिद्ध हूँ।",
    "has_hindi_translation": true
  },
  "BG_16_1": {
    "id": "BG_16_1",
    "chapter": 16,
    "verse": 1,
    "reference": "16.1",
    "sanskrit": "अभयं सत्त्व-संशुद्धिर् ज्ञान-योग-व्यवस्थितिः |\nदानं दमश् च यज्ञश् च स्वाध्यायस् तप आर्जवम्",
    "transliteration": "abhayaṃ sattva-saṃśuddhir jñāna-yoga-vyavasthitiḥ |\ndānaṃ damaś ca yajñaś ca svādhyāyas tapa ārjavam",
    "english_translation": {
      "reading_summary": "(reading summary extraction pending; ENABLE_READING_SUMMARIES=true to generate)",
      "key_cross_references": [],
      "witness_passages": [
        "sridhara_16.1"
      ],
      "score": 0.5,
      "english_rendering": "Chapter 16 begins precisely to resolve who is qualified for the tattva-jnana spoken at the chapter's end — the adhikari question requires distinguishing those fit from those unfit. Abhayam (absence of fear), sattva-samsuddhi (brightness of the citta), jnana-yoga-vyavasthiti (firm establishment in the means of atma-jnana), dana (appropriate sharing of food etc.), dama (restraint of the external indriyas), yajna (the sacrifices proper to one's adhikara such as darsapurnamasa), svadhyaya (Brahma-yajna, japa-yajna), tapas (physical austerity to be elaborated in Chapter 17), and arjava (non-crookedness) — these together constitute the daivi sampat that marks out the adhikari who will benefit from the teaching."
    },
    "hindi_translation": "श्रीभगवान् बोले -- भयका सर्वथा अभाव; अन्तःकरणकी शुद्धि; ज्ञानके लिये योगमें दृढ़ स्थिति; सात्त्विक दान; इन्द्रियोंका दमन; यज्ञ; स्वाध्याय; कर्तव्य-पालनके लिये कष्ट सहना; शरीर-मन-वाणीकी सरलता।",
    "has_hindi_translation": true
  },
  "BG_16_2": {
    "id": "BG_16_2",
    "chapter": 16,
    "verse": 2,
    "reference": "16.2",
    "sanskrit": "अहिंसा सत्यम् अक्रोधस् त्यागः शान्तिर् अपैशुनम् |\nदया भूतेष्व् अलोलुप्त्वं मार्दवं ह्रीर् अचापलम्",
    "transliteration": "ahiṃsā satyam akrodhas tyāgaḥ śāntir apaiśunam |\ndayā bhūteṣv aloluptvaṃ mārdavaṃ hrīr acāpalam",
    "english_translation": {
      "reading_summary": "(reading summary extraction pending; ENABLE_READING_SUMMARIES=true to generate)",
      "key_cross_references": [],
      "witness_passages": [
        "sridhara_16.2"
      ],
      "score": 0.5,
      "english_rendering": "Ahimsa is abstention from harming others; satya is speaking things as they are; akrodha is the non-arising of disturbance in the mind even when one is struck. Tyaga is generosity (audarya); shanti is the composure of the mind (citta-uparati). Paishunam is the revealing of another's faults behind their back — apaishunam is freedom from that. Daya is compassion toward those who are afflicted (dina); aloluptvam is the absence of greed (lobhabhava), with the elision of one letter being an archaic usage. Mardavam is gentleness and freedom from cruelty; hri is the shame of public opinion (loka-lajja) when about to engage in improper conduct; acapalam is the absence of purposeless activity.",
      "commentator": "Sridhara Svami"
    },
    "hindi_translation": "अहिंसा, सत्यभाषण; क्रोध न करना; संसारकी कामनाका त्याग; अन्तःकरणमें राग-द्वेषजनित हलचलका न होना; चुगली न करना; प्राणियोंपर दया करना सांसारिक विषयोंमें न ललचाना; अन्तःकरणकी कोमलता; अकर्तव्य करनेमें लज्जा; चपलताका अभाव।",
    "has_hindi_translation": true
  },
  "BG_16_4": {
    "id": "BG_16_4",
    "chapter": 16,
    "verse": 4,
    "reference": "16.4",
    "sanskrit": "दम्भो दर्पो ऽतिमानश् च क्रोधः पारुष्यम् एव च |\nअज्ञानं चाभिजातस्य पार्थ संपदम् आसुरीम्",
    "transliteration": "dambho darpo 'timānaś ca krodhaḥ pāruṣyam eva ca |\najñānaṃ cābhijātasya pārtha saṃpadam āsurīm",
    "english_translation": "Hypocrisy, arrogance, excessive pride, anger, harshness of speech, and ignorance of what should and should not be done, O Arjuna, are the marks of one born into the demonic endowment.",
    "hindi_translation": "हे पृथानन्दन ! दम्भ करना, घमण्ड करना, अभिमान करना, क्रोध करना, कठोरता रखना और अविवेकका होना भी -- ये सभी आसुरीसम्पदाको प्राप्त हुए मनुष्यके लक्षण हैं।",
    "has_hindi_translation": true
  },
  "BG_16_21": {
    "id": "BG_16_21",
    "chapter": 16,
    "verse": 21,
    "reference": "16.21",
    "sanskrit": "त्रि-विधं नरकस्येदं द्वारं नाशनम् आत्मनः |\nकामः क्रोधस् तथा लोभस् तस्माद् एतत् त्रयं त्यजेत्",
    "transliteration": "tri-vidhaṃ narakasyedaṃ dvāraṃ nāśanam ātmanaḥ |\nkāmaḥ krodhas tathā lobhas tasmād etat trayaṃ tyajet",
    "english_translation": "Desire, anger, and greed are the three gates of hell, destroyers of the self. Abandon all three.",
    "hindi_translation": "काम, क्रोध और लोभ -- ये तीन प्रकारके नरकके दरवाजे जीवात्माका पतन करनेवाले हैं, इसलिये इन तीनोंका त्याग कर देना चाहिये।",
    "has_hindi_translation": true
  },
  "BG_17_3": {
    "id": "BG_17_3",
    "chapter": 17,
    "verse": 3,
    "reference": "17.3",
    "sanskrit": "सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत |\nश्रद्धा-मयो ऽयं पुरुषो यो यच्-छ्रद्धः स एव सः",
    "transliteration": "sattvānurūpā sarvasya śraddhā bhavati bhārata |\nśraddhā-mayo 'yaṃ puruṣo yo yac-chraddhaḥ sa eva saḥ",
    "english_translation": "A person's faith takes the shape of their own inner nature; each person is made of their faith, and whatever they put their faith in, that is what they are.",
    "hindi_translation": "हे भारत ! सभी मनुष्योंकी श्रद्धा अन्तःकरणके अनुरूप होती है। यह मनुष्य श्रद्धामय है। इसलिये जो जैसी श्रद्धावाला है, वही उसका स्वरूप है अर्थात् वही उसकी निष्ठा -- स्थिति है।",
    "has_hindi_translation": true
  },
  "BG_17_8": {
    "id": "BG_17_8",
    "chapter": 17,
    "verse": 8,
    "reference": "17.8",
    "sanskrit": "आयुः-सत्त्व-बलारोग्य-सुख-प्रीति-विवर्धनाः |\nरस्याः स्निग्धाः स्थिरा हृद्या आहाराः सात्त्विक-प्रियाः",
    "transliteration": "āyuḥ-sattva-balārogya-sukha-prīti-vivardhanāḥ |\nrasyāḥ snigdhāḥ sthirā hṛdyā āhārāḥ sāttvika-priyāḥ",
    "english_translation": {
      "reading_summary": "(reading summary extraction pending; ENABLE_READING_SUMMARIES=true to generate)",
      "key_cross_references": [],
      "witness_passages": [
        "sridhara_17.8"
      ],
      "score": 0.5,
      "english_rendering": "Ayus is life itself; sattva is enthusiasm (utsaha); bala is capacity (sakti); arogya is freedom from disease; sukha is clarity of mind (citta-prasada); priti is relish and inclination (abhiruci). Foods that especially promote these six qualities — rasya (full of flavor), snigdha (unctuous), sthira (remaining long in the body in their essential substance), hrdya (pleasing to the heart at the very sight) — covering the whole range of things chewed, sucked, licked, and drunk, are dear to persons of sattvic nature. The bhakta recognizes in such food a gift of the Lord that sustains the body-instrument for devoted service.",
      "commentator": "Sridhara Svami"
    },
    "hindi_translation": "आयु, सत्त्वगुण, बल, आरोग्य, सुख और प्रसन्नता बढ़ानेवाले, स्थिर रहनेवाले, हृदयको शक्ति देनेवाले, रसयुक्त तथा चिकने -- ऐसे आहार अर्थात् भोजन करनेके पदार्थ सात्त्विक मनुष्यको प्रिय होते हैं।",
    "has_hindi_translation": true
  },
  "BG_17_20": {
    "id": "BG_17_20",
    "chapter": 17,
    "verse": 20,
    "reference": "17.20",
    "sanskrit": "दातव्यम् इति यद् दानं दीयते ऽनुपकारिणे |\nदेशे काले च पात्रे च तद् दानं सात्त्विकं स्मृतम्",
    "transliteration": "dātavyam iti yad dānaṃ dīyate 'nupakāriṇe |\ndeśe kāle ca pātre ca tad dānaṃ sāttvikaṃ smṛtam",
    "english_translation": "Giving because it must be given, to someone who cannot repay you, in the right place and at the right time and to a worthy recipient, that is *sāttvika* giving.",
    "hindi_translation": "दान देना कर्तव्य है -- ऐसे भावसे जो दान देश, काल और पात्रके प्राप्त होनेपर अनुपकारीको दिया जाता है, वह दान सात्त्विक कहा गया है।",
    "has_hindi_translation": true
  },
  "BG_17_23": {
    "id": "BG_17_23",
    "chapter": 17,
    "verse": 23,
    "reference": "17.23",
    "sanskrit": "ॐ तत् सद् इति निर्देशो ब्रह्मणस् त्रिविधः स्मृतः |\nब्राह्मणास् तेन वेदाश् च यज्ञाश् च विहिताः पुरा",
    "transliteration": "oṃ tat sad iti nirdeśo brahmaṇas trividhaḥ smṛtaḥ |\nbrāhmaṇās tena vedāś ca yajñāś ca vihitāḥ purā",
    "english_translation": "The ancient threefold designation of Brahman is *oṃ tat sat*, through which Brahmanas, the Vedas, and sacrificial rites were ordained from the beginning.",
    "hindi_translation": "ऊँ, तत् और सत् -- इन तीनों नामोंसे जिस परमात्माका निर्देश किया गया है, उसी परमात्माने सृष्टिके आदिमें वेदों, ब्राह्मणों और यज्ञोंकी रचना की है।",
    "has_hindi_translation": true
  },
  "BG_18_5": {
    "id": "BG_18_5",
    "chapter": 18,
    "verse": 5,
    "reference": "18.5",
    "sanskrit": "यज्ञदानतपःकर्म न त्याज्यं कार्यमेव तत् |\nयज्ञो दानं तपश्चैव पावनानि मनीषिणाम्",
    "transliteration": "yajñadānatapaḥkarma na tyājyaṃ kāryameva tat |\nyajño dānaṃ tapaścaiva pāvanāni manīṣiṇām",
    "english_translation": {
      "reading_summary": "(reading summary extraction pending; ENABLE_READING_SUMMARIES=true to generate)",
      "key_cross_references": [],
      "witness_passages": [
        "sridhara_18.5"
      ],
      "score": 0.5,
      "english_rendering": "Sridhara Svami is economical: manisinin here means viveki (one of discrimination), and pavana means citta-suddhi-kara (productive of inner purity). The verse issues a firm niscaya (settled judgment) against abandonment: yajna, dana, tapas are obligatory because they cleanse the mind that is the instrument of bhakti. Without this cleansing, devotion cannot take root; the acts are therefore not ends but the indispensable soil of the devotional life."
    },
    "hindi_translation": "यज्ञ, दान और तपरूप कर्मोंका त्याग नहीं करना चाहिये, प्रत्युत उनको तो करना ही चाहिये क्योंकि यज्ञ, दान और तप -- ये तीनों ही कर्म मनीषियोंको पवित्र करनेवाले हैं।",
    "has_hindi_translation": true
  },
  "BG_18_9": {
    "id": "BG_18_9",
    "chapter": 18,
    "verse": 9,
    "reference": "18.9",
    "sanskrit": "कार्यमित्येव यत्कर्म नियतं क्रियतेऽर्जुन |\nसङ्गं त्यक्त्वा फलं चैव स त्यागः सात्त्विको मतः",
    "transliteration": "kāryamityeva yatkarma niyataṃ kriyate'rjuna |\nsaṅgaṃ tyaktvā phalaṃ caiva sa tyāgaḥ sāttviko mataḥ",
    "english_translation": "Do what must be done, Arjuna, without clinging to the act or craving its reward. That renunciation is *sāttvika*.",
    "hindi_translation": "हे अर्जुन ! 'केवल कर्तव्यमात्र करना है' -- ऐसा समझकर जो नियत कर्म आसक्ति और फलका त्याग करके किया जाता है, वही सात्त्विक त्याग माना गया है।",
    "has_hindi_translation": true
  },
  "BG_18_47": {
    "id": "BG_18_47",
    "chapter": 18,
    "verse": 47,
    "reference": "18.47",
    "sanskrit": "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् |\nस्वभावनियतं कर्म कुर्वन् नाप्नोति किल्बिषम्",
    "transliteration": "śreyānsvadharmo viguṇaḥ paradharmāt svanuṣṭhitāt |\nsvabhāvaniyataṃ karma kurvannāpnoti kilbiṣam",
    "english_translation": "Your own duty, even imperfectly done, is better than another's duty done well. Acting within the nature you were born to, you take on no sin.",
    "hindi_translation": "अच्छी तरहसे अनुष्ठान किये हुए परधर्मसे गुणरहित अपना धर्म श्रेष्ठ है। कारण कि स्वभावसे नियत किये हुए स्वधर्मरूप कर्मको करता हुआ मनुष्य पापको प्राप्त नहीं होता।",
    "has_hindi_translation": true
  },
  "BG_18_63": {
    "id": "BG_18_63",
    "chapter": 18,
    "verse": 63,
    "reference": "18.63",
    "sanskrit": "इति ते ज्ञानमाख्यातं गुह्याद्गुह्यतरं मया |\nविमृश्यैतदशेषेण यथेच्छसि तथा कुरु",
    "transliteration": "iti te jñānamākhyātaṃ guhyādguhyataraṃ mayā |\nvimṛśyaitadaśeṣeṇa yathecchasi tathā kuru",
    "english_translation": "I have now given you this knowledge, the most secret of all. Reflect on every word of it, then act as you choose.",
    "hindi_translation": "यह गुह्यसे भी गुह्यतर (शरणागतिरूप) ज्ञान मैंने तुझे कह दिया। अब तू इसपर अच्छी तरहसे विचार करके जैसा चाहता है, वैसा कर।",
    "has_hindi_translation": true
  },
  "BG_18_66": {
    "id": "BG_18_66",
    "chapter": 18,
    "verse": 66,
    "reference": "18.66",
    "sanskrit": "सर्वधर्मान् परित्यज्य मामेकं शरणं व्रज |\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः",
    "transliteration": "sarvadharmān parityajya māmekaṃ śaraṇaṃ vraja |\nahaṃ tvā sarvapāpebhyo mokṣayiṣyāmi mā śucaḥ",
    "english_translation": "Drop every last claim on your own moral bookkeeping and come to Me alone for shelter; I will free you from all sin, so do not grieve.",
    "hindi_translation": "सम्पूर्ण धर्मोंका आश्रय छोड़कर तू केवल मेरी शरणमें आ जा। मैं तुझे सम्पूर्ण पापोंसे मुक्त कर दूँगा, चिन्ता मत कर।",
    "has_hindi_translation": true
  }
};
