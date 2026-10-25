// Saral Banking — Pay, Payees, Safety, Young saver & Voice Tamil strings
// Dev 2 Tamil translation matching tamil.md rules

export default {
  // Pay flow
  'pay.title': 'பணம் அனுப்புங்கள்',
  'pay.subtitle': 'யாருக்குப் பணம் அனுப்ப வேண்டும் எனத் தேர்ந்தெடுக்கவும்',
  'pay.searchPayees': 'பெயர் அல்லது கணக்கு எண் மூலம் தேடுங்கள்',
  'pay.orAddNew': 'அல்லது புதிய நபரைச் சேர்க்கவும்',
  'pay.scanQr': 'QR குறியீட்டை ஸ்கேன் செய்யுங்கள்',

  // Amount step
  'pay.amount.title': 'தொகையை உள்ளிடுங்கள்',
  'pay.amount.label': 'அனுப்ப வேண்டிய தொகை',
  'pay.amount.available': 'கணக்கில் உள்ள இருப்பு: {{amount}}',
  'pay.amount.note': 'குறிப்பு சேர்க்கவும் (விருப்பத்தேர்வு)',
  'pay.amount.notePlaceholder': 'இந்தப் பணம் எதற்காக அனுப்பப்படுகிறது?',
  'pay.amount.insufficient': 'உள்ளிட்ட தொகை உங்கள் கணக்கு இருப்பை விட அதிகமாக உள்ளது.',
  'pay.amount.exceedsDaily': 'தொகை உங்கள் தினசரி வரம்பான {{limit}}-ஐ விட அதிகமாக உள்ளது.',
  'pay.amount.exceedsNewPayee': 'புதிய பெறுநர் வரம்பு: முதல் 24 மணி நேரத்தில் அதிகபட்சம் ₹10,000 மட்டுமே அனுமதிக்கப்படும்.',

  // Review step
  'pay.review.title': 'பரிமாற்றத்தைச் சரிபாருங்கள்',
  'pay.review.titleTo': '{{name}} என்ற பெயருக்குப் பணம் அனுப்புவதை சரிபாருங்கள்',
  'pay.review.to': 'பணம் பெறுபவர்',
  'pay.review.account': 'கணக்கு எண்',
  'pay.review.ifsc': 'வங்கிக் கிளை குறியீடு (IFSC)',
  'pay.review.bank': 'வங்கிப் பெயர்',
  'pay.review.amount': 'தொகை',
  'pay.review.from': 'பணம் கழியும் கணக்கு',
  'pay.review.note': 'குறிப்பு',
  'pay.review.fee': 'பரிமாற்றக் கட்டணம்',
  'pay.review.free': 'இலவசம் (₹0)',

  // PIN step
  'pay.pin.title': 'உறுதிசெய்ய ரகசிய எண்ணை (PIN) உள்ளிடுங்கள்',
  'pay.pin.label': 'உங்கள் 4 இலக்க வங்கி ரகசிய எண்ணை (PIN) உள்ளிடவும்',
  'pay.pin.hint': 'மாதிரி ரகசிய எண்: 1234',
  'pay.pin.securityNote': 'உங்கள் ரகசிய எண்ணை (PIN) யாரிடமும் சொல்லாதீர்கள். வங்கி ஊழியர்கள் ஒருபோதும் கேட்க மாட்டார்கள்.',

  // Receipt
  'pay.receipt.title': 'பரிமாற்றம் வெற்றியடைந்தது',
  'pay.receipt.sent': 'பணம் அனுப்பப்பட்டது!',
  'pay.receipt.ref': 'குறிப்பு எண் (Reference)',
  'pay.receipt.date': 'தேதி மற்றும் நேரம்',
  'pay.receipt.download': 'ரசீதைச் சேமிக்கவும்',
  'pay.receipt.another': 'மற்றொருவருக்குப் பணம் அனுப்புங்கள்',

  // Warnings and safety prompts
  'pay.newPayeeWarning': 'பாதுகாப்பிற்காக, புதிதாகச் சேர்க்கப்பட்ட பெறுநருக்கு முதல் 24 மணி நேரத்தில் ₹10,000 வரை மட்டுமே அனுப்ப முடியும்.',
  'pay.safetyCheck.title': 'பாதுகாப்புச் சரிபார்ப்பு',
  'pay.safetyCheck.question': 'இந்தப் பணத்தை அனுப்புமாறு யாராவது அழைத்தோ அல்லது செய்தி அனுப்பியோ கேட்டார்களா?',
  'pay.safetyCheck.warning': 'மோசடி செய்பவர்கள் பெரும்பாலும் வங்கி ஊழியர், காவல்துறை அல்லது கூரியர் முகவர் போல நடிக்கலாம்.',
  'pay.simpleConfirm.title': 'உறுதியாக அனுப்பலாமா?',
  'pay.simpleConfirm.question': 'நீங்கள் {{amount}} தொகையை {{name}} என்ற பெயருக்கு அனுப்புகிறீர்கள். தொடர விரும்புகிறீர்களா?',

  // Payment requests
  'pay.request.title': 'பணம் கோரல் (Payment request)',
  'pay.request.subtitle': '{{name}} என்பவர் {{amount}} தொகையைக் கேட்டுள்ளார்',
  'pay.request.warning': 'முக்கியம்: பணம் அனுப்பும்போது மட்டுமே ரகசிய எண் (PIN) தேவை. ரகசிய எண்ணை உள்ளிட்டால் பணம் வராது, உங்கள் கணக்கிலிருந்து கழியும்.',
  'pay.request.decline': 'கோரிக்கையை நிராகரிக்கவும்',
  'pay.request.pay': '{{amount}} தொகையைச் செலுத்துங்கள்',
  'pay.request.declinedReceipt': 'பணம் கோரல் நிராகரிக்கப்பட்டது.',

  // QR Code
  'pay.qr.title': 'QR குறியீட்டை ஸ்கேன் செய்யுங்கள்',
  'pay.qr.instruction': 'உங்கள் கேமராவை யுபிஐ (UPI) அல்லது வங்கி QR குறியீட்டின் மீது காட்டுங்கள்.',
  'pay.qr.scanSuccess': 'QR குறியீடு வெற்றிகரமாக ஸ்கேன் செய்யப்பட்டது',
  'pay.qr.invalid': 'QR குறியீட்டைப் படிக்க முடியவில்லை. குறியீட்டைச் சரிபார்த்து மீண்டும் முயலுங்கள்.',

  // Payees
  'payees.title': 'பணம் பெறுபவர்கள்',
  'payees.search': 'சேமிக்கப்பட்ட பெறுநர்களைத் தேடுங்கள்',
  'payees.addNew': 'புதிய பெறுநரைச் சேர்க்கவும்',
  'payees.empty': 'பெறுநர்கள் யாரும் இல்லை',
  'payees.name': 'பெறுநரின் பெயர்',
  'payees.namePlaceholder': 'வங்கிப் பதிவேட்டில் உள்ளபடி முழுப் பெயர்',
  'payees.account': 'கணக்கு எண்',
  'payees.accountConfirm': 'கணக்கு எண்ணை மீண்டும் உள்ளிடவும்',
  'payees.accountMismatch': 'கணக்கு எண்கள் பொருந்தவில்லை. மீண்டும் சரிபாருங்கள்.',
  'payees.ifsc': 'வங்கிக் கிளை குறியீடு (IFSC)',
  'payees.ifscHint': '11 எழுத்துக்கள் கொண்ட குறியீடு (எ.கா. SBIN0001234)',
  'payees.bank': 'வங்கிப் பெயர்',
  'payees.nickname': 'செல்லப்பெயர் (விருப்பத்தேர்வு)',
  'payees.isNew': 'புதிய பெறுநர் (சமீபத்தில் சேர்க்கப்பட்டவர்)',
  'payees.newBadge': 'புதியது',
  'payees.review': 'பெறுநர் விவரங்களைச் சரிபாருங்கள்',
  'payees.saved': 'பெறுநர் வெற்றிகரமாகச் சேமிக்கப்பட்டார்',
  'payees.deleted': 'பெறுநர் நீக்கப்பட்டார்',
  'payees.deleteConfirm': '{{name}} என்பவரைப் பட்டியலில் இருந்து நீக்க விரும்புகிறீர்களா?',

  // Stopped screen
  'safety.stopped.title': 'உங்கள் பாதுகாப்பிற்காகப் பரிமாற்றம் நிறுத்தப்பட்டது',
  'safety.stopped.message': 'யாரோ சொல்லியதால் இந்தப் பணத்தை அனுப்புவதாகத் தெரிவித்துள்ளீர்கள். பெரும்பாலான வங்கி மோசடிகள் இப்படித்தான் நடக்கின்றன.',
  'safety.stopped.explanation': 'உண்மையான வங்கிகளோ, அரசு அதிகாரிகளோ தொலைபேசியில் அழைத்து அவசரமாகப் பணம் அனுப்பச் சொல்ல மாட்டார்கள்.',
  'safety.stopped.helpline': 'யாராவது உங்களை மிரட்டினால் அல்லது வற்புறுத்தினால், உடனடியாக தேசிய சைபர் குற்ற உதவி எண் 1930-ஐ அழையுங்கள்.',
  'safety.stopped.callHelpline': 'உதவி எண் 1930-ஐ அழையுங்கள்',
  'safety.stopped.learnScams': 'மோசடிகளை அடையாளம் காணக் கற்றுக்கொள்ளுங்கள்',
  'safety.stopped.returnHome': 'முகப்புக்குத் திரும்புங்கள்',

  // Young saver mode
  'young.goals.title': 'சேமிப்பு இலக்குகள்',
  'young.goals.subtitle': 'இலக்குகளை அமைத்து உங்கள் சேமிப்பு உயர்வதைக் கண்காணியுங்கள்',
  'young.goals.add': 'புதிய சேமிப்பு இலக்கைச் சேர்க்கவும்',
  'young.goals.name': 'இலக்கின் பெயர்',
  'young.goals.target': 'இலக்குத் தொகை',
  'young.goals.saved': 'சேமிக்கப்பட்ட தொகை',
  'young.goals.remaining': 'இலக்கை அடைய இன்னும் {{amount}} தேவை',
  'young.goals.addMoney': 'இலக்கிற்குப் பணம் சேருங்கள்',
  'young.goals.congrats': 'வாழ்த்துகள்! உங்கள் சேமிப்பு இலக்கை அடைந்துவிட்டீர்கள்.',

  // Guardian view & controls
  'young.guardian.title': 'பாதுகாவலர் பார்வை (Guardian View)',
  'young.guardian.subtitle': '{{child}} கணக்கைக் கண்காணித்தல்',
  'young.guardian.dailyLimit': 'தினசரி செலவு வரம்பு',
  'young.guardian.currentLimit': 'தற்போதைய தினசரி வரம்பு: {{amount}}',
  'young.guardian.setLimit': 'தினசரி வரம்பை மாற்றுங்கள்',
  'young.guardian.pendingRequests': 'காத்திருக்கும் ஒப்புதல் கோரிக்கைகள்',
  'young.guardian.noPending': 'தற்போது நிலுவையில் உள்ள ஒப்புதல்கள் எதுவும் இல்லை',
  'young.guardian.approve': 'பரிமாற்றத்திற்கு ஒப்புதல் அளியுங்கள்',
  'young.guardian.decline': 'பரிமாற்றத்தை நிராகரியுங்கள்',
  'young.guardian.requestFrom': '{{child}} என்பவர் {{amount}} தொகையை {{name}} என்ற பெயருக்கு அனுப்பக் கேட்டுள்ளார்',
  'young.guardian.approved': 'பரிமாற்றம் அங்கீகரிக்கப்பட்டது',
  'young.guardian.declined': 'பரிமாற்றம் நிராகரிக்கப்பட்டது',

  // Guardian consent
  'young.consent.title': 'பாதுகாவலர் ஒப்புதல்',
  'young.consent.message': 'இந்தக் கணக்கு 18 வயதுக்குட்பட்ட இளைய சேமிப்பாளருக்கானது. பெற்றோர் அல்லது சட்டப்பூர்வ பாதுகாவலர் இதை மதிப்பாய்வு செய்து அங்கீகரிக்க வேண்டும்.',
  'young.consent.agree': 'நான் பாதுகாவலர், இதற்குச் சம்மதிக்கிறேன்',
  'young.consent.guardianName': 'பாதுகாவலரின் முழுப் பெயர்',
  'young.consent.guardianMobile': 'பாதுகாவலரின் மொபைல் எண்',

  // Over limit notification
  'young.overLimit.title': 'தினசரி வரம்பை மீறியுள்ளது',
  'young.overLimit.message': 'இந்த {{amount}} தொகை உங்கள் தினசரி வரம்பான {{limit}}-ஐ விட அதிகம். உங்கள் பாதுகாவலருக்கு ({{guardian}}) ஒப்புதல் கோரிக்கை அனுப்பப்பட்டுள்ளது.',
  'young.overLimit.requestSent': '{{guardian}} என்ற பாதுகாவலருக்கு ஒப்புதல் கோரிக்கை அனுப்பப்பட்டது',

  // Voice assistant
  'voice.title': 'குரல் வழி வங்கி உதவியாளர்',
  'voice.listening': 'கேட்கிறது... உங்கள் போனில் தெளிவாகப் பேசுங்கள்',
  'voice.tapToSpeak': 'பேச மைக்ரோஃபோனைத் தொடவும்',
  'voice.stopSpeaking': 'நிறுத்தத் தொடவும்',
  'voice.example': 'சொல்லுங்கள்: "ரமேஷிற்கு 500 ரூபாய் அனுப்பு" அல்லது "என் இருப்புத் தொகையைச் சொல்"',
  'voice.notUnderstood': 'கட்டளையைப் புரிந்துகொள்ள முடியவில்லை. மீண்டும் முயலுங்கள்.',
  'voice.permissionDenied': 'மைக்ரோஃபோன் அனுமதி வழங்கப்படவில்லை.',
};
