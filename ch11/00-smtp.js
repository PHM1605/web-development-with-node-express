const nodemailer = require("nodemailer");
const credentials = require("./credentials");

const mailTransport = nodemailer.createTransport({
  host: credentials.mailtrap.host,
  port: credentials.mailtrap.port,
  auth: {
    user: credentials.mailtrap.user,
    pass: credentials.mailtrap.password
  }
})

async function go() {
  try {
    const result = await mailTransport.sendMail({
      from: '"phm1605" <info@demomailtrap.com>',
      to: 'PHM1605@gmail.com',
      subject: 'Your Meadowlark Travel Tour',
      text: 'Thank you for booking your trip with Meadowlark Travel. We look forward to your visit!'
    })
    console.log('mail sent successfully: ', result);
  } catch(err) {
    console.log('could not send mail: ' + err.message);
  }
}

go();