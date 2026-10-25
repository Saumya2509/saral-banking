import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Notice from '../../components/ui/Notice';
import SaralAiLogo from '../../components/ui/SaralAiLogo';
import { SendIcon, MicIcon, AlertTriangleIcon } from '../../components/icons/Icons';
import { maskSensitive } from '../../../shared/mask.js';
import { MAX_CHARS, MAX_HISTORY, WARNING_TEXT, keywordAnswer, askServer } from '../../utils/chat.js';
import { useI18n } from '../../i18n/index.js';

export default function HelpChat() {
  const { lang, t } = useI18n();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const initialBotGreeting =
    lang === 'hi'
      ? 'नमस्ते! मैं आपका सरल एआई सहायक हूँ। आप मुझसे अपने खाते, बैलेंस, सुरक्षित रहने या किसी भी बैंकिंग सेवा के बारे में पूछ सकते हैं।'
      : 'Hello! I am your Saral AI Assistant. You can ask me about your account, balance, safety tips, or how to use any bank feature.';

  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: initialBotGreeting, time: 'Just now' },
  ]);
  const [history, setHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingTxn, setPendingTxn] = useState(location.state?.txn || null);

  const suggestedQuestions =
    lang === 'hi'
      ? [
          'मेरा बैलेंस कैसे देखूँ?',
          'ATM चार्ज क्यों कटा?',
          'नए लाभार्थी की सीमा क्या है?',
          'धोखाधड़ी से कैसे बचें?',
          'न्यूनतम बैलेंस शुल्क क्या है?',
          'कार्ड ब्लॉक कैसे करें?',
        ]
      : [
          'How do I check my balance?',
          'Why was an ATM charge deducted?',
          'What is the new payee 24h limit?',
          'How do I stay safe from scams?',
          'What is minimum balance charge?',
          'How do I block my debit card?',
        ];

  const sendMessage = async (rawText, txnContext = pendingTxn) => {
    let text = (rawText || inputText).trim();
    if (!text || isBusy) return;

    if (text.length > MAX_CHARS) {
      text = text.slice(0, MAX_CHARS);
    }

    // 1) Mask BEFORE anything leaves the page, and before it is shown
    const m = maskSensitive(text);

    const newMessages = [];

    // If anything sensitive was masked, show local warning bubble immediately
    if (m.masked) {
      newMessages.push({
        id: `warn_${Date.now()}`,
        sender: 'system',
        text: WARNING_TEXT,
        isWarning: true,
      });
    }

    // User message bubble with masked text
    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: m.text,
      time: 'Just now',
    };
    newMessages.push(userMsg);

    setMessages((prev) => [...prev, ...newMessages]);
    setInputText('');

    // Update history (last 10 messages)
    const nextHistory = [...history, { role: 'user', text: m.text }].slice(-MAX_HISTORY);
    setHistory(nextHistory);

    // 2) txn: only the plain and raw descriptions
    const safeTxn = txnContext
      ? { plain: txnContext.plain || '', raw: txnContext.raw || '' }
      : null;

    setIsBusy(true);
    let reply = '';
    let isFallback = false;

    try {
      reply = await askServer(nextHistory, safeTxn);
    } catch {
      isFallback = true;
      reply = keywordAnswer(m.text, safeTxn, lang);
    } finally {
      setIsBusy(false);
    }

    const botMsg = {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: reply,
      isFallback,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, botMsg]);
    setHistory((prev) => [...prev, { role: 'assistant', text: reply }].slice(-MAX_HISTORY));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBusy]);

  // Handle incoming "Ask about this" transaction from location state
  useEffect(() => {
    if (location.state?.txn && location.state?.initialQuestion) {
      const q = location.state.initialQuestion;
      const tData = location.state.txn;
      setPendingTxn(tData);
      sendMessage(q, tData);
    }
  }, [location.state]);

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
      sendMessage(transcript);
    };

    recognition.start();
  };

  return (
    <Screen title={t('rec.help.chat.title') || 'Ask a question'} hideTabBar>
      {/* If navigating with transaction context, show banner */}
      {pendingTxn && (
        <Notice type="info" title={lang === 'hi' ? 'लेन-देन संदर्भ' : 'Transaction Context'}>
          <div style={{ fontSize: '0.8125rem' }}>
            <strong>{pendingTxn.plain || 'Transaction'}</strong>
            {pendingTxn.raw && (
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.85, marginTop: '2px' }}>
                {maskSensitive(pendingTxn.raw).text}
              </div>
            )}
          </div>
        </Notice>
      )}

      {/* Suggested Questions Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isBusy}
            onClick={() => sendMessage(q)}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              backgroundColor: 'var(--brand-soft)',
              color: 'var(--brand)',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: isBusy ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              opacity: isBusy ? 0.6 : 1,
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
          padding: '8px 0 80px 0',
          minHeight: '260px',
        }}
      >
        {messages.map((msg) => {
          if (msg.sender === 'system' || msg.isWarning) {
            return (
              <div
                key={msg.id}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--danger-soft, #fef2f2)',
                  color: 'var(--danger, #dc2626)',
                  borderRadius: '12px',
                  border: '1px solid var(--danger-border, #fca5a5)',
                  fontSize: '0.875rem',
                  lineHeight: 1.4,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <AlertTriangleIcon size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
              </div>
            );
          }

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
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  backgroundColor: isUser ? 'var(--brand)' : 'var(--surface-alt)',
                  color: isUser ? 'var(--brand-contrast, #ffffff)' : 'var(--text-primary)',
                  border: isUser ? 'none' : '1px solid var(--border)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.45,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  wordBreak: 'break-word',
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--brand)',
                      marginBottom: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <SaralAiLogo size={20} animated />
                      <span>Saral AI Assistant</span>
                    </div>
                    {msg.isFallback && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          backgroundColor: 'var(--surface)',
                          color: 'var(--text-muted)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          border: '1px solid var(--border)',
                        }}
                      >
                        Offline Guide
                      </span>
                    )}
                  </div>
                )}
                <div>{msg.text}</div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isBusy && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '16px 16px 16px 4px',
              backgroundColor: 'var(--surface-alt)',
              border: '1.5px solid var(--border)',
              width: 'fit-content',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <SaralAiLogo size={20} animated />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px' }}>
              Thinking
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--text-muted)',
                animation: 'chatDotBlink 1.2s infinite ease-in-out',
              }}
            />
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--text-muted)',
                animation: 'chatDotBlink 1.2s infinite ease-in-out 0.2s',
              }}
            />
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--text-muted)',
                animation: 'chatDotBlink 1.2s infinite ease-in-out 0.4s',
              }}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field + Voice + Character Counter + Send button */}
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
          padding: '10px 16px 12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={toggleVoiceInput}
            disabled={isBusy}
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
              cursor: isBusy ? 'not-allowed' : 'pointer',
              flexShrink: 0,
            }}
          >
            <MicIcon size={20} />
          </button>

          <input
            type="text"
            maxLength={MAX_CHARS}
            disabled={isBusy}
            placeholder={t('rec.help.chat.placeholder') || 'Type your question... (max 500 chars)'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
              }
            }}
            style={{
              flex: 1,
              height: '44px',
              borderRadius: '22px',
              padding: '0 16px',
              border: '1.5px solid var(--border)',
              backgroundColor: isBusy ? 'var(--surface-alt)' : 'var(--surface)',
              color: 'var(--text-primary)',
              fontSize: '0.9375rem',
              outline: 'none',
            }}
          />

          <button
            type="button"
            disabled={isBusy || !inputText.trim()}
            onClick={() => sendMessage()}
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
              cursor: isBusy || !inputText.trim() ? 'not-allowed' : 'pointer',
              opacity: isBusy || !inputText.trim() ? 0.5 : 1,
              flexShrink: 0,
            }}
            aria-label="Send"
          >
            <SendIcon size={20} />
          </button>
        </div>

        {/* Character counter */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            fontSize: '0.6875rem',
            color: inputText.length >= MAX_CHARS ? 'var(--danger)' : 'var(--text-muted)',
            paddingRight: '56px',
          }}
        >
          {inputText.length} / {MAX_CHARS}
        </div>
      </div>

      <style>{`
        @keyframes chatDotBlink {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </Screen>
  );
}
