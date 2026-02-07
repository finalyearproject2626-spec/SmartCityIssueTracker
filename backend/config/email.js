const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS ? String(process.env.EMAIL_PASS).replace(/^["']|["']$/g, '').replace(/\s/g, '').trim() : '';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
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
    const info = await transporter.sendMail({
      from: `"Smart City Issue Tracker" <${emailUser}>`,
      to,
      subject,
      text: text || (html && html.replace(/<[^>]*>/g, '')),
      html: html || text
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('Email send error:', err.message);
    throw err;
  }
}

module.exports = { sendEmail, isEmailConfigured };
