import React, { useState, useEffect } from 'react';
import Sheet from './Sheet';
import BigButton from './BigButton';
import {
  DownloadIcon,
  ShareIcon,
  CheckIcon,
  CopyIcon,
  CameraIcon,
  ShieldIcon,
} from '../icons/Icons';
import { generatePaymentScreenshot, downloadScreenshotFile } from '../../utils/screenshot.js';
import { playSuccessChime } from '../../utils/audio.js';
import { useI18n } from '../../i18n/index.js';
import { formatINR } from '../../utils/money.js';

export default function PaymentScreenshotModal({ isOpen, onClose, receiptData }) {
  const { lang } = useI18n();

  const [screenshotResult, setScreenshotResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && receiptData) {
      generateImage();
    } else {
      setScreenshotResult(null);
      setFeedbackMsg('');
      setCopied(false);
    }
  }, [isOpen, receiptData]);

  const generateImage = async () => {
    setIsGenerating(true);
    setFeedbackMsg('');
    try {
      const result = await generatePaymentScreenshot({
        amountPaise: receiptData.amountPaise,
        payeeName: receiptData.payee?.name || receiptData.counterparty || 'Merchant',
        payeeVpa: receiptData.payee?.accountNumber || receiptData.payee?.vpa || '',
        date: receiptData.date || new Date().toISOString(),
        ref: receiptData.reference || receiptData.ref || '412345678901',
        fromAccount: receiptData.fromAccount || '•••• 4821',
        fromName: receiptData.fromName || 'Shankar Prasad',
        bankName: receiptData.bankName || 'Saral Bank',
        note: receiptData.note || '',
        lang,
      });

      setScreenshotResult(result);
    } catch (err) {
      console.error('Failed to generate payment screenshot:', err);
      setFeedbackMsg(lang === 'hi' ? 'स्क्रीनशॉट बनाने में त्रुटि' : 'Could not generate screenshot');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToMerchant = async () => {
    if (!screenshotResult) return;
    playSuccessChime();

    const payeeName = receiptData.payee?.name || receiptData.counterparty || 'Merchant';
    const amountStr = formatINR(receiptData.amountPaise);
    const refStr = receiptData.reference || receiptData.ref || '';

    const shareTitle = lang === 'hi' ? 'भुगतान रसीद' : 'Payment Receipt';
    const shareText =
      lang === 'hi'
        ? `सरल बैंक — भुगतान प्रमाण\nप्राप्तकर्ता: ${payeeName}\nराशि: ${amountStr}\nसंदर्भ संख्या: ${refStr}\nसफल लेनदेन।`
        : `Saral Bank — Payment Proof\nPaid to: ${payeeName}\nAmount: ${amountStr}\nUPI Ref: ${refStr}\nPayment Successful.`;

    // 1. Try Native Web Share with actual screenshot file
    if (navigator.canShare && screenshotResult.file && navigator.canShare({ files: [screenshotResult.file] })) {
      try {
        await navigator.share({
          files: [screenshotResult.file],
          title: shareTitle,
          text: shareText,
        });
        setFeedbackMsg(lang === 'hi' ? 'स्क्रीनशॉट भेजा गया!' : 'Screenshot shared successfully!');
        return;
      } catch (e) {
        if (e.name === 'AbortError') return;
      }
    }

    // 2. Try Standard Web Share without file
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
        });
        setFeedbackMsg(lang === 'hi' ? 'विवरण शेयर किया गया!' : 'Shared successfully!');
        return;
      } catch (e) {
        if (e.name === 'AbortError') return;
      }
    }

    // 3. Fallback: Download the file and open WhatsApp link
    downloadScreenshotFile(screenshotResult.dataUrl, screenshotResult.filename);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    setFeedbackMsg(lang === 'hi' ? 'स्क्रीनशॉट डाउनलोड हुआ और व्हाट्सएप खुला!' : 'Screenshot downloaded & WhatsApp opened!');
  };

  const handleDownload = () => {
    if (!screenshotResult) return;
    playSuccessChime();
    downloadScreenshotFile(screenshotResult.dataUrl, screenshotResult.filename);
    setFeedbackMsg(lang === 'hi' ? 'स्क्रीनशॉट गैलरी / डाउनलोड में सहेजा गया!' : 'Saved screenshot to your Downloads!');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleCopyImage = async () => {
    if (!screenshotResult?.blob) return;
    playSuccessChime();

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new window.ClipboardItem({ 'image/png': screenshotResult.blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        setFeedbackMsg(lang === 'hi' ? 'स्क्रीनशॉट कॉपी हो गया!' : 'Screenshot image copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
        return;
      }
    } catch (e) {
      console.warn('Clipboard write image failed, falling back to text:', e);
    }

    // Fallback: Copy reference text
    const text = `Saral Bank Payment Proof: ${formatINR(receiptData.amountPaise)} sent to ${receiptData.payee?.name || 'Merchant'}. Ref: ${receiptData.reference || receiptData.ref}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setFeedbackMsg(lang === 'hi' ? 'भुगतान विवरण कॉपी किया गया!' : 'Payment details copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'hi' ? 'दुकानदार / मर्चेंट को स्क्रीनशॉट भेजें' : 'Send Payment Screenshot'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        {/* Helper Note */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--surface-alt)',
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}
        >
          <CameraIcon size={18} className="text-blue-600 flex-shrink-0" />
          <span>
            {lang === 'hi'
              ? 'यह आधिकारिक भुगतान स्क्रीनशॉट मर्चेंट या दुकानदार को व्हाट्सएप / चैट पर भेजें।'
              : 'Share this official verified receipt screenshot directly with the merchant on WhatsApp or chat.'}
          </span>
        </div>

        {/* Screenshot Image Preview Container */}
        <div
          style={{
            width: '100%',
            maxHeight: '360px',
            overflowY: 'auto',
            borderRadius: '16px',
            border: '2px solid var(--border)',
            backgroundColor: '#0f172a',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            padding: '8px',
          }}
        >
          {isGenerating ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#ffffff' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '3px solid #38bdf8',
                  borderTopColor: 'transparent',
                  margin: '0 auto 12px auto',
                }}
                className="animate-spin-smooth"
              />
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {lang === 'hi' ? 'स्क्रीनशॉट तैयार हो रहा है...' : 'Generating Official Screenshot...'}
              </div>
            </div>
          ) : screenshotResult?.dataUrl ? (
            <img
              src={screenshotResult.dataUrl}
              alt="Payment Screenshot Preview"
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'contain',
                borderRadius: '10px',
              }}
            />
          ) : (
            <div style={{ padding: '30px', color: '#94a3b8', fontSize: '0.875rem' }}>
              {feedbackMsg || 'Could not load preview'}
            </div>
          )}
        </div>

        {/* Live Feedback Toast */}
        {feedbackMsg && (
          <div
            style={{
              width: '100%',
              backgroundColor: '#ecfdf5',
              border: '1px solid #059669',
              color: '#065f46',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textAlign: 'center',
            }}
            className="animate-fade-in"
          >
            ✓ {feedbackMsg}
          </div>
        )}

        {/* Main Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Primary: Send to Merchant */}
          <BigButton
            variant="primary"
            onClick={handleSendToMerchant}
            disabled={isGenerating || !screenshotResult}
          >
            <ShareIcon size={20} />
            <span style={{ marginLeft: '8px' }}>
              {lang === 'hi' ? 'दुकानदार को स्क्रीनशॉट भेजें' : 'Share Screenshot'}
            </span>
          </BigButton>

          {/* Secondary Actions Row: Download + Copy */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating || !screenshotResult}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-alt)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
              className="interactive-tap hover:border-blue-500"
            >
              <DownloadIcon size={18} />
              <span>{lang === 'hi' ? 'डाउनलोड करें' : 'Download Image'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyImage}
              disabled={isGenerating || !screenshotResult}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-alt)',
                color: copied ? 'var(--success)' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
              className="interactive-tap hover:border-blue-500"
            >
              {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
              <span>{copied ? (lang === 'hi' ? 'कॉपी हो गया!' : 'Copied!') : (lang === 'hi' ? 'इमेज कॉपी करें' : 'Copy Image')}</span>
            </button>
          </div>
        </div>

        {/* Security watermark footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '2px',
          }}
        >
          <ShieldIcon size={14} className="text-emerald-600" />
          <span>Verified NPCI & Bharat UPI payment proof</span>
        </div>
      </div>
    </Sheet>
  );
}
