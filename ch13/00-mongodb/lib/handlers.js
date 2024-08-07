const pathUtils = require('path');
const fs = require('fs');
const mv = require('mv');
const {promisify} = require('util');
const db = require("../db");

const dataDir = pathUtils.resolve(__dirname, '..', 'data');
const vacationPhotosDir = pathUtils.join(dataDir, 'vacation-photos');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(vacationPhotosDir)) fs.mkdirSync(vacationPhotosDir);

// Promise-based version
const mkdir = promisify(fs.mkdir);
const move = promisify(mv);

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

exports.listVacations = async (req, res) => {
  const vacations = await db.getVacations({available: true});
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
      }
    })
  }
  switch (currency) {
    case 'USD': context.currencyUSD = 'selected'; break;
    case 'GBP': context.currencyGBP = 'selected'; break;
    case 'BTC': context.currencyBTC = 'selected'; break;
  }
  res.render('vacations', context);
}

exports.notifyWhenInSeasonForm = (req, res) => {
  res.render("notify-me-when-in-season", {sku: req.query.sku});
}

exports.notifyWhenInSeasonProcess = async (req, res) => {
  const {email, sku} = req.body;
  await db.addVacationInSeasonListener(email, sku);
  return res.redirect(303, "/vacations");
}

exports.vacationPhotoContestAjax = (req, res) => {
  const now = new Date();
  res.render("contest/vacation-photo-ajax", { year: now.getFullYear(), month: now.getMonth() });
}

exports.api.vacationPhotoContestError = (req, res, message) => {
  res.send({result: 'error', error: message});
}

exports.api.vacationPhotoContest = async (req, res, fields, files) => {
  const photo = files.photo[0];
  const dir = vacationPhotosDir + '/' + Date.now(); // to prevent many users upload the same file name at the same time + create a different folder every ms
  const path = dir + '/' + photo.originalFilename;
  await mkdir(dir);
  await move(photo.path, path, err=>{
    res.send({error: 'cannot move file from tmp'})
  });
  // saveContestEntry
  res.send({result: 'success'})
}

function convertFromUSD(value, currency) {
  switch(currency) {
    case "USD": return value * 1;
    case "GBP": return value * 0.79;
    case "BTC": return value * 0.000078;
    default: return NaN;
  }
}