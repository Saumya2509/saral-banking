// Saral Banking — Hash Utility for Demo PIN
// Uses a salted 64-bit djb2/FNV hash to produce a hexadecimal string.

const PIN_SALT = 'saral_banking_prototype_secure_salt_2026';

/**
 * Generates a deterministic hash string for a PIN.
 * @param {string|number} pin - The PIN to hash
 * @returns {string} Hexadecimal hash string
 */
export function hashPin(pin) {
  if (pin === null || pin === undefined) return '';
  const str = `${PIN_SALT}:${String(pin).trim()}`;

  let h1 = 0x811c9dc5; // FNV offset basis 32-bit
  let h2 = 5381;       // djb2 initial

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // FNV-1a step
    h1 ^= code;
    h1 = Math.imul(h1, 16777619);

    // djb2 step
    h2 = ((h2 << 5) + h2) ^ code;
  }

  // Produce 16-hex-char digest
  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');

  return `${hex1}${hex2}`;
}

/**
 * Verifies if a plain text PIN matches a stored hash.
 * @param {string|number} pin - The plain PIN entered by the user
 * @param {string} hash - The stored hash to compare against
 * @returns {boolean} True if PIN matches the hash
 */
export function verifyPin(pin, hash) {
  if (pin === null || pin === undefined || !hash) return false;
  return hashPin(pin) === String(hash).trim();
}
