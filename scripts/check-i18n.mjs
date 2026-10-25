// scripts/check-i18n.mjs
import en from '../src/i18n/en.js';
import hi from '../src/i18n/hi.js';
import ta from '../src/i18n/ta.js';

console.log('--- Checking i18n Completeness (en, hi, ta) ---');

const enKeys = Object.keys(en);
const hiKeys = Object.keys(hi);
const taKeys = Object.keys(ta);

const missingInHi = enKeys.filter((k) => !(k in hi));
const missingInTa = enKeys.filter((k) => !(k in ta));

console.log(`English keys: ${enKeys.length}`);
console.log(`Hindi keys:   ${hiKeys.length}`);
console.log(`Tamil keys:   ${taKeys.length}`);

let hasErrors = false;

if (missingInHi.length > 0) {
  console.error('Missing in hi:', missingInHi);
  hasErrors = true;
}

if (missingInTa.length > 0) {
  console.error('Missing in ta:', missingInTa);
  hasErrors = true;
}

for (const k of taKeys) {
  const val = typeof ta[k] === 'string' ? ta[k].trim() : '';
  if (!val) {
    console.error(`Empty value in ta for key: "${k}"`);
    hasErrors = true;
  }
}

// Check placeholders
let placeholderMismatches = 0;
const extractPlaceholders = (str) => {
  if (typeof str !== 'string') return [];
  const matches = str.match(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g) || [];
  return matches.map((m) => m.replace(/[\{\}\s]/g, '')).sort();
};

for (const k of enKeys) {
  if (!(k in ta)) continue;
  const enPh = extractPlaceholders(en[k]);
  const taPh = extractPlaceholders(ta[k]);
  if (JSON.stringify(enPh) !== JSON.stringify(taPh)) {
    console.error(`Placeholder mismatch in key "${k}": en=${JSON.stringify(enPh)}, ta=${JSON.stringify(taPh)}`);
    placeholderMismatches++;
    hasErrors = true;
  }
}

console.log(`Missing in Hindi: ${missingInHi.length}`);
console.log(`Missing in Tamil: ${missingInTa.length}`);
console.log(`Placeholder mismatches: ${placeholderMismatches}`);

if (hasErrors) {
  process.exit(1);
} else {
  console.log('✓ All i18n specification checks passed cleanly!');
}
