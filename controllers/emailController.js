const nodemailer = require('nodemailer');

const sendBulkEmail = async (req, res) => {
    const { emails, subject, message } = req.body;

    // Validate required fields
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ error: 'Invalid email list. Ensure it is an array of email addresses.' });
    }
    if (!subject || !message) {
        return res.status(400).json({ error: 'Subject and message are required.' });
    }

    try {
        // Configure the nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Create email sending promises
        const emailSendPromises = emails.map((email) => {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email.trim(), // Ensure each email is trimmed to avoid errors
                subject: subject,
                text: message,
            };

            return transporter.sendMail(mailOptions);
        });

        // Wait for all emails to be sent
        await Promise.all(emailSendPromises);

        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error); // Log error details for debugging
        res.status(500).json({
            error: 'Failed to send emails. Please check the server logs for details.',
            details: error.message,
        });
    }
};

module.exports = { sendBulkEmail };
