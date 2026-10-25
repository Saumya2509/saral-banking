import React, { useState, useRef, useEffect } from 'react';
import Sheet from './Sheet';
import BigButton from './BigButton';
import Field from './Field';
import Notice from './Notice';
import {
  QrCodeIcon,
  CheckIcon,
  AlertCircleIcon,
  XIcon,
  ShieldIcon,
  SparklesIcon,
} from '../icons/Icons';
import { playSuccessChime, playErrorTone } from '../../utils/audio.js';
import { useI18n } from '../../i18n/index.js';
import { formatINR } from '../../utils/money.js';
import { parseUpiQr } from '../../utils/upi.js';
export { parseUpiQr };

/**
 * Parses a UPI string or URI into structured payee object
 * Handles: upi://pay?pa=...&pn=...&am=... as well as plain VPAs (e.g. name@upi)
 */
export function parseUpiString(text) {
  const strict = parseUpiQr(text);
  if (strict) return strict;

  let payeeName = 'Scanned Merchant';
  let vpa = (text || '').trim();
  let amountPaise = 0;

  if (vpa.includes('upi://pay')) {
    try {
      const queryPart = vpa.split('?')[1] || '';
      const params = new URLSearchParams(queryPart);
      if (params.get('pa')) vpa = params.get('pa');
      if (params.get('pn')) payeeName = decodeURIComponent(params.get('pn'));
      const am = params.get('am');
      if (am) amountPaise = Math.round(parseFloat(am) * 100);
    } catch (e) {
      const paMatch = vpa.match(/pa=([^&]+)/);
      const pnMatch = vpa.match(/pn=([^&]+)/);
      const amMatch = vpa.match(/am=([^&]+)/);
      if (paMatch) vpa = decodeURIComponent(paMatch[1]);
      if (pnMatch) payeeName = decodeURIComponent(pnMatch[1]);
      if (amMatch) amountPaise = Math.round(parseFloat(amMatch[1]) * 100);
    }
  } else if (vpa.includes('@')) {
    const parts = vpa.split('@');
    payeeName = parts[0].replace(/[^a-zA-Z0-9 ]/g, ' ').trim() || 'UPI Payee';
  }

  return {
    name: payeeName,
    bank: 'UPI / Bharat QR',
    accountNumber: vpa,
    amountPaise: amountPaise > 0 ? amountPaise : undefined,
  };
}

/**
 * Complete, Robust Camera QR Code Scanner with User Approval
 * Features:
 * - Live camera stream with permissions approval handling
 * - Permanent video element mounting (no null reference bugs)
 * - Front / Rear camera switching
 * - Hardware BarcodeDetector scanning loop + audio feedback
 * - Gallery image upload QR detection
 * - Interactive viewfinder tap-to-capture
 * - Verified sample merchant cards with real amounts
 * - Manual UPI ID fallback
 * - Full Hindi & English localization
 */
export default function QrScanner({ isOpen, onClose, onScanSuccess }) {
  const { lang, t } = useI18n();

  const [cameraState, setCameraState] = useState('idle'); // 'idle' | 'requesting' | 'streaming' | 'denied'
  const [errorMessage, setErrorMessage] = useState('');
  const [qrError, setQrError] = useState('');
  const [manualUpi, setManualUpi] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [lastScanned, setLastScanned] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  const sampleQrs = [
    {
      name: 'Sharma Medical Hall',
      bank: 'Punjab National Bank',
      vpa: 'sharma.med@upi',
      amountPaise: 45000,
      desc: lang === 'hi' ? 'दवा और स्वास्थ्य' : 'Medicines & Health',
    },
    {
      name: 'Mother Dairy Jammu',
      bank: 'State Bank of India',
      vpa: 'motherdairy@upi',
      amountPaise: 12000,
      desc: lang === 'hi' ? 'दूध और दैनिक किराना' : 'Dairy & Daily Needs',
    },
    {
      name: 'Verma Grocery Mart',
      bank: 'HDFC Bank',
      vpa: 'vermagrocery@upi',
      amountPaise: 85000,
      desc: lang === 'hi' ? 'किराना मार्ट' : 'Supermarket & Provisions',
    },
    {
      name: 'Ramesh K (Personal)',
      bank: 'State Bank of India',
      vpa: 'ramesh@upi',
      amountPaise: 50000,
      desc: lang === 'hi' ? 'व्यक्तिगत भुगतान' : 'Personal Contact',
    },
    {
      name: 'Jammu Power Dept',
      bank: 'State Bank of India',
      vpa: 'jammupower@upi',
      amountPaise: 120000,
      desc: lang === 'hi' ? 'बिजली बिल' : 'Electricity Utility',
    },
    {
      name: 'Swiggy Food Jammu',
      bank: 'ICICI Bank',
      vpa: 'swiggy@upi',
      amountPaise: 34000,
      desc: lang === 'hi' ? 'भोजन डिलीवरी' : 'Food & Dining',
    },
  ];

  // Stop camera when closing
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    } else {
      setCameraState('idle');
      setErrorMessage('');
      setLastScanned(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const stopCamera = () => {
    if (scanTimerRef.current) {
      clearInterval(scanTimerRef.current);
      clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('idle');
  };

  const startCamera = async (mode = facingMode) => {
    setErrorMessage('');
    setCameraState('requesting');

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('denied');
      setErrorMessage(
        lang === 'hi'
          ? 'आपके ब्राउज़र में कैमरा समर्थित नहीं है। कृपया नीचे दिए गए मर्चेंट QR या UPI ID का उपयोग करें।'
          : 'Camera access is not supported by your browser environment. Please select a sample merchant or enter UPI ID below.'
      );
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Attach stream to permanently mounted video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (e) {
          console.warn('Video play warning:', e);
        }
      }

      setCameraState('streaming');

      // Native BarcodeDetector loop if supported by browser (Chrome / Edge / Android)
      if ('BarcodeDetector' in window) {
        try {
          const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const detectInterval = setInterval(async () => {
            if (!videoRef.current || videoRef.current.readyState < 2) return;
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                clearInterval(detectInterval);
                handleQrDetected(barcodes[0].rawValue);
              }
            } catch (e) {}
          }, 250);

          scanTimerRef.current = detectInterval;
        } catch (e) {}
      }
    } catch (err) {
      setCameraState('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage(
          lang === 'hi'
            ? 'कैमरा अनुमति अस्वीकार कर दी गई। कृपया ब्राउज़र सेटिंग्स में कैमरा अनुमति दें या नीचे दिए गए मर्चेंट चुनें।'
            : 'Camera permission was denied. Please allow camera access in your browser or select a sample merchant below.'
        );
      } else {
        setErrorMessage(
          lang === 'hi'
            ? `कैमरा शुरू नहीं हो सका: ${err.message || 'त्रुटि'}`
            : `Could not start camera: ${err.message || 'Unknown device error'}`
        );
      }
    }
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleQrDetected = (qrValue) => {
    const parsed = parseUpiQr(qrValue);
    if (!parsed) {
      playErrorTone();
      stopCamera();
      const msg =
        lang === 'hi'
          ? 'यह भुगतान का QR कोड नहीं है। दूसरा आज़माएँ।'
          : lang === 'ta'
          ? 'இது பணம் செலுத்தும் QR குறியீடு அல்ல. வேறொன்றை முயற்சிக்கவும்.'
          : 'This is not a payment QR code. Try another one.';
      setQrError(msg);
      return;
    }

    setQrError('');
    playSuccessChime();
    stopCamera();

    setLastScanned(parsed);

    setTimeout(() => {
      onScanSuccess(parsed);
      onClose();
    }, 400);
  };

  const handleCaptureFrame = async () => {
    // If BarcodeDetector is available, try immediate detect
    if ('BarcodeDetector' in window && videoRef.current) {
      try {
        const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await barcodeDetector.detect(videoRef.current);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          handleQrDetected(barcodes[0].rawValue);
          return;
        }
      } catch (e) {}
    }

    // If capture frame failed to detect a valid QR
    playErrorTone();
    stopCamera();
    const msg =
      lang === 'hi'
        ? 'यह भुगतान का QR कोड नहीं है। दूसरा आज़माएँ।'
        : lang === 'ta'
        ? 'இது பணம் செலுத்தும் QR குறியீடு அல்ல. வேறொன்றை முயற்சிக்கவும்.'
        : 'This is not a payment QR code. Try another one.';
    setQrError(msg);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if ('BarcodeDetector' in window) {
      try {
        const imageBitmap = await createImageBitmap(file);
        const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await barcodeDetector.detect(imageBitmap);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          handleQrDetected(barcodes[0].rawValue);
          return;
        }
      } catch (err) {
        console.warn('BarcodeDetector on image file failed:', err);
      }
    }

    // Rejected upload
    playErrorTone();
    stopCamera();
    const msg =
      lang === 'hi'
        ? 'यह भुगतान का QR कोड नहीं है। दूसरा आज़माएँ।'
        : lang === 'ta'
        ? 'இது பணம் செலுத்தும் QR குறியீடு அல்ல. வேறொன்றை முயற்சிக்கவும்.'
        : 'This is not a payment QR code. Try another one.';
    setQrError(msg);
  };

  const handleSelectSample = (sample) => {
    playSuccessChime();
    stopCamera();

    const payeeData = {
      name: sample.name,
      bank: sample.bank,
      accountNumber: sample.vpa,
      amountPaise: sample.amountPaise,
    };

    setLastScanned(payeeData);

    setTimeout(() => {
      onScanSuccess(payeeData);
      onClose();
    }, 300);
  };

  const handleManualSubmit = () => {
    if (!manualUpi.trim()) return;
    playSuccessChime();
    stopCamera();

    const parsed = parseUpiString(manualUpi.trim());
    onScanSuccess(parsed);
    onClose();
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'hi' ? 'QR कोड स्कैन या UPI ID' : lang === 'ta' ? 'QR குறியீட்டை ஸ்கேன் செய்க' : 'Scan QR Code or Enter UPI ID'}
    >
      {/* Rejected QR Calm Notification per change.md §4 */}
      {qrError && (
        <div
          style={{
            padding: '14px 16px',
            backgroundColor: '#fef2f2',
            border: '1.5px solid #f87171',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '14px',
          }}
        >
          <div style={{ color: '#b91c1c', fontWeight: 600, fontSize: '0.9375rem', marginBottom: '10px' }}>
            {qrError}
          </div>
          <button
            type="button"
            onClick={() => {
              setQrError('');
              startCamera();
            }}
            style={{
              backgroundColor: 'var(--brand)',
              color: '#ffffff',
              border: 'none',
              padding: '6px 18px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
            className="interactive-tap"
          >
            {lang === 'hi' ? 'दूसरा आज़माएँ' : lang === 'ta' ? 'வேறொன்றை முயற்சிக்கவும்' : 'Try another one'}
          </button>
        </div>
      )}

      {/* 1. Camera Viewport / Request Box */}
      <div
        style={{
          width: '100%',
          height: '260px',
          backgroundColor: '#0a0f1d',
          borderRadius: '16px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          overflow: 'hidden',
          marginBottom: '16px',
          boxShadow: 'inset 0 0 24px rgba(0,0,0,0.6)',
        }}
      >
        {/* Permanent video element: always mounted in DOM to prevent null reference */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: cameraState === 'streaming' ? 'block' : 'none',
          }}
        />

        {/* STREAMING ACTIVE STATE */}
        {cameraState === 'streaming' && (
          <>
            {/* Viewfinder Target Frame */}
            <div
              style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                border: '2px solid rgba(255, 255, 255, 0.45)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.48)',
                cursor: 'pointer',
              }}
              onClick={handleCaptureFrame}
              title="Tap frame to capture QR"
            >
              {/* Corner markers */}
              <div
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  width: '22px',
                  height: '22px',
                  borderTop: '4px solid #38bdf8',
                  borderLeft: '4px solid #38bdf8',
                  borderRadius: '4px 0 0 0',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '22px',
                  height: '22px',
                  borderTop: '4px solid #38bdf8',
                  borderRight: '4px solid #38bdf8',
                  borderRadius: '0 4px 0 0',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '-2px',
                  width: '22px',
                  height: '22px',
                  borderBottom: '4px solid #38bdf8',
                  borderLeft: '4px solid #38bdf8',
                  borderRadius: '0 0 0 4px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '22px',
                  height: '22px',
                  borderBottom: '4px solid #38bdf8',
                  borderRight: '4px solid #38bdf8',
                  borderRadius: '0 0 4px 0',
                }}
              />

              {/* Animated Laser Sweep */}
              <div
                className="animate-laser"
                style={{
                  position: 'absolute',
                  width: '90%',
                  height: '2px',
                  backgroundColor: '#38bdf8',
                  boxShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8',
                }}
              />
            </div>

            {/* Top Floating Controls */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 5,
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  color: '#38bdf8',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#22c55e',
                  }}
                  className="animate-pulse"
                />
                {lang === 'hi' ? 'कैमरा चालू है' : 'Camera Live'}
              </span>

              {/* Flip camera */}
              <button
                type="button"
                onClick={toggleCameraFacing}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
                className="interactive-tap"
                title={lang === 'hi' ? 'कैमरा बदलें' : 'Switch Camera'}
              >
                🔄
              </button>
            </div>

            {/* Bottom Floating Tap to Scan Action */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                right: '12px',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 5,
              }}
            >
              <button
                type="button"
                onClick={handleCaptureFrame}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(15, 23, 42, 0.88)',
                  border: '1.5px solid #38bdf8',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                className="interactive-tap"
              >
                <span>📸</span>
                <span>{lang === 'hi' ? 'स्कैन करने के लिए टैप करें' : 'Tap to Capture & Scan'}</span>
              </button>
            </div>
          </>
        )}

        {/* REQUESTING CAMERA APPROVAL */}
        {cameraState === 'requesting' && (
          <div style={{ textAlign: 'center', padding: '20px', zIndex: 2 }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '3px solid #38bdf8',
                borderTopColor: 'transparent',
                margin: '0 auto 12px auto',
              }}
              className="animate-spin-smooth"
            />
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
              {lang === 'hi' ? 'कैमरा अनुमति की प्रतीक्षा...' : 'Requesting Camera Access...'}
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '6px' }}>
              {lang === 'hi'
                ? 'कृपया अपने ब्राउज़र में "Allow" या "अनुमति दें" पर टैप करें'
                : 'Please tap "Allow" in the browser permission prompt'}
            </div>
          </div>
        )}

        {/* DENIED OR ERROR STATE */}
        {cameraState === 'denied' && (
          <div style={{ textAlign: 'center', padding: '16px 20px', zIndex: 2, maxWidth: '320px' }}>
            <AlertCircleIcon size={38} className="text-red-400 mb-2" />
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#fca5a5' }}>
              {lang === 'hi' ? 'कैमरा अनुमति आवश्यक है' : 'Camera Permission Needed'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '6px', lineHeight: 1.4 }}>
              {errorMessage}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => startCamera()}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#38bdf8',
                  color: '#0f172a',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                className="interactive-tap"
              >
                {lang === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                className="interactive-tap"
              >
                {lang === 'hi' ? 'फोटो अपलोड करें' : 'Upload Image'}
              </button>
            </div>
          </div>
        )}

        {/* IDLE STATE: PROMINENT CAMERA APPROVAL BUTTON */}
        {cameraState === 'idle' && (
          <div style={{ textAlign: 'center', padding: '20px', zIndex: 2 }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <QrCodeIcon size={36} />
            </div>

            <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '4px', color: '#ffffff' }}>
              {lang === 'hi' ? 'भारत QR / UPI QR स्कैन करें' : 'Scan Bharat QR / UPI QR'}
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: '0 auto 16px auto', maxWidth: '280px' }}>
              {lang === 'hi'
                ? 'कैमरा चालू करके किसी भी मर्चेंट या बिलर का QR कोड स्कैन करें'
                : 'Grant camera access to scan and pay any merchant or biller QR code'}
            </p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => startCamera()}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--brand)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(26, 86, 219, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                className="interactive-tap"
              >
                <span>📷</span>
                <span>{lang === 'hi' ? 'कैमरा स्कैनर शुरू करें' : 'Enable Camera Scanner'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#1e293b',
                  color: '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                }}
                className="interactive-tap"
                title={lang === 'hi' ? 'गैलरी से QR चुनें' : 'Upload from gallery'}
              >
                🖼️
              </button>
            </div>
          </div>
        )}

        {/* Hidden file input for image QR uploads */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </div>

      {/* 2. Direct UPI ID Fallback */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <Field
          label={lang === 'hi' ? 'या सीधे UPI ID दर्ज करें' : 'Or enter recipient UPI ID directly'}
          placeholder="e.g. name@upi, 9876543210@pay"
          value={manualUpi}
          onChange={(e) => setManualUpi(e.target.value)}
        />
        <BigButton variant="primary" onClick={handleManualSubmit} disabled={!manualUpi.trim()}>
          {lang === 'hi' ? 'UPI ID से आगे बढ़ें' : 'Proceed with UPI ID'}
        </BigButton>
      </div>

      {/* Security Guarantee Note */}
      <div
        style={{
          marginTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <ShieldIcon size={14} className="text-emerald-600" />
        <span>
          {lang === 'hi'
            ? 'सुरक्षित भारत QR / UPI भुगतान · राशि की पुष्टि हमेशा समीक्षा स्क्रीन पर होगी'
            : 'Secured Bharat QR / UPI payment · Always verify amount on review screen'}
        </span>
      </div>
    </Sheet>
  );
}
