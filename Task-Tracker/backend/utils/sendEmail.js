// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');
const logger = require('./logger');
const { NODE_ENV } = require('../config/env');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    logger.error('SMTP connection error:', error);
  } else {
    logger.info('Server is ready to send emails');
  }
});

exports.sendEmail = async (options) => {
  if (NODE_ENV === 'test') {
    logger.info('Email sending skipped in test environment');
    return;
  }

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    await transporter.sendMail(message);
    logger.info(`Email sent to ${options.email}`);
  } catch (err) {
    logger.error(`Email send error: ${err.message}`);
    throw err;
  }
};