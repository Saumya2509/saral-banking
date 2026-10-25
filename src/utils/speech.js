// Saral Banking — Speech Synthesis Utility
// Text-to-speech utility using the Web Speech API with support for English and Hindi.

let cachedVoices = [];

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Find the best matching voice for the specified language.
 * @param {string} lang - 'en' or 'hi'
 * @returns {SpeechSynthesisVoice|null}
 */
function findVoice(lang) {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  const targetTag = lang === 'hi' ? 'hi' : 'en';

  // 1. Try exact Indian regional match first ('hi-IN' or 'en-IN')
  const regionalMatch = voices.find((v) =>
    lang === 'hi'
      ? v.lang.toLowerCase().startsWith('hi')
      : v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase() === 'en_in'
  );
  if (regionalMatch) return regionalMatch;

  // 2. Try generic language match
  const genericMatch = voices.find((v) => v.lang.toLowerCase().startsWith(targetTag));
  if (genericMatch) return genericMatch;

  return null;
}

/**
 * Speaks text using the Web Speech API.
 * Automatically cancels any ongoing utterance before speaking.
 * @param {string} text - The plain text string to speak
 * @param {string} [lang='en'] - 'en' or 'hi'
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

  const utterance = new SpeechSynthesisUtterance(text.trim());
  const bcp47 = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.lang = bcp47;

  const matchedVoice = findVoice(lang);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  // Clear and comfortable rate for accessibility
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

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
