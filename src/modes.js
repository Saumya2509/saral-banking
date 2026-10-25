// Saral Banking — Modes Configuration
// Defines the 3 core modes: standard, simple, young

export const MODES = {
  standard: {
    id: 'standard',
    name: { en: 'Standard', hi: 'मानक' },
    rootPx: 16,
    tapH: '3rem', // 48px
    tapGap: '0.5rem', // 8px
    homeSimple: false,
    confirmOver: null,
    readAloud: false,
    description: {
      en: 'Complete banking interface for day-to-day finances',
      hi: 'दैनिक वित्तीय कार्यों के लिए पूर्ण बैंकिंग इंटरफ़ेस',
    },
  },
  simple: {
    id: 'simple',
    name: { en: 'Simple', hi: 'सरल' },
    rootPx: 20, // 125% base size
    tapH: '3.5rem', // 56px large buttons
    tapGap: '0.75rem', // 12px
    homeSimple: true,
    confirmOver: 500000, // ₹5,000 extra confirmation limit (in paise)
    readAloud: true,
    description: {
      en: 'High-contrast large text, read-aloud voice, and four big actions for seniors',
      hi: 'वरिष्ठ नागरिकों के लिए बड़ा टेक्स्ट, बोलकर बताने की सुविधा और 4 बड़े विकल्प',
    },
  },
  young: {
    id: 'young',
    name: { en: 'Young Saver', hi: 'युवा बचत' },
    rootPx: 16,
    tapH: '3rem',
    tapGap: '0.5rem',
    homeSimple: false,
    confirmOver: null,
    readAloud: false,
    hasGoals: true,
    hasGuardian: true,
    description: {
      en: 'Savings goals and spending limits for young savers under 18',
      hi: '18 वर्ष से कम उम्र के युवाओं के लिए बचत लक्ष्य और दैनिक सीमा',
    },
  },
};

export default MODES;
