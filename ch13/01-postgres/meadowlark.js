const express = require("express");
const {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const handlers = require('./lib/handlers')
const weatherMiddleware = require('./lib/middleware/weather');
const credentials = require('./credentials');

const app = express();
app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options) {
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
  // redis missing
}));

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(weatherMiddleware);
app.get("/", handlers.home);
app.get("/newsletter", handlers.newsletter);
app.post("/api/newsletter-signup", handlers.api.newsletterSignup);
app.get('/vacations', handlers.listVacations);
app.get('/set-currency/:currency', handlers.setCurrency);
app.get('/notify-me-when-in-season', handlers.notifyWhenInSeasonForm);
app.post('/notify-me-when-in-season', handlers.notifyWhenInSeasonProcess);
app.get('/contest/vacation-photo-ajax', handlers.vacationPhotoContestAjax);

app.use(handlers.notFound);
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`)
  })
} else {
  module.exports = app;
}