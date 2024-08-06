const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const handlers = require("./lib/handlers.js");
const weatherMiddleware = require("./lib/middleware/weather");

const app = express();

// configure handlebars view engine
app.engine('handlebars', engine({
  defaultLayout: "main",
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this);
      return null;
    }
  }
}))
app.set('view engine', 'handlebars')

// setup body-parser to read info from request
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"))

app.use(weatherMiddleware)

app.get("/", handlers.home)
app.get("/newsletter", handlers.newsletter)
app.post("/api/newsletter-signup", handlers.api.newsletterSignup)

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`);
  })
} else {
  module.exports = app;
}