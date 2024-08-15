const db = require('./db');
const geocode = require('./lib/geocode');

const gecodeVacations = async () => {
  const vacations = await db.getVacations();
  const vacationsWithoutCoordinates = vacations.filter(({location}) => 
    !location.coordinates || typeof location.coordinates.lat !== 'number');
  console.log(`geocoding ${vacationsWithoutCoordinates.length} of ${vacations.length} vacations: `);

  return Promise.all(vacationsWithoutCoordinates.map(
    async ({sku, location}) => {
      const {search} = location;
      if (typeof search !== 'string' || !/\w/.test(search)) {
        return console.log(` SKU ${sku} FAILED: does not have location.search`);
      }
      // if location.search exists
      try {
        const coordinates = await geocode(search);
        await db.updateVacationBySku(sku, {location: {search, coordinates}});
        console.log(` SKU ${sku} SUCCEEDED: ${coordinates.lat}, ${coordinates.lng}`);
      } catch(err) {
        return console.log(` SKU ${sku} FAILED: ${err.message}`);
      }
    }

  ));
}

gecodeVacations()
.then(() => {
  console.log("DONE");
  db.close();
})
.catch(err => {
  console.log("ERROR: " + err.message);
  db.close();
})
