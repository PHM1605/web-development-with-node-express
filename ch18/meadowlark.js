const express = require("express");
const {engine} = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const credentials = require("./credentials");
const csrf = require("csurf");
const handlers = require("./lib/handlers");

const {createClient} = require("redis");
const RedisStore = require("connect-redis").default;
const redisClient = createClient({
  url: credentials.redis.url
});
redisClient.connect().catch(console.error);

const app = express();
const port = process.env.PORT || 3000;

app.use("/api", cors());
app.engine("handlebars", engine({
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this);
      return null 
    }
  }
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
  store: new RedisStore({
    client: redisClient
  })
}))

// csurf middleware adds the csrfToken method to "req" object
app.use(csrf({cookie: true}));
app.use((req, res, next) => {
  res.locals._csrfToken = req.csrfToken();
  next();
})

app.post("/api/newsletter-signup", handlers.api.newsletterSignup);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`);
  })
} else {
  module.exports = app;
}