// Saral Banking — Sample transactions
// Provides at least 60 seed transactions per customer (180+ total)
// spread over 3 months relative to config.demoToday ('2026-10-24').
// All amounts are integers in paise.

let seed = 987654321;
function seededRandom() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}

function randInt(min, max) {
  return Math.floor(min + seededRandom() * (max - min + 1));
}

function pad(num) {
  return String(num).padStart(2, '0');
}

export function createSeedTransactions() {
  const transactions = [];

  // =========================================================================
  // 1. SHANKAR PRASAD (Age 68, Retired, Simple mode)
  // Opening: ₹1,50,000 (15000000 paise)
  // Monthly pension ~₹25,000, medicines, groceries, electricity, family UPI, ATM
  // =========================================================================
  const shankarMerchants = [
    { name: 'Apollo Pharmacy', type: 'UPI', plainEn: 'Medicine purchase', plainHi: 'दवाई की खरीद' },
    { name: 'Sharma Medical Hall', type: 'POS', plainEn: 'Health store', plainHi: 'स्वास्थ्य स्टोर' },
    { name: 'Verma Grocery Store', type: 'POS', plainEn: 'Daily groceries', plainHi: 'दैनिक राशन' },
    { name: 'Mother Dairy Jammu', type: 'UPI', plainEn: 'Milk and vegetables', plainHi: 'दूध और सब्जियां' },
    { name: 'Jammu Power Dept', type: 'UPI', plainEn: 'Electricity bill payment', plainHi: 'बिजली बिल भुगतान' },
    { name: 'J&K Water Dept', type: 'UPI', plainEn: 'Water utility bill', plainHi: 'पानी बिल' },
    { name: 'SBI ATM Residency Rd', type: 'ATM', plainEn: 'Cash withdrawal', plainHi: 'नकदी निकासी' },
    { name: 'Ramesh K', type: 'UPI', plainEn: 'Paid Ramesh K', plainHi: 'रमेश के को भुगतान किया' },
    { name: 'Kavita Prasad', type: 'UPI', plainEn: 'Transfer to Kavita', plainHi: 'कविता को पैसे भेजे' },
  ];

  // Shankar's monthly pensions (August 1, Sept 1, Oct 1)
  const pensionMonths = [
    { date: '2026-08-01T09:30:00', amount: 2500000 },
    { date: '2026-09-01T09:30:00', amount: 2500000 },
    { date: '2026-10-01T09:30:00', amount: 2500000 },
  ];
  pensionMonths.forEach((p, idx) => {
    const ref = `4210080${idx}1001`;
    transactions.push({
      id: `tx_shankar_pension_${idx}`,
      customerId: 'shankar',
      date: p.date,
      direction: 'in',
      amountPaise: p.amount,
      type: 'PENSION',
      counterparty: 'Central Govt Pension',
      raw: `NEFT/CR/${ref}/CENTRAL PENSION/SBIN`,
      ref,
      plain: { en: 'Monthly pension credited', hi: 'मासिक पेंशन जमा की गई' },
      parts: [
        { token: 'NEFT', key: 'neft' },
        { token: 'CR', key: 'cr' },
        { token: ref, key: 'ref' },
        { token: 'CENTRAL PENSION', key: 'pension' },
      ],
    });
  });

  // Shankar quarterly interest (Sept 30)
  transactions.push({
    id: 'tx_shankar_int_0',
    customerId: 'shankar',
    date: '2026-09-30T23:59:00',
    direction: 'in',
    amountPaise: 112500, // ₹1,125
    type: 'INTEREST',
    counterparty: 'Saral Bank Savings Interest',
    raw: 'INT.PD/CR/427309304800/Q2 SAVINGS INT/SBNK',
    ref: '427309304800',
    plain: { en: 'Quarterly interest credited', hi: 'त्रैमासिक ब्याज जमा किया गया' },
    parts: [
      { token: 'INT.PD', key: 'int' },
      { token: 'CR', key: 'cr' },
      { token: '427309304800', key: 'ref' },
    ],
  });

  // Generate 62 routine expenses for Shankar over 90 days
  for (let i = 1; i <= 62; i++) {
    const dayOffset = Math.floor((i / 62) * 88); // 0 to 88 days ago
    const d = new Date(2026, 9, 23); // Oct 23
    d.setDate(d.getDate() - dayOffset);
    d.setHours(randInt(8, 20), randInt(0, 59), 0);
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    const m = shankarMerchants[i % shankarMerchants.length];
    const amountPaise =
      m.type === 'ATM'
        ? randInt(10, 40) * 10000 // ₹1,000 to ₹4,000
        : randInt(15, 180) * 1000; // ₹150 to ₹1,800
    const ref = `429${i % 10}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(i)}48`;

    transactions.push({
      id: `tx_shankar_gen_${i}`,
      customerId: 'shankar',
      date: dateStr,
      direction: 'out',
      amountPaise,
      type: m.type,
      counterparty: m.name,
      raw: `${m.type}/DR/${ref}/${m.name.toUpperCase().replace(/\s+/g, '')}/BANK`,
      ref,
      plain: { en: m.plainEn, hi: m.plainHi },
      parts: [
        { token: m.type, key: m.type.toLowerCase() },
        { token: 'DR', key: 'dr' },
        { token: ref, key: 'ref' },
      ],
    });
  }

  // =========================================================================
  // 2. PRIYA SHARMA (Age 32, Working Professional, Standard mode)
  // Opening: ₹2,50,000 (25000000 paise)
  // Monthly salary ₹55,000, rent ₹15,000, utilities, dining, OTT, shopping
  // =========================================================================
  const priyaMerchants = [
    { name: 'Landlord Rent (Sharma Ji)', type: 'NEFT', plainEn: 'House rent', plainHi: 'मकान किराया' },
    { name: 'Jio Fiber Internet', type: 'UPI', plainEn: 'Broadband bill', plainHi: 'इंटरनेट बिल' },
    { name: 'Airtel Mobile Postpaid', type: 'UPI', plainEn: 'Phone bill', plainHi: 'मोबाइल बिल' },
    { name: 'Swiggy Food Delivery', type: 'UPI', plainEn: 'Dinner order', plainHi: 'खाना डिलीवरी' },
    { name: 'Zomato Dining', type: 'UPI', plainEn: 'Restaurant meal', plainHi: 'रेस्टोरेंट' },
    { name: 'Amazon India', type: 'POS', plainEn: 'Online shopping', plainHi: 'ऑनलाइन शॉपिंग' },
    { name: 'Netflix Subscription', type: 'UPI', plainEn: 'Monthly streaming', plainHi: 'स्ट्रीमिंग सब्सक्रिप्शन' },
    { name: 'Transfer to Family', type: 'IMPS', plainEn: 'Family support', plainHi: 'पारिवारिक सहायता' },
    { name: 'Shell Petrol Pump', type: 'POS', plainEn: 'Vehicle fuel', plainHi: 'पेट्रोल' },
  ];

  // Priya's Monthly Salaries (July 31, Aug 31, Sept 30)
  const salaryDates = ['2026-07-31T18:00:00', '2026-08-31T18:00:00', '2026-09-30T18:00:00'];
  salaryDates.forEach((sDate, idx) => {
    const ref = `42800${idx}315501`;
    transactions.push({
      id: `tx_priya_sal_${idx}`,
      customerId: 'priya',
      date: sDate,
      direction: 'in',
      amountPaise: 5500000, // ₹55,000
      type: 'NEFT',
      counterparty: 'TechCorp Solutions Ltd',
      raw: `NEFT/CR/${ref}/TECHCORP SALARY/HDFC`,
      ref,
      plain: { en: 'Monthly salary credited', hi: 'मासिक वेतन जमा किया गया' },
      parts: [
        { token: 'NEFT', key: 'neft' },
        { token: 'CR', key: 'cr' },
        { token: ref, key: 'ref' },
      ],
    });
  });

  // Priya's quarterly interest (Sept 30)
  transactions.push({
    id: 'tx_priya_int_0',
    customerId: 'priya',
    date: '2026-09-30T23:59:00',
    direction: 'in',
    amountPaise: 187500, // ₹1,875
    type: 'INTEREST',
    counterparty: 'Saral Bank Savings Interest',
    raw: 'INT.PD/CR/427309305600/Q2 SAVINGS INT/SBNK',
    ref: '427309305600',
    plain: { en: 'Quarterly interest credited', hi: 'त्रैमासिक ब्याज जमा किया गया' },
    parts: [
      { token: 'INT.PD', key: 'int' },
      { token: 'CR', key: 'cr' },
      { token: '427309305600', key: 'ref' },
    ],
  });

  // Generate 62 routine expenses for Priya over 90 days
  for (let i = 1; i <= 62; i++) {
    const dayOffset = Math.floor((i / 62) * 88);
    const d = new Date(2026, 9, 23);
    d.setDate(d.getDate() - dayOffset);
    d.setHours(randInt(9, 22), randInt(0, 59), 0);
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    const m = priyaMerchants[i % priyaMerchants.length];
    let amountPaise = randInt(25, 250) * 1000; // ₹250 to ₹2,500
    if (m.name.includes('Rent')) {
      amountPaise = 1500000; // ₹15,000
    }
    const ref = `428${i % 10}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(i)}56`;

    transactions.push({
      id: `tx_priya_gen_${i}`,
      customerId: 'priya',
      date: dateStr,
      direction: 'out',
      amountPaise,
      type: m.type,
      counterparty: m.name,
      raw: `${m.type}/DR/${ref}/${m.name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 12)}/BANK`,
      ref,
      plain: { en: m.plainEn, hi: m.plainHi },
      parts: [
        { token: m.type, key: m.type.toLowerCase() },
        { token: 'DR', key: 'dr' },
        { token: ref, key: 'ref' },
      ],
    });
  }

  // =========================================================================
  // 3. AARAV MEHTA (Age 15, Minor Student, Young Saver mode)
  // Opening: ₹50,000 (5000000 paise)
  // Pocket money from Priya Sharma, snacks, books, stationery, small UPI spends
  // Keep daily outgoings small (< ₹1,000)
  // =========================================================================
  const aaravMerchants = [
    { name: 'Campus Canteen', type: 'UPI', plainEn: 'Snacks and juice', plainHi: 'नाश्ता और जूस' },
    { name: 'National Book Store', type: 'UPI', plainEn: 'Notebooks & pens', plainHi: 'कॉपियाँ और पेन' },
    { name: 'City Bus Pass', type: 'UPI', plainEn: 'Monthly student bus pass', plainHi: 'छात्र बस पास' },
    { name: 'Corner Bakery', type: 'UPI', plainEn: 'Bakery treats', plainHi: 'बेकरी' },
    { name: 'Science Museum Entry', type: 'UPI', plainEn: 'Educational visit ticket', plainHi: 'टिकट' },
  ];

  // Aarav's weekly pocket money from Priya Sharma (12 weeks)
  for (let w = 1; w <= 12; w++) {
    const d = new Date(2026, 9, 22);
    d.setDate(d.getDate() - (w * 7));
    d.setHours(11, 0, 0);
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T11:00:00`;
    const ref = `42700${w}106100`;

    transactions.push({
      id: `tx_aarav_pocket_${w}`,
      customerId: 'aarav',
      date: dateStr,
      direction: 'in',
      amountPaise: 80000, // ₹800
      type: 'UPI',
      counterparty: 'Priya Sharma',
      raw: `UPI/CR/${ref}/PRIYA SHARMA/SBNK`,
      ref,
      plain: { en: 'Pocket money from Mom (Priya Sharma)', hi: 'माँ (प्रिया शर्मा) से जेब खर्च प्राप्त हुआ' },
      parts: [
        { token: 'UPI', key: 'upi' },
        { token: 'CR', key: 'cr' },
        { token: ref, key: 'ref' },
      ],
    });
  }

  // Aarav interest (Sept 30)
  transactions.push({
    id: 'tx_aarav_int_0',
    customerId: 'aarav',
    date: '2026-09-30T23:59:00',
    direction: 'in',
    amountPaise: 37500, // ₹375
    type: 'INTEREST',
    counterparty: 'Saral Bank Savings Interest',
    raw: 'INT.PD/CR/427309306100/Q2 SAVINGS INT/SBNK',
    ref: '427309306100',
    plain: { en: 'Quarterly interest credited', hi: 'त्रैमासिक ब्याज जमा किया गया' },
    parts: [
      { token: 'INT.PD', key: 'int' },
      { token: 'CR', key: 'cr' },
      { token: '427309306100', key: 'ref' },
    ],
  });

  // Generate 55 small spends for Aarav (< ₹400 each)
  for (let i = 1; i <= 55; i++) {
    const dayOffset = Math.floor((i / 55) * 88);
    const d = new Date(2026, 9, 23);
    d.setDate(d.getDate() - dayOffset);
    d.setHours(randInt(12, 18), randInt(0, 59), 0);
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    const m = aaravMerchants[i % aaravMerchants.length];
    const amountPaise = randInt(4, 35) * 1000; // ₹40 to ₹350
    const ref = `427${i % 10}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(i)}61`;

    transactions.push({
      id: `tx_aarav_gen_${i}`,
      customerId: 'aarav',
      date: dateStr,
      direction: 'out',
      amountPaise,
      type: m.type,
      counterparty: m.name,
      raw: `${m.type}/DR/${ref}/${m.name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 12)}/BANK`,
      ref,
      plain: { en: m.plainEn, hi: m.plainHi },
      parts: [
        { token: m.type, key: m.type.toLowerCase() },
        { token: 'DR', key: 'dr' },
        { token: ref, key: 'ref' },
      ],
    });
  }

  // Sort all transactions newest first
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return transactions;
}

const transactions = createSeedTransactions();

export function getTransactionsForCustomer(customerId) {
  return transactions.filter((t) => t.customerId === customerId);
}

export function getAllSeedTransactions() {
  return transactions;
}

export default transactions;
