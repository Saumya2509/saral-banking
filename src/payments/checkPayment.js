// src/payments/checkPayment.js
// Universal payment safety and compliance checker from diff.md

export function checkPayment(user = {}, payment = {}, customConfig = {}) {
  const cfg = {
    safetyCheckOverPaise: 1000000, // ₹10,000 asks "Did someone call or message you?"
    simpleConfirmOverPaise: 500000, // ₹5,000 extra "Are you sure?" in Simple mode
    dailyLimitPaise: user.dailyLimitPaise || 100000, // ₹1,000 daily limit for Young Saver
    ...customConfig,
  };

  const steps = [];

  // Safety checks (all modes, always)
  if (payment.isNewPayee) {
    steps.push('safety.newPayee');
  }
  if (payment.amountPaise > cfg.safetyCheckOverPaise) {
    steps.push('safety.over10k');
  }
  if (payment.isRequest) {
    steps.push('safety.paymentRequest');
  }

  // Simple mode: extra confirmation over ₹5,000
  if (user.mode === 'simple' && payment.amountPaise > cfg.simpleConfirmOverPaise) {
    steps.push('confirm.simple');
  }

  // Young saver: over daily limit goes to mother Priya Sharma
  const totalToday = (payment.amountPaise || 0) + (payment.spentToday || 0);
  if (user.mode === 'young' && totalToday > 500000) {
    steps.push('guardian.approve');
  }

  return steps;
}

export default checkPayment;
