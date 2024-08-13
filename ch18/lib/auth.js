const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../db');

// put user ID into session
passport.serializeUser((user, done) => done(null, user._id));
// get user from userId in db; then put user into session
passport.deserializeUser((id, done) =>{
  db.getUserById(id)
  .then(user => done(null, user))
  .catch(err => done(err, null))
})
// ==> after this, when user successfully authenticated, there will be "req.session.passport.user" object from db

// "createAuth" function
module.exports = (app, options) => {
  // if successRedirect path or failureRedirect path is not yet set
  if (!options.successRedirect) options.successRedirect = '/account';
  if (!options.failureRedirect) options.failureRedirect = '/login';
  return {
    init: () => {
      var config = options.providers;
      passport.use(new FacebookStrategy(
      {
        clientID: config.facebook.appId,
        clientSecret: config.facebook.appSecret,
        callbackURL: (options.baseUrl || '') + '/auth/facebook/callback'
      }, 
      // FacebookStrategy will fill these params in this callback when user successfully authenticated
      (accessToken, refreshToken, profile, done) => {
        const authId = 'facebook:' + profile.id;
        db.getUserByAuthId(authId)
        .then(user => {
          // if user is already in db => call serializeUser to put userId into session
          if (user) return done(null, user);
          // if user is not yet in db => put it in db => call serializeUser to put userId into session
          db.addUser({
            authId: authId,
            name: profile.displayName,
            created: new Date(),
            role: 'customer'
          })
          .then(user => done(null, user))
          .catch(err => done(err, null))
        })
        .catch(err => {
          if(err) return done(err, null);
        })
      }
    ))
    app.use(passport.initialized());
    app.use(passport.session());
    },
    registerRoutes: () => {
      app.get('/auth/facebook', (req, res, next) => {
        // if request has a query ?redirect=abc => store it to use after authentication process
        if (req.query.redirect) req.session.authRedirect = req.query.redirect;
        // redirect to facebook authentication screen
        passport.authenticate('facebook')(req, res, next);
      });
      app.get('/auth/facebook/callback', 
        // if failure then redirect to /unauthorized
        passport.authenticate('facebook', {failureRedirect: options.failureRedirect}),
        // "next" function i.e. call when successfully authenticated
        (req, res) => {
          // if user has a query of desired redirect which was saved in session => redirect there, otherwise to the default path /account
          const redirect = req.session.authRedirect;
          if (redirect) delete req.session.authRedirect 
          res.redirect(303, redirect || options.successRedirect);
        }
      )
    }
  }
}