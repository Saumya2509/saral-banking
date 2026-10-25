// Saral Banking — Frequently asked questions (bilingual)
// Dev 3 owns this file; used by LearnScreen and Chatbot for FAQ lookup

const faq = [
  {
    id: 'check-balance',
    question: {
      en: 'How do I check my account balance?',
      hi: 'मैं अपना खाता बैलेंस कैसे देखूँ?',
      ta: 'என் கணக்கு இருப்புத் தொகையை எப்படிப் பார்ப்பது?',
    },
    answer: {
      en: 'Open the app and your balance is shown on the home screen. You can also tap "Statement" to see recent transactions.',
      hi: 'ऐप खोलें, होम स्क्रीन पर आपका बैलेंस दिखता है। हाल के लेन-देन देखने के लिए "खाता विवरण" पर टैप करें।',
      ta: 'ஆப்பைத் திறந்ததும் முகப்புத் திரையிலேயே உங்கள் இருப்புத் தொகை தெரியும். சமீபத்திய பரிவர்த்தனைகளைப் பார்க்க "கணக்கு அறிக்கை" என்பதைத் தொடவும்.',
    },
    keywords: {
      en: ['balance', 'check balance', 'see balance', 'how much money', 'account balance'],
      hi: ['बैलेंस', 'शेष', 'पैसा कितना', 'खाते में कितना'],
      ta: ["இருப்பு","இருப்புத் தொகை","பணம் எவ்வளவு","மீதி","பேலன்ஸ்","iruppu","meethi","balance","kaasu","check balance"],
    },
  },
  {
    id: 'send-money',
    question: {
      en: 'How do I send money to someone?',
      hi: 'मैं किसी को पैसे कैसे भेजूँ?',
      ta: 'வேறொருவருக்கு பணம் எப்படி அனுப்புவது?',
    },
    answer: {
      en: 'Go to "Send money", choose a saved payee or add a new one, enter the amount, review the details, and confirm with your PIN.',
      hi: '"पैसे भेजें" पर जाएँ, सेव किए गए प्राप्तकर्ता को चुनें या नया जोड़ें, राशि डालें, विवरण जाँचें और पिन से पुष्टि करें।',
      ta: '"பணம் அனுப்பு" என்பதற்குச் செல்லவும். முன்பே சேர்த்த நபரைத் தேர்வு செய்யவும் அல்லது புதிய நபரைச் சேர்க்கவும். தொகையை உள்ளிட்டு, விவரங்களைச் சரிபார்த்து, உங்கள் ரகசிய எண் (PIN) மூலம் உறுதிப்படுத்தவும்.',
    },
    keywords: {
      en: ['send money', 'transfer', 'pay', 'send', 'payment'],
      hi: ['पैसे भेजें', 'ट्रांसफर', 'भुगतान', 'भेजना'],
      ta: ["பணம் அனுப்பு","பரிமாற்றம்","பணம் செலுத்த","அனுப்புதல்","panam anuppu","send money","transfer","pay","anuppuvadhu"],
    },
  },
  {
    id: 'new-payee-limit',
    question: {
      en: 'Why is there a limit when I pay a new payee?',
      hi: 'नए प्राप्तकर्ता को भुगतान करने पर सीमा क्यों है?',
      ta: 'புதிய நபருக்கு பணம் அனுப்பும்போது ஏன் வரம்பு உள்ளது?',
    },
    answer: {
      en: 'For your safety, payments to a newly added payee are limited to ₹10,000 in the first 24 hours. After that, the full limit applies.',
      hi: 'आपकी सुरक्षा के लिए, नए जोड़े गए प्राप्तकर्ता को पहले 24 घंटे में ₹10,000 तक ही भुगतान हो सकता है। उसके बाद पूरी सीमा लागू होती है।',
      ta: 'உங்கள் பாதுகாப்பிற்காக, புதிதாகச் சேர்க்கப்பட்ட நபருக்கு முதல் 24 மணி நேரத்தில் ₹10,000 வரை மட்டுமே அனுப்ப முடியும். அதன் பிறகு முழு வரம்பும் பொருந்தும்.',
    },
    keywords: {
      en: ['new payee', 'limit', 'payee limit', '24 hours', 'first payment', 'new beneficiary'],
      hi: ['नया प्राप्तकर्ता', 'सीमा', 'लिमिट', '24 घंटे', 'नया लाभार्थी'],
      ta: ["புதிய நபர்","வரம்பு","24 மணி நேரம்","புதிய பயனாளி","new payee","limit","24 hours","varambu"],
    },
  },
  {
    id: 'safety-checks',
    question: {
      en: 'What are the safety checks before a big payment?',
      hi: 'बड़े भुगतान से पहले कौन-सी सुरक्षा जाँच होती है?',
      ta: 'பெரிய தொகை அனுப்பும் முன் என்ன பாதுகாப்பு சோதனைகள் நடக்கும்?',
    },
    answer: {
      en: 'For amounts above ₹10,000, the app shows extra warnings and asks you to confirm who you are paying, why, and whether anyone else asked you to make the payment.',
      hi: '₹10,000 से अधिक की राशि पर ऐप अतिरिक्त चेतावनी दिखाता है और पूछता है कि आप किसे, क्यों भुगतान कर रहे हैं, और क्या कोई और आपसे यह भुगतान करवा रहा है।',
      ta: '₹10,000-க்கு மேற்பட்ட தொகைக்கு, ஆப் கூடுதல் எச்சரிக்கைகளைக் காட்டும். நீங்கள் யாருக்கு, ஏன் பணம் அனுப்புகிறீர்கள் என்றும், யாராவது வற்புறுத்தி அனுப்பச் சொல்கிறார்களா என்றும் உறுதி செய்யக் கேட்கும்.',
    },
    keywords: {
      en: ['safety', 'safety check', 'big payment', 'large amount', 'warning', 'confirm'],
      hi: ['सुरक्षा', 'सुरक्षा जाँच', 'बड़ा भुगतान', 'चेतावनी', 'पुष्टि'],
      ta: ["பாதுகாப்பு","எச்சரிக்கை","பெரிய தொகை","உறுதிப்படுத்தல்","safety","big payment","warning","paadhukaappu"],
    },
  },
  {
    id: 'payment-request-scam',
    question: {
      en: 'Someone sent me a payment request. Should I accept it?',
      hi: 'किसी ने मुझे पेमेंट रिक्वेस्ट भेजी है। क्या मैं स्वीकार करूँ?',
      ta: 'யாரோ எனக்கு பணக் கோரிக்கை (Payment Request) அனுப்பியுள்ளனர். அதை ஏற்கலாமா?',
    },
    answer: {
      en: 'Be very careful. You never enter your PIN to receive money. If a stranger sent the request, decline it immediately. It is likely a scam.',
      hi: 'बहुत सावधान रहें। पैसा पाने के लिए कभी पिन नहीं डाला जाता। अगर किसी अनजान ने रिक्वेस्ट भेजी है, तो तुरंत अस्वीकार करें। यह धोखा हो सकता है।',
      ta: 'மிகவும் கவனமாக இருங்கள். பணம் பெறுவதற்கு நீங்கள் ஒருபோதும் ரகசிய எண்ணை (PIN) உள்ளிடத் தேவையில்லை. தெரியாத நபர் கோரிக்கை அனுப்பியிருந்தால் உடனே நிராகரிக்கவும் (Decline). இது மோசடியாக இருக்கலாம்.',
    },
    keywords: {
      en: ['payment request', 'collect request', 'accept request', 'approve request', 'decline'],
      hi: ['पेमेंट रिक्वेस्ट', 'कलेक्ट रिक्वेस्ट', 'स्वीकार', 'अस्वीकार'],
      ta: ["பணக் கோரிக்கை","ரிக்வெஸ்ட்","நிராகரி","மோசடி","collect request","payment request","decline","scam"],
    },
  },
  {
    id: 'scam-awareness',
    question: {
      en: 'How can I protect myself from banking scams?',
      hi: 'मैं बैंकिंग धोखाधड़ी से कैसे बचूँ?',
      ta: 'வங்கி மோசடிகளிலிருந்து என்னை எப்படிப் பாதுகாத்துக் கொள்வது?',
    },
    answer: {
      en: 'Never share your OTP, PIN, or password with anyone. Do not click unknown links. Do not install screen-sharing apps on a caller\'s request. Report fraud to helpline 1930.',
      hi: 'अपना ओटीपी, पिन या पासवर्ड कभी किसी को न बताएं। अनजान लिंक पर क्लिक न करें। किसी कॉलर के कहने पर स्क्रीन-शेयरिंग ऐप न डालें। धोखाधड़ी की सूचना 1930 पर दें।',
      ta: 'உங்கள் ஒருமுறை எண் (OTP), ரகசிய எண் (PIN), கடவுச்சொல் அல்லது அட்டை விவரங்களை யாரிடமும் பகிராதீர்கள். வங்கி ஒருபோதும் இவற்றை தொலைபேசியில் கேட்காது. தெரியாத இணைப்புகளைத் தொடாதீர்கள்.',
    },
    keywords: {
      en: ['scam', 'fraud', 'protect', 'safety', 'cheating', 'phishing', 'fake'],
      hi: ['धोखाधड़ी', 'फ्रॉड', 'सुरक्षा', 'बचाव', 'ठगी', 'झांसा'],
      ta: ["மோசடி","பாதுகாப்பு","தற்காப்பு","ஏமாற்று","scam","fraud","mosadi","safety"],
    },
  },
  {
    id: 'otp-safety',
    question: {
      en: 'Should I share my OTP with bank staff?',
      hi: 'क्या मुझे बैंक कर्मचारी को अपना ओटीपी बताना चाहिए?',
      ta: 'ஒருமுறை எண் (OTP) என்றால் என்ன, அதை யாரிடமாவது சொல்லலாமா?',
    },
    answer: {
      en: 'No. Bank employees will never ask for your OTP. If someone asks for it, they are not from the bank. Hang up and report to 1930.',
      hi: 'नहीं। बैंक कर्मचारी कभी आपका ओटीपी नहीं माँगते। अगर कोई माँगे तो वो बैंक का नहीं है। फोन काटें और 1930 पर शिकायत करें।',
      ta: 'ஒருமுறை எண் (OTP) என்பது பரிவர்த்தனையை உறுதிசெய்ய உங்கள் மொபைலுக்கு வரும் ரகசிய எண். வங்கி மேலாளர் அல்லது காவல் துறையினர் கேட்டாலும் இதை ஒருபோதும் யாரிடமும் சொல்லாதீர்கள்.',
    },
    keywords: {
      en: ['OTP', 'share OTP', 'one time password', 'bank staff', 'bank employee'],
      hi: ['ओटीपी', 'OTP', 'बैंक कर्मचारी', 'शेयर'],
      ta: ["ஒருமுறை எண்","ஓடிபி","OTP","ரகசியம்","otp safety","orumurai en"],
    },
  },
  {
    id: 'pin-safety',
    question: {
      en: 'When should I enter my PIN?',
      hi: 'मुझे अपना पिन कब डालना चाहिए?',
      ta: 'என் யுபிஐ (UPI) அல்லது ஏடிஎம் பின்னை யாரிடமாவது சொல்லலாமா?',
    },
    answer: {
      en: 'Enter your PIN only when you are sending money or making a payment. You never need a PIN to receive money. Never tell your PIN to anyone.',
      hi: 'पिन तभी डालें जब आप पैसा भेज रहे हों या भुगतान कर रहे हों। पैसा पाने के लिए पिन कभी नहीं चाहिए। अपना पिन कभी किसी को न बताएं।',
      ta: 'இல்லை, உங்கள் ரகசிய எண்ணை (PIN) நீங்கள் மட்டுமே நினைவில் வைத்திருக்க வேண்டும். எங்கும் எழுதி வைக்காதீர்கள், யாரிடமும் பகிராதீர்கள். பணம் அனுப்பும்போது மட்டுமே பின் தேவைப்படும்.',
    },
    keywords: {
      en: ['PIN', 'enter PIN', 'UPI PIN', 'ATM PIN', 'when PIN'],
      hi: ['पिन', 'PIN', 'यूपीआई पिन', 'एटीएम पिन', 'कब पिन'],
      ta: ["ரகசிய எண்","பின்","PIN","பாதுகாப்பு","pin safety","rakasiya en"],
    },
  },
  {
    id: 'blocked-card',
    question: {
      en: 'My debit card is blocked. What should I do?',
      hi: 'मेरा डेबिट कार्ड ब्लॉक हो गया है। मैं क्या करूँ?',
      ta: 'என் ஏடிஎம் அட்டை தொலைந்துவிட்டால் அல்லது முடக்கப்பட்டால் என்ன செய்வது?',
    },
    answer: {
      en: 'Call the helpline number on the back of your card immediately. They will help you get a replacement card. Do not share card details with anyone who calls you.',
      hi: 'अपने कार्ड के पीछे लिखे हेल्पलाइन नंबर पर तुरंत कॉल करें। वे आपको नया कार्ड दिलाने में मदद करेंगे। जो कोई भी आपको कॉल करे उसे कार्ड की जानकारी न दें।',
      ta: 'ஆப்பில் உள்ள "கார்டுகள்" பகுதிக்குச் சென்று உடனே அட்டையை முடக்கவும் (Block Card). அல்லது வங்கியின் கட்டணமில்லா உதவி எண் 1800-111-222-ஐ உடனே அழையுங்கள்.',
    },
    keywords: {
      en: ['blocked card', 'card blocked', 'debit card blocked', 'lost card', 'card problem'],
      hi: ['कार्ड ब्लॉक', 'ब्लॉक कार्ड', 'डेबिट कार्ड', 'कार्ड खोया'],
      ta: ["அட்டை முடக்கம்","அட்டை தொலைந்தது","கார்டு பிளாக்","lost card","blocked card","card tholainthuvittathu"],
    },
  },
  {
    id: 'view-statement',
    question: {
      en: 'How do I view my bank statement?',
      hi: 'मैं अपना बैंक स्टेटमेंट कैसे देखूँ?',
      ta: 'என் முந்தைய பணப் பரிவர்த்தனைகளை எப்படிப் பார்ப்பது?',
    },
    answer: {
      en: 'Tap "Statement" on the home screen. You can see all recent transactions with dates, amounts, and whether money was received or spent.',
      hi: 'होम स्क्रीन पर "खाता विवरण" पर टैप करें। आप तारीख, राशि और पैसा आया या गया — सभी हाल के लेन-देन देख सकते हैं।',
      ta: 'முகப்புத் திரையில் உள்ள "கணக்கு அறிக்கை" (Statement) என்பதைத் தொடவும். அங்கே தேதி வாரியாக வந்த மற்றும் போன பணம் தெளிவாகப் பட்டியலிடப்பட்டிருக்கும்.',
    },
    keywords: {
      en: ['statement', 'bank statement', 'transaction history', 'past transactions', 'view statement'],
      hi: ['स्टेटमेंट', 'खाता विवरण', 'लेन-देन', 'पिछले लेन-देन'],
      ta: ["கணக்கு அறிக்கை","பரிவர்த்தனை வரலாறு","ஸ்டேட்மென்ட்","statement","history","kanakku arikkai"],
    },
  },
  {
    id: 'minimum-balance',
    question: {
      en: 'What is minimum balance and what happens if I go below it?',
      hi: 'न्यूनतम बैलेंस क्या है और इससे कम होने पर क्या होगा?',
      ta: 'குறைந்தபட்ச இருப்பு என்றால் என்ன, அதற்குக் கட்டணம் உண்டா?',
    },
    answer: {
      en: 'Minimum balance is the lowest amount your bank requires you to keep. If your balance falls below ₹1,000, the bank may charge a monthly fee.',
      hi: 'न्यूनतम बैलेंस वह सबसे कम राशि है जो बैंक रखने को कहता है। अगर आपका बैलेंस ₹1,000 से कम हो जाए तो बैंक मासिक शुल्क काट सकता है।',
      ta: 'உங்கள் கணக்கில் எப்போதும் இருக்க வேண்டிய குறைந்தபட்சத் தொகை ₹1,000 ஆகும். இதற்குக் குறைவாக இருப்பு இருந்தால் மாதந்தோறும் சிறு அபராதக் கட்டணம் பிடிக்கப்படலாம்.',
    },
    keywords: {
      en: ['minimum balance', 'min balance', 'below minimum', 'balance charge', 'penalty'],
      hi: ['न्यूनतम बैलेंस', 'कम बैलेंस', 'शुल्क', 'जुर्माना'],
      ta: ["குறைந்தபட்ச இருப்பு","கட்டணம்","குறைந்த பணம்","minimum balance","min bal","kurainthapatsa iruppu"],
    },
  },
  {
    id: 'bank-charges',
    question: {
      en: 'What charges does the bank apply?',
      hi: 'बैंक कौन-कौन से शुल्क लगाता है?',
      ta: 'வங்கி என் கணக்கிலிருந்து என்னென்ன கட்டணங்களை எடுக்கும்?',
    },
    answer: {
      en: 'Common charges include: SMS alerts (₹25/quarter), cheque book (₹75 for 25 leaves), extra ATM use (₹21/use beyond 5 free), and minimum balance charge (₹500/month).',
      hi: 'आम शुल्क: एसएमएस अलर्ट (₹25/तिमाही), चेक बुक (₹75 - 25 पत्ते), 5 मुफ़्त के बाद एटीएम (₹21/बार), और न्यूनतम शेष शुल्क (₹500/माह)।',
      ta: 'குறுஞ்செய்தி (SMS) சேவை, 5 முறைக்கு மேல் ஏடிஎம் பயன்பாடு, காசோலை புத்தகம் மற்றும் குறைந்தபட்ச இருப்பு இல்லாதபோது வங்கி முறையான கட்டணங்களை எடுக்கும்.',
    },
    keywords: {
      en: ['charges', 'fees', 'bank charges', 'deductions', 'bank fees', 'cost'],
      hi: ['शुल्क', 'चार्ज', 'फीस', 'कटौती', 'खर्च'],
      ta: ["வங்கி கட்டணம்","சேவைக் கட்டணம்","கட்டணங்கள்","bank charges","fees","kattanam"],
    },
  },
  {
    id: 'interest-info',
    question: {
      en: 'How does interest work on my savings account?',
      hi: 'मेरे बचत खाते पर ब्याज कैसे मिलता है?',
      ta: 'என் சேமிப்புக் கணக்கிற்கு வட்டி எப்படிக் கிடைக்கிறது?',
    },
    answer: {
      en: 'The bank pays you interest (around 3% per year) on the money in your savings account. Interest is calculated daily and added to your account every quarter.',
      hi: 'बैंक आपके बचत खाते में रखे पैसे पर ब्याज (लगभग 3% सालाना) देता है। ब्याज रोज़ाना हिसाब होता है और हर तिमाही में खाते में जुड़ता है।',
      ta: 'உங்கள் கணக்கில் உள்ள இருப்புத் தொகைக்கு ஆண்டுக்கு 3.0% வட்டி கணக்கிடப்பட்டு ஒவ்வொரு காலாண்டிலும் உங்கள் கணக்கில் வரவு வைக்கப்படும்.',
    },
    keywords: {
      en: ['interest', 'savings interest', 'interest rate', 'earn interest', 'how much interest'],
      hi: ['ब्याज', 'ब्याज दर', 'कितना ब्याज', 'ब्याज कैसे'],
      ta: ["வட்டி","வட்டி விகிதம்","சேமிப்பு வட்டி","interest","vatti"],
    },
  },
  {
    id: 'nominee-info',
    question: {
      en: 'What is a nominee and why should I add one?',
      hi: 'नॉमिनी क्या है और इसे क्यों जोड़ना चाहिए?',
      ta: 'வாரிசுதாரர் (Nominee) சேர்ப்பது எப்படி?',
    },
    answer: {
      en: 'A nominee is a trusted person you choose to receive your account money if something happens to you. Adding a nominee ensures your family can access the funds easily.',
      hi: 'नॉमिनी वह भरोसेमंद व्यक्ति है जिसे आपके बाद खाते का पैसा मिलेगा। नॉमिनी जोड़ने से आपका परिवार आसानी से पैसा प्राप्त कर सकता है।',
      ta: 'சுயவிவரம் (Profile) பகுதிக்குச் சென்று உங்கள் வாரிசுதாரர் விவரங்களைப் பார்க்கலாம் அல்லது மாற்றலாம். உங்களுக்குப் பிறகு உங்கள் பணம் பாதுகாப்பாக உங்கள் குடும்பத்திற்குச் சேர இது முக்கியம்.',
    },
    keywords: {
      en: ['nominee', 'add nominee', 'beneficiary', 'next of kin', 'family'],
      hi: ['नॉमिनी', 'नामांकित', 'लाभार्थी', 'परिवार'],
      ta: ["வாரிசுதாரர்","நாமினி","nominee","varisudhaarar"],
    },
  },
  {
    id: 'cheque-book-info',
    question: {
      en: 'How do I request a cheque book?',
      hi: 'मैं चेक बुक कैसे मँगवाऊँ?',
      ta: 'புதிய காசோலை புத்தகம் (Cheque Book) பெறுவது எப்படி?',
    },
    answer: {
      en: 'You can request a cheque book by visiting your bank branch or through the bank\'s net banking portal. A charge of ₹75 for 25 leaves may apply.',
      hi: 'चेक बुक के लिए अपनी बैंक शाखा जाएं या नेट बैंकिंग से अनुरोध करें। 25 पत्तों की चेक बुक पर ₹75 शुल्क लग सकता है।',
      ta: '"சேவைகள்" (Services) பகுதிக்குச் சென்று புதிய காசோலை புத்தகத்திற்கு விண்ணப்பிக்கலாம். அது உங்கள் பதிவு செய்யப்பட்ட முகவரிக்குத் தபாலில் அனுப்பப்படும்.',
    },
    keywords: {
      en: ['cheque book', 'checkbook', 'request cheque', 'order cheque book'],
      hi: ['चेक बुक', 'चेकबुक', 'चेक बुक मँगवाना'],
      ta: ["காசோலை","காசோலை புத்தகம்","செக் புக்","cheque book","kasolai"],
    },
  },
  {
    id: 'change-language',
    question: {
      en: 'How do I change the app language?',
      hi: 'मैं ऐप की भाषा कैसे बदलूँ?',
      ta: 'ஆப்பின் மொழியை எப்படி மாற்றுவது?',
    },
    answer: {
      en: 'Tap the language button (अ/A) at the top of any screen to switch between English and Hindi instantly.',
      hi: 'किसी भी स्क्रीन के ऊपर भाषा बटन (अ/A) पर टैप करें और अंग्रेज़ी व हिंदी के बीच तुरंत बदलें।',
      ta: '"அமைப்புகள்" (Settings) பகுதிக்குச் சென்று ஆங்கிலம் (English), இந்தி (हिन्दी) அல்லது தமிழ் (தமிழ்) மொழிகளில் உங்களுக்கு விருப்பமானதைத் தேர்ந்தெடுக்கலாம்.',
    },
    keywords: {
      en: ['language', 'change language', 'Hindi', 'English', 'switch language'],
      hi: ['भाषा', 'भाषा बदलें', 'हिंदी', 'अंग्रेज़ी'],
      ta: ["மொழி மாற்றம்","தமிழ்","மொழி","language","change language","mozhi maatram"],
    },
  },
  {
    id: 'payment-modes',
    question: {
      en: 'What are the different ways to send money?',
      hi: 'पैसे भेजने के कौन-कौन से तरीके हैं?',
      ta: 'யுபிஐ, நெப்ட் மற்றும் ஐஎம்பிஎஸ் இடையே உள்ள வித்தியாசம் என்ன?',
    },
    answer: {
      en: 'You can send money via UPI (instant, free), IMPS (instant, 24/7), or NEFT (processed in batches every half hour during banking hours).',
      hi: 'आप UPI (तुरंत, मुफ़्त), IMPS (तुरंत, 24/7), या NEFT (बैंकिंग समय में आधे-आधे घंटे के बैच में) से पैसे भेज सकते हैं।',
      ta: 'யுபிஐ மற்றும் ஐஎம்பிஎஸ் மூலம் உடனே எந்த நேரத்திலும் பணம் அனுப்பலாம். நெப்ட் (NEFT) மூலம் பெரிய தொகைகளை அனுப்பலாம், இது தொகுதி வாரியாகச் சில மணி நேரத்தில் சேரும்.',
    },
    keywords: {
      en: ['modes', 'payment modes', 'UPI', 'NEFT', 'IMPS', 'ways to pay', 'transfer types'],
      hi: ['तरीके', 'भुगतान तरीके', 'UPI', 'NEFT', 'IMPS', 'भेजने के तरीके'],
      ta: ["யுபிஐ","நெப்ட்","ஐஎம்பிஎஸ்","பணப் பரிமாற்ற முறைகள்","upi","neft","imps","payment modes"],
    },
  },
  {
    id: 'young-saver',
    question: {
      en: 'What is the young saver account?',
      hi: 'यंग सेवर खाता क्या है?',
      ta: 'இளைய சேமிப்பாளர் (Young Saver) பயன்முறை என்றால் என்ன?',
    },
    answer: {
      en: 'A young saver account is for children below 18 years, managed under a guardian\'s supervision. It has a default daily spending limit of ₹1,000 that the guardian can change.',
      hi: 'यंग सेवर खाता 18 साल से कम उम्र के बच्चों के लिए है, जो अभिभावक की देखरेख में चलता है। इसमें ₹1,000 की दैनिक खर्च सीमा होती है जिसे अभिभावक बदल सकता है।',
      ta: 'குழந்தைகள் பணத்தைச் சேமிக்கவும் கையாளவும் கற்றுக்கொள்ளும் சிறப்பு முறை. இதில் தினசரி செலவு வரம்பு இருக்கும் மற்றும் பெற்றோர் அனுமதியுடன் செயல்படும்.',
    },
    keywords: {
      en: ['young saver', 'child account', 'minor account', 'kids account', 'children'],
      hi: ['यंग सेवर', 'बच्चों का खाता', 'बाल खाता', 'नाबालिग खाता'],
      ta: ["இளைய சேமிப்பாளர்","குழந்தைகள் கணக்கு","young saver","minor account"],
    },
  },
  {
    id: 'guardian-role',
    question: {
      en: 'What can a guardian do on a young saver account?',
      hi: 'अभिभावक यंग सेवर खाते पर क्या कर सकता है?',
      ta: 'பெற்றோர் அல்லது பாதுகாவலர் என்னென்ன செய்ய முடியும்?',
    },
    answer: {
      en: 'A guardian can view the child\'s transactions, set or change the daily spending limit, and approve or block certain payments for the child\'s safety.',
      hi: 'अभिभावक बच्चे के लेन-देन देख सकता है, दैनिक खर्च सीमा तय या बदल सकता है, और बच्चे की सुरक्षा के लिए कुछ भुगतान स्वीकार या रोक सकता है।',
      ta: 'பாதுகாவலர் தினசரி செலவு வரம்பை அமைக்கலாம், பரிவர்த்தனைகளைக் கண்காணிக்கலாம் மற்றும் பாதுகாப்பிற்கு வழிகாட்டலாம்.',
    },
    keywords: {
      en: ['guardian', 'parent', 'guardian controls', 'parental control', 'manage child'],
      hi: ['अभिभावक', 'माता-पिता', 'अभिभावक नियंत्रण', 'बच्चे का प्रबंधन'],
      ta: ["பாதுகாவலர்","பெற்றோர்","வரம்பு அமைத்தல்","guardian","parent"],
    },
  },
  {
    id: 'lost-phone',
    question: {
      en: 'What should I do if I lose my phone?',
      hi: 'अगर मेरा फोन खो जाए तो क्या करूँ?',
      ta: 'என் மொபைல் போன் தொலைந்துவிட்டால் என்ன செய்வது?',
    },
    answer: {
      en: 'Call your bank\'s helpline immediately to block UPI and mobile banking. Also call your mobile operator to block your SIM. Report cyber fraud at 1930 if needed.',
      hi: 'तुरंत बैंक हेल्पलाइन पर कॉल करके UPI और मोबाइल बैंकिंग बंद करवाएँ। मोबाइल ऑपरेटर से SIM भी ब्लॉक करवाएँ। ज़रूरत हो तो 1930 पर साइबर फ्रॉड की शिकायत करें।',
      ta: 'உடனே வங்கியின் உதவி எண் 1800-111-222-ஐ அழைத்து உங்கள் மொபைல் வங்கிச் சேவையை முடக்கச் சொல்லுங்கள். பின்னர் உங்கள் சிம் கார்டையும் முடக்கவும்.',
    },
    keywords: {
      en: ['lost phone', 'phone stolen', 'missing phone', 'phone lost', 'stolen mobile'],
      hi: ['फोन खोया', 'फोन चोरी', 'मोबाइल खोया', 'फोन गुम'],
      ta: ["போன் தொலைந்தது","மொபைல் தொலைந்தது","lost phone","sim block","phone tholainthuvittathu"],
    },
  },
  {
    id: 'what-is-upi',
    question: {
      en: 'What is UPI and how does it work?',
      hi: 'UPI क्या है और यह कैसे काम करता है?',
      ta: 'யுபிஐ (UPI) என்றால் என்ன?',
    },
    answer: {
      en: 'UPI (Unified Payments Interface) lets you send and receive money instantly using a UPI ID or mobile number. It is free, works 24/7, and is linked directly to your bank account.',
      hi: 'UPI (यूनिफाइड पेमेंट्स इंटरफेस) से आप यूपीआई आईडी या मोबाइल नंबर से तुरंत पैसा भेज और पा सकते हैं। यह मुफ़्त है, 24/7 काम करता है और सीधे बैंक खाते से जुड़ा होता है।',
      ta: 'யுபிஐ என்பது வங்கி கணக்கு எண் மற்றும் ஐஎஃப்எஸ்சி இல்லாமலேயே, மொபைல் எண் அல்லது யுபிஐ ஐடி மூலம் உடனடியாகப் பணம் அனுப்பும் இந்திய அரசின் எளிய முறை.',
    },
    keywords: {
      en: ['UPI', 'what is UPI', 'how UPI works', 'UPI meaning', 'unified payments'],
      hi: ['UPI', 'यूपीआई', 'UPI क्या है', 'यूपीआई कैसे'],
      ta: ["யுபிஐ என்றால் என்ன","UPI","what is upi"],
    },
  },
  {
    id: 'what-is-neft',
    question: {
      en: 'What is NEFT?',
      hi: 'NEFT क्या है?',
      ta: 'நெப்ட் (NEFT) என்றால் என்ன?',
    },
    answer: {
      en: 'NEFT (National Electronic Funds Transfer) is a way to send money between bank accounts. Transfers are processed in batches every half hour during banking hours. It is safe and free for most savings accounts.',
      hi: 'NEFT (नेशनल इलेक्ट्रॉनिक फंड्स ट्रांसफर) बैंक खातों के बीच पैसा भेजने का तरीका है। बैंकिंग समय में हर आधे घंटे में बैच में पैसा भेजा जाता है। यह सुरक्षित है और अधिकतर बचत खातों के लिए मुफ़्त है।',
      ta: 'நெப்ட் என்பது ஒரு வங்கிக் கணக்கிலிருந்து வேறொரு வங்கிக்கு பாதுகாப்பாகப் பணம் மாற்றும் தேசிய முறை. இது வேலை நேரங்களில் தொகுதி வாரியாக நடக்கும்.',
    },
    keywords: {
      en: ['NEFT', 'what is NEFT', 'NEFT transfer', 'national electronic'],
      hi: ['NEFT', 'एनईएफटी', 'NEFT क्या है'],
      ta: ["நெப்ட் என்றால் என்ன","NEFT","what is neft"],
    },
  },
  {
    id: 'what-is-imps',
    question: {
      en: 'What is IMPS?',
      hi: 'IMPS क्या है?',
      ta: 'ஐஎம்பிஎஸ் (IMPS) என்றால் என்ன?',
    },
    answer: {
      en: 'IMPS (Immediate Payment Service) is an instant money transfer service that works 24/7, even on holidays. Money reaches the other account within seconds.',
      hi: 'IMPS (इमीडिएट पेमेंट सर्विस) तुरंत पैसा भेजने की सेवा है जो 24/7 काम करती है, छुट्टियों में भी। पैसा कुछ सेकंड में दूसरे खाते में पहुँच जाता है।',
      ta: 'ஐஎம்பிஎஸ் என்பது விடுமுறை நாட்களிலும் 24 மணி நேரமும் உடனே மற்றொரு வங்கிக் கணக்கிற்குப் பணம் அனுப்பும் உடனடிப் பணப் பரிமாற்ற சேவை.',
    },
    keywords: {
      en: ['IMPS', 'what is IMPS', 'IMPS transfer', 'immediate payment'],
      hi: ['IMPS', 'आईएमपीएस', 'IMPS क्या है', 'तुरंत भुगतान'],
      ta: ["ஐஎம்பிஎஸ் என்றால் என்ன","IMPS","what is imps"],
    },
  },
  {
    id: 'debit-card-info',
    question: {
      en: 'What is a debit card used for?',
      hi: 'डेबिट कार्ड किसके लिए इस्तेमाल होता है?',
      ta: 'டெபிட் கார்டு (Debit Card) பற்றிய முக்கிய தகவல்கள் என்ன?',
    },
    answer: {
      en: 'A debit card lets you withdraw cash from ATMs and pay at shops using the card machine (POS). The money is deducted directly from your bank account.',
      hi: 'डेबिट कार्ड से आप ATM से पैसे निकाल सकते हैं और दुकानों पर कार्ड मशीन (POS) से भुगतान कर सकते हैं। पैसा सीधे आपके बैंक खाते से कटता है।',
      ta: 'இது உங்கள் கணக்கில் உள்ள பணத்தை ஏடிஎம்மில் எடுக்கவும் கடைகளில் செலுத்தவும் உதவும். கார்டின் பின்புறம் உள்ள சிவிவி மற்றும் உங்கள் ரகசிய பின்னை எப்போதும் பாதுகாக்க வேண்டும்.',
    },
    keywords: {
      en: ['debit card', 'ATM card', 'bank card', 'card use', 'POS'],
      hi: ['डेबिट कार्ड', 'एटीएम कार्ड', 'बैंक कार्ड', 'कार्ड का उपयोग'],
      ta: ["டெபிட் கார்டு","ஏடிஎம் அட்டை","கார்டு பாதுகாப்பு","debit card"],
    },
  },
  {
    id: 'helpline-info',
    question: {
      en: 'What is the helpline number for reporting fraud?',
      hi: 'धोखाधड़ी की शिकायत के लिए हेल्पलाइन नंबर क्या है?',
      ta: 'வங்கி மற்றும் இணையக் குற்ற உதவி எண்கள் என்ன?',
    },
    answer: {
      en: 'Call 1930 (national cyber fraud helpline) immediately if you suspect fraud. You can also visit cybercrime.gov.in to file an online complaint.',
      hi: 'धोखाधड़ी का संदेह होने पर तुरंत 1930 (राष्ट्रीय साइबर फ्रॉड हेल्पलाइन) पर कॉल करें। आप cybercrime.gov.in पर ऑनलाइन शिकायत भी कर सकते हैं।',
      ta: 'வங்கி கட்டணமில்லா உதவி எண்: 1800-111-222. இணைய நிதி மோசடி நடந்தால் அழைக்க வேண்டிய தேசிய சைபர் குற்ற உதவி எண்: 1930 (இணையதளம்: cybercrime.gov.in).',
    },
    keywords: {
      en: ['helpline', 'customer care', 'fraud helpline', '1930', 'report fraud', 'support number'],
      hi: ['हेल्पलाइन', 'कस्टमर केयर', 'फ्रॉड हेल्पलाइन', '1930', 'शिकायत'],
      ta: ["உதவி எண்","ஹெல்ப்லைன்","1930","சைபர் குற்றம்","helpline","cybercrime"],
    },
  },
  {
    id: 'app-usage',
    question: {
      en: 'I am new to this app. How do I start?',
      hi: 'मैं इस ऐप में नया हूँ। शुरुआत कैसे करूँ?',
      ta: 'நான் இந்த ஆப்பிற்குப் புதியவன். எப்படிப் பயன்படுத்துவது?',
    },
    answer: {
      en: 'Start at the home screen where you can see your balance. Use "Send money" to make payments, "Statement" to view history, and "Learn" to understand banking terms and stay safe.',
      hi: 'होम स्क्रीन से शुरू करें जहाँ आपका बैलेंस दिखता है। भुगतान के लिए "पैसे भेजें", इतिहास के लिए "खाता विवरण", और बैंकिंग शब्द व सुरक्षा सीखने के लिए "सीखें" देखें।',
      ta: 'முகப்புத் திரையில் உங்கள் இருப்பு தெரியும். "பணம் அனுப்பு" மூலம் பணம் அனுப்பலாம், "கணக்கு அறிக்கை" மூலம் வரலாற்றைப் பார்க்கலாம், "கற்றுக்கொள்" மூலம் வங்கி முறைகளைப் புரிந்து கொள்ளலாம்.',
    },
    keywords: {
      en: ['new', 'start', 'how to use', 'beginner', 'first time', 'getting started', 'app usage'],
      hi: ['नया', 'शुरुआत', 'कैसे उपयोग', 'पहली बार', 'नए उपयोगकर्ता'],
      ta: ["ஆப் பயன்பாடு","புதியவர்","எப்படிப் பயன்படுத்துவது","app usage","how to use","arimugam"],
    },
  },
  {
    id: 'account-details',
    question: {
      en: 'Where can I see my account details?',
      hi: 'मैं अपने खाते की जानकारी कहाँ देख सकता हूँ?',
      ta: 'என் கணக்கு விவரங்களை எங்கே பார்ப்பது?',
    },
    answer: {
      en: 'Your account number, IFSC code, and account type are shown on the home screen. Tap on your profile area for more details.',
      hi: 'आपका खाता नंबर, IFSC कोड, और खाता प्रकार होम स्क्रीन पर दिखता है। अधिक जानकारी के लिए प्रोफ़ाइल क्षेत्र पर टैप करें।',
      ta: 'உங்கள் கணக்கு எண், ஐஎஃப்எஸ்சி (IFSC) குறியீடு மற்றும் கணக்கு வகை ஆகியவை முகப்புத் திரையில் தெரியும். கூடுதல் விவரங்களுக்கு உங்கள் சுயவிவரத்தைத் தொடவும்.',
    },
    keywords: {
      en: ['account details', 'account number', 'IFSC', 'account info', 'my account', 'profile'],
      hi: ['खाता जानकारी', 'खाता नंबर', 'IFSC', 'खाता विवरण', 'प्रोफ़ाइल'],
      ta: ["கணக்கு விவரங்கள்","கணக்கு எண்","ஐஎஃப்எஸ்சி","account details","account number","ifsc"],
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

  const normalizedLang = (lang === 'hi' || lang === 'ta') ? lang : 'en';
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

export const FAQ = faq;
export default faq;
