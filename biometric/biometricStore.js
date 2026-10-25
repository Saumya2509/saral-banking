// biometric/biometricStore.js
// Persistent local storage wrapper for profile-specific biometric credentials

const PREFIX = 'saral_bio_';

export function getStorageKey(profileId) {
  return `${PREFIX}${profileId}`;
}

export function saveCredential(profileId, credentialData) {
  try {
    if (typeof localStorage === 'undefined') return false;
    const payload = {
      credentialId: credentialData.credentialId,
      rawId: credentialData.rawId,
      enrolledAt: new Date().toISOString(),
      profileId,
      authenticatorType: credentialData.authenticatorType || 'platform',
    };
    localStorage.setItem(getStorageKey(profileId), JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error('Failed to save biometric credential:', err);
    return false;
  }
}

export function getCredential(profileId) {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(getStorageKey(profileId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function removeCredential(profileId) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(getStorageKey(profileId));
  } catch (err) {
    console.error('Failed to remove biometric credential:', err);
  }
}

export function hasCredential(profileId) {
  return !!getCredential(profileId);
}

export function listEnrolledProfiles() {
  try {
    if (typeof localStorage === 'undefined') return [];
    const profiles = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        profiles.push(key.replace(PREFIX, ''));
      }
    }
    return profiles;
  } catch {
    return [];
  }
}
