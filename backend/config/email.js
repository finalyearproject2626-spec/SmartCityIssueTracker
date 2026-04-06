const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS ? String(process.env.EMAIL_PASS).replace(/^["']|["']$/g, '').replace(/\s/g, '').trim() : '';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  },
  // Prevent hanging forever on production networks (Render free tier)
  pool: false,
  maxConnections: 1,
  connectionTimeout: 15000
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
