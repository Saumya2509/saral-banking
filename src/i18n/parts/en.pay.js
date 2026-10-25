// Saral Banking — Pay, Payees, Safety, Young saver & Voice English strings
// Dev 2 owns this file

export default {
  // Pay flow
  'pay.title': 'Send money',
  'pay.subtitle': 'Choose who you want to pay',
  'pay.searchPayees': 'Search by name or account number',
  'pay.orAddNew': 'Or add a new person',
  'pay.scanQr': 'Scan QR code',

  // Amount step
  'pay.amount.title': 'Enter amount',
  'pay.amount.label': 'Amount to send',
  'pay.amount.available': 'Available balance: {{amount}}',
  'pay.amount.note': 'Add a note (optional)',
  'pay.amount.notePlaceholder': 'What is this payment for?',
  'pay.amount.insufficient': 'Entered amount is greater than your available balance.',
  'pay.amount.exceedsDaily': 'Amount exceeds your daily limit of {{limit}}.',
  'pay.amount.exceedsNewPayee': 'New payee limit: maximum ₹10,000 allowed in first 24 hours.',

  // Review step
  'pay.review.title': 'Review payment',
  'pay.review.titleTo': 'Review payment to {{name}}',
  'pay.review.to': 'Sending to',
  'pay.review.account': 'Account number',
  'pay.review.ifsc': 'IFSC code',
  'pay.review.bank': 'Bank name',
  'pay.review.amount': 'Amount',
  'pay.review.from': 'Deducting from',
  'pay.review.note': 'Note',
  'pay.review.fee': 'Transfer charge',
  'pay.review.free': 'Free (₹0)',

  // PIN step
  'pay.pin.title': 'Enter PIN to confirm',
  'pay.pin.label': 'Enter your 4-digit bank PIN',
  'pay.pin.hint': 'Demo PIN: 1234',
  'pay.pin.securityNote': 'Never share your PIN with anyone. Bank staff will never ask for it.',

  // Receipt
  'pay.receipt.title': 'Payment successful',
  'pay.receipt.sent': 'Payment sent!',
  'pay.receipt.ref': 'Reference number',
  'pay.receipt.date': 'Date and time',
  'pay.receipt.download': 'Save receipt',
  'pay.receipt.another': 'Send another payment',

  // Warnings and safety prompts
  'pay.newPayeeWarning': 'For safety, payments to a new payee are limited to ₹10,000 in the first 24 hours.',
  'pay.safetyCheck.title': 'Safety check',
  'pay.safetyCheck.question': 'Did someone call or message you asking you to send this money?',
  'pay.safetyCheck.warning': 'Fraudsters often pretend to be bank staff, police, courier agents, or lottery officials.',
  'pay.simpleConfirm.title': 'Are you sure?',
  'pay.simpleConfirm.question': 'You are sending {{amount}} to {{name}}. Do you want to proceed?',

  // Payment requests (Collect requests)
  'pay.request.title': 'Payment request',
  'pay.request.subtitle': '{{name}} is asking for {{amount}}',
  'pay.request.warning': 'Important: You only enter your PIN when sending money. Entering your PIN will NOT receive money.',
  'pay.request.decline': 'Decline request',
  'pay.request.pay': 'Pay {{amount}}',
  'pay.request.declinedReceipt': 'Payment request was declined.',

  // QR Code
  'pay.qr.title': 'Scan QR code',
  'pay.qr.instruction': 'Point your phone camera at any UPI or bank QR code.',
  'pay.qr.scanSuccess': 'QR code scanned successfully',
  'pay.qr.invalid': 'Could not read QR code. Please check the code and try again.',

  // Payees
  'payees.title': 'Payees',
  'payees.search': 'Search saved payees',
  'payees.addNew': 'Add new payee',
  'payees.empty': 'No payees found',
  'payees.name': 'Payee name',
  'payees.namePlaceholder': 'Full name as per bank record',
  'payees.account': 'Account number',
  'payees.accountConfirm': 'Confirm account number',
  'payees.accountMismatch': 'Account numbers do not match. Please recheck.',
  'payees.ifsc': 'IFSC code',
  'payees.ifscHint': '11-character code, e.g. SBIN0001234',
  'payees.bank': 'Bank name',
  'payees.nickname': 'Nickname (optional)',
  'payees.isNew': 'New payee (added recently)',
  'payees.newBadge': 'New',
  'payees.review': 'Review payee details',
  'payees.saved': 'Payee saved successfully',
  'payees.deleted': 'Payee removed',
  'payees.deleteConfirm': 'Are you sure you want to remove {{name}}?',

  // Stopped screen
  'safety.stopped.title': 'Payment stopped for your safety',
  'safety.stopped.message': 'You indicated that someone asked you to send this money. This is how most banking fraud happens.',
  'safety.stopped.explanation': 'Real banks, government officials, and legitimate companies never call asking you to urgently transfer money.',
  'safety.stopped.helpline': 'If someone is pressuring or threatening you, call the National Cyber Crime Helpline at 1930 immediately.',
  'safety.stopped.callHelpline': 'Call helpline 1930',
  'safety.stopped.learnScams': 'Learn how to spot scams',
  'safety.stopped.returnHome': 'Return to home',

  // Young saver mode
  'young.goals.title': 'Savings goals',
  'young.goals.subtitle': 'Set targets and track how your savings grow',
  'young.goals.add': 'Add savings goal',
  'young.goals.name': 'Goal name',
  'young.goals.target': 'Target amount',
  'young.goals.saved': 'Amount saved',
  'young.goals.remaining': '{{amount}} remaining to reach goal',
  'young.goals.addMoney': 'Add money to goal',
  'young.goals.congrats': 'Congratulations! You reached your savings goal.',

  // Guardian view & controls
  'young.guardian.title': 'Guardian view',
  'young.guardian.subtitle': 'Supervising account for {{child}}',
  'young.guardian.dailyLimit': 'Daily spending limit',
  'young.guardian.currentLimit': 'Current daily limit: {{amount}}',
  'young.guardian.setLimit': 'Change daily limit',
  'young.guardian.pendingRequests': 'Pending payment approvals',
  'young.guardian.noPending': 'No pending approvals at this time',
  'young.guardian.approve': 'Approve payment',
  'young.guardian.decline': 'Decline payment',
  'young.guardian.requestFrom': '{{child}} requested to pay {{amount}} to {{name}}',
  'young.guardian.approved': 'Payment approved',
  'young.guardian.declined': 'Payment declined',

  // Guardian consent
  'young.consent.title': 'Guardian consent',
  'young.consent.message': 'This account is for a young saver under 18 years of age. A parent or legal guardian must review and approve account setup.',
  'young.consent.agree': 'I am the guardian and I consent',
  'young.consent.guardianName': 'Guardian full name',
  'young.consent.guardianMobile': 'Guardian mobile number',

  // Over limit notification
  'young.overLimit.title': 'Over daily limit',
  'young.overLimit.message': 'This payment of {{amount}} is higher than your daily limit of {{limit}}. An approval request has been sent to your guardian ({{guardian}}).',
  'young.overLimit.requestSent': 'Approval request sent to {{guardian}}',

  // Voice assistant
  'voice.title': 'Voice assistant',
  'voice.listening': 'Listening... speak clearly into your phone',
  'voice.tapToSpeak': 'Tap microphone to speak',
  'voice.stopSpeaking': 'Tap to stop',
  'voice.example': 'Say: "Send 500 rupees to Ramesh" or "Check my balance"',
  'voice.notUnderstood': 'Could not understand that command. Please try again.',
  'voice.permissionDenied': 'Microphone permission was not granted.',
};
