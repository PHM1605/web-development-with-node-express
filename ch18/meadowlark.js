const express = require("express");
const {engine} = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const credentials = require("./credentials");
const csrf = require("csurf");
const cors = require('cors')
const handlers = require("./lib/handlers");
const createAuth = require('./lib/auth');

const {createClient} = require("redis");
const passport = require("passport");
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

app.use(express.static(__dirname + '/public'))

// Auth config
const auth = createAuth(app, {
  baseUrl: process.env.BASE_URL,
  providers: credentials.authProviders, // facebook or google
  successRedirect: '/account',
  failureRedirect: '/unauthorized'
})

// linking to Passport middleware
auth.init();
// set routes
auth.registerRoutes();

const customerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'customer') return next();
  res.redirect(303, '/unauthorized')
}

const employeeOnly = (req, res, next) => {
  if (req.user && req.user.role === 'employee') return next();
  next('route'); // random route - not implemented anywhere so falling through to 404 page
}

app.get('/', handlers.home)
app.get("/newsletter", handlers.newsletter);
app.post("/api/newsletter-signup", handlers.api.newsletterSignup);
app.get("/account", customerOnly, (req, res) => {
  if (!req.user) {
    return res.redirect(303, '/unauthorized');
  }
  console.log(req.user)
  res.render('account', {username: req.user.name})
})
app.get('/account/order-history', customerOnly, (req, res) => {
  res.render('account/order-history');
})
app.get("/account/email-prefs", customerOnly, (req, res) => {
  res.render("account/email-prefs");
})
app.get("/sales", employeeOnly, (req, res) => {
  console.log("RHERE")
  res.render("sales");
})
app.get('/unauthorized', (req, res) => {
  res.status(403).render('unauthorized');
})
app.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
  });
  res.redirect("/")
})

app.use(handlers.notFound);
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`);
  })
} else {
  module.exports = app;
}