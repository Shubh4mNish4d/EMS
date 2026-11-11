const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
 service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.SENDER_EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

async function sendEmail(to, subject, html) {
    try {
      const info = await transporter.sendMail({
          from: process.env.SENDER_EMAIL, // sender address
          to, // list of recipients
          subject, // subject line
          html // HTML body
      });

    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

module.exports = {sendEmail}