const express = require("express");
const {engine} = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const catNames = ["abby", "petter", "quiz"];

const app = express();
const port = process.env.PORT || 3000;
app.engine("handlebars", engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(cookieParser());
app.use(session({resave: false, saveUninitialized: false, secret: 'keyboard cat'}))

app.get("/greeting", (req, res) => {
  res.render("greeting", {
    message: "Hello esteemed programmer!",
    style: req.query.style,
    userid: req.cookies.userid,
    username: req.session.username
  });
})

app.get("/set-random-userid", (req, res) => {
  res.cookie('userid', (Math.random() * 10000).toFixed(0));
  res.redirect("/greeting");
})

app.get("/set-random-username", (req, res) => {
  let randomIndex = Math.floor(Math.random() * catNames.length);
  req.session.username = catNames[randomIndex];
  res.redirect('/greeting');
});

app.get("*", (req, res)=> res.send('Checkout our "<a href="/greeting">greeting</a>" page'));
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/greeting`));