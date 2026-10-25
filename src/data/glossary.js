// Saral Banking — Glossary of banking terms
// Dev 3 owns this file; Dev 1's Rich and Term components use this for tap-to-explain

const glossary = [
  {
    id: 'ifsc',
    match: {
      en: ['IFSC', 'IFSC code'],
      hi: ['आईएफएससी', 'IFSC', 'आईएफएससी कोड'],
      ta: ["IFSC","ஐஎஃப்எஸ்சி","வங்கிக் கிளை குறியீடு","குறியீடு"],
    },
    term: {
      en: 'IFSC',
      hi: 'आईएफएससी',
      ta: 'வங்கிக் கிளை குறியீடு (IFSC)',
    },
    meaning: {
      en: 'An 11-character code that identifies a specific bank branch for electronic payments.',
      hi: '11 अक्षरों का एक कोड जो इलेक्ट्रॉनिक भुगतान के लिए बैंक की शाखा की पहचान करता है।',
      ta: 'ஒவ்வொரு வங்கிக் கிளைக்கும் உள்ள 11 எழுத்து, எண் கொண்ட குறியீடு. பணம் அனுப்பும்போது இது தேவை. உங்கள் கணக்குப் புத்தகத்தில் இருக்கும்.',
    },
  },
  {
    id: 'upi',
    match: {
      en: ['UPI', 'Unified Payments Interface'],
      hi: ['यूपीआई', 'UPI'],
      ta: ["யுபிஐ","UPI","யு.பி.ஐ"],
    },
    term: {
      en: 'UPI',
      hi: 'यूपीआई',
      ta: 'யுபிஐ (UPI)',
    },
    meaning: {
      en: 'A system that lets you send and receive money instantly from your phone using a simple ID or mobile number.',
      hi: 'एक ऐसी प्रणाली जिससे आप अपने फोन से किसी यूपीआई आईडी या मोबाइल नंबर पर तुरंत पैसा भेज और पा सकते हैं।',
      ta: 'மொபைல் ஆப் மூலம் உடனே பணம் அனுப்பவும் பெறவும் உதவும் முறை.',
    },
  },
  {
    id: 'otp',
    match: {
      en: ['OTP', 'One Time Password', 'one-time password'],
      hi: ['ओटीपी', 'OTP', 'वन टाइम पासवर्ड'],
      ta: ["ஒருமுறை எண்","ஓடிபி","OTP"],
    },
    term: {
      en: 'OTP',
      hi: 'ओटीपी',
      ta: 'ஒருமுறை எண் (OTP)',
    },
    meaning: {
      en: 'A one-time secret code sent to your phone to approve a transaction. Never share it with anyone.',
      hi: 'एक बार उपयोग होने वाला गुप्त कोड जो लेन-देन की पुष्टि के लिए फोन पर आता है। इसे किसी को न बताएं।',
      ta: 'ஒரே ஒரு முறை மட்டும் பயன்படும் எண். செய்தியாக வரும். இதை யாரிடமும் சொல்லாதீர்கள்.',
    },
  },
  {
    id: 'kyc',
    match: {
      en: ['KYC', 'Know Your Customer'],
      hi: ['केवाईसी', 'KYC'],
      ta: ["அடையாளச் சரிபார்ப்பு","கேஒய்சி","KYC"],
    },
    term: {
      en: 'KYC',
      hi: 'केवाईसी',
      ta: 'அடையாளச் சரிபார்ப்பு (KYC)',
    },
    meaning: {
      en: 'A verification process where the bank checks your identity and address using official documents.',
      hi: 'एक प्रक्रिया जिसमें बैंक सरकारी पहचान पत्र और पते के प्रमाण से आपकी पहचान की पुष्टि करता है।',
      ta: 'நீங்கள் யார் என்று வங்கி உறுதிசெய்யும் முறை. ஆதார், பான் போன்ற ஆவணங்கள் தேவைப்படலாம்.',
    },
  },
  {
    id: 'balance',
    match: {
      en: ['balance', 'total balance', 'account balance'],
      hi: ['बैलेंस', 'खाता शेष', 'कुल बैलेंस', 'कुल शेष'],
      ta: ["இருப்புத் தொகை","இருப்பு","பேலன்ஸ்"],
    },
    term: {
      en: 'Balance',
      hi: 'कुल बैलेंस',
      ta: 'இருப்புத் தொகை',
    },
    meaning: {
      en: 'The total amount of money present in your bank account right now.',
      hi: 'इस समय आपके बैंक खाते में मौजूद कुल पैसे की राशि।',
      ta: 'உங்கள் கணக்கில் இப்போது இருக்கும் பணம்.',
    },
  },
  {
    id: 'available-balance',
    match: {
      en: ['available balance', 'spendable balance'],
      hi: ['उपलब्ध बैलेंस', 'उपलब्ध शेष'],
      ta: ["கிடைக்கக்கூடிய இருப்பு","பயன்படுத்தக்கூடிய இருப்பு"],
    },
    term: {
      en: 'Available balance',
      hi: 'उपलब्ध बैलेंस',
      ta: 'கிடைக்கக்கூடிய இருப்பு',
    },
    meaning: {
      en: 'The money you can spend or withdraw immediately, after deducting any held or pending amounts.',
      hi: 'वह पैसा जिसे आप अभी खर्च या निकाल सकते हैं, किसी रोकी गई राशि को घटाकर।',
      ta: 'நீங்கள் இப்போது உடனடியாகப் பயன்படுத்த அல்லது எடுக்கக்கூடிய பணம்.',
    },
  },
  {
    id: 'minimum-balance',
    match: {
      en: ['minimum balance', 'min balance', 'average monthly balance'],
      hi: ['न्यूनतम बैलेंस', 'न्यूनतम शेष', 'कम से कम बैलेंस'],
      ta: ["குறைந்தபட்ச இருப்பு","குறைந்தபட்ச பணம்"],
    },
    term: {
      en: 'Minimum balance',
      hi: 'न्यूनतम बैलेंस',
      ta: 'குறைந்தபட்ச இருப்பு',
    },
    meaning: {
      en: 'The lowest balance your bank asks you to maintain in your account to avoid a monthly charge.',
      hi: 'खाते में रखा जाने वाला सबसे कम पैसा ताकि बैंक कोई अतिरिक्त शुल्क न काटे।',
      ta: 'கணக்கில் எப்போதும் வைத்திருக்க வேண்டிய குறைந்தபட்சப் பணம். இதற்குக் குறைந்தால் வங்கி கட்டணம் எடுக்கலாம்.',
    },
  },
  {
    id: 'interest',
    match: {
      en: ['interest', 'savings interest'],
      hi: ['ब्याज'],
      ta: ["வட்டி"],
    },
    term: {
      en: 'Interest',
      hi: 'ब्याज',
      ta: 'வட்டி',
    },
    meaning: {
      en: 'Extra money paid by the bank into your account as a reward for keeping your savings with them.',
      hi: 'बैंक में बचत रखने पर बैंक द्वारा आपके खाते में जमा किया जाने वाला अतिरिक्त पैसा।',
      ta: 'உங்கள் சேமிப்புக்கு வங்கி கொடுக்கும் கூடுதல் பணம்.',
    },
  },
  {
    id: 'neft',
    match: {
      en: ['NEFT', 'National Electronic Funds Transfer'],
      hi: ['एनईएफटी', 'NEFT'],
      ta: ["NEFT","என்இஎஃப்டி","இணையப் பரிமாற்றம்"],
    },
    term: {
      en: 'NEFT',
      hi: 'एनईएफटी',
      ta: 'இணையம் வழிப் பணப் பரிமாற்றம் (NEFT)',
    },
    meaning: {
      en: 'A nationwide electronic payment system for transferring money between bank accounts in hourly batches.',
      hi: 'एक बैंक से दूसरे बैंक में सुरक्षित पैसा भेजने की सेवा जो आधे-आधे घंटे के बैच में पूरी होती है।',
      ta: 'ஒரு வங்கிக் கணக்கிலிருந்து மற்றொன்றுக்குப் பணம் அனுப்பும் முறை. சில மணி நேரம் ஆகலாம்.',
    },
  },
  {
    id: 'imps',
    match: {
      en: ['IMPS', 'Immediate Payment Service'],
      hi: ['आईएमपीएस', 'IMPS'],
      ta: ["IMPS","ஐஎம்பிஎஸ்","உடனடிப் பரிமாற்றம்"],
    },
    term: {
      en: 'IMPS',
      hi: 'आईएमपीएस',
      ta: 'உடனடிப் பணப் பரிமாற்றம் (IMPS)',
    },
    meaning: {
      en: 'An instant 24/7 money transfer service that delivers funds to another bank account within seconds.',
      hi: '24 घंटे तुरंत पैसा भेजने की सेवा जो कुछ ही सेकंड में दूसरे के खाते में रकम पहुँचा देती है।',
      ta: 'இரவும் பகலும் எந்த நேரத்திலும் உடனே பணம் அனுப்பலாம்.',
    },
  },
  {
    id: 'nominee',
    match: {
      en: ['nominee', 'beneficiary nominee'],
      hi: ['नॉमिनी', 'नामांकित व्यक्ति'],
      ta: ["வாரிசுதாரர்","நாமினி","Nominee"],
    },
    term: {
      en: 'Nominee',
      hi: 'नॉमिनी',
      ta: 'வாரிசுதாரர் (Nominee)',
    },
    meaning: {
      en: 'A trusted person chosen by you to receive your account money safely in case of your passing.',
      hi: 'आपके द्वारा चुना गया वह भरोसेमंद व्यक्ति जिसे आपके बाद खाते का पैसा सुरक्षित सौंपा जा सके।',
      ta: 'உங்களுக்குப் பிறகு உங்கள் கணக்கிலுள்ள பணத்தைப் பெற நீங்கள் நியமிக்கும் நபர்.',
    },
  },
  {
    id: 'cheque-book',
    match: {
      en: ['cheque book', 'checkbook', 'cheque', 'check book'],
      hi: ['चेक बुक', 'चेकबुक', 'चेक'],
      ta: ["காசோலை புத்தகம்","காசோலை","செக் புத்தகம்"],
    },
    term: {
      en: 'Cheque book',
      hi: 'चेक बुक',
      ta: 'காசோலை புத்தகம்',
    },
    meaning: {
      en: 'A booklet of paper leaflets you sign to instruct your bank to pay a specified amount to someone.',
      hi: 'बैंक द्वारा दी गई पन्नों की पुस्तिका जिस पर दस्तखत करके आप किसी को पैसा दे सकते हैं।',
      ta: 'வங்கி மூலம் பாதுகாப்பாகப் பணம் செலுத்த அல்லது எடுக்க உதவும் காசோலைகளின் புத்தகம்.',
    },
  },
  {
    id: 'debit-card',
    match: {
      en: ['debit card', 'ATM card', 'bank card'],
      hi: ['डेबिट कार्ड', 'एटीएम कार्ड'],
      ta: ["டெபிட் கார்டு","ஏடிஎம் அட்டை","கார்டு"],
    },
    term: {
      en: 'Debit card',
      hi: 'डेबिट कार्ड',
      ta: 'டெபிட் கார்டு (Debit Card)',
    },
    meaning: {
      en: 'A plastic card linked to your account used to withdraw cash at ATMs and make payments in stores.',
      hi: 'खाते से जुड़ा प्लास्टिक कार्ड जिससे एटीएम से नकद निकाल सकते हैं और दुकानों पर भुगतान कर सकते हैं।',
      ta: 'உங்கள் வங்கிக் கணக்கிலிருந்து ஏடிஎம்மில் பணம் எடுக்க அல்லது கடைகளில் பணம் செலுத்த உதவும் அட்டை.',
    },
  },
  {
    id: 'upi-limit',
    match: {
      en: ['UPI limit', 'daily UPI limit', 'spending limit'],
      hi: ['यूपीआई लिमिट', 'यूपीआई सीमा', 'दैनिक सीमा'],
      ta: ["யுபிஐ வரம்பு","அனுப்பும் வரம்பு"],
    },
    term: {
      en: 'UPI limit',
      hi: 'यूपीआई सीमा',
      ta: 'யுபிஐ வரம்பு (UPI Limit)',
    },
    meaning: {
      en: 'The maximum amount of money you are permitted to send through UPI in a single day.',
      hi: 'एक दिन में यूपीआई के माध्यम से भेजी जा सकने वाली अधिकतम धनराशि।',
      ta: 'ஒரு நாளில் அல்லது ஒரு முறை யுபிஐ மூலம் நீங்கள் அனுப்பக்கூடிய அதிகபட்சப் பணம்.',
    },
  },
  {
    id: 'reference-number',
    match: {
      en: ['reference number', 'ref number', 'transaction reference', 'UTR', 'ref no'],
      hi: ['संदर्भ संख्या', 'रेफरेंस नंबर', 'यूटीआर', 'रेफरेंस संख्या'],
      ta: ["குறிப்பு எண்","பரிவர்த்தனை எண்","ரெஃப் எண்"],
    },
    term: {
      en: 'Reference number',
      hi: 'संदर्भ संख्या',
      ta: 'பரிவர்த்தனை குறிப்பு எண் (Ref No)',
    },
    meaning: {
      en: 'A unique tracking number given to every transaction to identify and trace it if questions arise.',
      hi: 'हर लेन-देन को मिलने वाला अनोखा नंबर जिससे किसी समस्या के समय भुगतान की खोज की जा सके।',
      ta: 'ஒவ்வொரு பணப் பரிமாற்றத்திற்கும் வங்கி தரும் தனித்துவமான அடையாள எண்.',
    },
  },
  {
    id: 'statement',
    match: {
      en: ['statement', 'bank statement', 'account statement'],
      hi: ['स्टेटमेंट', 'खाता विवरण', 'बैंक स्टेटमेंट'],
      ta: ["கணக்கு அறிக்கை","ஸ்டேட்மென்ட்","பரிவர்த்தனை வரலாறு"],
    },
    term: {
      en: 'Statement',
      hi: 'खाता विवरण',
      ta: 'கணக்கு அறிக்கை',
    },
    meaning: {
      en: 'A clear summary of all money received and spent in your account over a selected period.',
      hi: 'एक निश्चित समय में आपके खाते में आए और गए सभी पैसों का स्पष्ट लिखित ब्योरा।',
      ta: 'உங்கள் கணக்கில் வந்த, போன பணத்தின் பட்டியல்.',
    },
  },
  {
    id: 'payee',
    match: {
      en: ['payee', 'beneficiary'],
      hi: ['पेयी', 'प्राप्तकर्ता', 'लाभार्थी'],
      ta: ["பணம் பெறுபவர்","பெறுநர்","பயனாளி"],
    },
    term: {
      en: 'Payee',
      hi: 'प्राप्तकर्ता (पेयी)',
      ta: 'பணம் பெறுபவர் (Payee)',
    },
    meaning: {
      en: 'The person or business receiving the money you send.',
      hi: 'वह व्यक्ति या दुकान जिसे आप पैसा भेज रहे हैं।',
      ta: 'நீங்கள் யாருக்குப் பணம் அனுப்புகிறீர்களோ அந்த நபர் அல்லது நிறுவனம்.',
    },
  },
  {
    id: 'dr',
    match: {
      en: ['DR', 'debit', 'debited'],
      hi: ['DR', 'डेबिट', 'पैसा कटा'],
      ta: ["பற்று","டெபிட்","DR"],
    },
    term: {
      en: 'DR (Debit)',
      hi: 'डीआर (डेबिट)',
      ta: 'பற்று (DR - Debited)',
    },
    meaning: {
      en: 'Short for Debit. It indicates that money went out or was deducted from your account.',
      hi: 'डेबिट का संक्षिप्त रूप। इसका मतलब है कि आपके खाते से पैसा निकला या काटा गया है।',
      ta: 'உங்கள் வங்கிக் கணக்கிலிருந்து பணம் எடுக்கப்பட்டது அல்லது குறைக்கப்பட்டது என்று பொருள்.',
    },
  },
  {
    id: 'cr',
    match: {
      en: ['CR', 'credit', 'credited'],
      hi: ['CR', 'क्रेडिट', 'पैसा आया'],
      ta: ["வரவு","கிரெடிட்","CR"],
    },
    term: {
      en: 'CR (Credit)',
      hi: 'सीआर (क्रेडिट)',
      ta: 'வரவு (CR - Credited)',
    },
    meaning: {
      en: 'Short for Credit. It indicates that money came into or was added to your account.',
      hi: 'क्रेडिट का संक्षिप्त रूप। इसका मतलब है कि आपके खाते में पैसा आया या जमा हुआ है।',
      ta: 'உங்கள் வங்கிக் கணக்கில் பணம் வந்து சேர்ந்தது அல்லது கூட்டப்பட்டது என்று பொருள்.',
    },
  },
  {
    id: 'hold',
    match: {
      en: ['hold', 'held amount', 'lien', 'on hold'],
      hi: ['होल्ड', 'रोकी गई राशि', 'रुका हुआ'],
      ta: ["தற்காலிக நிறுத்தம்","நிறுத்தி வைக்கப்பட்டது"],
    },
    term: {
      en: 'Hold',
      hi: 'होल्ड (रोकी गई राशि)',
      ta: 'தற்காலிக நிறுத்தம் (Hold)',
    },
    meaning: {
      en: 'Money temporarily locked for pending approvals or verification that cannot be spent right now.',
      hi: 'खाते का वह पैसा जो किसी मंज़ूरी या जाँच के लिए कुछ समय तक रोक दिया गया है और खर्च नहीं हो सकता।',
      ta: 'குறிப்பிட்ட காரணத்திற்காக உங்கள் கணக்கில் தற்காலிகமாக நிறுத்தி வைக்கப்பட்ட தொகை.',
    },
  },
  {
    id: 'helpline',
    match: {
      en: ['helpline', 'customer care', 'toll-free', 'support number'],
      hi: ['हेल्पलाइन', 'कस्टमर केयर', 'सहायता नंबर'],
      ta: ["உதவி எண்","ஹெல்ப்லைன்"],
    },
    term: {
      en: 'Helpline',
      hi: 'हेल्पलाइन',
      ta: 'வங்கி உதவி எண் (Helpline)',
    },
    meaning: {
      en: 'Official phone numbers provided to ask questions, report problems, or stop banking fraud.',
      hi: 'बैंक या साइबर सुरक्षा के आधिकारिक फोन नंबर जहाँ समस्या या धोखाधड़ी की सूचना दे सकते हैं।',
      ta: 'உதவி அல்லது புகார் தெரிவிக்க நீங்கள் அழைக்க வேண்டிய அதிகாரப்பூர்வ எண் 1800-111-222.',
    },
  },
  {
    id: 'pin',
    match: {
      en: ['PIN', 'UPI PIN', 'ATM PIN'],
      hi: ['पिन', 'PIN', 'यूपीआई पिन', 'एटीएम पिन'],
      ta: ["ரகசிய எண்","பின்","PIN"],
    },
    term: {
      en: 'PIN',
      hi: 'पिन (PIN)',
      ta: 'ரகசிய எண் (PIN)',
    },
    meaning: {
      en: 'A private secret number you enter yourself to authorize payments or ATM cash withdrawals.',
      hi: 'आपका निजी गुप्त कोड जिसे आप पैसे निकालने या भुगतान की पुष्टि के लिए खुद दर्ज करते हैं।',
      ta: 'அட்டை அல்லது யுபிஐ (UPI) பயன்படுத்த நீங்கள் மட்டுமே அறிந்த 4 அல்லது 6 இலக்க எண்.',
    },
  },
  {
    id: 'pos',
    match: {
      en: ['POS', 'point of sale', 'card machine'],
      hi: ['पीओएस', 'POS', 'कार्ड मशीन'],
      ta: ["POS","பிஓஎஸ்","கார்டு இயந்திரம்"],
    },
    term: {
      en: 'POS (Point of Sale)',
      hi: 'पीओएस (कार्ड मशीन)',
      ta: 'பி.ஓ.எஸ் இயந்திரம் (POS)',
    },
    meaning: {
      en: 'A card-swiping terminal at shops and petrol pumps where you tap or insert your debit card.',
      hi: 'दुकानों पर लगी मशीन जिसमें डेबिट कार्ड लगाकर या छूकर आप खरीदारी का भुगतान करते हैं।',
      ta: 'கடைகளில் அட்டை மூலம் பணம் செலுத்தப் பயன்படும் சிறிய மின்னணு இயந்திரம்.',
    },
  },
  {
    id: 'atm',
    match: {
      en: ['ATM', 'cash machine'],
      hi: ['एटीएम', 'ATM', 'कैश मशीन'],
      ta: ["ஏடிஎம்","ATM","பணம் எடுக்கும் இயந்திரம்"],
    },
    term: {
      en: 'ATM',
      hi: 'एटीएम',
      ta: 'ஏடிஎம் (ATM)',
    },
    meaning: {
      en: 'An automated machine where you can insert your card and PIN to withdraw cash 24 hours a day.',
      hi: 'एक स्वचालित मशीन जिससे आप किसी भी समय अपने कार्ड और पिन द्वारा नकद पैसा निकाल सकते हैं।',
      ta: 'தானியங்கிப் பணப் பரிவர்த்தனை இயந்திரம். எந்நேரமும் பணம் எடுக்கலாம்.',
    },
  },
  {
    id: 'cvv',
    match: {
      en: ['CVV', 'card verification value', 'security code'],
      hi: ['सीवीवी', 'CVV', 'सुरक्षा कोड'],
      ta: ["சிவிவி","CVV"],
    },
    term: {
      en: 'CVV',
      hi: 'सीवीवी',
      ta: 'சிவிவி (CVV)',
    },
    meaning: {
      en: 'The 3-digit security number printed on the back of your debit card. Keep it private at all times.',
      hi: 'डेबिट कार्ड के पीछे लिखा 3 अंकों का सुरक्षा नंबर। इसे हमेशा गुप्त रखना चाहिए।',
      ta: 'உங்கள் டெபிட் கார்டின் பின்புறம் உள்ள 3 இலக்க ரகசிய எண். இதை யாரிடமும் சொல்லாதீர்கள்.',
    },
  },
  {
    id: 'savings-account',
    match: {
      en: ['savings account', 'bank account'],
      hi: ['बचत खाता', 'बैंक खाता'],
      ta: ["சேமிப்புக் கணக்கு","வங்கி கணக்கு"],
    },
    term: {
      en: 'Savings account',
      hi: 'बचत खाता',
      ta: 'சேமிப்புக் கணக்கு',
    },
    meaning: {
      en: 'A secure deposit account in a bank where your money earns interest while remaining easy to withdraw.',
      hi: 'बैंक में एक सुरक्षित खाता जहाँ आपके पैसे पर ब्याज मिलता है और जब चाहें पैसा निकाला जा सकता है।',
      ta: 'உங்கள் பணம் பாதுகாப்பாக இருக்கவும் வட்டி பெறவும் உதவும் வங்கிக் கணக்கு.',
    },
  },,
  {
    id: 'lakh',
    match: {
      en: ['lakh', 'lakhs'],
      hi: ['लाख'],
      ta: ['லட்சம்'],
    },
    term: {
      en: 'Lakh',
      hi: 'लाख',
      ta: 'லட்சம்',
    },
    meaning: {
      en: '1,00,000. One hundred thousand.',
      hi: '1,00,000. सौ हज़ार।',
      ta: '1,00,000. நூறு ஆயிரம்.',
    },
  },
  {
    id: 'crore',
    match: {
      en: ['crore', 'crores'],
      hi: ['करोड़'],
      ta: ['கோடி'],
    },
    term: {
      en: 'Crore',
      hi: 'करोड़',
      ta: 'கோடி',
    },
    meaning: {
      en: '1,00,00,000. One hundred lakh.',
      hi: '1,00,00,000. सौ लाख।',
      ta: '1,00,00,000. நூறு லட்சம்.',
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
  const normalizedLang = (lang === 'hi' || lang === 'ta') ? lang : 'en';
  const matches = [];

  for (const item of glossary) {
    const patterns = item.match?.[normalizedLang] || [];
    let matched = false;

    for (const pattern of patterns) {
      if (!pattern) continue;

      if (normalizedLang === 'hi' || normalizedLang === 'ta') {
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

export const GLOSSARY = glossary;
export default glossary;
