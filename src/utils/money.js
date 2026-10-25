// Saral Banking — Money Utilities
// All amounts are integers in paise. No float arithmetic.

const HINDI_NUMBERS = [
  'शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
  'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस',
  'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस', 'तीस',
  'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस',
  'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास',
  'इक्यावन', 'बावन', 'तिरपन', 'चौवन', 'बचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ', 'साठ',
  'इकसठ', 'बासठ', 'तिरसठ', 'चौंसठ', 'पैंसठ', 'छ्यासठ', 'सड़सठ', 'अड़सठ', 'उनहत्तर', 'सत्तर',
  'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उन्यासी', 'अस्सी',
  'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सत्तासी', 'अट्ठासी', 'नवासी', 'नब्बे',
  'इक्यानवे', 'बानवे', 'तिरानवे', 'चौरानवे', 'पचानवे', 'छियानवे', 'सत्तानवे', 'अट्ठानवे', 'निन्यानवे'
];

const ENGLISH_UNITS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

const ENGLISH_TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

function twoDigitsToEnglish(n) {
  if (n < 20) return ENGLISH_UNITS[n];
  const ten = Math.floor(n / 10);
  const unit = n % 10;
  return unit > 0 ? `${ENGLISH_TENS[ten]} ${ENGLISH_UNITS[unit]}` : ENGLISH_TENS[ten];
}

function numberToIndianEnglish(rupees) {
  if (rupees === 0) return 'zero';

  const parts = [];

  const crores = Math.floor(rupees / 10000000);
  rupees %= 10000000;

  const lakhs = Math.floor(rupees / 100000);
  rupees %= 100000;

  const thousands = Math.floor(rupees / 1000);
  rupees %= 1000;

  const hundreds = Math.floor(rupees / 100);
  const remainder = rupees % 100;

  if (crores > 0) {
    parts.push(`${numberToIndianEnglish(crores)} crore`);
  }
  if (lakhs > 0) {
    parts.push(`${twoDigitsToEnglish(lakhs)} lakh`);
  }
  if (thousands > 0) {
    parts.push(`${twoDigitsToEnglish(thousands)} thousand`);
  }
  if (hundreds > 0) {
    parts.push(`${ENGLISH_UNITS[hundreds]} hundred`);
  }
  if (remainder > 0) {
    parts.push(twoDigitsToEnglish(remainder));
  }

  return parts.join(' ');
}

function numberToIndianHindi(rupees) {
  if (rupees === 0) return 'शून्य';

  const parts = [];

  const crores = Math.floor(rupees / 10000000);
  rupees %= 10000000;

  const lakhs = Math.floor(rupees / 100000);
  rupees %= 100000;

  const thousands = Math.floor(rupees / 1000);
  rupees %= 1000;

  const hundreds = Math.floor(rupees / 100);
  const remainder = rupees % 100;

  if (crores > 0) {
    parts.push(`${numberToIndianHindi(crores)} करोड़`);
  }
  if (lakhs > 0) {
    parts.push(`${HINDI_NUMBERS[lakhs] || lakhs} लाख`);
  }
  if (thousands > 0) {
    parts.push(`${HINDI_NUMBERS[thousands] || thousands} हज़ार`);
  }
  if (hundreds > 0) {
    parts.push(`${HINDI_NUMBERS[hundreds] || hundreds} सौ`);
  }
  if (remainder > 0) {
    parts.push(HINDI_NUMBERS[remainder] || String(remainder));
  }

  return parts.join(' ');
}

/**
 * Format paise into Indian Rupee currency string via Intl.NumberFormat('en-IN')
 * e.g. 10000000 -> '₹1,00,000.00'
 * @param {number} paise - Integer amount in paise
 * @param {object} [options] - Intl formatting options or { showPaise: false }
 * @returns {string} Formatted INR string
 */
export function formatINR(paise, options = {}) {
  if (paise === null || paise === undefined || Number.isNaN(paise)) {
    return '₹0.00';
  }

  const isNegative = paise < 0;
  const absPaise = Math.abs(Math.round(paise));
  const rupees = absPaise / 100;

  const minFraction = options.showPaise === false ? 0 : (options.minimumFractionDigits ?? 2);
  const maxFraction = options.showPaise === false ? 0 : (options.maximumFractionDigits ?? 2);

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: minFraction,
    maximumFractionDigits: maxFraction,
    ...options,
  });

  const formatted = formatter.format(rupees);
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Converts a rupee string into integer paise using string parsing only (NO float maths).
 * Strips commas, symbols and spaces, splits on decimal point.
 * e.g. '8,000.50' -> 800050
 *      '100' -> 10000
 *      '0.5' -> 50
 * @param {string|number} input
 * @returns {number} Integer amount in paise
 */
export function rupeesToPaise(input) {
  if (input === null || input === undefined) return 0;
  if (typeof input === 'number') {
    input = String(input);
  }
  if (typeof input !== 'string') return 0;

  let cleaned = input.trim().replace(/[₹,\s]/g, '').replace(/^(INR|Rs\.?)\s*/i, '');
  if (!cleaned) return 0;

  let isNegative = false;
  if (cleaned.startsWith('-')) {
    isNegative = true;
    cleaned = cleaned.slice(1).trim();
  }

  // Validate number format (optional leading digits, optional dot, optional trailing digits)
  if (!/^\d*(\.\d*)?$/.test(cleaned) || cleaned === '.' || cleaned === '') {
    return 0;
  }

  const parts = cleaned.split('.');
  const rupeesPart = parts[0] || '0';
  const paisePartRaw = parts[1] || '00';

  // Normalize paise to exactly 2 digits: '5' -> '50', '505' -> '50', '05' -> '05'
  const paisePart = paisePartRaw.padEnd(2, '0').slice(0, 2);

  const rupeesInt = parseInt(rupeesPart, 10) || 0;
  const paiseInt = parseInt(paisePart, 10) || 0;

  const totalPaise = rupeesInt * 100 + paiseInt;
  return isNegative ? -totalPaise : totalPaise;
}

/**
 * Converts paise to a spoken description in English or Hindi for screen readers.
 * Handles lakhs, thousands, hundreds and paise.
 * e.g. 10000000, 'en' -> 'one lakh rupees'
 *      10000000, 'hi' -> 'एक लाख रुपये'
 *      800050, 'en' -> 'eight thousand rupees and fifty paise'
 * @param {number} paise - Integer paise
 * @param {string} [lang='en'] - 'en' or 'hi'
 * @returns {string} Text-to-speech string
 */
export function amountToSpeech(paise, lang = 'en') {
  if (paise === null || paise === undefined || Number.isNaN(paise)) {
    return lang === 'hi' ? 'शून्य रुपये' : 'zero rupees';
  }

  const isNegative = paise < 0;
  const absPaise = Math.abs(Math.round(paise));
  const rupees = Math.floor(absPaise / 100);
  const paiseRemaining = absPaise % 100;

  if (lang === 'hi') {
    let result = '';
    if (rupees === 0 && paiseRemaining === 0) {
      return 'शून्य रुपये';
    }

    if (rupees > 0) {
      result += `${numberToIndianHindi(rupees)} रुपये`;
    }

    if (paiseRemaining > 0) {
      const paiseWords = HINDI_NUMBERS[paiseRemaining] || String(paiseRemaining);
      result = result ? `${result} ${paiseWords} पैसे` : `${paiseWords} पैसे`;
    }

    return isNegative ? `ऋण ${result}` : result;
  }

  // English
  let result = '';
  if (rupees === 0 && paiseRemaining === 0) {
    return 'zero rupees';
  }

  if (rupees > 0) {
    result += `${numberToIndianEnglish(rupees)} rupees`;
  }

  if (paiseRemaining > 0) {
    const paiseWords = twoDigitsToEnglish(paiseRemaining);
    result = result ? `${result} and ${paiseWords} paise` : `${paiseWords} paise`;
  }

  return isNegative ? `minus ${result}` : result;
}

// Alias for convenience
export const paiseToSpeech = amountToSpeech;
