// src/i18n/tamil/tamilNumber.js
// Number to Tamil spoken words and Indian currency words (Lakh, Crore)
// Follows Section 7 of tamil.md

const ONES = ["", "ஒன்று", "இரண்டு", "மூன்று", "நான்கு", "ஐந்து", "ஆறு", "ஏழு", "எட்டு", "ஒன்பது"];
const TEENS = {
  10: "பத்து", 11: "பதினொன்று", 12: "பன்னிரண்டு", 13: "பதிமூன்று", 14: "பதினான்கு",
  15: "பதினைந்து", 16: "பதினாறு", 17: "பதினேழு", 18: "பதினெட்டு", 19: "பத்தொன்பது"
};
const TENS = {
  2: "இருபது", 3: "முப்பது", 4: "நாற்பது", 5: "ஐம்பது",
  6: "அறுபது", 7: "எழுபது", 8: "எண்பது", 9: "தொண்ணூறு"
};
const TEN_STEM = {
  2: "இருபத்து", 3: "முப்பத்து", 4: "நாற்பத்து", 5: "ஐம்பத்து",
  6: "அறுபத்து", 7: "எழுபத்து", 8: "எண்பத்து", 9: "தொண்ணூற்று"
};
const HUND = {
  1: "நூறு", 2: "இருநூறு", 3: "முந்நூறு", 4: "நானூறு", 5: "ஐந்நூறு",
  6: "அறுநூறு", 7: "எழுநூறு", 8: "எண்ணூறு", 9: "தொள்ளாயிரம்"
};
const THOUS = {
  1: "ஆயிரம்", 2: "இரண்டாயிரம்", 3: "மூவாயிரம்", 4: "நான்காயிரம்", 5: "ஐயாயிரம்",
  6: "ஆறாயிரம்", 7: "ஏழாயிரம்", 8: "எட்டாயிரம்", 9: "ஒன்பதாயிரம்", 10: "பத்தாயிரம்"
};
const SIGN = { "ஒ": "ொ", "இ": "ி", "ஐ": "ை", "ஆ": "ா", "ஏ": "ே", "எ": "ெ" };

// "when something follows" oblique form: நூறு -> நூற்று, ஆயிரம் -> ஆயிரத்து
const OBL = (w) => (w.endsWith("று") ? w.slice(0, -2) + "ற்று" : w.slice(0, -2) + "த்து");

// join tens stem with unit
function join(stem, unit) {
  const first = unit[0];
  return SIGN[first] ? stem.slice(0, -1) + SIGN[first] + unit.slice(1) : stem + " " + unit;
}

function two(n) { // 1..99
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n];
  const t = Math.floor(n / 10), u = n % 10;
  return u ? join(TEN_STEM[t], ONES[u]) : TENS[t];
}

function hundreds(n) { // 1..999
  if (n < 100) return two(n);
  const h = Math.floor(n / 100), r = n % 100;
  return r ? OBL(HUND[h]) + " " + two(r) : HUND[h];
}

function attachThousand(c) {
  const w = c.endsWith("ு") ? c.slice(0, -1) + "ாயிரம்" : c + " ஆயிரம்";
  const o = c.endsWith("ு") ? c.slice(0, -1) + "ாயிரத்து" : c + " ஆயிரத்து";
  return { w, o };
}

export function toTamilWords(input) {
  const n = Math.floor(Math.abs(input));
  if (n === 0) return "பூஜ்ஜியம்";
  const crore = Math.floor(n / 1e7), lakh = Math.floor(n / 1e5) % 100,
        thou = Math.floor(n / 1e3) % 100, rest = n % 1000;
  const g = [];
  if (crore) {
    const c = crore === 1 ? "ஒரு" : toTamilWords(crore);
    g.push({ w: c + " கோடி", o: c + " கோடியே" });
  }
  if (lakh) {
    const c = lakh === 1 ? "ஒரு" : two(lakh);
    g.push({ w: c + " லட்சம்", o: c + " லட்சத்து" });
  }
  if (thou) {
    if (thou <= 10) g.push({ w: THOUS[thou], o: OBL(THOUS[thou]) });
    else g.push(attachThousand(two(thou)));
  }
  if (rest) g.push({ w: hundreds(rest), o: hundreds(rest) });
  return g.map((x, i) => (i < g.length - 1 ? x.o : x.w)).join(" ");
}

export function amountToTamilSpeech(amount) {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let out = toTamilWords(rupees) + " ரூபாய்";
  if (paise) out += " " + toTamilWords(paise) + " பைசா";
  return out;
}

export default {
  toTamilWords,
  amountToTamilSpeech,
};
