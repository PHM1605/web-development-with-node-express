const nodemailer = require('nodemailer');
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
      to: '"Hoang Minh Pham" <phm1605@gmail.com>',
      subject: 'Your Meadowlark Travel Tour',
      html: '<h1>Meadowlark Travel</h1>\n<p>Thanks for book your trip with Meadowlark Travel. <b>We look forward to your visit!</b></p>',
      text: 'Thank you for booking your trip with Meadowlark Travel. We look forward to your visit!'
    });
    console.log('mail sent successfully: ', result);
  } catch (err) {
    console.log('could not send mail: ' + err.message);
  }
}

go();