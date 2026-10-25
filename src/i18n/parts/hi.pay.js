// Saral Banking — Pay, Payees, Safety, Young saver & Voice Hindi strings
// Dev 2 owns this file

export default {
  // Pay flow
  'pay.title': 'पैसे भेजें',
  'pay.subtitle': 'चुनें कि आप किसे पैसे भेजना चाहते हैं',
  'pay.searchPayees': 'नाम या खाता संख्या से खोजें',
  'pay.orAddNew': 'या किसी नए व्यक्ति को जोड़ें',
  'pay.scanQr': 'QR कोड स्कैन करें',

  // Amount step
  'pay.amount.title': 'राशि दर्ज करें',
  'pay.amount.label': 'भेजी जाने वाली राशि',
  'pay.amount.available': 'उपलब्ध शेष: {{amount}}',
  'pay.amount.note': 'नोट जोड़ें (वैकल्पिक)',
  'pay.amount.notePlaceholder': 'यह भुगतान किसलिए है?',
  'pay.amount.insufficient': 'दर्ज की गई राशि आपके खाते में उपलब्ध शेष से अधिक है।',
  'pay.amount.exceedsDaily': 'राशि आपकी दैनिक सीमा {{limit}} से अधिक है।',
  'pay.amount.exceedsNewPayee': 'नए लाभार्थी की सीमा: पहले 24 घंटों में अधिकतम ₹10,000 की अनुमति है।',

  // Review step
  'pay.review.title': 'भुगतान की समीक्षा',
  'pay.review.titleTo': '{{name}} को भुगतान की समीक्षा',
  'pay.review.to': 'प्राप्तकर्ता',
  'pay.review.account': 'खाता संख्या',
  'pay.review.ifsc': 'IFSC कोड',
  'pay.review.bank': 'बैंक का नाम',
  'pay.review.amount': 'राशि',
  'pay.review.from': 'इस खाते से कटेंगे',
  'pay.review.note': 'नोट',
  'pay.review.fee': 'ट्रांसफर शुल्क',
  'pay.review.free': 'निःशुल्क (₹0)',

  // PIN step
  'pay.pin.title': 'पुष्टि के लिए PIN दर्ज करें',
  'pay.pin.label': 'अपना 4 अंकों का बैंक PIN दर्ज करें',
  'pay.pin.hint': 'डेमो PIN: 1234',
  'pay.pin.securityNote': 'अपना PIN कभी किसी के साथ साझा न करें। बैंक कर्मचारी इसे कभी नहीं मांगते।',

  // Receipt
  'pay.receipt.title': 'भुगतान सफल रहा',
  'pay.receipt.sent': 'भुगतान सफल!',
  'pay.receipt.ref': 'संदर्भ संख्या',
  'pay.receipt.date': 'दिनांक और समय',
  'pay.receipt.download': 'रसीद सहेजें',
  'pay.receipt.another': 'एक और भुगतान करें',

  // Warnings and safety prompts
  'pay.newPayeeWarning': 'सुरक्षा के लिए, नए लाभार्थी को पहले 24 घंटों में अधिकतम ₹10,000 ही भेजे जा सकते हैं।',
  'pay.safetyCheck.title': 'सुरक्षा जांच',
  'pay.safetyCheck.question': 'क्या किसी ने कॉल या मैसेज करके आपसे यह पैसा भेजने को कहा है?',
  'pay.safetyCheck.warning': 'धोखेबाज अक्सर खुद को बैंक कर्मचारी, पुलिस, कूरियर एजेंट या लॉटरी अधिकारी बताते हैं।',
  'pay.simpleConfirm.title': 'क्या आप सुनिश्चित हैं?',
  'pay.simpleConfirm.question': 'आप {{name}} को {{amount}} भेज रहे हैं। क्या आप आगे बढ़ना चाहते हैं?',

  // Payment requests (Collect requests)
  'pay.request.title': 'भुगतान अनुरोध',
  'pay.request.subtitle': '{{name}} ने {{amount}} का अनुरोध किया है',
  'pay.request.warning': 'महत्वपूर्ण: PIN केवल पैसे भेजते समय डाला जाता है। PIN डालने से पैसे प्राप्त नहीं होते, कटते हैं।',
  'pay.request.decline': 'अनुरोध अस्वीकार करें',
  'pay.request.pay': '{{amount}} का भुगतान करें',
  'pay.request.declinedReceipt': 'भुगतान अनुरोध अस्वीकार कर दिया गया।',

  // QR Code
  'pay.qr.title': 'QR कोड स्कैन करें',
  'pay.qr.instruction': 'अपने फोन का कैमरा किसी भी UPI या बैंक QR कोड पर रखें।',
  'pay.qr.scanSuccess': 'QR कोड सफलतापूर्वक स्कैन हुआ',
  'pay.qr.invalid': 'QR कोड पढ़ा नहीं जा सका। कृपया कोड जांचें और पुनः प्रयास करें।',

  // Payees
  'payees.title': 'लाभार्थी',
  'payees.search': 'सहेजे गए लाभार्थी खोजें',
  'payees.addNew': 'नया लाभार्थी जोड़ें',
  'payees.empty': 'कोई लाभार्थी नहीं मिला',
  'payees.name': 'लाभार्थी का नाम',
  'payees.namePlaceholder': 'बैंक रिकॉर्ड के अनुसार पूरा नाम',
  'payees.account': 'खाता संख्या',
  'payees.accountConfirm': 'खाता संख्या की पुष्टि करें',
  'payees.accountMismatch': 'खाता संख्या मेल नहीं खाती। कृपया दोबारा जांचें।',
  'payees.ifsc': 'IFSC कोड',
  'payees.ifscHint': '11 अक्षरों का कोड, जैसे SBIN0001234',
  'payees.bank': 'बैंक का नाम',
  'payees.nickname': 'उपनाम (वैकल्पिक)',
  'payees.isNew': 'नया लाभार्थी (हाल ही में जोड़ा गया)',
  'payees.newBadge': 'नया',
  'payees.review': 'लाभार्थी विवरण की समीक्षा करें',
  'payees.saved': 'लाभार्थी सफलतापूर्वक सहेज लिया गया',
  'payees.deleted': 'लाभार्थी हटा दिया गया',
  'payees.deleteConfirm': 'क्या आप वाकई {{name}} को हटाना चाहते हैं?',

  // Stopped screen
  'safety.stopped.title': 'आपकी सुरक्षा के लिए भुगतान रोक दिया गया',
  'safety.stopped.message': 'आपने बताया कि किसी ने आपसे यह पैसा भेजने को कहा है। अधिकांश बैंकिंग धोखाधड़ी इसी तरह होती है।',
  'safety.stopped.explanation': 'असली बैंक, सरकारी अधिकारी और वैध कंपनियां कभी फोन करके तुरंत पैसे ट्रांसफर करने का दबाव नहीं बनातीं।',
  'safety.stopped.helpline': 'यदि कोई आप पर दबाव बना रहा है या धमकी दे रहा है, तो तुरंत राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 पर कॉल करें।',
  'safety.stopped.callHelpline': 'हेल्पलाइन 1930 पर कॉल करें',
  'safety.stopped.learnScams': 'धोखाधड़ी से बचने के उपाय जानें',
  'safety.stopped.returnHome': 'होम पर वापस जाएं',

  // Young saver mode
  'young.goals.title': 'बचत लक्ष्य',
  'young.goals.subtitle': 'लक्ष्य निर्धारित करें और अपनी बचत को बढ़ते देखें',
  'young.goals.add': 'नया बचत लक्ष्य जोड़ें',
  'young.goals.name': 'लक्ष्य का नाम',
  'young.goals.target': 'लक्ष्य राशि',
  'young.goals.saved': 'जमा की गई राशि',
  'young.goals.remaining': 'लक्ष्य तक पहुंचने के लिए {{amount}} शेष',
  'young.goals.addMoney': 'लक्ष्य में पैसे जोड़ें',
  'young.goals.congrats': 'बधाई हो! आपने अपना बचत लक्ष्य पूरा कर लिया है।',

  // Guardian view & controls
  'young.guardian.title': 'अभिभावक दृश्य',
  'young.guardian.subtitle': '{{child}} के खाते की निगरानी',
  'young.guardian.dailyLimit': 'दैनिक खर्च सीमा',
  'young.guardian.currentLimit': 'वर्तमान दैनिक सीमा: {{amount}}',
  'young.guardian.setLimit': 'दैनिक सीमा बदलें',
  'young.guardian.pendingRequests': 'लंबित भुगतान अनुमोदन',
  'young.guardian.noPending': 'इस समय कोई अनुरोध लंबित नहीं है',
  'young.guardian.approve': 'भुगतान स्वीकृत करें',
  'young.guardian.decline': 'भुगतान अस्वीकार करें',
  'young.guardian.requestFrom': '{{child}} ने {{name}} को {{amount}} भुगतान करने का अनुरोध किया है',
  'young.guardian.approved': 'भुगतान स्वीकृत किया गया',
  'young.guardian.declined': 'भुगतान अस्वीकार किया गया',

  // Guardian consent
  'young.consent.title': 'अभिभावक सहमति',
  'young.consent.message': 'यह खाता 18 वर्ष से कम आयु के युवा बचतकर्ता के लिए है। खाता शुरू करने के लिए माता-पिता या कानूनी अभिभावक की समीक्षा और सहमति अनिवार्य है।',
  'young.consent.agree': 'मैं अभिभावक हूँ और सहमति देता/देती हूँ',
  'young.consent.guardianName': 'अभिभावक का पूरा नाम',
  'young.consent.guardianMobile': 'अभिभावक का मोबाइल नंबर',

  // Over limit notification
  'young.overLimit.title': 'दैनिक सीमा से अधिक',
  'young.overLimit.message': '{{amount}} का यह भुगतान आपकी दैनिक सीमा {{limit}} से अधिक है। अनुमोदन के लिए आपके अभिभावक ({{guardian}}) को एक अनुरोध भेजा गया है।',
  'young.overLimit.requestSent': '{{guardian}} को अनुमोदन अनुरोध भेज दिया गया है',

  // Voice assistant
  'voice.title': 'वॉइस सहायक',
  'voice.listening': 'सुन रहा हूँ... अपने फोन में साफ बोलें',
  'voice.tapToSpeak': 'बोलने के लिए माइक दबाएं',
  'voice.stopSpeaking': 'रोकने के लिए दबाएं',
  'voice.example': 'बोलें: "रमेश को 500 रुपये भेजें" या "मेरी शेष राशि बताएं"',
  'voice.notUnderstood': 'कमांड समझ नहीं आई। कृपया दोबारा प्रयास करें।',
  'voice.permissionDenied': 'माइक्रोफ़ोन की अनुमति नहीं दी गई।',
};
