# Saral Banking — Accessible, Predictable Banking for Bharat

> Built for the GEC Jammu Hackathon. A mobile-first, bilingual (English + Hindi), WCAG AA accessible banking standard prototype.

---

## 🚀 Quick Start

### 1. Install Dependencies & Run Dev Server
```bash
cd saral-banking
npm install
npm run dev
```

Visit: **http://localhost:3000**

### 2. Demo Credentials
- **Demo PIN:** `1234`
- **Demo OTP:** `123456`
- **Profiles:**
  1. **Shankar Prasad (68 yrs):** Simple mode (4 big buttons), Hindi default, pension & medicine routine.
  2. **Priya Sharma (32 yrs):** Standard mode, English default, salary, rent, dining, shopping.
  3. **Aarav Mehta (15 yrs):** Young Saver mode with savings goals & Meena Mehta guardian supervision.

---

## 🏛️ The 5 Pillars of The Standard
1. **Same 5 tabs everywhere:** Home, Pay, History, Services, Help.
2. **Same place for the same thing:** Total balance always at top; main action button always at bottom.
3. **Same words:** Everyday language ("Send money" instead of "Fund transfer"). Tap any dotted term for a plain explanation.
4. **Same 3 steps:** Every action follows **1. Fill in → 2. Review → 3. Confirm with PIN**.
5. **Bank switcher changes only colours:** Saral Bank (Blue), Janata Bank (Green), Desh Bank (Purple).

---

## 🛡️ Safety & Fraud Protection
- **One-Tap Emergency Block:** Immediately stops card and UPI payments in one click (`/help/fraud`).
- **Safety Prompts on Large Payments:** Asks *"Did someone ask you to send this money?"* for payments > ₹10,000. Selecting *"Yes"* halts the transfer immediately and directs to the **1930 Cyber Fraud Helpline**.
- **New Payee Guard:** 24-hour ₹10,000 limit for newly registered payees.
- **Sensitive Data Masking:** Chat automatically detects and masks 4-digit PINs, 6-digit OTPs, and 10+ digit account numbers.

---

## ✨ Features Implemented
- **Central Deterministic Ledger:** One balance rule (`total = opening + sum(in) - sum(out)`), integer whole paise only, 200+ realistic transactions.
- **Statements:** 1/3/6-month filter, instant UTF-8 BOM CSV export, and print-optimized PDF view.
- **Services:** Mobile/email update with demo OTP, cheque book requests, nominee registration, debit card blocking/unblocking, and daily UPI limits.
- **Young Saver:** Savings goals with progress bars, guardian consent, and guardian approval workflow.
- **Phase C Add-ons:**
  - 🤖 **AI Support Assistant:** Keyword-based FAQ matching with sensitive data filtering.
  - 🎙️ **Voice Control:** Web Speech synthesis (read aloud) + speech recognition.
  - 📷 **QR Code Scanner:** Interactive camera scanner and sample QR code simulator.
