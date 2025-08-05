const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test connection on startup (optional)
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection error:', error);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

async function emailSender(mailOptions) {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error in emailSender:', error);
    throw error;  // rethrow to handle upstream
  }
}

async function sendOTP(toEmail, otp) {
  try {
    const mailOptions = {
      from: '"Online Voting System" <no-reply@votingsystem.com>',
      to: toEmail,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Your OTP Code</h2>
          <p>Hello,</p>
          <p>Your OTP code is: <strong style="font-size: 18px;">${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>Thank you,<br/>Online Voting System</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email.');
  }
}

module.exports = { emailSender, sendOTP };
