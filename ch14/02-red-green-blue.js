const express = require('express');
const {engine} = require('express-handlebars');
const app = express();

app.get("/rgb", 
  (req, res, next) => {
    if (Math.random() < 0.33) return next();
    res.send("red");
  },
  // half of 2/3 is 1/3
  (req, res, next) => {
    if (Math.random() < 0.5) return next();
    res.send('green');
  },
  (req, res) => {
    res.send('blue');
  }
)

app.get("*", (req, res) => res.send('Check out the "<a href="/rgb">rgb</a>" page!'))

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`navigate to http://localhost:${port}/rgb and try reloading a few times\n`))