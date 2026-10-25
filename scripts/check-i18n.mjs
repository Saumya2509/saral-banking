// scripts/check-i18n.mjs
import en from '../src/i18n/en.js';
import ta from '../src/i18n/ta.js';

console.log('--- Checking Tamil i18n Completeness ---');

const enKeys = Object.keys(en);
const taKeys = Object.keys(ta);
const missingInTa = enKeys.filter((k) => !(k in ta));
const extraInTa = taKeys.filter((k) => !(k in en));

console.log(`English keys: ${enKeys.length}`);
console.log(`Tamil keys:   ${taKeys.length}`);
console.log(`Missing keys: ${missingInTa.length}`);

if (missingInTa.length > 0) {
  console.error('Missing in ta:', missingInTa);
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
  }
}

console.log(`Placeholder mismatches: ${placeholderMismatches}`);

if (missingInTa.length > 0 || placeholderMismatches > 0) {
  process.exit(1);
} else {
  console.log('✓ All i18n checks passed cleanly!');
}
