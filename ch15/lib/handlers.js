const db = require('../db');

exports.home = (req, res) => res.json({message: 'done render home'});

exports.getVacationsApi = async (req, res) => {
  const vacations = await db.getVacations({available: true});
  res.json(vacations);
}

exports.getVacationBySkuApi = async (req, res) => {
  const vacation = await db.getVacationBySku(req.params.sku);
  res.json(vacation);
}

exports.addVacationInSeasonListenerApi = async(req, res) => {
  await db.addVacationInSeasonListener(req.body.email, req.params.sku);
  res.json({message: 'success'});
}

exports.requestDeleteVacationApi = async (req, res) => {
  await db.deleteVacation(req.params.sku)
  res.json({message: 'success'});
}