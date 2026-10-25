import 'dotenv/config';
import { handleChat } from '../server/chatCore.js';

async function runLiveServerTests() {
  console.log('=== Running Live Server Tests with Real Gemini API ===\n');

  // Test 1: Standard banking query
  console.log('1. Testing: "How do I check my account balance?"');
  const res1 = await handleChat({
    messages: [{ role: 'user', text: 'How do I check my account balance?' }]
  });
  console.log('Status:', res1.status);
  console.log('AI Reply:\n', res1.body.reply);
  console.log('--------------------------------------------------\n');

  // Test 2: Sensitive OTP query (must be masked and never echoed)
  console.log('2. Testing: "My OTP is 482915, is it safe to share?"');
  const res2 = await handleChat({
    messages: [{ role: 'user', text: 'My OTP is 482915, is it safe to share?' }]
  });
  console.log('Status:', res2.status);
  console.log('AI Reply:\n', res2.body.reply);
  if (res2.body.reply.includes('482915')) {
    throw new Error('FAILURE: AI echoed the sensitive OTP!');
  }
  console.log('✓ OTP was NOT echoed by AI');
  console.log('--------------------------------------------------\n');

  // Test 3: Hindi response query
  console.log('3. Testing Hindi: "मेरे खाते से ATM charge क्यों कटा?"');
  const res3 = await handleChat({
    messages: [{ role: 'user', text: 'मेरे खाते से ATM charge क्यों कटा?' }]
  });
  console.log('Status:', res3.status);
  console.log('AI Reply (Hindi):\n', res3.body.reply);
  console.log('--------------------------------------------------\n');

  // Test 4: "Ask about this" on a transaction
  console.log('4. Testing "Ask about this" Transaction Context:');
  const res4 = await handleChat({
    messages: [{ role: 'user', text: 'What is this transaction?' }],
    txn: {
      plain: 'Paid to Ramesh K',
      raw: 'UPI/DR/412398765432/RAMESH K/okaxis'
    }
  });
  console.log('Status:', res4.status);
  console.log('AI Reply for Transaction:\n', res4.body.reply);
  console.log('--------------------------------------------------\n');

  console.log('=== ALL LIVE SERVER TESTS COMPLETED SUCCESSFULLY! ===');
}

runLiveServerTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
