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
  },

  sampleCharges: [
    { id: 'sms', label: { en: 'SMS alerts (per quarter)', hi: 'एसएमएस अलर्ट (प्रति तिमाही)' }, amountPaise: 2500 },
    { id: 'cheque', label: { en: 'Cheque book (25 leaves)', hi: 'चेक बुक (25 पत्ते)' }, amountPaise: 7500 },
    { id: 'atm', label: { en: 'ATM use beyond 5 free (per use)', hi: '5 मुफ़्त के बाद ATM उपयोग (प्रति बार)' }, amountPaise: 2100 },
    { id: 'min-bal', label: { en: 'Minimum balance charge (per month)', hi: 'न्यूनतम शेष शुल्क (प्रति माह)' }, amountPaise: 50000 },
  ],

  sampleInterestPercent: 3.0,
  sampleMinimumBalancePaise: 100000, // ₹1,000

  idleLockSeconds: 120,

  helplines: {
    cyber: '1930',
    site: 'cybercrime.gov.in',
  },
};

export default config;
