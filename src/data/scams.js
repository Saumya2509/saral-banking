// Saral Banking — Scam types and safety rules
// Dev 2 owns this file; Dev 3 reads it for safety lessons and fraud guidance

const scams = [
  {
    id: 'fake-kyc',
    title: {
      en: 'Fake KYC update message',
      hi: 'फर्जी केवाईसी अपडेट संदेश',
    },
    signs: {
      en: [
        'An SMS claims your bank account or SIM card will be blocked today unless you update KYC.',
        'The message includes an urgent link or an unknown mobile number to call.',
      ],
      hi: [
        'एसएमएस में दावा किया जाता है कि आज ही केवाईसी अपडेट न करने पर खाता या सिम बंद हो जाएगा।',
        'संदेश में तुरंत क्लिक करने के लिए अनजान लिंक या मोबाइल नंबर दिया होता है।',
      ],
    },
    doThis: {
      en: 'Real banks never block accounts via SMS links. Delete the message and never click unknown links.',
      hi: 'बैंक कभी भी एसएमएस लिंक से खाता बंद नहीं करते। संदेश मिटा दें और किसी लिंक पर क्लिक न करें।',
    },
  },
  {
    id: 'prize',
    title: {
      en: 'Prize or lottery scam',
      hi: 'इनाम या लॉटरी का झांसा',
    },
    signs: {
      en: [
        'A message or caller claims you won a car, lottery, or cash prize in a contest you never entered.',
        'They ask you to pay a small processing fee or tax upfront before releasing the prize money.',
      ],
      hi: [
        'संदेश या कॉल जिसमें दावा किया जाता है कि आपने कोई कार या लॉटरी जीती है जिसमें आपने भाग भी नहीं लिया था।',
        'इनाम की रकम भेजने से पहले प्रोसेसिंग फीस या टैक्स के नाम पर पैसे माँगे जाते हैं।',
      ],
    },
    doThis: {
      en: 'Never pay money to claim a prize. Genuine lotteries never ask for advance payments.',
      hi: 'इनाम पाने के लिए कभी पैसे न दें। असली ईनाम में पहले कोई भुगतान नहीं माँगा जाता।',
    },
  },
  {
    id: 'payment-request',
    title: {
      en: 'Fake payment request',
      hi: 'फर्जी पेमेंट (कलेक्ट) रिक्वेस्ट',
    },
    signs: {
      en: [
        'A buyer on an online marketplace claims they sent you money, but sends a payment request instead.',
        'They tell you to approve the request and enter your UPI PIN to receive the funds.',
      ],
      hi: [
        'सामान खरीदने वाला कहता है कि उसने पैसे भेज दिए हैं, लेकिन असल में वह पैसे माँगने की रिक्वेस्ट भेजता है।',
        'वह कहता है कि पैसा पाने के लिए रिक्वेस्ट स्वीकार करके अपना यूपीआई पिन दर्ज करें।',
      ],
    },
    doThis: {
      en: 'Remember: you NEVER enter your PIN to receive money. Tap Decline immediately.',
      hi: 'याद रखें: पैसा पाने के लिए कभी पिन नहीं डाला जाता। तुरंत रिक्वेस्ट अस्वीकार (Decline) करें।',
    },
  },
  {
    id: 'screen-sharing',
    title: {
      en: 'Screen-sharing app fraud',
      hi: 'स्क्रीन-शेयरिंग ऐप धोखाधड़ी',
    },
    signs: {
      en: [
        'A caller claiming to be bank or tech support asks you to install AnyDesk, TeamViewer, or QuickSupport.',
        'They ask you to read out a 9-digit code so they can "fix" your account or refund money.',
      ],
      hi: [
        'बैंक या टेक सपोर्ट का नाम लेकर कॉलर कोई ऐप (जैसे AnyDesk, TeamViewer या QuickSupport) इंस्टॉल करने को कहता है।',
        'वे समस्या ठीक करने के बहाने आपसे 9 अंकों का कोड या स्क्रीन देखने की अनुमति माँगते हैं।',
      ],
    },
    doThis: {
      en: 'Never install remote screen-sharing apps on an unknown caller instructions. Hang up immediately.',
      hi: 'किसी अनजान कॉलर के कहने पर कभी स्क्रीन-शेयरिंग ऐप न डालें। तुरंत फोन काट दें।',
    },
  },
  {
    id: 'fake-care-number',
    title: {
      en: 'Fake customer care number',
      hi: 'फर्जी कस्टमर केयर नंबर',
    },
    signs: {
      en: [
        'A mobile number found on search engines or social media claiming to be official bank support.',
        'The representative asks for your full debit card number, expiry, CVV, or internet banking password.',
      ],
      hi: [
        'गूगल सर्च या सोशल मीडिया पर मिला साधारण मोबाइल नंबर जो बैंक का हेल्पलाइन होने का दावा करता है।',
        'कॉल उठाने वाला आपका पूरा कार्ड नंबर, एक्सपायरी, सीवीवी या पासवर्ड माँगता है।',
      ],
    },
    doThis: {
      en: 'Only call official toll-free numbers listed on the back of your card, in passbooks, or inside this app.',
      hi: 'केवल अपने कार्ड के पीछे, पासबुक में या इस ऐप में दिए गए आधिकारिक टोल-फ्री नंबर पर ही कॉल करें।',
    },
  },
  {
    id: 'otp-pin',
    title: {
      en: 'Anyone asking for OTP or PIN',
      hi: 'ओटीपी या पिन माँगने वाले',
    },
    signs: {
      en: [
        'A caller posing as a bank manager, police officer, or tax agent asks for your OTP or PIN.',
        'They create extreme urgency, claiming your account will be frozen or seized immediately.',
      ],
      hi: [
        'कॉलर खुद को बैंक मैनेजर, पुलिस या टैक्स अधिकारी बताकर आपका ओटीपी या पिन माँगता है।',
        'वे डराते हैं कि यदि आपने तुरंत कोड नहीं दिया तो आपका खाता अभी सील कर दिया जाएगा।',
      ],
    },
    doThis: {
      en: 'Never share your OTP, PIN, or password with anyone. Bank staff and police will never ask for them.',
      hi: 'अपना ओटीपी, पिन या पासवर्ड कभी किसी को न बताएं। बैंक कर्मचारी या पुलिस इसे कभी नहीं माँगते।',
    },
  },
];

export function getScam(id) {
  if (!id) return null;
  return scams.find((s) => s.id === id) || null;
}

export const findScam = getScam;

export function getAllScams() {
  return scams;
}

export default scams;
