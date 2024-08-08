const {Pool} = require('pg');
const _ = require('lodash');
const credentials = require("./credentials");
const connectionString = credentials.postgres[process.env.NODE_ENV || 'development'];
const pool = new Pool({connectionString});

module.exports = {
  getVacations: async() => {
    const {rows} = await pool.query("SELECT * FROM VACATIONS");
    // return list of {name:'Hood River Day Trip', slug:'hood-river-day-trip',category:...}
    return rows.map(row => {
      // convert key of that object (column name in db) from camel case (e.g. my_item) to snake case (myItem)
      const vacation = _.mapKeys(row, (v, k) => _.camelCase(k));
      vacation.price = parseFloat(vacation.price.replace(/^\$/, ''));
      vacation.location = {
        search: vacation.locationSearch,
        coordinates: {
          lat: vacation.locationLat,
          lng: vacation.locationLng
        }
      };
      return vacation;
    })
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