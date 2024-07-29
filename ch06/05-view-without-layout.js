const express = require('express');
const { engine } = require("express-handlebars");

const app = express();
app.engine("handlebars", engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.get("/no-layout", (req, res) =>
  res.render("no-layout", {layout: null})
)

app.get("*", (req, res) => 
  res.send('Checkout the "<a href="/no-layout">no layout</a>" page!'))

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/no-layout\n`))