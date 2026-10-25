# bio.md: Biometric Authentication Specification (WebAuthn / FIDO2 Passkeys)

This specification defines the production-grade biometric authentication system for **Saral Banking**, an accessible savings account application designed for customers in India across three distinct persona tiers: **Shankar Prasad** (Senior, 68y, Simple mode), **Priya Sharma** (Salaried Professional, 32y, Standard mode), and **Aarav Mehta** (Minor, 15y, Young Saver mode).

---

## 1. Executive Summary & Architecture

Biometric authentication in Saral Banking utilizes the standardized **W3C Web Authentication API (WebAuthn / FIDO2)**. It allows customers to unlock their banking profiles using built-in device hardware authenticators:
- **Fingerprint sensor** (Android BiometricPrompt, Windows Hello Fingerprint, Touch ID)
- **Facial recognition** (Face ID, Windows Hello Face)
- **Platform screen lock fallback** (Device PIN, Pattern, or Passcode)

### 1.1 Core Principles
1. **Zero Biometric Data Leaves the Device:** No raw fingerprint or facial scan data is ever transmitted, serialized, or stored on servers or local storage. Only cryptographic key pairs generated in hardware secure enclaves (TPM / Secure Enclave / Android KeyStore) are utilized.
2. **First PIN Login is the Enrollment Anchor:** There is no separate signup or onboarding wall. The user enters their 4-digit demo PIN (`1234`) to prove account ownership, after which Saral Banking offers 1-tap biometric enrollment.
3. **Strict Profile Isolation:** Biometric credentials are keyed to the specific customer ID (`shankar`, `priya`, `aarav`). Enabling biometrics for Priya does not allow Shankar or Aarav to bypass their own authentication.
4. **Resilient Dual-Path Architecture:** Works in two modes:
   - **Production Mode (WebAuthn):** Invokes `navigator.credentials.create()` and `navigator.credentials.get()` on secure contexts (`https://` or `http://localhost`).
   - **Accessible Demo & Testing Mode:** Automatically provides a reliable fallback simulator for headless testing, non-HTTPS environments, and devices lacking biometric hardware.
5. **Always-Available PIN Fallback:** PIN verification remains 100% functional at all times. Biometric failure or cancellation never locks the user out of manual PIN entry.

---

## 2. Directory & Module Organization

All biometric code is contained inside the dedicated `biometric/` directory:

```
saral-banking/
├── biometric/
│   ├── bio.md                     # This specification file
│   ├── biometric.js               # WebAuthn engine, platform checks, registration & unlock
│   ├── biometricStore.js          # Persistent credential storage & profile association
│   ├── BiometricEnrollModal.jsx   # Accessible prompt dialog ("Turn on fingerprint for next time?")
│   └── index.js                   # Unified export gateway
├── src/
│   ├── biometric/                 # Symlinked/bridged client module
│   │   ├── biometric.js
│   │   ├── biometricStore.js
│   │   ├── BiometricEnrollModal.jsx
│   │   └── index.js
│   ├── screens/
│   │   ├── signin/SignIn.jsx      # Biometric button states & unlock handler
│   │   └── profile/Profile.jsx    # Biometric settings toggle (enable/disable)
│   └── i18n/
│       ├── parts/en.core.js       # English biometric strings
│       ├── parts/hi.core.js       # Hindi biometric strings
│       └── tamil/ta.core.js       # Tamil biometric strings
└── scripts/
    └── test-biometric.js          # Automated end-to-end verification suite
```

---

## 3. WebAuthn Technical Specifications

### 3.1 Platform Authenticator Detection
```javascript
export async function fingerprintSupported() {
  if (typeof window === 'undefined') return false;
  if (!window.isSecureContext || !window.PublicKeyCredential || !navigator.credentials) {
    return false;
  }
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}
```

### 3.2 Credential Creation (Enrollment / Registration)
Triggered immediately after a valid PIN verification:
```javascript
const publicKeyCredentialCreationOptions = {
  challenge: crypto.getRandomValues(new Uint8Array(32)),
  rp: {
    name: "Saral Bank",
    id: window.location.hostname
  },
  user: {
    id: new TextEncoder().encode(`saral-user-${profile.id}`),
    name: profile.id,
    displayName: profile.name?.en || profile.id
  },
  pubKeyCredParams: [
    { alg: -7, type: "public-key" },   // ES256 (ECDSA w/ SHA-256)
    { alg: -257, type: "public-key" }  // RS256 (RSA w/ SHA-256)
  ],
  authenticatorSelection: {
    authenticatorAttachment: "platform", // Built-in device sensor
    userVerification: "required",        // Mandates biometric verification
    residentKey: "discouraged"
  },
  timeout: 60000,
  attestation: "none"
};
```

### 3.3 Credential Assertion (Unlock / Authentication)
Triggered when the user taps "Unlock with Fingerprint":
```javascript
const publicKeyCredentialRequestOptions = {
  challenge: crypto.getRandomValues(new Uint8Array(32)),
  allowCredentials: [{
    type: "public-key",
    id: fromBase64Url(storedCredentialId)
  }],
  userVerification: "required",
  timeout: 60000
};
```

---

## 4. UI Button States & Multilingual Labels

The biometric button on the sign-in screen reacts to three states:

| State | Button Visual | English | Hindi | Tamil |
|---|---|---|---|---|
| **Active & Ready** | Blue border, vibrant icon | 1-Tap instant biometrics | 1-टैप त्वरित बायोमेट्रिक्स | ஒரு தொடுதலில் கைரேகை |
| **Needs PIN Setup** | Muted, clickable for hint | Log in with PIN once to turn on | चालू करने के लिए एक बार पिन से लॉगिन करें | முதலில் ரகசிய எண் (PIN) மூலம் உள்நுழைந்து இயக்குங்கள் |
| **Unsupported** | Disabled, dimmed | Not available on this device | इस डिवाइस पर उपलब्ध नहीं है | இந்தச் சாதனத்தில் கிடைக்கவில்லை |

### 4.1 Dialog & Action Vocabulary

| Key | English | Hindi | Tamil |
|---|---|---|---|
| `bio.enroll.prompt` | Turn on fingerprint for next time? | क्या अगली बार के लिए फ़िंगரप्रिंट चालू करें? | அடுத்த முறைக்கு கைரேகையை இயக்கவா? |
| `bio.enroll.yes` | Yes | हाँ | ஆம் |
| `bio.enroll.notNow` | Not now | अभी नहीं | இப்போது வேண்டாம் |
| `bio.enroll.success` | Fingerprint is now on. | फ़िंगरप्रिंट अब चालू है। | கைரேகை இப்போது இயக்கப்பட்டது. |
| `bio.error.failed` | Fingerprint did not work. Use your PIN. | फ़िंगरप्रिंट काम नहीं किया। अपना पिन उपयोग करें। | கைரேகை வேலை செய்யவில்லை. உங்கள் ரகசிய எண்ணை (PIN) பயன்படுத்துங்கள். |
| `bio.settings.turnOff` | Turn off fingerprint | फ़िंगरप्रिंट बंद करें | கைரேகையை நிறுத்து |
| `bio.settings.turnOn` | Turn on fingerprint | फ़िंगरप्रिंट चालू करें | கைரேகையை இயக்கு |

---

## 5. Security & RBI Compliance Considerations

1. **Two-Factor Authentication (2FA) Alignment:**
   - Factor 1: Ownership (Possession of the customer's phone/browser instance).
   - Factor 2: Inherence (Biometric fingerprint/facial verification via Platform Authenticator) OR Knowledge (4-Digit PIN).
2. **Guardian Controls for Minors:**
   - Aarav Mehta (15y) operates under Young Saver constraints. Guardian (`priya`) can enable or revoke biometric access for Aarav from the Guardian Settings dashboard.
3. **Session Expiry & Inactivity:**
   - After `config.idleLockSeconds` (120 seconds) of inactivity, the app locks and requires either 1-tap biometric or PIN entry to resume.
4. **Anti-Lockout Guarantee:**
   - 3 consecutive failed biometric attempts automatically fall back to PIN pad with an explanatory banner.

---

## 6. Automated Verification Matrix

Every build validates against the following test requirements in `scripts/test-biometric.js`:
- [x] WebAuthn platform availability detection (truthy in secure environments).
- [x] Enrollment creates unique credential ID for profile.
- [x] Cross-profile isolation: credential for `priya` does not unlock `shankar`.
- [x] Cancellation error mapping returns `{ code: 'cancelled' }` without throwing unhandled exceptions.
- [x] Revocation removes credential and transitions button back to setup state.
- [x] 100% translation coverage for English, Hindi, and Tamil biometric keys.
