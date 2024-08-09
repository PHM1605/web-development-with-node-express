const express = require('express');
const {engine} = require('express-handlebars');
const app = express();
app.engine('handlebars', engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'))

async function getSpecialsFromDatabase() {
  return {
    name: 'Deluxe Technicolor Widget',
    price: '$29.95'
  };
}

async function specials(req, res, next) {
  res.locals.special = await getSpecialsFromDatabase();
  next();
}

app.get('/page-with-specials', specials, (req, res) =>{
  res.render('page-with-specials');
})

app.get('*', (req, res) => res.send('Check out the "<a href="/page-with-specials">specials</a>" page!'))

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/page-with-specials`))