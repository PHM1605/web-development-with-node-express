const express = require("express");
const {engine} = require("express-handlebars");
const app = express();

app.engine("handlebars", engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");
// the layout file views/layouts/custom.handlebars will be used
app.get("/custom-layout", (req, res)=>
  res.render("custom-layout", {layout: "custom"}))

app.get('*', (req, res) => res.send('Check out the "<a href="/custom-layout">custom layout</a>" page!'))
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/custom-layout\n`))