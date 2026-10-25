// Saral Banking — Canvas-based Payment Screenshot Generator
// Creates a high-DPI official transaction receipt image for sharing with merchants

import { formatINR } from './money.js';
import { formatDate, formatTime } from './dates.js';

function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

/**
 * Generates an official payment screenshot image on an HTML5 Canvas.
 * Returns { canvas, dataUrl, blob, file }
 */
export async function generatePaymentScreenshot({
  amountPaise = 0,
  payeeName = 'Merchant',
  payeeVpa = '',
  date = new Date().toISOString(),
  ref = '412345678901',
  fromAccount = '•••• 4821',
  fromName = 'Shankar Prasad',
  bankName = 'Saral Bank',
  note = '',
  lang = 'en',
}) {
  const width = 800;
  const height = 1100;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get 2D canvas context');

  // 1. Canvas Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#f8fafc');
  bgGrad.addColorStop(1, '#edf2f7');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Receipt Main Card
  const cardX = 40;
  const cardY = 40;
  const cardW = width - 80;
  const cardH = height - 80;
  const cardRadius = 28;

  // Card Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#ffffff';
  drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();
  ctx.restore();

  // Card Border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.stroke();

  // 3. Top Decorative Header Strip
  const topStripGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
  topStripGrad.addColorStop(0, '#1e40af');
  topStripGrad.addColorStop(1, '#3b82f6');
  ctx.fillStyle = topStripGrad;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(cardX, cardY, cardW, 80, [cardRadius, cardRadius, 0, 0]);
  } else {
    ctx.rect(cardX, cardY, cardW, 80);
  }
  ctx.fill();

  // Bank Logo Badge on Top Strip
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🏛️  SARAL BANK', cardX + 28, cardY + 48);

  // Top Right Security Badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '600 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('✓ UPI VERIFIED PAYMENT', cardX + cardW - 28, cardY + 48);

  // 4. Large Circular Green Checkmark
  const badgeCenterX = width / 2;
  const badgeCenterY = cardY + 160;
  const badgeRadius = 46;

  // Outer glowing ring
  ctx.fillStyle = '#ecfdf5';
  ctx.beginPath();
  ctx.arc(badgeCenterX, badgeCenterY, badgeRadius + 8, 0, Math.PI * 2);
  ctx.fill();

  // Solid green circle
  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.arc(badgeCenterX, badgeCenterY, badgeRadius, 0, Math.PI * 2);
  ctx.fill();

  // White Checkmark Icon
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(badgeCenterX - 18, badgeCenterY);
  ctx.lineTo(badgeCenterX - 6, badgeCenterY + 13);
  ctx.lineTo(badgeCenterX + 19, badgeCenterY - 14);
  ctx.stroke();

  // 5. Payment Sent Headline
  ctx.fillStyle = '#065f46';
  ctx.font = '800 28px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  const headingText = lang === 'hi' ? 'भुगतान सफल!' : 'Payment Successful!';
  ctx.fillText(headingText, badgeCenterX, cardY + 242);

  // 6. Huge Amount Display
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 50px system-ui, -apple-system, sans-serif';
  ctx.fillText(formatINR(amountPaise), badgeCenterX, cardY + 306);

  // "Paid to [Merchant]"
  ctx.fillStyle = '#475569';
  ctx.font = '600 20px system-ui, -apple-system, sans-serif';
  const paidToText = lang === 'hi' ? `${payeeName} को भेजे गए` : `Paid to ${payeeName}`;
  ctx.fillText(paidToText, badgeCenterX, cardY + 342);

  // Date and Time
  const formattedDateTime = `${formatDate(date, lang)} at ${formatTime(date)}`;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(formattedDateTime, badgeCenterX, cardY + 372);

  // 7. Dashed Divider Line with Semicircle Coupon Cuts
  const dividerY = cardY + 410;

  // Left semicircle cutout
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.arc(cardX, dividerY, 14, -Math.PI / 2, Math.PI / 2);
  ctx.fill();

  // Right semicircle cutout
  ctx.beginPath();
  ctx.arc(cardX + cardW, dividerY, 14, Math.PI / 2, -Math.PI / 2);
  ctx.fill();

  // Dashed line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(cardX + 22, dividerY);
  ctx.lineTo(cardX + cardW - 22, dividerY);
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash

  // 8. Transaction Details Rows
  const startRowY = dividerY + 45;
  const rowSpacing = 52;
  const labelX = cardX + 36;
  const valueX = cardX + cardW - 36;

  const rows = [
    {
      label: lang === 'hi' ? 'प्राप्तकर्ता (To)' : 'Paid To',
      value: payeeName,
    },
    {
      label: lang === 'hi' ? 'UPI ID / खाता' : 'UPI ID / VPA',
      value: payeeVpa || `${payeeName.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`,
    },
    {
      label: lang === 'hi' ? 'खाते से (From)' : 'Debited From',
      value: `${fromName} (${fromAccount})`,
    },
    {
      label: lang === 'hi' ? 'लेनदेन संदर्भ संख्या (Ref)' : 'UPI Reference ID',
      value: ref,
    },
    {
      label: lang === 'hi' ? 'भुगतान स्थिति' : 'Payment Status',
      value: '✓ COMPLETED',
      isStatus: true,
    },
    ...(note ? [{ label: lang === 'hi' ? 'नोट' : 'Note', value: note }] : []),
  ];

  rows.forEach((row, i) => {
    const curY = startRowY + i * rowSpacing;

    // Label
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '500 17px system-ui, -apple-system, sans-serif';
    ctx.fillText(row.label, labelX, curY);

    // Value
    ctx.textAlign = 'right';
    if (row.isStatus) {
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 17px system-ui, -apple-system, sans-serif';
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.font = '600 18px system-ui, -apple-system, sans-serif';
    }

    // Truncate long value
    let valStr = String(row.value);
    if (valStr.length > 34) {
      valStr = valStr.substring(0, 31) + '...';
    }
    ctx.fillText(valStr, valueX, curY);

    // Subtle horizontal divider under each row
    if (i < rows.length - 1) {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(labelX, curY + 16);
      ctx.lineTo(valueX, curY + 16);
      ctx.stroke();
    }
  });

  // 9. Official Trust Badge Footer
  const footerBoxY = cardY + cardH - 145;
  const footerBoxH = 105;

  ctx.fillStyle = '#f8fafc';
  drawRoundRect(ctx, cardX + 24, footerBoxY, cardW - 48, footerBoxH, 16);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, cardX + 24, footerBoxY, cardW - 48, footerBoxH, 16);
  ctx.stroke();

  // Security icons & text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('🔒 100% SECURE BANK PAYMENT PROOF', width / 2, footerBoxY + 36);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 13px system-ui, -apple-system, sans-serif';
  const guaranteeText =
    lang === 'hi'
      ? 'यह इलेक्ट्रॉनिक रसीद भारतीय राष्ट्रीय भुगतान निगम (NPCI) और सरल बैंक द्वारा सत्यापित है।'
      : 'This electronic receipt is official proof of transaction, certified by NPCI & Saral Bank.';
  ctx.fillText(guaranteeText, width / 2, footerBoxY + 62);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 11px system-ui, -apple-system, sans-serif';
  ctx.fillText(`TRANSACTION ID: ${ref} · OFFICIAL PROOF FOR MERCHANT`, width / 2, footerBoxY + 84);

  // Convert to Blob and File
  const filename = `Saral_Receipt_${ref || 'tx'}.png`;

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const dataUrl = canvas.toDataURL('image/png');
      const file = blob
        ? new File([blob], filename, { type: 'image/png' })
        : null;

      resolve({
        canvas,
        dataUrl,
        blob,
        file,
        filename,
      });
    }, 'image/png');
  });
}

/**
 * Downloads the screenshot blob directly to device
 */
export function downloadScreenshotFile(dataUrl, filename = 'payment_receipt.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
