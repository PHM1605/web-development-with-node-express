const nodemailer = require("nodemailer");
const htmlToFormattedText = require("html-to-formatted-text");

module.exports = credentials => {
  const mailTransport = nodemailer.createTransport({
    host: credentials.mailtrap.host,
    auth: {
      user: credentials.mailtrap.user,
      pass: credentials.mailtrap.password
    }
  });
  const from = '"phm1605" <info@demomailtrap.com>';
  const errorRecipient = 'phm1605@gmail.com';
  return {
    send: (to, subject, html) =>
      mailTransport.sendMail({
        from,
        to,
        subject,
        html,
        text: htmlToFormattedText(html)
      })
  }
}