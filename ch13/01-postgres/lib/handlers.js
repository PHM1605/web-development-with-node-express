const db = require('../db');

exports.api = {};
exports.home = (req, res) => res.render('home');
exports.newsletter = (req, res) => {
  res.render('newsletter', {csrf: 'CSRF token goes here'});
}
exports.api.newsletterSignup = (req, res) => {
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name);
  console.log('Email (from visible form field): ' + req.body.email);
  res.send({result: 'success'});
}

function convertFromUSD(value, currency) {
  switch(currency) {
    case 'USD': return value * 1;
    case 'GBP': return value * 0.79;
    case 'BTC': return value * 0.000078;
    default: return NaN;
  }
}

exports.setCurrency = (req, res) => {
  req.session.currency = req.params.currency;
  return res.redirect(303, '/vacations');
}

exports.listVacations = async (req, res) => {
  const vacations = await db.getVacations();
  const currency = req.session.currency || 'USD';
  const context = {
    currency: currency,
    vacations: vacations.map(vacation => {
      return {
        sku: vacation.sku,
        name: vacation.name,
        description: vacation.description,
        inSeason: vacation.inSeason,
        price: convertFromUSD(vacation.price, currency),
        qty: vacation.qty
      };
    })
  };
  switch(currency) {
    case 'USD': context.currencyUSD = 'selected'; break;
    case 'GBP': context.currencyGBP = 'selected'; break;
    case 'BTC': context.currencyBTC = 'selected'; break;
  }
  res.render('vacations', context);
}

exports.notifyWhenInSeasonForm = (req, res) => {
  res.render('notify-me-when-in-season', {sku: req.query.sku});
}

exports.notifyWhenInSeasonProcess = async (req, res) => {
  const {email, sku} = req.body;
  await db.addVacationInSeasonListener(email, sku);
  return res.redirect(303, '/vacations');
}

exports.vacationPhotoContestAjax = (req, res) => {
  const now = new Date();
  res.render('contest/vacation-photo-ajax', {year: now.getFullYear(), month: now.getMonth()});
}