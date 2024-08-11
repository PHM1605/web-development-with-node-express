const db = require("../db");

exports.getVacationsApi = async (req, res) => {
  const vacations = await db.getVacations({available: true});
  res.json(vacations);
}

exports.getVacationBySkuApi = async (req, res) => {
  const vacation = await db.getVacationBySku(req.params.sku);
  res.json(vacation);
}

exports.addVacationInSeasonListenerApi = async (req, res) => {
  console.log(`${req.body.email} is listening for vacation ${req.params.sku}`);
  await db.addVacationInSeasonListener(req.params.sku, req.body.email);
  res.json({message: 'success'});
}