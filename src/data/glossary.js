// Saral Banking — Glossary of banking terms
// Dev 3 owns this file; Dev 1's Rich and Term components use this for tap-to-explain

const glossary = [
  {
    id: 'ifsc',
    match: {
      en: ['IFSC', 'IFSC code'],
      hi: ['आईएफएससी', 'IFSC', 'आईएफएससी कोड'],
    },
    term: {
      en: 'IFSC',
      hi: 'आईएफएससी',
    },
    meaning: {
      en: 'An 11-character code that identifies a specific bank branch for electronic payments.',
      hi: '11 अक्षरों का एक कोड जो इलेक्ट्रॉनिक भुगतान के लिए बैंक की शाखा की पहचान करता है।',
    },
  },
  {
    id: 'upi',
    match: {
      en: ['UPI', 'Unified Payments Interface'],
      hi: ['यूपीआई', 'UPI'],
    },
    term: {
      en: 'UPI',
      hi: 'यूपीआई',
    },
    meaning: {
      en: 'A system that lets you send and receive money instantly from your phone using a simple ID or mobile number.',
      hi: 'एक ऐसी प्रणाली जिससे आप अपने फोन से किसी यूपीआई आईडी या मोबाइल नंबर पर तुरंत पैसा भेज और पा सकते हैं।',
    },
  },
  {
    id: 'otp',
    match: {
      en: ['OTP', 'One Time Password', 'one-time password'],
      hi: ['ओटीपी', 'OTP', 'वन टाइम पासवर्ड'],
    },
    term: {
      en: 'OTP',
      hi: 'ओटीपी',
    },
    meaning: {
      en: 'A one-time secret code sent to your phone to approve a transaction. Never share it with anyone.',
      hi: 'एक बार उपयोग होने वाला गुप्त कोड जो लेन-देन की पुष्टि के लिए फोन पर आता है। इसे किसी को न बताएं।',
    },
  },
  {
    id: 'kyc',
    match: {
      en: ['KYC', 'Know Your Customer'],
      hi: ['केवाईसी', 'KYC'],
    },
    term: {
      en: 'KYC',
      hi: 'केवाईसी',
    },
    meaning: {
      en: 'A verification process where the bank checks your identity and address using official documents.',
      hi: 'एक प्रक्रिया जिसमें बैंक सरकारी पहचान पत्र और पते के प्रमाण से आपकी पहचान की पुष्टि करता है।',
    },
  },
  {
    id: 'balance',
    match: {
      en: ['balance', 'total balance', 'account balance'],
      hi: ['बैलेंस', 'खाता शेष', 'कुल बैलेंस', 'कुल शेष'],
    },
    term: {
      en: 'Balance',
      hi: 'कुल बैलेंस',
    },
    meaning: {
      en: 'The total amount of money present in your bank account right now.',
      hi: 'इस समय आपके बैंक खाते में मौजूद कुल पैसे की राशि।',
    },
  },
  {
    id: 'available-balance',
    match: {
      en: ['available balance', 'spendable balance'],
      hi: ['उपलब्ध बैलेंस', 'उपलब्ध शेष'],
    },
    term: {
      en: 'Available balance',
      hi: 'उपलब्ध बैलेंस',
    },
    meaning: {
      en: 'The money you can spend or withdraw immediately, after deducting any held or pending amounts.',
      hi: 'वह पैसा जिसे आप अभी खर्च या निकाल सकते हैं, किसी रोकी गई राशि को घटाकर।',
    },
  },
  {
    id: 'minimum-balance',
    match: {
      en: ['minimum balance', 'min balance', 'average monthly balance'],
      hi: ['न्यूनतम बैलेंस', 'न्यूनतम शेष', 'कम से कम बैलेंस'],
    },
    term: {
      en: 'Minimum balance',
      hi: 'न्यूनतम बैलेंस',
    },
    meaning: {
      en: 'The lowest balance your bank asks you to maintain in your account to avoid a monthly charge.',
      hi: 'खाते में रखा जाने वाला सबसे कम पैसा ताकि बैंक कोई अतिरिक्त शुल्क न काटे।',
    },
  },
  {
    id: 'interest',
    match: {
      en: ['interest', 'savings interest'],
      hi: ['ब्याज'],
    },
    term: {
      en: 'Interest',
      hi: 'ब्याज',
    },
    meaning: {
      en: 'Extra money paid by the bank into your account as a reward for keeping your savings with them.',
      hi: 'बैंक में बचत रखने पर बैंक द्वारा आपके खाते में जमा किया जाने वाला अतिरिक्त पैसा।',
    },
  },
  {
    id: 'neft',
    match: {
      en: ['NEFT', 'National Electronic Funds Transfer'],
      hi: ['एनईएफटी', 'NEFT'],
    },
    term: {
      en: 'NEFT',
      hi: 'एनईएफटी',
    },
    meaning: {
      en: 'A nationwide electronic payment system for transferring money between bank accounts in hourly batches.',
      hi: 'एक बैंक से दूसरे बैंक में सुरक्षित पैसा भेजने की सेवा जो आधे-आधे घंटे के बैच में पूरी होती है।',
    },
  },
  {
    id: 'imps',
    match: {
      en: ['IMPS', 'Immediate Payment Service'],
      hi: ['आईएमपीएस', 'IMPS'],
    },
    term: {
      en: 'IMPS',
      hi: 'आईएमपीएस',
    },
    meaning: {
      en: 'An instant 24/7 money transfer service that delivers funds to another bank account within seconds.',
      hi: '24 घंटे तुरंत पैसा भेजने की सेवा जो कुछ ही सेकंड में दूसरे के खाते में रकम पहुँचा देती है।',
    },
  },
  {
    id: 'nominee',
    match: {
      en: ['nominee', 'beneficiary nominee'],
      hi: ['नॉमिनी', 'नामांकित व्यक्ति'],
    },
    term: {
      en: 'Nominee',
      hi: 'नॉमिनी',
    },
    meaning: {
      en: 'A trusted person chosen by you to receive your account money safely in case of your passing.',
      hi: 'आपके द्वारा चुना गया वह भरोसेमंद व्यक्ति जिसे आपके बाद खाते का पैसा सुरक्षित सौंपा जा सके।',
    },
  },
  {
    id: 'cheque-book',
    match: {
      en: ['cheque book', 'checkbook', 'cheque', 'check book'],
      hi: ['चेक बुक', 'चेकबुक', 'चेक'],
    },
    term: {
      en: 'Cheque book',
      hi: 'चेक बुक',
    },
    meaning: {
      en: 'A booklet of paper leaflets you sign to instruct your bank to pay a specified amount to someone.',
      hi: 'बैंक द्वारा दी गई पन्नों की पुस्तिका जिस पर दस्तखत करके आप किसी को पैसा दे सकते हैं।',
    },
  },
  {
    id: 'debit-card',
    match: {
      en: ['debit card', 'ATM card', 'bank card'],
      hi: ['डेबिट कार्ड', 'एटीएम कार्ड'],
    },
    term: {
      en: 'Debit card',
      hi: 'डेबिट कार्ड',
    },
    meaning: {
      en: 'A plastic card linked to your account used to withdraw cash at ATMs and make payments in stores.',
      hi: 'खाते से जुड़ा प्लास्टिक कार्ड जिससे एटीएम से नकद निकाल सकते हैं और दुकानों पर भुगतान कर सकते हैं।',
    },
  },
  {
    id: 'upi-limit',
    match: {
      en: ['UPI limit', 'daily UPI limit', 'spending limit'],
      hi: ['यूपीआई लिमिट', 'यूपीआई सीमा', 'दैनिक सीमा'],
    },
    term: {
      en: 'UPI limit',
      hi: 'यूपीआई सीमा',
    },
    meaning: {
      en: 'The maximum amount of money you are permitted to send through UPI in a single day.',
      hi: 'एक दिन में यूपीआई के माध्यम से भेजी जा सकने वाली अधिकतम धनराशि।',
    },
  },
  {
    id: 'reference-number',
    match: {
      en: ['reference number', 'ref number', 'transaction reference', 'UTR', 'ref no'],
      hi: ['संदर्भ संख्या', 'रेफरेंस नंबर', 'यूटीआर', 'रेफरेंस संख्या'],
    },
    term: {
      en: 'Reference number',
      hi: 'संदर्भ संख्या',
    },
    meaning: {
      en: 'A unique tracking number given to every transaction to identify and trace it if questions arise.',
      hi: 'हर लेन-देन को मिलने वाला अनोखा नंबर जिससे किसी समस्या के समय भुगतान की खोज की जा सके।',
    },
  },
  {
    id: 'statement',
    match: {
      en: ['statement', 'bank statement', 'account statement'],
      hi: ['स्टेटमेंट', 'खाता विवरण', 'बैंक स्टेटमेंट'],
    },
    term: {
      en: 'Statement',
      hi: 'खाता विवरण',
    },
    meaning: {
      en: 'A clear summary of all money received and spent in your account over a selected period.',
      hi: 'एक निश्चित समय में आपके खाते में आए और गए सभी पैसों का स्पष्ट लिखित ब्योरा।',
    },
  },
  {
    id: 'payee',
    match: {
      en: ['payee', 'beneficiary'],
      hi: ['पेयी', 'प्राप्तकर्ता', 'लाभार्थी'],
    },
    term: {
      en: 'Payee',
      hi: 'प्राप्तकर्ता (पेयी)',
    },
    meaning: {
      en: 'The person or business receiving the money you send.',
      hi: 'वह व्यक्ति या दुकान जिसे आप पैसा भेज रहे हैं।',
    },
  },
  {
    id: 'dr',
    match: {
      en: ['DR', 'debit', 'debited'],
      hi: ['DR', 'डेबिट', 'पैसा कटा'],
    },
    term: {
      en: 'DR (Debit)',
      hi: 'डीआर (डेबिट)',
    },
    meaning: {
      en: 'Short for Debit. It indicates that money went out or was deducted from your account.',
      hi: 'डेबिट का संक्षिप्त रूप। इसका मतलब है कि आपके खाते से पैसा निकला या काटा गया है।',
    },
  },
  {
    id: 'cr',
    match: {
      en: ['CR', 'credit', 'credited'],
      hi: ['CR', 'क्रेडिट', 'पैसा आया'],
    },
    term: {
      en: 'CR (Credit)',
      hi: 'सीआर (क्रेडिट)',
    },
    meaning: {
      en: 'Short for Credit. It indicates that money came into or was added to your account.',
      hi: 'क्रेडिट का संक्षिप्त रूप। इसका मतलब है कि आपके खाते में पैसा आया या जमा हुआ है।',
    },
  },
  {
    id: 'hold',
    match: {
      en: ['hold', 'held amount', 'lien', 'on hold'],
      hi: ['होल्ड', 'रोकी गई राशि', 'रुका हुआ'],
    },
    term: {
      en: 'Hold',
      hi: 'होल्ड (रोकी गई राशि)',
    },
    meaning: {
      en: 'Money temporarily locked for pending approvals or verification that cannot be spent right now.',
      hi: 'खाते का वह पैसा जो किसी मंज़ूरी या जाँच के लिए कुछ समय तक रोक दिया गया है और खर्च नहीं हो सकता।',
    },
  },
  {
    id: 'helpline',
    match: {
      en: ['helpline', 'customer care', 'toll-free', 'support number'],
      hi: ['हेल्पलाइन', 'कस्टमर केयर', 'सहायता नंबर'],
    },
    term: {
      en: 'Helpline',
      hi: 'हेल्पलाइन',
    },
    meaning: {
      en: 'Official phone numbers provided to ask questions, report problems, or stop banking fraud.',
      hi: 'बैंक या साइबर सुरक्षा के आधिकारिक फोन नंबर जहाँ समस्या या धोखाधड़ी की सूचना दे सकते हैं।',
    },
  },
  {
    id: 'pin',
    match: {
      en: ['PIN', 'UPI PIN', 'ATM PIN'],
      hi: ['पिन', 'PIN', 'यूपीआई पिन', 'एटीएम पिन'],
    },
    term: {
      en: 'PIN',
      hi: 'पिन (PIN)',
    },
    meaning: {
      en: 'A private secret number you enter yourself to authorize payments or ATM cash withdrawals.',
      hi: 'आपका निजी गुप्त कोड जिसे आप पैसे निकालने या भुगतान की पुष्टि के लिए खुद दर्ज करते हैं।',
    },
  },
  {
    id: 'pos',
    match: {
      en: ['POS', 'point of sale', 'card machine'],
      hi: ['पीओएस', 'POS', 'कार्ड मशीन'],
    },
    term: {
      en: 'POS (Point of Sale)',
      hi: 'पीओएस (कार्ड मशीन)',
    },
    meaning: {
      en: 'A card-swiping terminal at shops and petrol pumps where you tap or insert your debit card.',
      hi: 'दुकानों पर लगी मशीन जिसमें डेबिट कार्ड लगाकर या छूकर आप खरीदारी का भुगतान करते हैं।',
    },
  },
  {
    id: 'atm',
    match: {
      en: ['ATM', 'cash machine'],
      hi: ['एटीएम', 'ATM', 'कैश मशीन'],
    },
    term: {
      en: 'ATM',
      hi: 'एटीएम',
    },
    meaning: {
      en: 'An automated machine where you can insert your card and PIN to withdraw cash 24 hours a day.',
      hi: 'एक स्वचालित मशीन जिससे आप किसी भी समय अपने कार्ड और पिन द्वारा नकद पैसा निकाल सकते हैं।',
    },
  },
  {
    id: 'cvv',
    match: {
      en: ['CVV', 'card verification value', 'security code'],
      hi: ['सीवीवी', 'CVV', 'सुरक्षा कोड'],
    },
    term: {
      en: 'CVV',
      hi: 'सीवीवी',
    },
    meaning: {
      en: 'The 3-digit security number printed on the back of your debit card. Keep it private at all times.',
      hi: 'डेबिट कार्ड के पीछे लिखा 3 अंकों का सुरक्षा नंबर। इसे हमेशा गुप्त रखना चाहिए।',
    },
  },
  {
    id: 'savings-account',
    match: {
      en: ['savings account', 'bank account'],
      hi: ['बचत खाता', 'बैंक खाता'],
    },
    term: {
      en: 'Savings account',
      hi: 'बचत खाता',
    },
    meaning: {
      en: 'A secure deposit account in a bank where your money earns interest while remaining easy to withdraw.',
      hi: 'बैंक में एक सुरक्षित खाता जहाँ आपके पैसे पर ब्याज मिलता है और जब चाहें पैसा निकाला जा सकता है।',
    },
  },
];

// Helper to look up a term by id or common aliases
export function findTerm(id) {
  if (!id || typeof id !== 'string') return null;
  const cleanId = id.trim().toLowerCase();

  // Handle common alias mappings
  const aliasMap = {
    ref: 'reference-number',
    utr: 'reference-number',
    reference: 'reference-number',
    card: 'debit-card',
    'atm-card': 'debit-card',
    'min-balance': 'minimum-balance',
    'available': 'available-balance',
    'cheque': 'cheque-book',
    'checkbook': 'cheque-book',
  };

  const targetId = aliasMap[cleanId] || cleanId;
  return glossary.find((item) => item.id.toLowerCase() === targetId) || null;
}

// Helper to find matching glossary terms present in a text string
export function findTermsByText(text, lang = 'en') {
  if (!text || typeof text !== 'string') return [];
  const normalizedLang = lang === 'hi' ? 'hi' : 'en';
  const matches = [];

  for (const item of glossary) {
    const patterns = item.match?.[normalizedLang] || [];
    let matched = false;

    for (const pattern of patterns) {
      if (!pattern) continue;

      if (normalizedLang === 'hi') {
        if (text.includes(pattern)) {
          matched = true;
          break;
        }
      } else {
        // In English, use word boundary so DR/CR/PIN don't match substrings inside other words
        const isStrictCase = pattern.length <= 3 && pattern === pattern.toUpperCase();
        const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, isStrictCase ? '' : 'i');
        if (regex.test(text)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      matches.push(item);
    }
  }

  return matches;
}

export default glossary;
