const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_ADDRESS,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SSL === 'true', // Use true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: process.env.SMTP_OPENSSL_VERIFY_MODE === 'none'
  },

  //debug: true, // Habilita logs detalhados
  //logger: true, // Exibe os logs no console

});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.MAILER_SENDER_EMAIL,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
