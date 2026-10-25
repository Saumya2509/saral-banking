// shared/mask.js
const KEYWORDS =
  '(?:otp|pin|cvv|cvc|password|passcode|code|ओटीपी|पिन|पासवर्ड|ઓટીપી|પિન|પાસવર્ડ|ஓடிபி|ஒருமுறை எண்|ரகசிய எண்|பின்|கடவுச்சொல்)';

function toAsciiDigits(s) {
  return s
    .replace(/[\u0966-\u096F]/g, d => String(d.charCodeAt(0) - 0x0966)) // Devanagari
    .replace(/[\u0AE6-\u0AEF]/g, d => String(d.charCodeAt(0) - 0x0AE6)) // Gujarati
    .replace(/[\u0BE6-\u0BEF]/g, d => String(d.charCodeAt(0) - 0x0BE6)); // Tamil
}

export function maskSensitive(input) {
  const kinds = new Set();
  let text = toAsciiDigits(String(input ?? ''));

  // 1) Long digit runs: card / account / phone-like numbers
  text = text.replace(/\d(?:[ -]?\d){8,}/g, match => {
    const n = match.replace(/\D/g, '').length;
    if (n >= 13 && n <= 19) { kinds.add('card'); return '[CARD NUMBER HIDDEN]'; }
    kinds.add('account');
    return '[NUMBER HIDDEN]';
  });

  // 2) Short numbers next to otp / pin / cvv / password words
  const after  = new RegExp(`(${KEYWORDS})([^0-9\\n]{0,25})(\\d{4,8})(?!\\d)`, 'giu');
  const before = new RegExp(`(?<!\\d)(\\d{4,8})([^0-9\\n]{0,25})(${KEYWORDS})`, 'giu');
  const label = k => (/otp|ओटीपी|ઓટીપી|ஓடிபி|ஒருமுறை/i.test(k) ? 'otp' : 'pin');

  text = text.replace(after, (m, k, gap) => {
    kinds.add(label(k)); return `${k}${gap}[OTP/PIN HIDDEN]`;
  });
  text = text.replace(before, (m, num, gap, k) => {
    kinds.add(label(k)); return `[OTP/PIN HIDDEN]${gap}${k}`;
  });

  return { text, masked: kinds.size > 0, kinds: [...kinds] };
}
