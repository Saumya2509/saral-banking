// Saral Banking — Learn section lessons (bilingual)
// Dev 3 owns this file; used by LearnScreen for basics and safety education

import config from './config.js';
import scams, { getAllScams } from './scams.js';

/**
 * Format paise to rupee display string using Intl.NumberFormat.
 * @param {number} paise - Amount in paise (integer)
 * @returns {string} Formatted rupee string e.g. "₹25"
 */
function formatPaise(paise) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

/**
 * Build the sample-charges lesson body dynamically from config.sampleCharges.
 */
function buildChargesBody() {
  const charges = config.sampleCharges || [];
  const enLines = charges.map((c) => `• ${c.label.en}: ${formatPaise(c.amountPaise)}`).join('\n');
  const hiLines = charges.map((c) => `• ${c.label.hi}: ${formatPaise(c.amountPaise)}`).join('\n');
  return {
    en: `Common bank charges you should know about:\n${enLines}`,
    hi: `बैंक के आम शुल्क जो आपको जानने चाहिए:\n${hiLines}`,
  };
}

// ── Static basics lessons ────────────────────────────────────────────

const basicsLessons = [
  {
    id: 'savings-account',
    title: {
      en: 'What is a savings account?',
      hi: 'बचत खाता क्या है?',
    },
    body: {
      en: 'A savings account is a safe place in a bank to keep your money. Your money earns interest and you can withdraw it anytime you need.',
      hi: 'बचत खाता बैंक में पैसा रखने की एक सुरक्षित जगह है। आपके पैसे पर ब्याज मिलता है और ज़रूरत पड़ने पर कभी भी निकाल सकते हैं।',
    },
    category: 'basics',
  },
  {
    id: 'interest',
    title: {
      en: 'How does interest work?',
      hi: 'ब्याज कैसे मिलता है?',
    },
    body: {
      en: `The bank pays you around ${config.sampleInterestPercent}% per year on your savings. Interest is calculated daily and added to your account every three months.`,
      hi: `बैंक आपकी बचत पर लगभग ${config.sampleInterestPercent}% सालाना ब्याज देता है। ब्याज रोज़ हिसाब होता है और हर तीन महीने में खाते में जुड़ता है।`,
    },
    category: 'basics',
  },
  {
    id: 'minimum-balance',
    title: {
      en: 'What is minimum balance?',
      hi: 'न्यूनतम बैलेंस क्या है?',
    },
    body: {
      en: `Your bank needs you to keep at least ${formatPaise(config.sampleMinimumBalancePaise)} in your account. If your balance goes below this, a monthly charge may apply.`,
      hi: `बैंक चाहता है कि आपके खाते में कम से कम ${formatPaise(config.sampleMinimumBalancePaise)} रहें। इससे कम होने पर मासिक शुल्क लग सकता है।`,
    },
    category: 'basics',
  },
  {
    id: 'sample-charges',
    title: {
      en: 'Common bank charges',
      hi: 'बैंक के सामान्य शुल्क',
    },
    body: buildChargesBody(),
    category: 'basics',
  },
  {
    id: 'what-is-upi',
    title: {
      en: 'What is UPI?',
      hi: 'UPI क्या है?',
    },
    body: {
      en: 'UPI lets you send and receive money instantly using just a phone number or UPI ID. It is free, works 24/7, and the money goes directly from one bank account to another.',
      hi: 'UPI से आप सिर्फ़ फोन नंबर या UPI आईडी से तुरंत पैसा भेज और पा सकते हैं। यह मुफ़्त है, 24/7 काम करता है और पैसा सीधे एक खाते से दूसरे खाते में जाता है।',
    },
    category: 'basics',
  },
];

// ── Safety lessons generated dynamically from scams data ─────────────

function buildSafetyLessons() {
  const allScams = getAllScams();
  return allScams.map((scam) => ({
    id: `safety-${scam.id}`,
    title: {
      en: `Stay safe: ${scam.title.en}`,
      hi: `सुरक्षित रहें: ${scam.title.hi}`,
    },
    body: {
      en: `${scam.signs.en[0]} ${scam.doThis.en}`,
      hi: `${scam.signs.hi[0]} ${scam.doThis.hi}`,
    },
    category: 'safety',
  }));
}

// ── Combined lessons ─────────────────────────────────────────────────

function getAllLessons() {
  return [...basicsLessons, ...buildSafetyLessons()];
}

const lessons = getAllLessons();

/**
 * Get all lessons (basics + safety).
 * @returns {Array} Array of lesson objects
 */
export function getLessons() {
  return lessons;
}

/**
 * Get a single lesson by its id.
 * @param {string} id - Lesson id (e.g. 'savings-account' or 'safety-fake-kyc')
 * @returns {Object|null} The lesson object or null if not found
 */
export function getLesson(id) {
  if (!id || typeof id !== 'string') return null;
  return lessons.find((l) => l.id === id) || null;
}

export default lessons;
