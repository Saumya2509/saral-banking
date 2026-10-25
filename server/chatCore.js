// server/chatCore.js
import { maskSensitive } from '../shared/mask.js';
import { SYSTEM_PROMPT } from './systemPrompt.js';

const MAX_CHARS = 500;
const MAX_MESSAGES = 10;
const MAX_TXN_CHARS = 200;
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const TIMEOUT_MS = 12000;

function clean(s, limit) {
  return maskSensitive(String(s ?? '').slice(0, limit)).text;
}

// Returns { status, body }
export async function handleChat(payload) {
  const key = process.env.GEMINI_API_KEY || process.env.GEMINI || process.env.Gemini;
  if (!key) return { status: 500, body: { error: 'server_not_configured' } };

  // ---- validate
  const raw = Array.isArray(payload?.messages) ? payload.messages : null;
  if (!raw || raw.length === 0) return { status: 400, body: { error: 'no_messages' } };

  let messages = raw
    .filter(m => (m?.role === 'user' || m?.role === 'assistant') && typeof m.text === 'string')
    .slice(-MAX_MESSAGES)
    .map(m => ({ role: m.role, text: clean(m.text, MAX_CHARS) }));

  while (messages.length && messages[0].role !== 'user') messages.shift(); // Gemini wants a user turn first
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user' || !last.text.trim()) {
    return { status: 400, body: { error: 'last_message_must_be_user' } };
  }

  // ---- optional "Ask about this": only plain + raw description, nothing else
  const txn = payload?.txn;
  if (txn && (txn.plain || txn.raw)) {
    const plain = clean(txn.plain, MAX_TXN_CHARS);
    const rawDesc = clean(txn.raw, MAX_TXN_CHARS);
    last.text =
      `[The user tapped "Ask about this" on a transaction]\n` +
      `Plain description: ${plain || 'not available'}\n` +
      `Raw description: ${rawDesc || 'not available'}\n\n` +
      `User's question: ${last.text}`;
  }

  // ---- call Gemini
  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    })),
    generationConfig: { temperature: 0.3, maxOutputTokens: 500 },
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      }
    );
    if (!r.ok) {
      console.error('Gemini error', r.status); // never log message text
      return { status: 502, body: { error: 'model_error' } };
    }
    const data = await r.json();
    const reply = (data?.candidates?.[0]?.content?.parts || [])
      .map(p => p.text || '').join('').trim();
    if (!reply) return { status: 502, body: { error: 'empty_reply' } };
    return { status: 200, body: { reply: maskSensitive(reply).text } }; // mask the output too
  } catch (e) {
    console.error('chat failure', e?.name);
    return { status: 504, body: { error: 'timeout_or_network' } };
  } finally {
    clearTimeout(timer);
  }
}
