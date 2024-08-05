const express = require('express');
const {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const nodemailer = require('nodemailer');
const htmlToFormattedText = require('html-to-formatted-text');

const app = express();
const credentials = require("./credentials");
const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

app.engine("handlebars", engine({defaultLayout: "main"}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret
}));

const mailTransport = nodemailer.createTransport({
  host: credentials.mailtrap.host,
  auth: {
    user: credentials.mailtrap.user,
    pass: credentials.mailtrap.password
  }
});

app.post('/cart/checkout', (req, res, next) => {
  const cart = req.session.cart;
  if (!cart) next(new Error('Cart does not exist.'));
  const name = req.body.name || '', email = req.body.email || '';
  // input validation
  if (!email.match(VALID_EMAIL_REGEX)) {
    return res.next(new Error('Invalid email address.'));
  }
  // assign a random cart ID; normally we would use a database ID here
  cart.number = Math.random().toString().replace(/^0\.0*/, '');
  cart.billing = {
    name: name,
    email: email
  };
  // the first "render" is for email layout, the second "render" (in "then") is for browser. "layout: null" is to prevent using using "layouts" folder
  res.render('email/cart-thank-you', {layout: null, cart: cart}, (err, html) => {
    console.log('rendered email: ', html);
    if (err) {
      console.log('error in email template');
    }
    mailTransport.sendMail({
      from: '"phm1605" <info@demomailtrap.com>',
      to: cart.billing.email,
      subject: 'Thank You for Book your Trip with Meadowlark Travel',
      html: html,
      text: htmlToFormattedText(html)
    })
    .then(info => {
      console.log('sent! ', info);
      res.render('cart-thank-you', {cart: cart});
    })
    .catch(err => {
      console.error('Unable to send confirmation: ' + err.message);
    })
  })
})

app.get("*", (req, res) => {
  req.session.cart = {
    items: [
      {id: '82RgrqGCAHqCf6rA2vujbT', qty: 1, guests: 2},
      {id: 'bqBtwqxpB4ohuxCBXRE9tq', qty: 1}
    ]
  };
  res.render('04-home');
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}\n`))