exports.api = {}

exports.home = (req, res) => res.render("home");

// Browser-based
exports.newsletterSignup = (req, res) => {
  res.render('newsletter-signup', {csrf: "CSRF token goes here"});
}
exports.newsletterSignupProcess = (req, res) => {
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name)
  console.log('Email (from visible form field): ' + req.body.email)
  res.redirect(303, '/newsletter-signup/thank-you')
}
exports.newsletterSignupThankYou = (req, res) => res.render("newsletter-signup-thank-you");

// Fetch-based
exports.newsletter = (req, res) => {
  // we will learn about CSRF later. For now, we just provide a dummy value
  res.render("newsletter", { csrf: 'CSRF token goes here' })
}
exports.api.newsletterSignup = (req, res) => {
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name);
  console.log('Email (from visible form field): ' + req.body.email);
  res.send({result: 'success'});
}

exports.vacationPhotoContest = (req, res) => {
  const now = new Date();
  res.render('contest/vacation-photo', {year: now.getFullYear(), month: now.getMonth() });
}

exports.notFound = (req, res) => res.render("404");

exports.serverError = (err, req, res, next) => res.render("500");