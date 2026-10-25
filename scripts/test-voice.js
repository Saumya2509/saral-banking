// scripts/test-voice.js
import assert from 'node:assert';
import { maskSensitive } from '../shared/mask.js';
import { SYSTEM_PROMPT } from '../server/systemPrompt.js';
import { handleChat } from '../server/chatCore.js';
import { keywordAnswer } from '../src/utils/chat.js';
import { toTamilWords, amountToTamilSpeech } from '../src/i18n/tamilNumber.js';

console.log('--- Starting voice.md Verification Tests ---');

// 1. Masking tests (§4 and §9)
{
  // Test 1: OTP with English keyword
  const r1 = maskSensitive('My OTP is 482915, the bank person is asking for it. Should I tell him?');
  assert.strictEqual(r1.masked, true);
  assert(r1.text.includes('[OTP/PIN HIDDEN]'));
  assert(!r1.text.includes('482915'));
  assert(r1.kinds.includes('otp'));
  console.log('✓ Test 1: OTP masked correctly');

  // Test 7: Card number masking
  const r7 = maskSensitive('My card is 4111 1111 1111 1111, block it');
  assert.strictEqual(r7.masked, true);
  assert(r7.text.includes('[CARD NUMBER HIDDEN]'));
  assert(!r7.text.includes('4111'));
  assert(r7.kinds.includes('card'));
  console.log('✓ Test 7: Card number masked correctly');

  // Test 10: Hinglish PIN
  const r10 = maskSensitive('mera pin 4821 hai, kaise badlun?');
  assert.strictEqual(r10.masked, true);
  assert(r10.text.includes('[OTP/PIN HIDDEN]'));
  assert(!r10.text.includes('4821'));
  assert(r10.kinds.includes('pin'));
  console.log('✓ Test 10: Hinglish PIN masked correctly');

  // Over-masking check: amounts and dates should NOT be masked
  const rOver = maskSensitive('I paid 5000 on 12 March');
  assert.strictEqual(rOver.masked, false);
  assert.strictEqual(rOver.text, 'I paid 5000 on 12 March');
  console.log('✓ Over-masking check passed: 5000 on 12 March untouched');

  // Devanagari digits OTP
  const rDev = maskSensitive('मेरा ओटीपी ४८२९१५ है');
  assert.strictEqual(rDev.masked, true);
  assert(rDev.text.includes('[OTP/PIN HIDDEN]'));
  assert(!rDev.text.includes('४८२९१५'));
  console.log('✓ Devanagari digits OTP masked correctly');

  // Tamil digits OTP
  const rTaOtp = maskSensitive('என் ஓடிபி ௧௨௩௪');
  assert.strictEqual(rTaOtp.masked, true);
  assert(rTaOtp.text.includes('[OTP/PIN HIDDEN]'));
  assert(rTaOtp.kinds.includes('otp'));
  console.log('✓ Tamil digits OTP masked correctly');

  // Tamil PIN
  const rTaPin = maskSensitive('என் ரகசிய எண் 1234');
  assert.strictEqual(rTaPin.masked, true);
  assert(rTaPin.text.includes('[OTP/PIN HIDDEN]'));
  assert(rTaPin.kinds.includes('pin'));
  console.log('✓ Tamil PIN masked correctly');

  // Account number (9+ digits)
  const rAcc = maskSensitive('Transfer to account 1234567890');
  assert.strictEqual(rAcc.masked, true);
  assert(rAcc.text.includes('[NUMBER HIDDEN]'));
  console.log('✓ Account number masked correctly');
}

// 2. System Prompt Integrity (§5)
{
  assert(SYSTEM_PROMPT.includes('You are the help assistant inside a bank\'s savings account app in India.'));
  assert(SYSTEM_PROMPT.includes('=== GLOSSARY ==='));
  assert(SYSTEM_PROMPT.includes('=== FAQ ==='));
  assert(SYSTEM_PROMPT.includes('=== SCAMS ==='));
  assert(SYSTEM_PROMPT.includes('=== CONFIG ==='));
  assert(SYSTEM_PROMPT.includes('Never ask for a PIN, OTP, password, card number, CVV, or account number.'));
  console.log('✓ System prompt built with all 4 knowledge sections and safety instructions');
}

// 3. Server Validation and Error Handling (§6.1)
{
  // Test no GEMINI_API_KEY set
  const oldKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  const resNoKey = await handleChat({ messages: [{ role: 'user', text: 'Hello' }] });
  assert.strictEqual(resNoKey.status, 500);
  assert.strictEqual(resNoKey.body.error, 'server_not_configured');
  console.log('✓ Server returns 500 server_not_configured when key is absent');

  // Test empty messages
  process.env.GEMINI_API_KEY = 'mock_key';
  const resNoMsg = await handleChat({ messages: [] });
  assert.strictEqual(resNoMsg.status, 400);
  assert.strictEqual(resNoMsg.body.error, 'no_messages');
  console.log('✓ Server validates non-empty messages');

  // Test last message must be user
  const resBadRole = await handleChat({
    messages: [
      { role: 'user', text: 'Hi' },
      { role: 'assistant', text: 'Hello' }
    ]
  });
  assert.strictEqual(resBadRole.status, 400);
  assert.strictEqual(resBadRole.body.error, 'last_message_must_be_user');
  console.log('✓ Server enforces last message must be from user');

  // Restore or cleanup
  if (oldKey) process.env.GEMINI_API_KEY = oldKey;
  else delete process.env.GEMINI_API_KEY;
}

// 4. Keyword Fallback Matcher (§7.2)
{
  const fb1 = keywordAnswer('What is my balance?', null, 'en');
  assert(typeof fb1 === 'string' && fb1.length > 0);

  const fbHi = keywordAnswer('बैलेंस कैसे चेक करें', null, 'hi');
  assert(typeof fbHi === 'string' && fbHi.length > 0);

  const fbTa = keywordAnswer('இருப்பு எவ்வளவு?', null, 'ta');
  assert(typeof fbTa === 'string' && fbTa.length > 0);

  const fbTanglish = keywordAnswer('iruppu check', null, 'ta');
  assert(typeof fbTanglish === 'string' && fbTanglish.length > 0);

  const fbTxn = keywordAnswer('What is this?', { plain: 'Paid to Ramesh', raw: 'UPI/DR/123/RAMESH' }, 'en');
  assert(fbTxn.includes('Paid to Ramesh'));
  console.log('✓ Keyword fallback answers work for English, Hindi, Tamil, and transactions');
}

// 5. Tamil Currency and Number to Words (§7 of tamil.md)
{
  assert.strictEqual(amountToTamilSpeech(500), 'ஐந்நூறு ரூபாய்');
  assert.strictEqual(amountToTamilSpeech(1250), 'ஆயிரத்து இருநூற்று ஐம்பது ரூபாய்');
  assert.strictEqual(amountToTamilSpeech(5000), 'ஐயாயிரம் ரூபாய்');
  assert.strictEqual(amountToTamilSpeech(25000), 'இருபத்தைந்தாயிரம் ரூபாய்');
  assert.strictEqual(amountToTamilSpeech(125000), 'ஒரு லட்சத்து இருபத்தைந்தாயிரம் ரூபாய்');
  assert.strictEqual(amountToTamilSpeech(250000), 'இரண்டு லட்சத்து ஐம்பதாயிரம் ரூபாய்');
  assert.strictEqual(amountToTamilSpeech(10000000), 'ஒரு கோடி ரூபாய்');
  assert.strictEqual(toTamilWords(500), 'ஐந்நூறு');
  console.log('✓ Tamil currency words matching Section 7 passed for all milestones');
}

console.log('--- ALL voice.md SPECIFICATION TESTS PASSED ---');
