const express = require('express');
const app = express();
app.disable('x-powered-by');
app.get("*", (req, res)=>{
  res.send(`Open your dev tools and examine your headers; you'll notice there is not x-powered-by headers!`)
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}`));