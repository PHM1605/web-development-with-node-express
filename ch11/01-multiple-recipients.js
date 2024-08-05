const nodemailer = require("nodemailer");
const credentials = require("./credentials");

const mailTransport = nodemailer.createTransport({
  host: credentials.mailtrap.host,
  auth: {
    user: credentials.mailtrap.user,
    pass: credentials.mailtrap.password
  }
});
async function go() {
  try {
    const result = await mailTransport.sendMail({
      from: '"phm1605" <info@demomailtrap.com>',
      to: 'phm1605@gmail.com',
      subject: 'Xin chào Thị Thị',
      text: 'Tui iu Thị Thị cơ mòa!'
    });
    console.log('mail sent successfully: ', result);
  } catch(err) {
    console.log('could not send mail: ' + err.message);
  }
}
go();