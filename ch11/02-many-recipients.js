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
  const largeRecipientList = new Array(10).fill().map((_, idx) => `customer${idx}@nowhere.com`);
  const recipientLimit = 2;
  const batches = largeRecipientList.reduce((batches, r) => {
    const lastBatch = batches[batches.length - 1];
    if (lastBatch.length < recipientLimit) {
      lastBatch.push(r);
    } else {
      batches.push([r]);
    }
    return batches; // [[customer0, customer1], [customer2, customer3]..[..]]
  }, [[]]);

  try {
    const results = await Promise.all(batches.map(batch => 
      mailTransport.sendMail({
        from: '"phm1605" <info@demomailtrap.com>',
        to: batch.join(', '),
        subject: "Special price on Hood River travel package!",
        text: "Book your trip to scenic Hood River now!"
      })
    ))
    console.log(results);
  } catch(err) {
    console.log('at least 1 email batch failed: ' + err.message);
  }
}

go();

