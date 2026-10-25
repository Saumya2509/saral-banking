// Saral Banking — Sample customers
// Dev 1 owns this file

const customers = [
  {
    id: 'shankar',
    name: { en: 'Shankar Prasad', hi: 'शंकर प्रसाद', ta: 'சங்கர் பிரசாத்' },
    age: 68,
    isMinor: false,
    guardianId: null,
    defaultLang: 'hi',
    defaultMode: 'simple',
    openingBalancePaise: 15000000, // ₹1,50,000
    accountNumber: '2048 1023 4821',
    ifsc: 'SBNK0001234',
    branch: { en: 'MG Road, Jammu', hi: 'एमजी रोड, जम्मू', ta: 'எம்.ஜி. ரோடு, ஜம்மு' },
    mobile: '98765 43210',
    email: 'shankar@example.com',
    dailyLimitPaise: null,
  },
  {
    id: 'priya',
    name: { en: 'Priya Sharma', hi: 'प्रिया शर्मा', ta: 'பிரியா சர்மா' },
    age: 32,
    isMinor: false,
    guardianId: null,
    defaultLang: 'en',
    defaultMode: 'standard',
    openingBalancePaise: 25000000, // ₹2,50,000
    accountNumber: '3072 5610 9384',
    ifsc: 'SBNK0005678',
    branch: { en: 'Residency Road, Jammu', hi: 'रेसिडेंसी रोड, जम्मू', ta: 'ரெசிடென்சி ரோடு, ஜம்மு' },
    mobile: '91234 56789',
    email: 'priya.sharma@example.com',
    dailyLimitPaise: null,
  },
  {
    id: 'aarav',
    name: { en: 'Aarav Mehta', hi: 'आरव मेहता', ta: 'ஆரவ் மேத்தா' },
    age: 15,
    isMinor: true,
    guardianId: 'priya',
    defaultLang: 'en',
    defaultMode: 'young',
    openingBalancePaise: 5000000, // ₹50,000
    accountNumber: '1035 7782 6150',
    ifsc: 'SBNK0001234',
    branch: { en: 'MG Road, Jammu', hi: 'एमजी रोड, जम्मू', ta: 'எம்.ஜி. ரோடு, ஜம்மு' },
    mobile: '99887 76655',
    email: null,
    dailyLimitPaise: 100000, // ₹1,000
  },
];

// Guardian for Aarav (Mom: Priya Sharma)
const guardians = [
  {
    id: 'priya',
    name: { en: 'Priya Sharma (Mom)', hi: 'प्रिया शर्मा (माँ)', ta: 'பிரியா சர்மா (தாய்)' },
    childId: 'aarav',
    mobile: '91234 56789',
  },
];

const STORAGE_KEY_CUSTOM = 'saral.customCustomers';

export function getCustomCustomers() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read custom customers:', err);
    return [];
  }
}

export function saveCustomCustomer(customer) {
  if (typeof window === 'undefined') return;
  try {
    const list = getCustomCustomers();
    const existingIdx = list.findIndex((c) => c.id === customer.id);
    if (existingIdx >= 0) {
      list[existingIdx] = customer;
    } else {
      list.push(customer);
    }
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save custom customer:', err);
  }
}

export function getAllCustomers() {
  const custom = getCustomCustomers();
  return [...customers, ...custom];
}

export function getCustomer(id) {
  const all = getAllCustomers();
  return all.find((c) => c.id === id);
}

export function getGuardian(id) {
  return guardians.find((g) => g.id === id);
}

export function maskAccountNumber(num) {
  // "2048 1023 4821" → "XXXX XXXX 4821"
  if (!num) return 'XXXX XXXX 0000';
  const parts = num.split(' ');
  return parts.map((p, i) => (i < parts.length - 1 ? 'XXXX' : p)).join(' ');
}

export default customers;
