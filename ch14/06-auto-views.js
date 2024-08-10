const express = require('express');
const {engine} = require('express-handlebars');
const fs = require("fs");
const {promisify} = require('util');
const fileExists = promisify(fs.exists)

const app = express();
app.engine('handlebars', engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.get("/", (req, res) => res.render("06-home.handlebars"))

const autoViews = {};
app.use(async (req, res, next) => {
  // KEY PART HERE: path varible to decide what to do base on that path
  const path=req.path.toLowerCase();
  console.log("PATH: ", path);
  if (autoViews[path]) return res.render(autoViews[path]);
  if (await fileExists(__dirname + '/views' + path + '.handlebars')) {
    autoViews[path] = path.replace(/^\//, '');
    return res.render(autoViews[path]);
  }
  next(); // no view found; pass on to 404
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}`))