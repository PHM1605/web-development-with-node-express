const express = require('express');
const {engine} = require('express-handlebars');
const app = express();
app.engine('handlebars', engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

const staff = {
  portland: {
    mitch: {
      name: "Mitch", bio: "Mitch is the man to have at your back in a bar fight"
    },
    madeline: {
      name: "Madeline", bio: "Madeline is our Oregon expert."
    }
  },
  bend: {
    walt: {
      name: "Walt", bio: "Walt is our Oregon Coast expert."
    }
  }  
};

app.get("/staff/:city/:name", (req, res, next) => {
  const cityStaff = staff[req.params.city];
  if (!cityStaff) return next(); // unrecognized city -> 404
  const info = cityStaff[req.params.name];
  if (!info) return next(); // will eventually fall through 404
  res.render('05-staffer', info);
})

app.get("/staff", (req, res) => {
  let staffUrls = []; 
  for (let [city, employees] of Object.entries(staff)) {
    for (let name of Object.keys(employees)) {
      staffUrls.push(`/staff/${city}/${name}` )
    }
  }
  res.render('05-staff', {staffUrls});
})

app.get("*", (req, res) => res.send('Check out the "<a href="/staff">staff directory</a>".'))
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/staff`))