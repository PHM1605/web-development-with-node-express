const express = require("express");
const {engine} = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
app.engine("handlebars", engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/thank-you", (req, res) => res.render("11-thank-you"));
app.get("/contact-error", (req, res) => res.render("11-contact-error"));
app.get("*", (req, res) => res.render("11-home"));
app.post("/process-contact", (req, res) => {
  try {
    // here's where we would try to save contact to database or other persistence mechanism. For now we'll just simulate an error
    if(req.body.simulateError) throw new Error("error saving contact");
    console.log(`contact from ${req.body.name} <${req.body.email}>`);
    res.format({
      'text/html': () => res.redirect(303, "/thank-you"),
      "application/json": () => res.json({ success: true })
    });
  } catch(err) {
    console.error(`error processing contact from ${req.body.name} <${req.body.email}>`);
    res.format({
      "text/html": () => res.redirect(303, "/contact-error"),
      "application/json": ()=>res.status(500).json({
        error: "error saving contact information"
      })
    });
  }
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}\n`))