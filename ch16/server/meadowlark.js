const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const handlers = require("./lib/handlers");
require('./db');

const app = express();
app.use('/api', cors());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
const port = process.env.PORT || 3033;
app.use(express.static(__dirname + '/public'));

app.get('/api/vacations', handlers.getVacationsApi);
app.get('/api/vacation/:sku', handlers.getVacationBySkuApi);
app.post("/api/vacation/:sku/notify-when-in-season", handlers.addVacationInSeasonListenerApi);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`);
  })
} else {
  module.exports = app;
}