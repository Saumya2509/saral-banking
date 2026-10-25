// src/utils/upi.js
// Strict UPI payment QR validator and parser per change.md §4

/**
 * Strict UPI payment QR validator and parser per change.md §4:
 * Accept only if all of these are true:
 * - The text starts with upi://pay? (case-insensitive).
 * - It has a pa parameter (the UPI ID) that matches ^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$.
 * - It has a non-empty pn (payee name), at most 100 characters.
 * - If am (amount) is present, it is a number greater than 0 with at most 2 decimals. Convert it to whole paise.
 * - cu, if present, is INR.
 * Returns { name, bank, accountNumber, amountPaise } on success, or null if invalid.
 */
export function parseUpiQr(text) {
  if (!text || typeof text !== 'string') return null;
  const raw = text.trim();

  // 1. Must start with upi://pay? (case-insensitive)
  if (!/^upi:\/\/pay\?/i.test(raw)) {
    return null;
  }

  const queryPart = raw.slice(raw.indexOf('?') + 1);
  const params = new URLSearchParams(queryPart);

  // 2. Must have a pa parameter matching ^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$
  const pa = params.get('pa') || '';
  if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(pa)) {
    return null;
  }

  // 3. Must have a non-empty pn (payee name), at most 100 characters
  const rawPn = params.get('pn');
  if (!rawPn) return null;
  const pn = decodeURIComponent(rawPn).trim();
  if (!pn || pn.length > 100) {
    return null;
  }

  // 4. cu, if present, must be INR (case-insensitive)
  const cu = params.get('cu');
  if (cu && cu.toUpperCase() !== 'INR') {
    return null;
  }

  // 5. If am (amount) is present, it is a number greater than 0 with at most 2 decimals
  const am = params.get('am');
  let amountPaise = undefined;
  if (am !== null && am !== undefined && am !== '') {
    if (!/^\d+(\.\d{1,2})?$/.test(am)) {
      return null;
    }
    const parsedAm = parseFloat(am);
    if (parsedAm <= 0 || isNaN(parsedAm)) {
      return null;
    }
    amountPaise = Math.round(parsedAm * 100);
  }

  return {
    name: pn,
    bank: 'UPI / Bharat QR',
    accountNumber: pa,
    amountPaise,
  };
}

export default {
  parseUpiQr,
};
