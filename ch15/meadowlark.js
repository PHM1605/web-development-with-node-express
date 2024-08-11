const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const handlers = require('./lib/handlers');

require('./db');

const app = express();
app.use('/api', cors())
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', handlers.home);
// it means every request being sent to e.g. api.<any thing> will be handled by this
app.get('/api/vacations', handlers.getVacationsApi)
app.get('/api/vacation/:sku', handlers.getVacationBySkuApi);
app.post('/api/vacation/:sku/notify-when-in-season', handlers.addVacationInSeasonListenerApi);
app.delete('/api/vacation/:sku', handlers.requestDeleteVacationApi)

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`);
  })
} else {
  module.exports = app;
}