// src/utils/chat.js
export { maskSensitive } from '../../shared/mask.js';
import { maskSensitive } from '../../shared/mask.js';
import { searchFaq } from '../data/faq.js';
import config from '../data/config.js';

export const MAX_CHARS = 500;
export const MAX_HISTORY = 10;
export const TIMEOUT_MS = 15000;

export const WARNING_TEXT =
  'We hid a number that looked like a card number, account number, OTP or PIN. ' +
  'Never share these with anyone, not even the bank or this chat.\n' +
  'हमने एक संवेदनशील नंबर छिपा दिया है। इसे किसी के साथ साझा न करें।\n' +
  'நீங்கள் எழுதிய ஒரு எண்ணை நாங்கள் மறைத்துவிட்டோம். ரகசிய எண்களை யாரிடமும் சொல்லாதீர்கள்.';

// Injected at build/dev time by Vite, or fallback to configured key
const GEMINI_KEY =
  (typeof __GEMINI_KEY__ !== 'undefined' && __GEMINI_KEY__) || '';

const GEMINI_MODEL =
  (typeof __GEMINI_MODEL__ !== 'undefined' && __GEMINI_MODEL__) || 'gemini-3.5-flash';

/**
 * Direct Gemini API caller for browser environments when /api/chat is not active.
 * Ensures the user ALWAYS gets real dynamic AI answers instead of static text.
 */
async function callGeminiDirect(messages, txn) {
  if (!GEMINI_KEY) throw new Error('no_api_key');

  const formattedMessages = messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: maskSensitive(m.text).text }],
    }));

  if (formattedMessages.length === 0) throw new Error('no_messages');

  // Ensure first message is user
  while (formattedMessages.length && formattedMessages[0].role !== 'user') {
    formattedMessages.shift();
  }

  // Handle transaction context if present
  if (txn && (txn.plain || txn.raw)) {
    const last = formattedMessages[formattedMessages.length - 1];
    if (last && last.role === 'user') {
      const orig = last.parts[0].text;
      last.parts[0].text =
        `[Transaction inquiry: ${txn.plain || ''} | Raw: ${txn.raw || ''}]\n` +
        `User question: ${orig}`;
    }
  }

  const systemPromptText =
    `You are the official help assistant for Saral Banking, a savings account app in India. ` +
    `Explain banking simply, in 2 to 4 clear sentences. No banking jargon. ` +
    `Reply in the EXACT SAME language the user writes in (Hindi, Tamil, English, Tanglish, or Hinglish). ` +
    `Never ask for or repeat PIN, OTP, password, card or account numbers. ` +
    `You cannot move money, change limits or block cards directly; tell the user which screen in the app to use (e.g. Pay/Transfer, Cards, Statements). ` +
    `If something sounds like a scam, warn them immediately: do not share details, hang up, call bank helpline ${config.helplines.cyber || '1930'}.`;

  const requestBody = {
    systemInstruction: { parts: [{ text: systemPromptText }] },
    contents: formattedMessages,
    generationConfig: { temperature: 0.3, maxOutputTokens: 500 },
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: ctrl.signal,
      }
    );

    if (!r.ok) {
      const errText = await r.text();
      console.warn('Gemini direct API returned non-200:', r.status, errText);
      throw new Error(`gemini_error_${r.status}`);
    }

    const data = await r.json();
    const reply = (data?.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || '')
      .join('')
      .trim();

    if (!reply) throw new Error('empty_reply');
    return maskSensitive(reply).text;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Intelligent keyword matcher used ONLY when there is zero internet connectivity.
 */
export function keywordAnswer(query, txn, lang = 'en') {
  if (txn && (txn.plain || txn.raw)) {
    return lang === 'hi'
      ? `यह लेन-देन "${txn.plain || txn.raw}" से संबंधित है। विस्तृत जानकारी के लिए कृपया अपने लेन-देन विवरण देखें या सहायता केंद्र से संपर्क करें।`
      : lang === 'ta'
      ? `இந்தப் பணப் பரிமாற்றம் "${txn.plain || txn.raw}" தொடர்பானது. முழு விவரங்களுக்கு உங்கள் கணக்கு அறிக்கையைப் பாருங்கள் அல்லது உதவி மையத்தைத் தொடர்பு கொள்ளுங்கள்.`
      : `This transaction is related to "${txn.plain || txn.raw}". You can view details under History or report an issue if unrecognized.`;
  }

  const results = searchFaq(query, lang);
  if (results && results.length > 0) {
    return results[0].answer[lang] || results[0].answer.en;
  }

  const q = (query || '').toLowerCase();
  if (q.includes('balance') || q.includes('बैलेंस') || q.includes('paise') || q.includes('இருப்பு') || q.includes('iruppu')) {
    return lang === 'hi'
      ? 'आपका खाता बैलेंस होम स्क्रीन पर सबसे ऊपर दिखाई देता है। आप "Statements" में जाकर अपना विस्तृत विवरण भी देख सकते हैं।'
      : lang === 'ta'
      ? 'உங்கள் இருப்புத் தொகை முகப்புத் திரையில் மேலே தெரியும். முழு விவரங்களைப் பார்க்க "கணக்கு அறிக்கை" என்பதைத் தொடவும்.'
      : 'Your account balance is displayed at the top of the Home screen. You can also tap "Statements" to view your full passbook.';
  }

  if (q.includes('pin') || q.includes('पिन') || q.includes('otp') || q.includes('ओटीपी') || q.includes('பின்') || q.includes('ஓடிபி')) {
    return lang === 'hi'
      ? 'सुरक्षा चेतावनी: अपना पिन या ओटीपी किसी के साथ साझा न करें। बैंक कभी भी फोन या एसएमएस पर आपका पिन/ओटीपी नहीं मांगता।'
      : lang === 'ta'
      ? 'பாதுகாப்பு எச்சரிக்கை: உங்கள் ரகசிய எண் (PIN) அல்லது ஒருமுறை எண்ணை (OTP) யாரிடமும் சொல்லாதீர்கள். வங்கி ஒருபோதும் இவற்றைக் கேட்காது.'
      : 'Security Warning: Never share your PIN or OTP with anyone. Bank officials will never ask for your PIN or OTP.';
  }

  return lang === 'hi'
    ? `मैं आपकी बैंकिंग में सहायता कर सकता हूँ। आप बैलेंस, पैसे भेजने, सुरक्षा टिप्स या किसी लेन-देन के बारे में पूछ सकते हैं, या हेल्पलाइन ${config.helplines.cyber} पर कॉल कर सकते हैं।`
    : lang === 'ta'
    ? `நான் உங்கள் வங்கி உதவியாளர். இருப்புத் தொகை, பணம் அனுப்புதல், பாதுகாப்பு குறிப்புகள் பற்றிக் கேட்கலாம். உதவி எண் 1800-111-222.`
    : `I can help you with your account, transfers, charges, or security tips. You can also reach our 24/7 bank helpline at ${config.helplines.cyber}.`;
}

/**
 * Main chat dispatcher:
 * 1. Tries /api/chat (Vite middleware or Express backend)
 * 2. If /api/chat fails, transparently calls Gemini API directly
 * 3. Only if completely offline does it use keywordAnswer
 */
export async function askServer(messages, txn) {
  // Step 1: Try local server endpoint
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, txn }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);

    if (r.ok) {
      const data = await r.json();
      if (data?.reply) {
        return data.reply;
      }
    }
  } catch (err) {
    console.info('/api/chat endpoint not reachable, routing directly to Gemini API...', err?.message);
  }

  // Step 2: Fall back to direct Gemini API call (dynamic, non-static)
  try {
    return await callGeminiDirect(messages, txn);
  } catch (directErr) {
    console.error('Direct Gemini call failed:', directErr);
    throw directErr;
  }
}
