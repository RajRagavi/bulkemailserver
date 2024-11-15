const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();  // To load environment variables from .env file

// Route to send bulk emails
router.post('/send-bulk-email', async (req, res) => {
  console.log('Received Headers:', req.headers);
  console.log('Received Body:', req.body);

  const { emailList, subject, message } = req.body;

  if (!emailList || !subject || !message) {
      return res.status(400).json({ error: 'Invalid data. Check JSON format and Content-Type.' });
  }

  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
      },
  });

  const mailOptions = {
      from: process.env.EMAIL_USER,
      subject,
      text: message,
  };

  try {
      const sendPromises = emailList.map((email) => {
          const options = { ...mailOptions, to: email.trim() };
          return transporter.sendMail(options);
      });

      await Promise.all(sendPromises);
      return res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
      console.error('Error sending emails:', error);
      return res.status(500).json({ error: 'Failed to send emails', details: error.message });
  }
});

module.exports = router;
