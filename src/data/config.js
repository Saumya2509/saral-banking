// Saral Banking — Shared config (Dev 1 owns, everyone reads)
// Fixed keys so nobody needs to edit this file

const config = {
  demoToday: '2026-10-24',
  demoPin: '1234',
  demoOtp: '123456',

  limits: {
    newPayee24hPaise: 1000000,            // ₹10,000
    safetyCheckAbovePaise: 1000000,       // ₹10,000
    simpleConfirmAbovePaise: 500000,      // ₹5,000
    youngSaverDailyDefaultPaise: 100000,  // ₹1,000 (guardian can change)
    globalMaxUpiLimitPaise: 10000000,     // ₹1,00,000 — global ceiling for all users
  },

  newPayeeRule: {
    en: 'For safety, payments to a new payee are limited to ₹10,000 in the first 24 hours.',
    hi: 'सुरक्षा के लिए, नए लाभार्थी को पहले 24 घंटों में ₹10,000 तक ही भुगतान किया जा सकता है।',
    ta: 'பாதுகாப்பிற்காக, புதிய நபருக்கு முதல் 24 மணி நேரத்தில் ₹10,000 வரை மட்டுமே பணம் அனுப்ப முடியும்.',
  },

  sampleCharges: [
    { id: 'sms', label: { en: 'SMS alerts (per quarter)', hi: 'एसएमएस अलर्ट (प्रति तिमाही)', ta: 'குறுஞ்செய்தி (SMS) கட்டணம் (காலாண்டுக்கு)' }, amountPaise: 2500 },
    { id: 'cheque', label: { en: 'Cheque book (25 leaves)', hi: 'चेक बुक (25 पत्ते)', ta: 'காசோலை புத்தகம் (25 தாள்கள்)' }, amountPaise: 7500 },
    { id: 'atm', label: { en: 'ATM use beyond 5 free (per use)', hi: '5 मुफ़्त के बाद ATM उपयोग (प्रति बार)', ta: '5 இலவசப் பயன்பாட்டிற்குப் பின் ஏடிஎம் பயன்பாடு (ஒரு முறைக்கு)' }, amountPaise: 2100 },
    { id: 'min-bal', label: { en: 'Minimum balance charge (per month)', hi: 'न्यूनतम शेष शुल्क (प्रति माह)', ta: 'குறைந்தபட்ச இருப்பு கட்டணம் (மாதத்திற்கு)' }, amountPaise: 50000 },
  ],

  sampleInterestPercent: 3.0,
  sampleMinimumBalancePaise: 100000, // ₹1,000

  idleLockSeconds: 120,

  helplines: {
    cyber: '1930',
    site: 'cybercrime.gov.in',
    bank: '1800 111 222',
  },

  screens: {
    sendMoney: 'Pay / Transfer (पैसे भेजें)',
    blockCard: 'Cards (कार्ड)',
    changePin: 'Settings (सेटिंग्स) / Cards (कार्ड)',
    changeLimit: 'Settings (सेटिंग्स) / UPI Limits',
    statements: 'Statements (खाता विवरण)',
    services: 'Services (सेवाएं)',
    reportFraud: 'Report Fraud (धोखाधड़ी रिपोर्ट)',
  },
};

export const CONFIG = config;
export default config;
