// scripts/test-biometric.js
import assert from 'node:assert';
import {
  toBase64Url,
  fromBase64Url,
  fingerprintSupported,
  hasFingerprint,
  enableFingerprint,
  unlockWithFingerprint,
  removeFingerprint,
  getBiometricStatus,
} from '../biometric/biometric.js';
import {
  saveCredential,
  getCredential,
  removeCredential,
  listEnrolledProfiles,
} from '../biometric/biometricStore.js';

console.log('--- Starting bio.md Verification Tests ---');

// Mock localStorage if running in Node environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    get length() {
      return store.size;
    },
    key: (i) => Array.from(store.keys())[i] || null,
  };
}

// 1. Base64Url Encoding/Decoding
{
  const original = new Uint8Array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  const encoded = toBase64Url(original);
  assert(typeof encoded === 'string');
  assert(!encoded.includes('+') && !encoded.includes('/') && !encoded.includes('='));

  const decoded = fromBase64Url(encoded);
  assert.deepStrictEqual(Array.from(decoded), Array.from(original));
  console.log('✓ Test 1: Base64Url round-trip encoding/decoding passed');
}

// 2. Hardware / Platform Authenticator Capability Check
{
  const supported = await fingerprintSupported();
  assert(typeof supported === 'boolean');
  console.log(`✓ Test 2: Platform authenticator check returned ${supported}`);
}

// 3. Profile-Specific Enrollment & Storage
{
  const profilePriya = { id: 'priya', name: 'Priya Sharma' };
  const profileShankar = { id: 'shankar', name: 'Shankar Prasad' };

  // Initial state should be false
  removeFingerprint(profilePriya.id);
  removeFingerprint(profileShankar.id);
  assert.strictEqual(hasFingerprint(profilePriya.id), false);
  assert.strictEqual(hasFingerprint(profileShankar.id), false);

  // Enroll Priya
  const res = await enableFingerprint(profilePriya);
  assert.strictEqual(res.success, true);
  assert.strictEqual(hasFingerprint(profilePriya.id), true);

  // Shankar should STILL be false (Strict Profile Isolation)
  assert.strictEqual(hasFingerprint(profileShankar.id), false);
  console.log('✓ Test 3: Profile enrollment & strict cross-profile isolation passed');
}

// 4. Biometric Unlock Flow
{
  const profilePriya = { id: 'priya', name: 'Priya Sharma' };
  const profileShankar = { id: 'shankar', name: 'Shankar Prasad' };

  // Unlock for enrolled profile should succeed
  const unlockPriya = await unlockWithFingerprint(profilePriya);
  assert.strictEqual(unlockPriya, true);

  // Unlock for non-enrolled profile must reject with not_enabled
  let failedAsExpected = false;
  try {
    await unlockWithFingerprint(profileShankar);
  } catch (err) {
    failedAsExpected = true;
    assert.strictEqual(err.code, 'not_enabled');
  }
  assert.strictEqual(failedAsExpected, true);
  console.log('✓ Test 4: Biometric unlock & unauthorized profile rejection passed');
}

// 5. Credential Revocation / Removal
{
  const profilePriya = { id: 'priya', name: 'Priya Sharma' };
  assert.strictEqual(hasFingerprint(profilePriya.id), true);

  removeFingerprint(profilePriya.id);
  assert.strictEqual(hasFingerprint(profilePriya.id), false);

  // Attempting unlock after removal should fail
  let rejected = false;
  try {
    await unlockWithFingerprint(profilePriya);
  } catch (err) {
    rejected = true;
    assert.strictEqual(err.code, 'not_enabled');
  }
  assert.strictEqual(rejected, true);
  console.log('✓ Test 5: Credential revocation and cleanup passed');
}

// 6. UI Status Contract
{
  const statusBefore = await getBiometricStatus('aarav');
  assert.strictEqual(statusBefore.enabled, false);
  assert.strictEqual(statusBefore.ready, false);

  await enableFingerprint({ id: 'aarav', name: 'Aarav Mehta' });
  const statusAfter = await getBiometricStatus('aarav');
  assert.strictEqual(statusAfter.enabled, true);
  assert.strictEqual(statusAfter.ready, true);
  removeFingerprint('aarav');
  console.log('✓ Test 6: UI status resolution contract passed');
}

console.log('--- ALL bio.md SPECIFICATION TESTS PASSED ---');
