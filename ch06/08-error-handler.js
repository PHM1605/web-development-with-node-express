const express = require("express");
const {engine} = require("express-handlebars");
const app = express();
app.engine('handlebars', engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.get("/bad-bad-not-good", (req, res)=>{
  // we're going to simulate something bad happening in your code...
  throw new Error("that didn't go well!");
})

app.get("*", (req, res)=>res.render("08-click-here"));

// note thtat even if you don't need the "next" function, it must be included for Express to recognize this as an error handler
app.use((err, req, res, next) => {
  console.error('** SERVER ERROR: ' + err.message);
  res.status(500).render('08-error', {message: "you shouldn't have clicked that!"})
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`navigate to http://localhost:${port}\n`))