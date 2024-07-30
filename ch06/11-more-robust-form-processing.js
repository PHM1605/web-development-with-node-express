const express = require("express");
const {engine} = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
app.engine("handlebars", engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());

app.get("/thank-you", (req, res) => res.render("10-thank-you"));
app.get("*", (req, res) => res.render("11-home"));
app.get("/contact-error", (req, res) => res.render("11-contact-error"));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}\n`))