const express = require("express");
const {engine} = require("express-handlebars");

const app = express();
const port = process.env.PORT || 3000;
app.engine("handlebars", engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"))

app.get("/error", (req, res) => {
  res.status(500).render("error");
});

app.get("*", (req, res)=> res.send('Checkout our "<a href="/error">error</a>" page'));

app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/error`));

