import React, { useState, useRef, useEffect } from 'react';
import Screen from '../../components/shell/Screen';
import Notice from '../../components/ui/Notice';
import { SendIcon, MicIcon, SparklesIcon, AlertTriangleIcon } from '../../components/icons/Icons';
import { searchFaq } from '../../data/faq.js';
import config from '../../data/config.js';
import { useI18n } from '../../i18n/index.js';

// Sensitive data pattern detectors (PINs, OTPs, Card numbers, Account numbers)
const SENSITIVE_PATTERNS = [
  { name: 'PIN', regex: /\b\d{4}\b/g },
  { name: 'OTP', regex: /\b\d{6}\b/g },
  { name: 'Card Number', regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g },
  { name: 'Account Number', regex: /\b\d{10,18}\b/g },
];

function sanitizeSensitiveData(text) {
  let sanitized = text;
  let detected = [];

  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.regex.test(sanitized)) {
      detected.push(pattern.name);
      sanitized = sanitized.replace(pattern.regex, '••••');
    }
  }

  return { sanitized, detected: [...new Set(detected)] };
}

export default function HelpChat() {
  const { lang, t } = useI18n();
  const messagesEndRef = useRef(null);

  const initialBotGreeting =
    lang === 'hi'
      ? 'नमस्ते! मैं आपका सरल सहायक हूँ। आप मुझसे अपने खाते, बैलेंस, सुरक्षित रहने या किसी भी सेवा के बारे में पूछ सकते हैं।'
      : 'Hello! I am your Saral Assistant. You can ask me about your balance, how to send money, safety tips, or bank charges.';

  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: initialBotGreeting, time: 'Just now' },
  ]);
  const [inputText, setInputText] = useState('');
  const [sensitiveWarning, setSensitiveWarning] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const suggestedQuestions =
    lang === 'hi'
      ? [
          'मेरा बैलेंस कैसे देखूँ?',
          'नए लाभार्थी की सीमा क्या है?',
          'धोखाधड़ी से कैसे बचें?',
          'कार्ड ब्लॉक कैसे करें?',
        ]
      : [
          'How do I check my balance?',
          'What is the new payee limit?',
          'How do I stay safe from scams?',
          'How do I block my debit card?',
        ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    // Check for sensitive data
    const { sanitized, detected } = sanitizeSensitiveData(query);

    if (detected.length > 0) {
      setSensitiveWarning(
        `Security Notice: We detected a possible ${detected.join(
          ' or '
        )}. For your security, never share PINs, OTPs, or full account numbers in chat. We have masked this data.`
      );
    } else {
      setSensitiveWarning(null);
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: sanitized,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Process answer from FAQ engine or AI assistant
    setTimeout(() => {
      const results = searchFaq(query, lang);
      let replyText = '';

      if (results && results.length > 0) {
        replyText = results[0].answer[lang] || results[0].answer.en;
      } else {
        replyText =
          lang === 'hi'
            ? `मुझे इस प्रश्न का सीधा उत्तर नहीं मिला। आप नीचे दिए गए सुझावों में से चुन सकते हैं या साइबर हेल्पलाइन ${config.helplines.cyber} पर कॉल कर सकते हैं।`
            : `I could not find a direct answer to that. You can try tapping one of the suggested questions below, or call our 24/7 helpline on ${config.helplines.cyber}.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText,
          time: 'Just now',
        },
      ]);
    }, 400);
  };

  // Voice speech-to-text integration
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript);
    };

    recognition.start();
  };

  return (
    <Screen title={t('rec.help.chat.title') || 'Ask a question'} hideTabBar>
      {/* Sensitive Data Warning Banner */}
      {sensitiveWarning && (
        <Notice type="safety" title="Privacy Protection">
          {sensitiveWarning}
        </Notice>
      )}

      {/* Suggested Questions Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              backgroundColor: 'var(--brand-soft)',
              color: 'var(--brand)',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '8px 0',
          minHeight: '260px',
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                width: '100%',
              }}
            >
              <div
                style={{
                  maxWidth: '82%',
                  padding: '12px 16px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  backgroundColor: isUser ? 'var(--brand)' : 'var(--surface-alt)',
                  color: isUser ? 'var(--brand-contrast, #ffffff)' : 'var(--text-primary)',
                  border: isUser ? 'none' : '1px solid var(--border)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.45,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                {!isUser && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand)', marginBottom: '4px' }}>
                    <SparklesIcon size={14} />
                    <span>Saral AI Assistant</span>
                  </div>
                )}
                <div>{msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field + Voice + Send button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: '480px',
          margin: '0 auto',
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '12px 16px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          zIndex: 30,
        }}
      >
        <button
          type="button"
          onClick={toggleVoiceInput}
          title={isListening ? 'Listening...' : 'Speak your question'}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: isListening ? '#fef2f2' : 'var(--surface-alt)',
            color: isListening ? 'var(--danger)' : 'var(--brand)',
            border: isListening ? '2px solid var(--danger)' : '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <MicIcon size={20} />
        </button>

        <input
          type="text"
          placeholder={t('rec.help.chat.placeholder') || 'Type your question...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          style={{
            flex: 1,
            height: '44px',
            borderRadius: '22px',
            padding: '0 16px',
            border: '1.5px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '0.9375rem',
            outline: 'none',
          }}
        />

        <button
          type="button"
          onClick={() => handleSendMessage()}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand)',
            color: 'var(--brand-contrast, #ffffff)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label="Send"
        >
          <SendIcon size={20} />
        </button>
      </div>
    </Screen>
  );
}
