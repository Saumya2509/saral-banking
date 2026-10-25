import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MicIcon, Volume2Icon, AlertTriangleIcon, CheckIcon, XIcon, ShieldIcon, SparklesIcon } from '../icons/Icons';
import { speak, stopSpeaking } from '../../utils/speech.js';
import { getBalances, getTransactions } from '../../utils/ledger.js';
import { amountToSpeech } from '../../utils/money.js';
import { getPayeesForCustomer } from '../../data/payees.js';
import { getAllCustomers } from '../../data/customers.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { playSuccessChime, playKeyTone } from '../../utils/audio.js';

// Comprehensive roster of all static members, payees, merchants, and billers
const STATIC_MEMBERS = [
  // Payees & Contacts
  {
    id: 'ramesh',
    name: 'Ramesh K',
    aliases: ['ramesh', 'ramesh k', 'रमेश', 'रमेश के', 'grocery', 'किराना'],
    bank: 'State Bank of India',
    accountNumber: 'ramesh@upi',
  },
  {
    id: 'kavita',
    name: 'Kavita Prasad',
    aliases: ['kavita', 'kavita prasad', 'कविता', 'कविता प्रसाद', 'daughter', 'बेटी'],
    bank: 'HDFC Bank',
    accountNumber: 'kavita@upi',
  },
  {
    id: 'sharma_med',
    name: 'Sharma Medical Hall',
    aliases: ['sharma', 'sharma medical', 'sharma medical hall', 'sharma medical store', 'chemist', 'शर्मा', 'शर्मा मेडिकल', 'दवा'],
    bank: 'Punjab National Bank',
    accountNumber: 'sharma@upi',
  },
  {
    id: 'jammu_power',
    name: 'Jammu Power Dept',
    aliases: ['jammu power', 'power dept', 'electricity', 'jammu power dept', 'बिजली', 'बिजली विभाग', 'बिजली बिल'],
    bank: 'State Bank of India',
    accountNumber: 'jammupower@upi',
  },
  {
    id: 'mohan',
    name: 'Mohan Electrician',
    aliases: ['mohan', 'electrician', 'mohan electrician', 'मोहन', 'इलेक्ट्रीशियन'],
    bank: 'ICICI Bank',
    accountNumber: 'mohan@upi',
  },
  {
    id: 'sunil',
    name: 'Sunil Verma',
    aliases: ['sunil', 'sunil verma', 'सुनील', 'सुनील वर्मा', 'rent', 'किराया', 'owner'],
    bank: 'HDFC Bank',
    accountNumber: 'sunil@upi',
  },
  {
    id: 'asha',
    name: 'Asha Sharma',
    aliases: ['asha', 'asha sharma', 'आशा', 'आशा शर्मा', 'mother', 'माताजी'],
    bank: 'State Bank of India',
    accountNumber: 'asha@upi',
  },
  {
    id: 'airtel',
    name: 'Airtel Broadband',
    aliases: ['airtel', 'broadband', 'airtel broadband', 'एयरटेल', 'इंटरनेट', 'wifi'],
    bank: 'Airtel Payments Bank',
    accountNumber: 'airtel@upi',
  },

  // Customers & Family
  {
    id: 'shankar',
    name: 'Shankar Prasad',
    aliases: ['shankar', 'shankar prasad', 'शंकर', 'शंकर प्रसाद', 'father', 'बाबूजी'],
    bank: 'Saral Bank',
    accountNumber: 'shankar@saral',
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    aliases: ['priya', 'priya sharma', 'प्रिया', 'प्रिया शर्मा'],
    bank: 'Saral Bank',
    accountNumber: 'priya@saral',
  },
  {
    id: 'aarav',
    name: 'Aarav Mehta',
    aliases: ['aarav', 'aarav mehta', 'आरव', 'आरव मेहता', 'child', 'बेटा'],
    bank: 'Saral Bank',
    accountNumber: 'aarav@saral',
  },
  {
    id: 'priya_mom',
    name: 'Priya Sharma (Mom)',
    aliases: ['priya', 'priya sharma', 'mom', 'mother', 'प्रिया', 'प्रिया शर्मा', 'माँ', 'अभिभावक', 'guardian'],
    bank: 'Saral Bank',
    accountNumber: 'priya@saral',
  },

  // Routine Merchants
  {
    id: 'apollo',
    name: 'Apollo Pharmacy',
    aliases: ['apollo', 'apollo pharmacy', 'अपोलो', 'अपोलो फार्मेसी', 'medicine'],
    bank: 'HDFC Bank',
    accountNumber: 'apollo@upi',
  },
  {
    id: 'verma_mart',
    name: 'Verma Grocery Mart',
    aliases: ['verma', 'verma grocery', 'verma grocery store', 'वर्मा', 'वर्मा किराना'],
    bank: 'State Bank of India',
    accountNumber: 'verma@upi',
  },
  {
    id: 'mother_dairy',
    name: 'Mother Dairy Jammu',
    aliases: ['mother dairy', 'mother dairy jammu', 'milk', 'मदर', 'मदर डेयरी', 'दूध'],
    bank: 'Punjab National Bank',
    accountNumber: 'motherdairy@upi',
  },
  {
    id: 'water_dept',
    name: 'J&K Water Dept',
    aliases: ['water', 'water dept', 'पानी', 'जल विभाग', 'पानी बिल'],
    bank: 'State Bank of India',
    accountNumber: 'water@upi',
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    aliases: ['swiggy', 'स्विगी', 'खाना'],
    bank: 'ICICI Bank',
    accountNumber: 'swiggy@upi',
  },
  {
    id: 'zomato',
    name: 'Zomato',
    aliases: ['zomato', 'ज़ोमैटो', 'जोमैटो'],
    bank: 'HDFC Bank',
    accountNumber: 'zomato@upi',
  },
];

/**
 * Extracts amount from natural speech (numbers or words in English & Hindi)
 */
function extractSpokenAmount(text) {
  const clean = text.toLowerCase();

  // 1. Direct digits: 500, 1000, 2500
  const digitMatch = clean.match(/\b\d+\b/);
  if (digitMatch) {
    return parseInt(digitMatch[0], 10);
  }

  // 2. Hindi word numbers
  if (clean.includes('दस हज़ार') || clean.includes('दस हजार') || clean.includes('10 हजार')) return 10000;
  if (clean.includes('पांच हज़ार') || clean.includes('पांच हजार') || clean.includes('5 हजार')) return 5000;
  if (clean.includes('दो हज़ार') || clean.includes('दो हजार') || clean.includes('2 हजार')) return 2000;
  if (clean.includes('हज़ार') || clean.includes('हजार')) return 1000;
  if (clean.includes('पांच सौ') || clean.includes('5 सौ')) return 500;
  if (clean.includes('चार सौ') || clean.includes('4 सौ')) return 400;
  if (clean.includes('तीन सौ') || clean.includes('3 सौ')) return 300;
  if (clean.includes('दो सौ') || clean.includes('2 सौ')) return 200;
  if (clean.includes('डेढ़ सौ')) return 150;
  if (clean.includes('सौ')) return 100;
  if (clean.includes('पचास')) return 50;
  if (clean.includes('बीस')) return 20;
  if (clean.includes('दस')) return 10;

  // 3. English word numbers
  if (clean.includes('ten thousand')) return 10000;
  if (clean.includes('five thousand')) return 5000;
  if (clean.includes('two thousand')) return 2000;
  if (clean.includes('thousand')) return 1000;
  if (clean.includes('five hundred')) return 500;
  if (clean.includes('four hundred')) return 400;
  if (clean.includes('three hundred')) return 300;
  if (clean.includes('two hundred')) return 200;
  if (clean.includes('one hundred') || clean.includes('a hundred')) return 100;
  if (clean.includes('fifty')) return 50;
  if (clean.includes('twenty')) return 20;
  if (clean.includes('ten')) return 10;

  return 0;
}

export default function VoiceControl({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const customerId = state.session.customerId || 'shankar';

  // Gather all known payees dynamically: static list + customer payees + custom created customers
  const customerPayees = getPayeesForCustomer(customerId);
  const storePayees = state.pay?.payees?.filter((p) => p.customerId === customerId) || [];
  const allDynamicCustomers = getAllCustomers();

  const dynamicCustomerMembers = allDynamicCustomers.map((c) => ({
    id: c.id,
    name: c.name?.en || c.id,
    aliases: [
      c.name?.en?.toLowerCase(),
      c.name?.hi?.toLowerCase(),
      c.id.toLowerCase(),
      c.name?.en?.split(' ')[0]?.toLowerCase(),
    ].filter(Boolean),
    bank: 'Saral Bank',
    accountNumber: `${c.id}@saral`,
  }));

  const combinedRoster = [...STATIC_MEMBERS, ...dynamicCustomerMembers, ...customerPayees, ...storePayees];

  // States: 'idle' | 'permission' | 'listening' | 'processing' | 'speaking' | 'pin_blocked' | 'error'
  const [voiceState, setVoiceState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopListening();
    }
    return () => {
      stopListening();
    };
  }, [isOpen]);

  const startListening = () => {
    stopSpeaking();
    setErrorMessage('');
    setTranscript('');
    setFeedbackMessage('');

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceState('idle');
      setFeedbackMessage(
        lang === 'hi'
          ? 'माइक्रोफ़ोन इस ब्राउज़र में उपलब्ध नहीं है। आप नीचे दिए गए किसी भी सदस्य या कमांड पर टैप कर सकते हैं।'
          : 'Speech recognition is not available in this browser. You can tap any member or suggestion below to command the assistant.'
      );
      return;
    }

    setVoiceState('permission');

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setVoiceState('listening');
        playKeyTone();
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          processVoiceCommand(currentTranscript);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setVoiceState('idle');
          setFeedbackMessage('Microphone access was denied. Tap any suggestion below to test voice banking.');
        } else if (event.error === 'no-speech') {
          setVoiceState('idle');
          setFeedbackMessage(
            lang === 'hi'
              ? 'कोई आवाज़ नहीं सुनाई दी। दोबारा बोलने के लिए माइक दबाएं या नीचे सुझाव चुनें।'
              : 'No speech heard. Tap the microphone to speak again, or select a member below.'
          );
        } else {
          setVoiceState('idle');
          setFeedbackMessage(`Voice note: ${event.error}. You can tap any suggestion below.`);
        }
      };

      recognition.onend = () => {
        if (voiceState === 'listening') {
          setVoiceState('idle');
        }
      };

      recognition.start();
    } catch (err) {
      setVoiceState('idle');
      setFeedbackMessage('Tap any member suggestion below to execute the command.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  const processVoiceCommand = (text) => {
    stopListening();
    setVoiceState('processing');

    const cleanText = text.trim();
    const lower = cleanText.toLowerCase();

    // ── STRICT SECURITY GUARD: BLOCK PIN / PASSWORD VIA VOICE ────────────────
    // Only triggers when user explicitly speaks "pin", "password", "passcode", etc.
    const hasPinOrPassword =
      /\b(pin|password|passcode|secret\s*pin)\b/i.test(lower) ||
      lower.includes('पिन') ||
      lower.includes('पासवर्ड') ||
      lower.includes('ரகசிய எண்') ||
      lower.includes('கடவுச்சொல்');

    if (hasPinOrPassword) {
      setVoiceState('pin_blocked');
      const warningText =
        lang === 'hi'
          ? 'सुरक्षा चेतावनी! अपना पिन या पासवर्ड कभी बोलकर न बताएं। आपकी सुरक्षा के लिए वॉइस द्वारा पिन दर्ज करना वर्जित है। कृपया स्क्रीन पर कीपैड का उपयोग करें।'
          : lang === 'ta'
          ? 'பாதுகாப்பு எச்சரிக்கை! உங்கள் ரகசிய எண் (PIN) அல்லது கடவுச்சொல்லை ஒருபோதும் வாய்விட்டுச் சொல்ல வேண்டாம். திரையில் உள்ள விசைப்பலகையைப் பயன்படுத்தவும்.'
          : 'Security Alert! Never speak your secret PIN or password aloud. For your protection, voice PIN entry is disabled. Please enter your PIN on the keypad.';

      setFeedbackMessage(warningText);
      speak(warningText, lang);
      return;
    }

    // ── 1. BALANCE INQUIRY ───────────────────────────────────────────────
    // Only triggers for genuine balance inquiries, NOT payment commands!
    const isPaymentCommand =
      lower.includes('pay') ||
      lower.includes('send') ||
      lower.includes('transfer') ||
      lower.includes('भेज') ||
      lower.includes('पे') ||
      lower.includes('अனுப்பு') ||
      lower.includes('செலுத்து');

    const isBalanceInquiry =
      !isPaymentCommand &&
      (lower.includes('balance') ||
        lower.includes('बैलेंस') ||
        lower.includes('இருப்பு') ||
        ((lower.includes('how much') || lower.includes('कितना') || lower.includes('எவ்வளவு')) && !cleanText.match(/\d+/)));

    if (isBalanceInquiry) {
      const reply =
        lang === 'hi'
          ? 'बैलेंस देखने के लिए होम स्क्रीन पर ले जा रहा हूँ।'
          : lang === 'ta'
          ? 'இருப்புத் தொகையைக் காண முகப்புத் திரைக்கு அழைத்துச் செல்கிறேன்.'
          : 'Taking you to the home screen to view your balance.';

      setVoiceState('speaking');
      setFeedbackMessage(reply);
      speak(reply, lang);
      setTimeout(() => {
        onClose();
        navigate('/');
      }, 1500);
      return;
    }

    // ── 2. VOICE PAYMENT & MEMBER MATCHING ────────────────────────────────
    const amountNumber = extractSpokenAmount(cleanText);

    // Identify recipient across all static members and dynamic payees
    let matchedMember = null;

    // Check alias matching
    for (const member of combinedRoster) {
      if (member.aliases) {
        for (const alias of member.aliases) {
          if (lower.includes(alias.toLowerCase())) {
            matchedMember = member;
            break;
          }
        }
      } else if (member.name && lower.includes(member.name.toLowerCase())) {
        matchedMember = member;
        break;
      }
      if (matchedMember) break;
    }

    // Natural speech patterns for recipients not in aliases
    if (!matchedMember) {
      // English: "pay [amount] to [Name]"
      const toMatch = cleanText.match(/(?:to\s+)([a-zA-Z\s]+?)(?:\s+(?:rupees|rs|\d+)|$)/i);
      if (toMatch && toMatch[1]) {
        const extracted = toMatch[1].replace(/\b(rupees|rs|paisa|money|please|send|pay|transfer)\b/gi, '').trim();
        if (extracted) {
          const displayName = extracted.toLowerCase() === 'this' ? 'Selected Payee' : extracted;
          matchedMember = {
            id: `payee_${Date.now()}`,
            name: displayName,
            bank: 'UPI Transfer',
            accountNumber: `${displayName.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`,
          };
        }
      }

      // Hindi: "[Name] को [amount] रुपये"
      const koMatch = cleanText.match(/([a-zA-Z\u0900-\u097F\s]+?)\s*को\s*/);
      if (koMatch && koMatch[1]) {
        const extracted = koMatch[1].replace(/(?:भेज|पे|पैसे|रुपये|ट्रांसफर|कृपया)/g, '').trim();
        if (extracted) {
          matchedMember = {
            id: `payee_${Date.now()}`,
            name: extracted,
            bank: 'UPI Transfer',
            accountNumber: `${extracted.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`,
          };
        }
      }
    }

    // Process matched payment
    if (matchedMember && amountNumber > 0) {
      const amountPaise = amountNumber * 100;
      const payeeName = matchedMember.name;

      const confirmSpeech =
        lang === 'hi'
          ? `${payeeName} को ${amountNumber} रुपये भेजने की समीक्षा खोली जा रही है।`
          : `Setting up payment of ${amountNumber} rupees to ${payeeName}. Opening review screen.`;

      setVoiceState('speaking');
      setFeedbackMessage(confirmSpeech);
      speak(confirmSpeech, lang);
      playSuccessChime();

      setTimeout(() => {
        onClose();
        navigate('/pay/review', {
          state: {
            payee: {
              name: matchedMember.name,
              bank: matchedMember.bank || 'Saral Bank',
              accountNumber: matchedMember.accountNumber || `${matchedMember.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`,
            },
            amountPaise,
            note: 'Voice transfer',
          },
        });
      }, 1500);
      return;
    }

    if (matchedMember && amountNumber === 0) {
      const reply =
        lang === 'hi'
          ? `${matchedMember.name} को कितने रुपये भेजने हैं?`
          : `How much money would you like to send to ${matchedMember.name}?`;
      setVoiceState('speaking');
      setFeedbackMessage(reply);
      speak(reply, lang);
      return;
    }

    if (!matchedMember && amountNumber > 0 && isPaymentCommand) {
      const confirmSpeech =
        lang === 'hi'
          ? `${amountNumber} रुपये भेजने के लिए स्क्रीन खोली जा रही है।`
          : `Opening payment screen for ${amountNumber} rupees.`;

      setVoiceState('speaking');
      setFeedbackMessage(confirmSpeech);
      speak(confirmSpeech, lang);
      playSuccessChime();

      setTimeout(() => {
        onClose();
        navigate('/pay/send', {
          state: {
            amountPaise: amountNumber * 100,
          },
        });
      }, 1500);
      return;
    }

    // ── 3. EMERGENCY FRAUD / BLOCK CARD ──────────────────────────────────
    if (
      lower.includes('fraud') ||
      lower.includes('block') ||
      lower.includes('emergency') ||
      lower.includes('धोखा') ||
      lower.includes('ब्लॉक')
    ) {
      const reply =
        lang === 'hi'
          ? 'सुरक्षा आपातकाल। कार्ड और यूपीआई तुरंत ब्लॉक करने के लिए स्क्रीन खोली जा रही है।'
          : 'Emergency security. Opening the fraud protection screen to block your card and UPI.';
      setVoiceState('speaking');
      setFeedbackMessage(reply);
      speak(reply, lang);
      setTimeout(() => {
        onClose();
        navigate('/help/fraud');
      }, 1500);
      return;
    }

    // ── 4. TRANSACTION HISTORY ───────────────────────────────────────────
    if (
      lower.includes('history') ||
      lower.includes('statement') ||
      lower.includes('transaction') ||
      lower.includes('इतिहास') ||
      lower.includes('लेनदेन')
    ) {
      const reply =
        lang === 'hi'
          ? 'आपका हाल का लेन-देन इतिहास खोला जा रहा है।'
          : 'Opening your recent transaction history.';
      setVoiceState('speaking');
      setFeedbackMessage(reply);
      speak(reply, lang);
      setTimeout(() => {
        onClose();
        navigate('/history');
      }, 1200);
      return;
    }

    // ── 5. LANGUAGE SWITCH ────────────────────────────────────────────────
    if (lower.includes('hindi') || lower.includes('हिन्दी')) {
      dispatch({ type: 'SET_LANG', payload: 'hi' });
      const reply = 'भाषा को हिन्दी में बदल दिया गया है।';
      setVoiceState('speaking');
      setFeedbackMessage(reply);
      speak(reply, 'hi');
      return;
    }

    if (lower.includes('english')) {
      dispatch({ type: 'SET_LANG', payload: 'en' });
      const reply = 'Language changed to English.';
      setVoiceState('speaking');
      setFeedbackMessage(reply);
      speak(reply, 'en');
      return;
    }

    // ── 6. DEFAULT GENERAL GUIDANCE ───────────────────────────────────────
    const defaultReply =
      lang === 'hi'
        ? 'मैं आपकी क्या मदद करूँ? आप कह सकते हैं: "रमेश को 500 रुपये भेजो", "प्रिया को 1000 भेजो", या "मेरा बैलेंस बताओ"।'
        : 'How can I assist you? You can say: "Pay 500 to Ramesh", "Send 1,000 to Priya", or "Check my balance".';

    setVoiceState('speaking');
    setFeedbackMessage(defaultReply);
    speak(defaultReply, lang);
  };

  // Static Member Quick Test Prompts
  const samplePrompts = [
    { label: 'Pay ₹500 to Ramesh', command: 'Pay 500 rupees to Ramesh K' },
    { label: 'Send ₹1,000 to Priya', command: 'Send 1000 rupees to Priya Sharma' },
    { label: 'Pay ₹200 to Aarav', command: 'Pay 200 rupees to Aarav Mehta' },
    { label: 'Pay Kavita ₹1,500', command: 'Pay 1500 rupees to Kavita Prasad' },
    { label: 'Apollo Pharmacy ₹350', command: 'Pay 350 to Apollo Pharmacy' },
    { label: 'Jammu Power ₹1,200', command: 'Pay 1200 to Jammu Power Dept' },
    { label: 'Sunil Verma ₹800', command: 'Send 800 rupees to Sunil Verma' },
    { label: 'Mohan Electrician ₹400', command: 'Pay 400 to Mohan Electrician' },
    { label: 'Asha Sharma ₹2,000', command: 'Send 2000 to Asha Sharma' },
    { label: 'Check Balance', command: 'Check my total balance' },
  ];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-assistant-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Dim backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Voice Assistant Sheet */}
      <div
        className="animate-slide-up"
        style={{
          position: 'relative',
          backgroundColor: 'var(--surface)',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '24px 20px 36px 20px',
          maxWidth: '480px',
          margin: '0 auto',
          width: '100%',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.22)',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Header bar */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor:
                  voiceState === 'listening'
                    ? '#ef4444'
                    : voiceState === 'processing'
                    ? '#3b82f6'
                    : '#10b981',
              }}
            />
            <h2 id="voice-assistant-title" style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {lang === 'hi' ? 'सरल वॉइस बैंकिंग सहायक' : 'Saral Voice Assistant'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close voice assistant"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              padding: '6px',
              cursor: 'pointer',
              borderRadius: '50%',
            }}
            className="interactive-tap hover:bg-slate-100"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Live Audio Status Visualizer with Equalizer Bars */}
        <div style={{ margin: '18px 0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          {voiceState === 'listening' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <button
                type="button"
                onClick={stopListening}
                className="animate-pulse-red-ring"
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  border: '3px solid #dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(220, 38, 38, 0.28)',
                }}
                aria-label="Listening to your voice. Tap to stop."
              >
                <MicIcon size={44} />
              </button>

              {/* Dynamic Equalizer Audio Waveform Bars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '34px' }}>
                <span style={{ width: '4px', backgroundColor: '#dc2626', borderRadius: '4px' }} className="animate-eq-1" />
                <span style={{ width: '4px', backgroundColor: '#dc2626', borderRadius: '4px' }} className="animate-eq-2" />
                <span style={{ width: '4px', backgroundColor: '#dc2626', borderRadius: '4px' }} className="animate-eq-3" />
                <span style={{ width: '4px', backgroundColor: '#dc2626', borderRadius: '4px' }} className="animate-eq-4" />
                <span style={{ width: '4px', backgroundColor: '#dc2626', borderRadius: '4px' }} className="animate-eq-5" />
              </div>
            </div>
          )}

          {voiceState === 'processing' && (
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                border: '4px solid var(--border)',
                borderTopColor: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="animate-spin-smooth"
            >
              <MicIcon size={34} className="text-blue-600 opacity-60" />
            </div>
          )}

          {voiceState === 'speaking' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <button
                type="button"
                onClick={startListening}
                className="animate-pulse-ring"
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-soft)',
                  color: 'var(--brand)',
                  border: '3px solid var(--brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(26, 86, 219, 0.25)',
                }}
                aria-label="Assistant speaking. Tap to speak again."
              >
                <Volume2Icon size={44} />
              </button>

              {/* Dynamic Equalizer Bars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '34px' }}>
                <span style={{ width: '4px', backgroundColor: 'var(--brand)', borderRadius: '4px' }} className="animate-eq-1" />
                <span style={{ width: '4px', backgroundColor: 'var(--brand)', borderRadius: '4px' }} className="animate-eq-2" />
                <span style={{ width: '4px', backgroundColor: 'var(--brand)', borderRadius: '4px' }} className="animate-eq-3" />
                <span style={{ width: '4px', backgroundColor: 'var(--brand)', borderRadius: '4px' }} className="animate-eq-4" />
                <span style={{ width: '4px', backgroundColor: 'var(--brand)', borderRadius: '4px' }} className="animate-eq-5" />
              </div>
            </div>
          )}

          {voiceState === 'pin_blocked' && (
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: '3px solid #dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="animate-shake"
            >
              <ShieldIcon size={44} />
            </div>
          )}

          {(voiceState === 'idle' || voiceState === 'permission' || voiceState === 'error') && (
            <button
              type="button"
              onClick={startListening}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-alt)',
                color: 'var(--text-primary)',
                border: '2px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              className="interactive-tap hover:border-blue-500"
              aria-label="Tap to speak"
            >
              <MicIcon size={44} />
            </button>
          )}
        </div>

        {/* State Label & Transcript */}
        <div style={{ minHeight: '56px', width: '100%', padding: '0 8px' }}>
          {voiceState === 'listening' && (
            <div>
              <p style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '1rem', margin: '0 0 6px 0' }}>
                {lang === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now'}
              </p>
              {transcript && (
                <div
                  style={{
                    backgroundColor: 'var(--surface-alt)',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '0.9375rem',
                    color: 'var(--text-primary)',
                    fontStyle: 'italic',
                    border: '1px solid var(--border)',
                  }}
                >
                  "{transcript}"
                </div>
              )}
            </div>
          )}

          {voiceState === 'processing' && (
            <p style={{ fontWeight: 600, color: 'var(--brand)', fontSize: '1rem', margin: 0 }}>
              {lang === 'hi' ? 'आदेश समझा जा रहा है...' : 'Processing your voice command...'}
            </p>
          )}

          {(voiceState === 'speaking' || voiceState === 'pin_blocked') && feedbackMessage && (
            <div
              style={{
                backgroundColor: voiceState === 'pin_blocked' ? '#fee2e2' : 'var(--brand-soft)',
                color: voiceState === 'pin_blocked' ? '#991b1b' : 'var(--brand)',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                lineHeight: 1.45,
                fontWeight: 600,
                textAlign: 'left',
                border: voiceState === 'pin_blocked' ? '1px solid #f87171' : '1px solid var(--brand)',
              }}
              className="animate-fade-in"
            >
              {feedbackMessage}
            </div>
          )}

          {voiceState === 'idle' && feedbackMessage && (
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9375rem', margin: 0, fontWeight: 500 }}>
              {feedbackMessage}
            </p>
          )}

          {voiceState === 'idle' && !feedbackMessage && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              {lang === 'hi'
                ? 'बोलिए: "रमेश को 500 रुपये भेजो", "प्रिया को 1000", या नीचे चुनें:'
                : 'Say: "Pay ₹500 to Ramesh", "Send ₹1,000 to Priya", or tap below:'}
            </p>
          )}
        </div>

        {/* Static Member Quick Test Chips */}
        <div style={{ width: '100%', marginTop: '16px' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textAlign: 'left',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <SparklesIcon size={14} className="text-amber-500" />
            <span>{lang === 'hi' ? 'त्वरित सदस्य और आदेश' : 'Recognized Members & Quick Commands'}</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              maxHeight: '120px',
              overflowY: 'auto',
              padding: '2px',
            }}
          >
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTranscript(p.command);
                  processVoiceCommand(p.command);
                }}
                style={{
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                className="interactive-tap hover:border-blue-500 hover:bg-blue-50"
              >
                <span>🎙️</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Security Rule for Blind Users Notice */}
        <div
          style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)',
            width: '100%',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ShieldIcon size={14} className="text-slate-400" />
          <span>Security Guarantee: PIN entry through voice is prohibited.</span>
        </div>
      </div>
    </div>
  );
}
