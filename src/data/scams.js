// Saral Banking — Scam types and safety rules
// Dev 2 owns this file; Dev 3 reads it for safety lessons and fraud guidance

const scams = [
  {
    id: 'fake-kyc',
    title: {
      en: 'Fake KYC update message',
      hi: 'फर्जी केवाईसी अपडेट संदेश',
      ta: 'போலி கேஒய்சி (KYC) புதுப்பிப்பு செய்தி',
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
      ta: [
        '"அடையாளச் சரிபார்ப்பு (KYC) இன்றே முடியப்போகிறது, கணக்கு முடக்கப்படும்" என்று குறுஞ்செய்தி வரும்.',
        'செய்தியில் அவசரமாகத் தொட ஒரு இணைப்போ அல்லது தெரியாத மொபைல் எண்ணோ இருக்கும்.',
      ],
    },
    doThis: {
      en: 'Real banks never block accounts via SMS links. Delete the message and never click unknown links.',
      hi: 'बैंक कभी भी एसएमएस लिंक से खाता बंद नहीं करते। संदेश मिटा दें और किसी लिंक पर क्लिक न करें।',
      ta: 'உண்மையான வங்கி ஒருபோதும் குறுஞ்செய்தி இணைப்பு மூலம் கணக்கை முடக்காது. செய்தியை நீக்குங்கள், இணைப்பைத் தொடாதீர்கள்.',
    },
  },
  {
    id: 'prize',
    title: {
      en: 'Prize or lottery scam',
      hi: 'इनाम या लॉटरी का झांसा',
      ta: 'பரிசு அல்லது லாட்டரி மோசடி',
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
      ta: [
        'நீங்கள் கலந்துகொள்ளாத போட்டியில் கார், பரிசு அல்லது பணம் விழுந்துள்ளது என்று செய்தி அல்லது அழைப்பு வரும்.',
        'பரிசுத் தொகையை அனுப்ப முன்பணமாகச் சிறிய கட்டணம் அல்லது வரி கட்டச் சொல்வார்கள்.',
      ],
    },
    doThis: {
      en: 'Never pay money to claim a prize. Genuine lotteries never ask for advance payments.',
      hi: 'इनाम पाने के लिए कभी पैसे न दें। असली ईनाम में पहले कोई भुगतान नहीं माँगा जाता।',
      ta: 'பரிசு பெறுவதற்காக ஒருபோதும் பணம் செலுத்தாதீர்கள். உண்மையான பரிசுகளுக்கு முன்பணம் கேட்கப்படாது.',
    },
  },
  {
    id: 'payment-request',
    title: {
      en: 'Fake payment request',
      hi: 'फर्जी पेमेंट (कलेक्ट) रिक्वेस्ट',
      ta: 'போலி கட்டணக் கோரிக்கை (கலெக்ட் ரிக்வெஸ்ட்)',
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
      ta: [
        'பணம் அனுப்புவதாகச் சொல்லி, அதற்குப் பதிலாக உங்களிடம் பணம் கேட்டு ரிக்வெஸ்ட் அனுப்புவார்கள்.',
        'பணத்தைப் பெற ரிக்வெஸ்ட்டை ஏற்றுக்கொண்டு உங்கள் ரகசிய எண்ணை (PIN) உள்ளிடுமாறு கூறுவார்கள்.',
      ],
    },
    doThis: {
      en: 'Remember: you NEVER enter your PIN to receive money. Tap Decline immediately.',
      hi: 'याद रखें: पैसा पाने के लिए कभी पिन नहीं डाला जाता। तुरंत रिक्वेस्ट अस्वीकार (Decline) करें।',
      ta: 'நினைவில் கொள்ளுங்கள்: பணம் பெறுவதற்கு நீங்கள் ஒருபோதும் ரகசிய எண்ணை (PIN) உள்ளிடத் தேவையில்லை. உடனே நிராகரியுங்கள் (Decline).',
    },
  },
  {
    id: 'screen-sharing',
    title: {
      en: 'Screen-sharing app fraud',
      hi: 'स्क्रीन-शेयरिंग ऐप धोखाधड़ी',
      ta: 'திரைப் பகிர்வு ஆப் (Screen Sharing) மோசடி',
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
      ta: [
        'வங்கி அல்லது உதவி மையம் என்று கூறி AnyDesk, TeamViewer போன்ற ஆப்பைப் பதிவிறக்கச் சொல்வார்கள்.',
        'கணக்கைச் சரிசெய்வதாகக் கூறி 9 இலக்கக் குறியீட்டைப் படித்துக் காட்டச் சொல்வார்கள் அல்லது உங்கள் திரையைப் பார்ப்பார்கள்.',
      ],
    },
    doThis: {
      en: 'Never install remote screen-sharing apps on an unknown caller instructions. Hang up immediately.',
      hi: 'किसी अनजान कॉलर के कहने पर कभी स्क्रीन-शेयरिंग ऐप न डालें। तुरंत फोन काट दें।',
      ta: 'தெரியாத நபர்களின் பேச்சைக் கேட்டு ஒருபோதும் திரைப் பகிர்வு ஆப்பை நிறுவ வேண்டாம். உடனே அழைப்பைத் துண்டியுங்கள்.',
    },
  },
  {
    id: 'fake-care-number',
    title: {
      en: 'Fake customer care number',
      hi: 'फर्जी कस्टमर केयर नंबर',
      ta: 'போலி வாடிக்கையாளர் சேவை எண்',
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
      ta: [
        'இணைய தேடல் அல்லது சமூக வலைதளங்களில் கிடைக்கும் சாதாரண மொபைல் எண் வங்கியின் உதவி எண் என்று கூறப்படும்.',
        'அழைப்பில் பேசுபவர் உங்கள் முழு அட்டை எண், காலாவதி தேதி, சிவிவி (CVV) அல்லது கடவுச்சொல்லைக் கேட்பார்.',
      ],
    },
    doThis: {
      en: 'Only call official toll-free numbers listed on the back of your card, in passbooks, or inside this app.',
      hi: 'केवल अपने कार्ड के पीछे, पासबुक में या इस ऐप में दिए गए आधिकारिक टोल-फ्री नंबर पर ही कॉल करें।',
      ta: 'உங்கள் அட்டையின் பின்புறம் உள்ள அல்லது ஆப்பில் உள்ள அதிகாரப்பூர்வ கட்டணமில்லா உதவி எண்ணை மட்டுமே அழையுங்கள்.',
    },
  },
  {
    id: 'otp-pin',
    title: {
      en: 'Anyone asking for OTP or PIN',
      hi: 'ओटीपी या पिन माँगने वाले',
      ta: 'ஒருமுறை எண் (OTP) அல்லது ரகசிய எண் (PIN) கேட்பவர்கள்',
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
      ta: [
        'வங்கி மேலாளர், காவல் துறை அல்லது வரி அதிகாரி என்று கூறி உங்கள் ஒருமுறை எண் (OTP) அல்லது ரகசிய எண்ணைக் கேட்பார்கள்.',
        'உடனே தராவிட்டால் கணக்கு முடக்கப்படும் அல்லது பறிமுதல் செய்யப்படும் என்று பயமுறுத்துவார்கள்.',
      ],
    },
    doThis: {
      en: 'Never share your OTP, PIN, or password with anyone. Bank staff and police will never ask for them.',
      hi: 'अपना ओटीपी, पिन या पासवर्ड कभी किसी को न बताएं। बैंक कर्मचारी या पुलिस इसे कभी नहीं माँगते।',
      ta: 'வங்கி ஒருபோதும் தொலைபேசியிலோ குறுஞ்செய்தியிலோ உங்கள் ஒருமுறை எண் (OTP), ரகசிய எண் (PIN) அல்லது கடவுச்சொல்லைக் கேட்காது. யாரிடமும் சொல்லாதீர்கள்.',
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

export const SCAMS = scams;
export default scams;
