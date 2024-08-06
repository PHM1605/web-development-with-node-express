exports.api = {}

exports.home = (req, res) => res.render("home");

exports.newsletter = (req, res) => {
  res.render("newsletter", { csrf: "CSRF token goes here "});
}

exports.api.newsletterSignup = (req, res) => {
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name);
  console.log('Email (from visible form field): ' + req.body.email);
  res.send({ result: 'success' });
}