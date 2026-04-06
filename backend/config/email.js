const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS ? String(process.env.EMAIL_PASS).replace(/^["']|["']$/g, '').replace(/\s/g, '').trim() : '';

// Prefer explicit SMTP config (more reliable than `service: 'gmail'` on hosts like Render)
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_SECURE = String(process.env.EMAIL_SECURE || '').toLowerCase() === 'true'; // true for 465, false for 587

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: emailUser,
    pass: emailPass
  },
  requireTLS: !EMAIL_SECURE,
  // Prevent hanging forever on production networks (Render free tier)
  pool: false,
  maxConnections: 1,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000
});

function isEmailConfigured() {
  return !!(emailUser && emailPass);
}

async function sendEmail({ to, subject, text, html }) {
  if (!isEmailConfigured()) {
    console.warn('Email not configured (EMAIL_USER/EMAIL_PASS). Skipping send.');
    return { skipped: true };
  }
  try {
    const sendPromise = transporter.sendMail({
      from: `"Smart City Issue Tracker" <${emailUser}>`,
      to,
      subject,
      text: text || (html && html.replace(/<[^>]*>/g, '')),
      html: html || text
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email send timed out')), 20000);
    });

    const info = await Promise.race([sendPromise, timeoutPromise]);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('Email send error:', err.message);
    throw err;
  }
}

module.exports = { sendEmail, isEmailConfigured };
