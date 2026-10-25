// Saral Banking — Speech Synthesis Utility
// Text-to-speech utility using the Web Speech API with support for English, Hindi, and Tamil.

let cachedVoices = [];

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

/**
 * Find the best matching voice for the specified language.
 * @param {string} lang - 'en', 'hi', or 'ta'
 * @returns {SpeechSynthesisVoice|null}
 */
export function findVoice(lang) {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  if (!voices || voices.length === 0) return null;

  const l = (lang || 'en').toLowerCase().trim();

  // 1. Tamil
  if (l === 'ta' || l.startsWith('ta')) {
    // 1a. Regional match (e.g. 'ta-IN', 'ta_IN', 'ta-LK')
    const regionalMatch = voices.find((v) => {
      const vLang = (v.lang || '').toLowerCase().replace('_', '-');
      return vLang === 'ta-in' || vLang.startsWith('ta-') || vLang === 'ta';
    });
    if (regionalMatch) return regionalMatch;

    // 1b. Search voice name containing 'Tamil' or 'தமிழ்'
    const nameMatch = voices.find((v) => {
      const name = (v.name || '').toLowerCase();
      return name.includes('tamil') || name.includes('தமிழ்');
    });
    if (nameMatch) return nameMatch;

    // If no Tamil voice exists, return null so we don't force an English voice on Tamil text
    return null;
  }

  // 2. Hindi
  if (l === 'hi' || l.startsWith('hi')) {
    const regionalMatch = voices.find((v) => {
      const vLang = (v.lang || '').toLowerCase().replace('_', '-');
      return vLang === 'hi-in' || vLang.startsWith('hi-') || vLang === 'hi';
    });
    if (regionalMatch) return regionalMatch;

    const nameMatch = voices.find((v) => {
      const name = (v.name || '').toLowerCase();
      return name.includes('hindi') || name.includes('हिंदी');
    });
    if (nameMatch) return nameMatch;

    return null;
  }

  // 3. English (default)
  const indianEn = voices.find((v) => {
    const vLang = (v.lang || '').toLowerCase().replace('_', '-');
    return vLang === 'en-in';
  });
  if (indianEn) return indianEn;

  const genericEn = voices.find((v) => (v.lang || '').toLowerCase().startsWith('en'));
  if (genericEn) return genericEn;

  return null;
}

/**
 * Checks whether a voice is available for the given language.
 * @param {string} lang
 * @returns {boolean}
 */
export function hasVoice(lang) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  if (!voices || voices.length === 0) {
    return true; // Voices may load asynchronously; don't prematurely report false
  }
  return Boolean(findVoice(lang));
}

/**
 * Speaks text using the Web Speech API.
 * Automatically cancels any ongoing utterance before speaking.
 * @param {string} text - The plain text string to speak
 * @param {string} [lang='en'] - 'en', 'hi', or 'ta'
 */
export function speak(text, lang = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing utterance
  stopSpeaking();

  if (!text || typeof text !== 'string' || !text.trim()) {
    return;
  }

  // Workaround for Chrome bug where speechSynthesis gets stuck in paused state
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  const utterance = new SpeechSynthesisUtterance(text.trim());

  const l = (lang || 'en').toLowerCase().trim();
  let bcp47 = 'en-IN';
  if (l === 'ta' || l.startsWith('ta')) {
    bcp47 = 'ta-IN';
  } else if (l === 'hi' || l.startsWith('hi')) {
    bcp47 = 'hi-IN';
  }
  utterance.lang = bcp47;

  const matchedVoice = findVoice(lang);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  // Clear and comfortable rate for accessibility
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  utterance.onerror = (e) => {
    if (e.error !== 'interrupted' && e.error !== 'canceled') {
      console.warn('Speech synthesis error:', e.error);
    }
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Stops any speech currently in progress or queued.
 */
export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Checks if the speech synthesis engine is currently speaking or has utterances queued.
 * @returns {boolean}
 */
export function isSpeaking() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  return window.speechSynthesis.speaking || window.speechSynthesis.pending;
}
