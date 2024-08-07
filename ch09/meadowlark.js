const express = require('express');
const {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require("express-session");
const credentials = require("./config");
const handlers = require("./lib/handlers");
const weatherMiddleware = require("./lib/middleware/weather");
const flashMiddleware = require("./lib/middleware/flash");

const app = express();
const port = process.env.PORT || 3000;

// set handlebars for view
app.engine("handlebars", engine({
  defaultLayout: "main",
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
}))
app.set('view engine', 'handlebars');

// turn on body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// use cookie & session
// NOTE: for session we only work on the "req" object
app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret
}))
app.use(express.static(__dirname + "/public"));
app.use(weatherMiddleware);
app.use(flashMiddleware);
app.get("/", handlers.home);
app.get("/newsletter-signup", handlers.newsletterSignup);
app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);
app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);
app.get("/newsletter-archive", handlers.newsletterArchive);
app.use(handlers.notFound);
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`)
  })
} else {
  module.exports = app;
}