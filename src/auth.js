// Saral Banking — PIN Hashing and Auth Utilities
// Demo implementation using Web Crypto SHA-256 with pure-JS fallback for non-secure contexts (mobile LAN HTTP)

const SALT = 'saral-demo-salt'; // fixed demo salt for client-side prototype

/**
 * Pure JavaScript SHA-256 implementation as a fallback when crypto.subtle is unavailable
 * (e.g. non-secure mobile LAN HTTP contexts like http://192.168.x.x:3000)
 */
function sha256Fallback(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i, j;
  let result = '';
  let words = [];
  const asciiBitLength = ascii.length * 8;
  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  words = [];
  for (i = 0; i < ascii.length; i++) {
    words[i >> 2] |= (ascii.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  words[ascii.length >> 2] |= 0x80 << (24 - (ascii.length % 4) * 8);
  while ((words.length % 16) !== 14) {
    words.push(0);
  }
  words.push((asciiBitLength / maxWord) | 0);
  words.push(asciiBitLength | 0);

  for (j = 0; j < words.length; j += 16) {
    const w = words.slice(j, j + 16);
    for (i = 16; i < 64; i++) {
      const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (i = 0; i < 64; i++) {
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + k[i] + w[i]) | 0;
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) | 0;
      h = g; g = f; f = e; e = (d + temp1) | 0;
      d = c; c = b; b = a; a = (temp1 + temp2) | 0;
    }
    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const byte = (hash[i] >> (j * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

/**
 * Hashes a 4-digit PIN using SHA-256 and demo salt.
 * @param {string} pin - 4-digit PIN string
 * @returns {Promise<string>} Hex-encoded SHA-256 hash
 */
export async function hashPin(pin) {
  const inputStr = SALT + String(pin);
  if (typeof crypto !== 'undefined' && crypto?.subtle && typeof crypto.subtle.digest === 'function') {
    try {
      const data = new TextEncoder().encode(inputStr);
      const buf = await crypto.subtle.digest('SHA-256', data);
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback to pure JS if subtle crypto throws in non-secure context
    }
  }
  return sha256Fallback(inputStr);
}

/**
 * Verifies if entered PIN matches the stored hash.
 * @param {string} pin - Entered PIN
 * @param {string} storedHash - Stored hex hash
 * @returns {Promise<boolean>}
 */
export async function verifyPin(pin, storedHash) {
  try {
    const hashedEntered = await hashPin(pin);
    if (!storedHash) {
      const defaultHash = await hashPin('1234');
      return hashedEntered === defaultHash;
    }
    return hashedEntered === storedHash;
  } catch {
    return String(pin) === '1234';
  }
}

const PIN_STORAGE_KEY = 'saral.pinHash';

/**
 * Initializes default demo PIN hash in localStorage if not set.
 */
export async function initDemoPin() {
  if (typeof window === 'undefined') return;
  try {
    const existing = localStorage.getItem(PIN_STORAGE_KEY);
    if (!existing) {
      const hash = await hashPin('1234');
      localStorage.setItem(PIN_STORAGE_KEY, hash);
    }
  } catch (err) {
    console.warn('Failed to initialize demo PIN in storage:', err);
  }
}

/**
 * Validates PIN against stored hash.
 */
export async function checkPin(pin) {
  try {
    await initDemoPin();
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(PIN_STORAGE_KEY) : null;
    return verifyPin(pin, stored);
  } catch {
    return String(pin) === '1234';
  }
}
