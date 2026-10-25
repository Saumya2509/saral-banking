// Saral Banking — Frequently asked questions (bilingual)
// Dev 3 owns this file; used by LearnScreen and Chatbot for FAQ lookup

const faq = [
  {
    id: 'check-balance',
    question: {
      en: 'How do I check my account balance?',
      hi: 'मैं अपना खाता बैलेंस कैसे देखूँ?',
    },
    answer: {
      en: 'Open the app and your balance is shown on the home screen. You can also tap "Statement" to see recent transactions.',
      hi: 'ऐप खोलें, होम स्क्रीन पर आपका बैलेंस दिखता है। हाल के लेन-देन देखने के लिए "खाता विवरण" पर टैप करें।',
    },
    keywords: {
      en: ['balance', 'check balance', 'see balance', 'how much money', 'account balance'],
      hi: ['बैलेंस', 'शेष', 'पैसा कितना', 'खाते में कितना'],
    },
  },
  {
    id: 'send-money',
    question: {
      en: 'How do I send money to someone?',
      hi: 'मैं किसी को पैसे कैसे भेजूँ?',
    },
    answer: {
      en: 'Go to "Send money", choose a saved payee or add a new one, enter the amount, review the details, and confirm with your PIN.',
      hi: '"पैसे भेजें" पर जाएँ, सेव किए गए प्राप्तकर्ता को चुनें या नया जोड़ें, राशि डालें, विवरण जाँचें और पिन से पुष्टि करें।',
    },
    keywords: {
      en: ['send money', 'transfer', 'pay', 'send', 'payment'],
      hi: ['पैसे भेजें', 'ट्रांसफर', 'भुगतान', 'भेजना'],
    },
  },
  {
    id: 'new-payee-limit',
    question: {
      en: 'Why is there a limit when I pay a new payee?',
      hi: 'नए प्राप्तकर्ता को भुगतान करने पर सीमा क्यों है?',
    },
    answer: {
      en: 'For your safety, payments to a newly added payee are limited to ₹10,000 in the first 24 hours. After that, the full limit applies.',
      hi: 'आपकी सुरक्षा के लिए, नए जोड़े गए प्राप्तकर्ता को पहले 24 घंटे में ₹10,000 तक ही भुगतान हो सकता है। उसके बाद पूरी सीमा लागू होती है।',
    },
    keywords: {
      en: ['new payee', 'limit', 'payee limit', '24 hours', 'first payment', 'new beneficiary'],
      hi: ['नया प्राप्तकर्ता', 'सीमा', 'लिमिट', '24 घंटे', 'नया लाभार्थी'],
    },
  },
  {
    id: 'safety-checks',
    question: {
      en: 'What are the safety checks before a big payment?',
      hi: 'बड़े भुगतान से पहले कौन-सी सुरक्षा जाँच होती है?',
    },
    answer: {
      en: 'For amounts above ₹10,000, the app shows extra warnings and asks you to confirm who you are paying, why, and whether anyone else asked you to make the payment.',
      hi: '₹10,000 से अधिक की राशि पर ऐप अतिरिक्त चेतावनी दिखाता है और पूछता है कि आप किसे, क्यों भुगतान कर रहे हैं, और क्या कोई और आपसे यह भुगतान करवा रहा है।',
    },
    keywords: {
      en: ['safety', 'safety check', 'big payment', 'large amount', 'warning', 'confirm'],
      hi: ['सुरक्षा', 'सुरक्षा जाँच', 'बड़ा भुगतान', 'चेतावनी', 'पुष्टि'],
    },
  },
  {
    id: 'payment-request-scam',
    question: {
      en: 'Someone sent me a payment request. Should I accept it?',
      hi: 'किसी ने मुझे पेमेंट रिक्वेस्ट भेजी है। क्या मैं स्वीकार करूँ?',
    },
    answer: {
      en: 'Be very careful. You never enter your PIN to receive money. If a stranger sent the request, decline it immediately. It is likely a scam.',
      hi: 'बहुत सावधान रहें। पैसा पाने के लिए कभी पिन नहीं डाला जाता। अगर किसी अनजान ने रिक्वेस्ट भेजी है, तो तुरंत अस्वीकार करें। यह धोखा हो सकता है।',
    },
    keywords: {
      en: ['payment request', 'collect request', 'accept request', 'approve request', 'decline'],
      hi: ['पेमेंट रिक्वेस्ट', 'कलेक्ट रिक्वेस्ट', 'स्वीकार', 'अस्वीकार'],
    },
  },
  {
    id: 'scam-awareness',
    question: {
      en: 'How can I protect myself from banking scams?',
      hi: 'मैं बैंकिंग धोखाधड़ी से कैसे बचूँ?',
    },
    answer: {
      en: 'Never share your OTP, PIN, or password with anyone. Do not click unknown links. Do not install screen-sharing apps on a caller\'s request. Report fraud to helpline 1930.',
      hi: 'अपना ओटीपी, पिन या पासवर्ड कभी किसी को न बताएं। अनजान लिंक पर क्लिक न करें। किसी कॉलर के कहने पर स्क्रीन-शेयरिंग ऐप न डालें। धोखाधड़ी की सूचना 1930 पर दें।',
    },
    keywords: {
      en: ['scam', 'fraud', 'protect', 'safety', 'cheating', 'phishing', 'fake'],
      hi: ['धोखाधड़ी', 'फ्रॉड', 'सुरक्षा', 'बचाव', 'ठगी', 'झांसा'],
    },
  },
  {
    id: 'otp-safety',
    question: {
      en: 'Should I share my OTP with bank staff?',
      hi: 'क्या मुझे बैंक कर्मचारी को अपना ओटीपी बताना चाहिए?',
    },
    answer: {
      en: 'No. Bank employees will never ask for your OTP. If someone asks for it, they are not from the bank. Hang up and report to 1930.',
      hi: 'नहीं। बैंक कर्मचारी कभी आपका ओटीपी नहीं माँगते। अगर कोई माँगे तो वो बैंक का नहीं है। फोन काटें और 1930 पर शिकायत करें।',
    },
    keywords: {
      en: ['OTP', 'share OTP', 'one time password', 'bank staff', 'bank employee'],
      hi: ['ओटीपी', 'OTP', 'बैंक कर्मचारी', 'शेयर'],
    },
  },
  {
    id: 'pin-safety',
    question: {
      en: 'When should I enter my PIN?',
      hi: 'मुझे अपना पिन कब डालना चाहिए?',
    },
    answer: {
      en: 'Enter your PIN only when you are sending money or making a payment. You never need a PIN to receive money. Never tell your PIN to anyone.',
      hi: 'पिन तभी डालें जब आप पैसा भेज रहे हों या भुगतान कर रहे हों। पैसा पाने के लिए पिन कभी नहीं चाहिए। अपना पिन कभी किसी को न बताएं।',
    },
    keywords: {
      en: ['PIN', 'enter PIN', 'UPI PIN', 'ATM PIN', 'when PIN'],
      hi: ['पिन', 'PIN', 'यूपीआई पिन', 'एटीएम पिन', 'कब पिन'],
    },
  },
  {
    id: 'blocked-card',
    question: {
      en: 'My debit card is blocked. What should I do?',
      hi: 'मेरा डेबिट कार्ड ब्लॉक हो गया है। मैं क्या करूँ?',
    },
    answer: {
      en: 'Call the helpline number on the back of your card immediately. They will help you get a replacement card. Do not share card details with anyone who calls you.',
      hi: 'अपने कार्ड के पीछे लिखे हेल्पलाइन नंबर पर तुरंत कॉल करें। वे आपको नया कार्ड दिलाने में मदद करेंगे। जो कोई भी आपको कॉल करे उसे कार्ड की जानकारी न दें।',
    },
    keywords: {
      en: ['blocked card', 'card blocked', 'debit card blocked', 'lost card', 'card problem'],
      hi: ['कार्ड ब्लॉक', 'ब्लॉक कार्ड', 'डेबिट कार्ड', 'कार्ड खोया'],
    },
  },
  {
    id: 'view-statement',
    question: {
      en: 'How do I view my bank statement?',
      hi: 'मैं अपना बैंक स्टेटमेंट कैसे देखूँ?',
    },
    answer: {
      en: 'Tap "Statement" on the home screen. You can see all recent transactions with dates, amounts, and whether money was received or spent.',
      hi: 'होम स्क्रीन पर "खाता विवरण" पर टैप करें। आप तारीख, राशि और पैसा आया या गया — सभी हाल के लेन-देन देख सकते हैं।',
    },
    keywords: {
      en: ['statement', 'bank statement', 'transaction history', 'past transactions', 'view statement'],
      hi: ['स्टेटमेंट', 'खाता विवरण', 'लेन-देन', 'पिछले लेन-देन'],
    },
  },
  {
    id: 'minimum-balance',
    question: {
      en: 'What is minimum balance and what happens if I go below it?',
      hi: 'न्यूनतम बैलेंस क्या है और इससे कम होने पर क्या होगा?',
    },
    answer: {
      en: 'Minimum balance is the lowest amount your bank requires you to keep. If your balance falls below ₹1,000, the bank may charge a monthly fee.',
      hi: 'न्यूनतम बैलेंस वह सबसे कम राशि है जो बैंक रखने को कहता है। अगर आपका बैलेंस ₹1,000 से कम हो जाए तो बैंक मासिक शुल्क काट सकता है।',
    },
    keywords: {
      en: ['minimum balance', 'min balance', 'below minimum', 'balance charge', 'penalty'],
      hi: ['न्यूनतम बैलेंस', 'कम बैलेंस', 'शुल्क', 'जुर्माना'],
    },
  },
  {
    id: 'bank-charges',
    question: {
      en: 'What charges does the bank apply?',
      hi: 'बैंक कौन-कौन से शुल्क लगाता है?',
    },
    answer: {
      en: 'Common charges include: SMS alerts (₹25/quarter), cheque book (₹75 for 25 leaves), extra ATM use (₹21/use beyond 5 free), and minimum balance charge (₹500/month).',
      hi: 'आम शुल्क: एसएमएस अलर्ट (₹25/तिमाही), चेक बुक (₹75 - 25 पत्ते), 5 मुफ़्त के बाद एटीएम (₹21/बार), और न्यूनतम शेष शुल्क (₹500/माह)।',
    },
    keywords: {
      en: ['charges', 'fees', 'bank charges', 'deductions', 'bank fees', 'cost'],
      hi: ['शुल्क', 'चार्ज', 'फीस', 'कटौती', 'खर्च'],
    },
  },
  {
    id: 'interest-info',
    question: {
      en: 'How does interest work on my savings account?',
      hi: 'मेरे बचत खाते पर ब्याज कैसे मिलता है?',
    },
    answer: {
      en: 'The bank pays you interest (around 3% per year) on the money in your savings account. Interest is calculated daily and added to your account every quarter.',
      hi: 'बैंक आपके बचत खाते में रखे पैसे पर ब्याज (लगभग 3% सालाना) देता है। ब्याज रोज़ाना हिसाब होता है और हर तिमाही में खाते में जुड़ता है।',
    },
    keywords: {
      en: ['interest', 'savings interest', 'interest rate', 'earn interest', 'how much interest'],
      hi: ['ब्याज', 'ब्याज दर', 'कितना ब्याज', 'ब्याज कैसे'],
    },
  },
  {
    id: 'nominee-info',
    question: {
      en: 'What is a nominee and why should I add one?',
      hi: 'नॉमिनी क्या है और इसे क्यों जोड़ना चाहिए?',
    },
    answer: {
      en: 'A nominee is a trusted person you choose to receive your account money if something happens to you. Adding a nominee ensures your family can access the funds easily.',
      hi: 'नॉमिनी वह भरोसेमंद व्यक्ति है जिसे आपके बाद खाते का पैसा मिलेगा। नॉमिनी जोड़ने से आपका परिवार आसानी से पैसा प्राप्त कर सकता है।',
    },
    keywords: {
      en: ['nominee', 'add nominee', 'beneficiary', 'next of kin', 'family'],
      hi: ['नॉमिनी', 'नामांकित', 'लाभार्थी', 'परिवार'],
    },
  },
  {
    id: 'cheque-book-info',
    question: {
      en: 'How do I request a cheque book?',
      hi: 'मैं चेक बुक कैसे मँगवाऊँ?',
    },
    answer: {
      en: 'You can request a cheque book by visiting your bank branch or through the bank\'s net banking portal. A charge of ₹75 for 25 leaves may apply.',
      hi: 'चेक बुक के लिए अपनी बैंक शाखा जाएं या नेट बैंकिंग से अनुरोध करें। 25 पत्तों की चेक बुक पर ₹75 शुल्क लग सकता है।',
    },
    keywords: {
      en: ['cheque book', 'checkbook', 'request cheque', 'order cheque book'],
      hi: ['चेक बुक', 'चेकबुक', 'चेक बुक मँगवाना'],
    },
  },
  {
    id: 'change-language',
    question: {
      en: 'How do I change the app language?',
      hi: 'मैं ऐप की भाषा कैसे बदलूँ?',
    },
    answer: {
      en: 'Tap the language button (अ/A) at the top of any screen to switch between English and Hindi instantly.',
      hi: 'किसी भी स्क्रीन के ऊपर भाषा बटन (अ/A) पर टैप करें और अंग्रेज़ी व हिंदी के बीच तुरंत बदलें।',
    },
    keywords: {
      en: ['language', 'change language', 'Hindi', 'English', 'switch language'],
      hi: ['भाषा', 'भाषा बदलें', 'हिंदी', 'अंग्रेज़ी'],
    },
  },
  {
    id: 'payment-modes',
    question: {
      en: 'What are the different ways to send money?',
      hi: 'पैसे भेजने के कौन-कौन से तरीके हैं?',
    },
    answer: {
      en: 'You can send money via UPI (instant, free), IMPS (instant, 24/7), or NEFT (processed in batches every half hour during banking hours).',
      hi: 'आप UPI (तुरंत, मुफ़्त), IMPS (तुरंत, 24/7), या NEFT (बैंकिंग समय में आधे-आधे घंटे के बैच में) से पैसे भेज सकते हैं।',
    },
    keywords: {
      en: ['modes', 'payment modes', 'UPI', 'NEFT', 'IMPS', 'ways to pay', 'transfer types'],
      hi: ['तरीके', 'भुगतान तरीके', 'UPI', 'NEFT', 'IMPS', 'भेजने के तरीके'],
    },
  },
  {
    id: 'young-saver',
    question: {
      en: 'What is the young saver account?',
      hi: 'यंग सेवर खाता क्या है?',
    },
    answer: {
      en: 'A young saver account is for children below 18 years, managed under a guardian\'s supervision. It has a default daily spending limit of ₹1,000 that the guardian can change.',
      hi: 'यंग सेवर खाता 18 साल से कम उम्र के बच्चों के लिए है, जो अभिभावक की देखरेख में चलता है। इसमें ₹1,000 की दैनिक खर्च सीमा होती है जिसे अभिभावक बदल सकता है।',
    },
    keywords: {
      en: ['young saver', 'child account', 'minor account', 'kids account', 'children'],
      hi: ['यंग सेवर', 'बच्चों का खाता', 'बाल खाता', 'नाबालिग खाता'],
    },
  },
  {
    id: 'guardian-role',
    question: {
      en: 'What can a guardian do on a young saver account?',
      hi: 'अभिभावक यंग सेवर खाते पर क्या कर सकता है?',
    },
    answer: {
      en: 'A guardian can view the child\'s transactions, set or change the daily spending limit, and approve or block certain payments for the child\'s safety.',
      hi: 'अभिभावक बच्चे के लेन-देन देख सकता है, दैनिक खर्च सीमा तय या बदल सकता है, और बच्चे की सुरक्षा के लिए कुछ भुगतान स्वीकार या रोक सकता है।',
    },
    keywords: {
      en: ['guardian', 'parent', 'guardian controls', 'parental control', 'manage child'],
      hi: ['अभिभावक', 'माता-पिता', 'अभिभावक नियंत्रण', 'बच्चे का प्रबंधन'],
    },
  },
  {
    id: 'lost-phone',
    question: {
      en: 'What should I do if I lose my phone?',
      hi: 'अगर मेरा फोन खो जाए तो क्या करूँ?',
    },
    answer: {
      en: 'Call your bank\'s helpline immediately to block UPI and mobile banking. Also call your mobile operator to block your SIM. Report cyber fraud at 1930 if needed.',
      hi: 'तुरंत बैंक हेल्पलाइन पर कॉल करके UPI और मोबाइल बैंकिंग बंद करवाएँ। मोबाइल ऑपरेटर से SIM भी ब्लॉक करवाएँ। ज़रूरत हो तो 1930 पर साइबर फ्रॉड की शिकायत करें।',
    },
    keywords: {
      en: ['lost phone', 'phone stolen', 'missing phone', 'phone lost', 'stolen mobile'],
      hi: ['फोन खोया', 'फोन चोरी', 'मोबाइल खोया', 'फोन गुम'],
    },
  },
  {
    id: 'what-is-upi',
    question: {
      en: 'What is UPI and how does it work?',
      hi: 'UPI क्या है और यह कैसे काम करता है?',
    },
    answer: {
      en: 'UPI (Unified Payments Interface) lets you send and receive money instantly using a UPI ID or mobile number. It is free, works 24/7, and is linked directly to your bank account.',
      hi: 'UPI (यूनिफाइड पेमेंट्स इंटरफेस) से आप यूपीआई आईडी या मोबाइल नंबर से तुरंत पैसा भेज और पा सकते हैं। यह मुफ़्त है, 24/7 काम करता है और सीधे बैंक खाते से जुड़ा होता है।',
    },
    keywords: {
      en: ['UPI', 'what is UPI', 'how UPI works', 'UPI meaning', 'unified payments'],
      hi: ['UPI', 'यूपीआई', 'UPI क्या है', 'यूपीआई कैसे'],
    },
  },
  {
    id: 'what-is-neft',
    question: {
      en: 'What is NEFT?',
      hi: 'NEFT क्या है?',
    },
    answer: {
      en: 'NEFT (National Electronic Funds Transfer) is a way to send money between bank accounts. Transfers are processed in batches every half hour during banking hours. It is safe and free for most savings accounts.',
      hi: 'NEFT (नेशनल इलेक्ट्रॉनिक फंड्स ट्रांसफर) बैंक खातों के बीच पैसा भेजने का तरीका है। बैंकिंग समय में हर आधे घंटे में बैच में पैसा भेजा जाता है। यह सुरक्षित है और अधिकतर बचत खातों के लिए मुफ़्त है।',
    },
    keywords: {
      en: ['NEFT', 'what is NEFT', 'NEFT transfer', 'national electronic'],
      hi: ['NEFT', 'एनईएफटी', 'NEFT क्या है'],
    },
  },
  {
    id: 'what-is-imps',
    question: {
      en: 'What is IMPS?',
      hi: 'IMPS क्या है?',
    },
    answer: {
      en: 'IMPS (Immediate Payment Service) is an instant money transfer service that works 24/7, even on holidays. Money reaches the other account within seconds.',
      hi: 'IMPS (इमीडिएट पेमेंट सर्विस) तुरंत पैसा भेजने की सेवा है जो 24/7 काम करती है, छुट्टियों में भी। पैसा कुछ सेकंड में दूसरे खाते में पहुँच जाता है।',
    },
    keywords: {
      en: ['IMPS', 'what is IMPS', 'IMPS transfer', 'immediate payment'],
      hi: ['IMPS', 'आईएमपीएस', 'IMPS क्या है', 'तुरंत भुगतान'],
    },
  },
  {
    id: 'debit-card-info',
    question: {
      en: 'What is a debit card used for?',
      hi: 'डेबिट कार्ड किसके लिए इस्तेमाल होता है?',
    },
    answer: {
      en: 'A debit card lets you withdraw cash from ATMs and pay at shops using the card machine (POS). The money is deducted directly from your bank account.',
      hi: 'डेबिट कार्ड से आप ATM से पैसे निकाल सकते हैं और दुकानों पर कार्ड मशीन (POS) से भुगतान कर सकते हैं। पैसा सीधे आपके बैंक खाते से कटता है।',
    },
    keywords: {
      en: ['debit card', 'ATM card', 'bank card', 'card use', 'POS'],
      hi: ['डेबिट कार्ड', 'एटीएम कार्ड', 'बैंक कार्ड', 'कार्ड का उपयोग'],
    },
  },
  {
    id: 'helpline-info',
    question: {
      en: 'What is the helpline number for reporting fraud?',
      hi: 'धोखाधड़ी की शिकायत के लिए हेल्पलाइन नंबर क्या है?',
    },
    answer: {
      en: 'Call 1930 (national cyber fraud helpline) immediately if you suspect fraud. You can also visit cybercrime.gov.in to file an online complaint.',
      hi: 'धोखाधड़ी का संदेह होने पर तुरंत 1930 (राष्ट्रीय साइबर फ्रॉड हेल्पलाइन) पर कॉल करें। आप cybercrime.gov.in पर ऑनलाइन शिकायत भी कर सकते हैं।',
    },
    keywords: {
      en: ['helpline', 'customer care', 'fraud helpline', '1930', 'report fraud', 'support number'],
      hi: ['हेल्पलाइन', 'कस्टमर केयर', 'फ्रॉड हेल्पलाइन', '1930', 'शिकायत'],
    },
  },
  {
    id: 'app-usage',
    question: {
      en: 'I am new to this app. How do I start?',
      hi: 'मैं इस ऐप में नया हूँ। शुरुआत कैसे करूँ?',
    },
    answer: {
      en: 'Start at the home screen where you can see your balance. Use "Send money" to make payments, "Statement" to view history, and "Learn" to understand banking terms and stay safe.',
      hi: 'होम स्क्रीन से शुरू करें जहाँ आपका बैलेंस दिखता है। भुगतान के लिए "पैसे भेजें", इतिहास के लिए "खाता विवरण", और बैंकिंग शब्द व सुरक्षा सीखने के लिए "सीखें" देखें।',
    },
    keywords: {
      en: ['new', 'start', 'how to use', 'beginner', 'first time', 'getting started', 'app usage'],
      hi: ['नया', 'शुरुआत', 'कैसे उपयोग', 'पहली बार', 'नए उपयोगकर्ता'],
    },
  },
  {
    id: 'account-details',
    question: {
      en: 'Where can I see my account details?',
      hi: 'मैं अपने खाते की जानकारी कहाँ देख सकता हूँ?',
    },
    answer: {
      en: 'Your account number, IFSC code, and account type are shown on the home screen. Tap on your profile area for more details.',
      hi: 'आपका खाता नंबर, IFSC कोड, और खाता प्रकार होम स्क्रीन पर दिखता है। अधिक जानकारी के लिए प्रोफ़ाइल क्षेत्र पर टैप करें।',
    },
    keywords: {
      en: ['account details', 'account number', 'IFSC', 'account info', 'my account', 'profile'],
      hi: ['खाता जानकारी', 'खाता नंबर', 'IFSC', 'खाता विवरण', 'प्रोफ़ाइल'],
    },
  },
];

/**
 * Search FAQ entries by query text in a given language.
 * Returns results sorted by relevance (keyword match count).
 * @param {string} query - The search query text
 * @param {string} lang - Language code ('en' or 'hi')
 * @returns {Array} Sorted array of matching FAQ entries with a `score` property
 */
export function searchFaq(query, lang = 'en') {
  if (!query || typeof query !== 'string') return [];

  const normalizedLang = lang === 'hi' ? 'hi' : 'en';
  const queryLower = query.toLowerCase().trim();

  if (!queryLower) return [];

  const scored = [];

  for (const entry of faq) {
    let score = 0;
    const keywords = entry.keywords?.[normalizedLang] || [];

    // Check keyword matches
    for (const keyword of keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        score += 3;
      } else if (keyword.toLowerCase().includes(queryLower)) {
        score += 2;
      }
    }

    // Check question text match
    const question = (entry.question?.[normalizedLang] || '').toLowerCase();
    if (question.includes(queryLower)) {
      score += 2;
    }

    // Check individual query words against keywords
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 1);
    for (const word of queryWords) {
      for (const keyword of keywords) {
        if (keyword.toLowerCase().includes(word)) {
          score += 1;
        }
      }
    }

    if (score > 0) {
      scored.push({ ...entry, score });
    }
  }

  // Sort by score descending, then by original order
  scored.sort((a, b) => b.score - a.score);

  // Remove the score property from results
  return scored.map(({ score, ...rest }) => rest);
}

export default faq;
