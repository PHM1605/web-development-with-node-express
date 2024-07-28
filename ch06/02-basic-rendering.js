const express = require("express");
const {engine} = require("express-handlebars");

const app = express();
const port = process.env.PORT || 3000;
app.engine("handlebars", engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("*", (req, res)=> res.send('Checkout our "<a href="/about">About</a>" page'));

app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/about`));

