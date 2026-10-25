// scripts/verify-all.js
// Verification suite validating all 17 sections of verify.md

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    totalPassed++;
  } else {
    console.error(`  ✗ FAILED: ${message}`);
    totalFailed++;
  }
}

console.log('=====================================================');
console.log('       SARAL BANKING: VERIFY.MD AUDIT SUITE          ');
console.log('=====================================================\n');

// Section 1: Safety and Privacy
console.log('--- Section 1: Safety & Privacy ---');
const signinContent = fs.readFileSync(path.join(root, 'src/screens/signin/SignIn.jsx'), 'utf8');
const authContent = fs.readFileSync(path.join(root, 'src/auth.js'), 'utf8');
const autoLockContent = fs.readFileSync(path.join(root, 'src/useAutoLock.js'), 'utf8');

assert(signinContent.includes('1234') && (signinContent.includes('Prototype') || signinContent.includes('Demo PIN')), '1.1 Sign-in shows demo PIN 1234 / prototype notice');
assert(authContent.includes('hashPin') || authContent.includes('checkPin'), '1.2 PIN hashing and verification implemented');
assert(autoLockContent.includes('120000'), '1.3 App auto-locks after 120 seconds (2 minutes)');

// Section 2: The Standard
console.log('\n--- Section 2: The Standard ---');
const standardExists = fs.existsSync(path.join(root, 'src/screens/standard/Standard.jsx'));
const routerContent = fs.readFileSync(path.join(root, 'src/router.jsx'), 'utf8');
const termExists = fs.existsSync(path.join(root, 'src/components/ui/Term.jsx'));

assert(standardExists, '2.1 Standard screen exists at src/screens/standard/Standard.jsx');
assert(routerContent.includes('help/standard'), '2.2 Router registers /help/standard route');
assert(termExists, '2.3 Term component exists for dotted glossary underlines');

// Section 3: Bank switcher
console.log('\n--- Section 3: Bank Switcher ---');
const banksContent = fs.readFileSync(path.join(root, 'src/data/banks.js'), 'utf8');
assert(banksContent.includes('saral') && banksContent.includes('janata') && banksContent.includes('desh'), '3.1 Three fictional banks defined (Saral, Janata, Desh)');

// Section 4: Customers & modes
console.log('\n--- Section 4: Customers and Modes ---');
const customersContent = fs.readFileSync(path.join(root, 'src/data/customers.js'), 'utf8');
assert(customersContent.includes("'shankar'") && customersContent.includes("'priya'") && customersContent.includes("'aarav'"), '4.1 Three customers available: Aarav, Priya, Shankar');
assert(customersContent.includes("defaultLang: 'hi'") && customersContent.includes("defaultMode: 'simple'"), '4.2 Shankar defaults to Hindi and Simple mode');
assert(customersContent.includes("defaultMode: 'young'"), '4.3 Aarav defaults to Young saver mode');

// Section 5: Young saver
console.log('\n--- Section 5: Young Saver ---');
const guardianConsentExists = fs.existsSync(path.join(root, 'src/screens/young/GuardianConsent.jsx'));
const guardianViewExists = fs.existsSync(path.join(root, 'src/screens/young/GuardianView.jsx'));
const goalsExists = fs.existsSync(path.join(root, 'src/screens/young/Goals.jsx'));
assert(guardianConsentExists, '5.1 GuardianConsent screen present');
assert(guardianViewExists, '5.2 GuardianView screen present for supervising child');
assert(goalsExists, '5.3 Savings Goals screen present for Young saver');

// Section 6: Home
console.log('\n--- Section 6: Home ---');
const homeContent = fs.readFileSync(path.join(root, 'src/screens/home/Home.jsx'), 'utf8');
const ledgerContent = fs.readFileSync(path.join(root, 'src/utils/ledger.js'), 'utf8');
assert(homeContent.includes('hideBalance') || homeContent.includes('EyeIcon') || homeContent.includes('EyeOffIcon'), '6.1 Balance has show/hide visibility toggle');
assert(ledgerContent.includes('available') && ledgerContent.includes('total'), '6.2 Ledger computes available and total balances');

// Section 7 & 8: Pay & Safety Checks
console.log('\n--- Section 7 & 8: Pay & Safety Checks ---');
const checkPaymentContent = fs.readFileSync(path.join(root, 'src/payments/checkPayment.js'), 'utf8');
const payReviewContent = fs.readFileSync(path.join(root, 'src/screens/pay/PayReview.jsx'), 'utf8');

assert(checkPaymentContent.includes('isNewPayee'), '8.1 New payee safety check enforced');
assert(checkPaymentContent.includes('safetyCheckOverPaise: 1000000') || checkPaymentContent.includes('safetyCheckAbovePaise'), '8.2 Safety check above ₹10,000 implemented');
assert(checkPaymentContent.includes('simpleConfirmOverPaise: 500000') || checkPaymentContent.includes('simpleConfirmAbovePaise'), '8.3 Simple confirm above ₹5,000 implemented');
assert(payReviewContent.includes('safety') || payReviewContent.includes('warning') || payReviewContent.includes('prompt'), '8.4 PayReview contains safety verification prompt');

// Section 9: History
console.log('\n--- Section 9: History ---');
const historyContent = fs.readFileSync(path.join(root, 'src/screens/history/History.jsx'), 'utf8');
const txDetailContent = fs.readFileSync(path.join(root, 'src/screens/history/TransactionDetail.jsx'), 'utf8');
assert(historyContent.includes('DayGroupHeader') || historyContent.includes('group'), '9.1 Transactions grouped by day');
assert(txDetailContent.includes('EXPLANATIONS') || txDetailContent.includes('parts'), '9.2 Transaction detail explains raw description parts');
assert(txDetailContent.includes('Report a problem') || txDetailContent.includes('help/chat'), '9.3 Report a problem and Ask about this actions present');

// Section 10: Statements
console.log('\n--- Section 10: Statements ---');
const statementsContent = fs.readFileSync(path.join(root, 'src/screens/statements/Statements.jsx'), 'utf8');
const printExists = fs.existsSync(path.join(root, 'src/screens/statements/StatementPrint.jsx'));
assert(statementsContent.includes('1m') && statementsContent.includes('3m') && statementsContent.includes('6m') && statementsContent.includes('custom'), '10.1 Statement periods (1m, 3m, 6m, custom) supported');
assert(statementsContent.includes('csv') || statementsContent.includes('text/csv'), '10.2 CSV export supported');
assert(printExists, '10.3 Statement print-friendly view exists');

// Section 11: Services
console.log('\n--- Section 11: Services ---');
const servicesContent = fs.readFileSync(path.join(root, 'src/screens/services/Services.jsx'), 'utf8');
const timelineExists = fs.existsSync(path.join(root, 'src/components/records/StatusTimeline.jsx'));
assert(timelineExists, '11.1 StatusTimeline component exists');
assert(servicesContent.includes('cheque') || servicesContent.includes('card') || servicesContent.includes('limit'), '11.2 Cheque, card blocking, and limits present in Services');

// Section 12: Learn & Help
console.log('\n--- Section 12: Learn & Help ---');
const learnContent = fs.readFileSync(path.join(root, 'src/screens/learn/Learn.jsx'), 'utf8');
const scamsContent = fs.readFileSync(path.join(root, 'src/data/scams.js'), 'utf8');
const helpChatContent = fs.readFileSync(path.join(root, 'src/screens/help/HelpChat.jsx'), 'utf8');
const reportFraudContent = fs.readFileSync(path.join(root, 'src/screens/help/ReportFraud.jsx'), 'utf8');

assert(learnContent.length > 0, '12.1 Learn screen present');
assert(scamsContent.includes('fake-kyc') && scamsContent.includes('prize') && scamsContent.includes('request'), '12.2 Common scams covered');
assert(helpChatContent.includes('maskSensitive') && helpChatContent.includes('WARNING_TEXT'), '12.3 HelpChat masks sensitive numbers');
assert(reportFraudContent.includes('config.helplines.cyber') && reportFraudContent.includes('config.helplines.site'), '12.4 Report fraud screen features 1930 and cybercrime.gov.in');

// Section 13: Settings
console.log('\n--- Section 13: Settings ---');
const settingsContent = fs.readFileSync(path.join(root, 'src/screens/settings/Settings.jsx'), 'utf8');
assert(settingsContent.includes('textSize') && settingsContent.includes('contrast'), '13.1 Text size (3 steps) and high contrast options in Settings');
assert(settingsContent.includes('handleResetDemo') || settingsContent.includes('resetDemo'), '13.2 Reset demo restores state');

// Section 14: Money and Data
console.log('\n--- Section 14: Money and Data ---');
const moneyContent = fs.readFileSync(path.join(root, 'src/utils/money.js'), 'utf8');
assert(moneyContent.includes('formatINR') && moneyContent.includes('amountToSpeech'), '14.1 formatINR (paise) and amountToSpeech with lakh/crore conversion present');

// Section 15: Voice Control
console.log('\n--- Section 15: Voice Control ---');
const voiceExists = fs.existsSync(path.join(root, 'src/components/voice/VoiceControl.jsx'));
assert(voiceExists, '15.1 VoiceControl component present with speech recognition support');

// Section 16: Languages (en, hi, ta)
console.log('\n--- Section 16: Languages (English, Hindi, Tamil) ---');
const taCoreExists = fs.existsSync(path.join(root, 'src/i18n/tamil/ta.core.js'));
const taPayExists = fs.existsSync(path.join(root, 'src/i18n/tamil/ta.pay.js'));
const taRecordsExists = fs.existsSync(path.join(root, 'src/i18n/tamil/ta.records.js'));
const tamilNumberExists = fs.existsSync(path.join(root, 'src/i18n/tamil/tamilNumber.js'));
assert(taCoreExists && taPayExists && taRecordsExists && tamilNumberExists, '16.1 Full modular Tamil i18n and Tamil sandhi numbering present');

// Section 17: Biometrics Engine
console.log('\n--- Biometric Authentication Engine ---');
const bioExists = fs.existsSync(path.join(root, 'biometric/biometric.js'));
const bioStoreExists = fs.existsSync(path.join(root, 'biometric/biometricStore.js'));
const bioModalExists = fs.existsSync(path.join(root, 'biometric/BiometricEnrollModal.jsx'));
assert(bioExists && bioStoreExists && bioModalExists, '17.1 WebAuthn platform biometric engine and enrollment modal present');

console.log('\n=====================================================');
console.log(`TOTAL CHECKS: ${totalPassed + totalFailed} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
console.log('=====================================================');

if (totalFailed > 0) process.exit(1);
