// Saral Banking — Bank themes
// Dev 1 owns this file. Bank switcher changes only these colours + logo.

const banks = {
  saral: {
    id: 'saral',
    name: { en: 'Saral Bank', hi: 'सरल बैंक' },
    colors: {
      brand: '#1a56db',        // Deep blue
      brandContrast: '#ffffff',
      brandSoft: '#e8f0fe',
    },
    logo: 'S',
  },
  janata: {
    id: 'janata',
    name: { en: 'Janata Bank', hi: 'जनता बैंक' },
    colors: {
      brand: '#047857',        // Emerald green
      brandContrast: '#ffffff',
      brandSoft: '#ecfdf5',
    },
    logo: 'J',
  },
  desh: {
    id: 'desh',
    name: { en: 'Desh Bank', hi: 'देश बैंक' },
    colors: {
      brand: '#9333ea',        // Purple
      brandContrast: '#ffffff',
      brandSoft: '#faf5ff',
    },
    logo: 'D',
  },
};

export function getBank(id) {
  return banks[id] || banks.saral;
}

export function getAllBanks() {
  return Object.values(banks);
}

export default banks;
