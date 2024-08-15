const db = require("../db");

exports.home = (req, res) => res.render('home')

exports.getVacationsApi = async (req, res) => {
  const vacations = await db.getVacations({available: true});
  res.json(vacations);
}