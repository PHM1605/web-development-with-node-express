const {Pool} = require('pg');
const _ = require('lodash');
const credentials = require("./credentials");
const connectionString = credentials.postgres[process.env.NODE_ENV || 'development'];
const pool = new Pool({connectionString});

module.exports = {
  getVacations: async() => {
    const {rows} = await pool.query("SELECT * FROM VACATIONS");
    return rows[0];
  },
  addVacationInSeasonListener: async (email, sku) => {
    await pool.query(
      'INSERT INTO vacation_in_season_listeners(email, sku) ' + 
      'VALUES  ($1, $2) ' + 
      'ON CONFLICT DO NOTHING',
      [email, sku]
    );
  }
};