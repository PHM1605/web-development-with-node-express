exports.home = (req, res) => res.render('home', {username: req.user && req.user.name})
exports.newsletter = (req, res) => {
  res.render("newsletter");
}

exports.api = {}
exports.api.newsletterSignup = (req, res) => {
  // _csrf field is now mandatory, due to "csurf" setup
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ', req.body.name);
  console.log('Email (from visible form field): ', req.body.email);
  res.send({result: 'success'});
}

exports.notFound = (req, res) => res.render('404')
exports.serverError = (err, req, res, next) => {
  console.log(err);
  res.render('500');
}