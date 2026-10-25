// Saral Banking — PIN Hashing and Auth Utilities
// Demo implementation using Web Crypto SHA-256 with fixed demo salt

const SALT = 'saral-demo-salt'; // fixed demo salt for client-side prototype

/**
 * Hashes a 4-digit PIN using SHA-256 and demo salt.
 * @param {string} pin - 4-digit PIN string
 * @returns {Promise<string>} Hex-encoded SHA-256 hash
 */
export async function hashPin(pin) {
  const data = new TextEncoder().encode(SALT + String(pin));
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies if entered PIN matches the stored hash.
 * @param {string} pin - Entered PIN
 * @param {string} storedHash - Stored hex hash
 * @returns {Promise<boolean>}
 */
export async function verifyPin(pin, storedHash) {
  if (!storedHash) {
    const defaultHash = await hashPin('1234');
    return (await hashPin(pin)) === defaultHash;
  }
  return (await hashPin(pin)) === storedHash;
}

const PIN_STORAGE_KEY = 'saral.pinHash';

/**
 * Initializes default demo PIN hash in localStorage if not set.
 */
export async function initDemoPin() {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(PIN_STORAGE_KEY);
  if (!existing) {
    const hash = await hashPin('1234');
    localStorage.setItem(PIN_STORAGE_KEY, hash);
  }
}

/**
 * Validates PIN against stored hash.
 */
export async function checkPin(pin) {
  await initDemoPin();
  const stored = localStorage.getItem(PIN_STORAGE_KEY);
  return verifyPin(pin, stored);
}
