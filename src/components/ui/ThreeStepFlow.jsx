import React, { useState } from 'react';
import StepHeader from './StepHeader';
import PinPad from './PinPad';
import Receipt from './Receipt';
import Field from './Field';
import BigButton from './BigButton';
import Notice from './Notice';
import config from '../../data/config.js';
import { useT } from '../../i18n/index.js';
import { playSuccessChime, playErrorTone } from '../../utils/audio.js';

/**
 * ThreeStepFlow component
 * Consistent flow engine for all money and service requests:
 * 1. Fill in -> 2. Review -> 3. PIN -> Receipt
 */
export default function ThreeStepFlow({
  fillContent,
  reviewContent,
  onConfirm,
  extraVerify = null, // 'otp' | null
  receiptData = null,
  onDone = null,
  canReview = true,
  className = '',
}) {
  const t = useT();
  const [currentStep, setCurrentStep] = useState(1); // 1: Fill, 2: Review, 2.5: OTP (if required), 3: PIN, 4: Receipt
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [pinError, setPinError] = useState('');

  const handleNextToReview = () => {
    setCurrentStep(2);
  };

  const handleNextToPin = () => {
    if (extraVerify === 'otp') {
      setCurrentStep(2.5);
    } else {
      setCurrentStep(3);
    }
  };

  const handleVerifyOtp = () => {
    if (otpValue.trim() === config.demoOtp) {
      setOtpError('');
      setCurrentStep(3);
    } else {
      setOtpError(`Please enter demo OTP: ${config.demoOtp}`);
    }
  };

  const handlePinSubmit = (enteredPin) => {
    if (enteredPin === config.demoPin) {
      setPinError('');
      playSuccessChime();
      if (onConfirm) {
        onConfirm(enteredPin);
      }
      setCurrentStep(4);
    } else {
      playErrorTone();
      setPinError(t('core.signin.wrongPin') || 'Wrong PIN. Demo PIN is 1234');
    }
  };

  return (
    <div style={{ width: '100%' }} className={className}>
      {currentStep === 1 && (
        <div>
          <StepHeader current={1} total={3} name={t('core.step.fill') || 'Fill in'} />
          {fillContent}
          <div style={{ marginTop: '24px' }}>
            <BigButton
              variant="primary"
              disabled={!canReview}
              onClick={handleNextToReview}
            >
              {t('core.btn.review') || 'Review'}
            </BigButton>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <StepHeader current={2} total={3} name={t('core.step.review') || 'Review'} />
          {reviewContent}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <BigButton variant="primary" onClick={handleNextToPin}>
              {t('core.btn.confirm') || 'Confirm with PIN'}
            </BigButton>
            <BigButton variant="secondary" onClick={() => setCurrentStep(1)}>
              {t('core.btn.change') || 'Change'}
            </BigButton>
          </div>
        </div>
      )}

      {currentStep === 2.5 && (
        <div>
          <StepHeader current={2} total={3} name="Verify OTP" />
          <Notice type="info">
            {`A demo verification code was generated for your security. Demo OTP: ${config.demoOtp}`}
          </Notice>
          <Field
            label="Enter OTP"
            placeholder={config.demoOtp}
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value)}
            error={otpError}
            hint="Check your messages for the 6-digit code."
          />
          <div style={{ marginTop: '24px' }}>
            <BigButton variant="primary" onClick={handleVerifyOtp}>
              Proceed to PIN
            </BigButton>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <StepHeader current={3} total={3} name={t('core.step.pin') || 'Confirm with PIN'} />
          <PinPad
            onSubmit={handlePinSubmit}
            error={pinError}
            title={t('core.signin.enterPin') || 'Enter your 4-digit PIN'}
          />
        </div>
      )}

      {currentStep === 4 && receiptData && (
        <Receipt
          title={receiptData.title}
          subtitle={receiptData.subtitle}
          items={receiptData.items}
          reference={receiptData.reference}
          onDone={onDone}
        />
      )}
    </div>
  );
}
