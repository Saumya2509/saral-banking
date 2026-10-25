// Saral Banking — Date Utilities
// Fixed relative to config.demoToday so demo data never goes stale.

import config from '../data/config.js';

const HINDI_MONTHS = [
  'जनवरी',
  'फ़रवरी',
  'मार्च',
  'अप्रैल',
  'मई',
  'जून',
  'जुलाई',
  'अगस्त',
  'सितंबर',
  'अक्टूबर',
  'नवंबर',
  'दिसंबर',
];

const ENGLISH_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Safely parse date from Date object, ISO string, or number.
 * @param {Date|string|number} input
 * @returns {Date}
 */
function toDate(input) {
  if (input instanceof Date) return input;
  if (typeof input === 'string') {
    // If it's a date-only string like '2026-10-24', parse in local time
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      const [y, m, d] = input.split('-').map(Number);
      return new Date(y, m - 1, d, 0, 0, 0, 0);
    }
    return new Date(input);
  }
  if (typeof input === 'number') {
    return new Date(input);
  }
  return new Date();
}

/**
 * Returns fixed Date object based on config.demoToday ('2026-10-24')
 * Guarantees demo data is consistent.
 * @returns {Date}
 */
export function getToday() {
  const raw = config?.demoToday || '2026-10-24';
  const [y, m, d] = raw.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/**
 * Formats a date string or object into '14 Sep 2026' (en) or '14 सितंबर 2026' (hi).
 * @param {Date|string|number} date
 * @param {string} [lang='en']
 * @returns {string}
 */
export function formatDate(date, lang = 'en') {
  if (!date) return '';
  const d = toDate(date);
  if (Number.isNaN(d.getTime())) return '';

  const day = d.getDate();
  const monthIdx = d.getMonth();
  const year = d.getFullYear();

  if (lang === 'hi') {
    return `${day} ${HINDI_MONTHS[monthIdx]} ${year}`;
  }
  return `${day} ${ENGLISH_MONTHS[monthIdx]} ${year}`;
}

/**
 * Formats time in 12-hour format: '10:32 AM'
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatTime(date) {
  if (!date) return '';
  const d = toDate(date);
  if (Number.isNaN(d.getTime())) return '';

  const hours24 = d.getHours();
  const hours12 = hours24 % 12 || 12;
  const hoursStr = String(hours12).padStart(2, '0');
  const minutesStr = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours24 >= 12 ? 'PM' : 'AM';

  return `${hoursStr}:${minutesStr} ${ampm}`;
}

/**
 * Checks if two dates fall on the same calendar day.
 * @param {Date|string|number} date1
 * @param {Date|string|number} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return false;

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Returns a Date object n days prior to getToday().
 * @param {number} n - Number of days
 * @returns {Date}
 */
export function getDaysAgo(n) {
  const today = getToday();
  const result = new Date(today.getFullYear(), today.getMonth(), today.getDate() - n, 0, 0, 0, 0);
  return result;
}

/**
 * Returns a Date object n months prior to getToday().
 * @param {number} n - Number of months
 * @returns {Date}
 */
export function getMonthsAgo(n) {
  const today = getToday();
  const result = new Date(today.getFullYear(), today.getMonth() - n, today.getDate(), 0, 0, 0, 0);
  return result;
}

/**
 * Returns start of the day (00:00:00.000) for a given date.
 * @param {Date|string|number} date
 * @returns {Date}
 */
export function startOfDay(date) {
  const d = toDate(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/**
 * Returns end of the day (23:59:59.999) for a given date.
 * @param {Date|string|number} date
 * @returns {Date}
 */
export function endOfDay(date) {
  const d = toDate(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/**
 * Formats a date into ISO 'YYYY-MM-DD' format.
 * @param {Date|string|number} date
 * @returns {string}
 */
export function toISODateString(date) {
  const d = toDate(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
