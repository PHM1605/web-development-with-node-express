const https = require('https');
const fs = require('fs');
const express = require('express');

const app = express();

const options = {
  key: fs.readFileSync(__dirname + '/ssl/meadowlark.pem'),
  cert: fs.readFileSync(__dirname + '/ssl/meadowlark.crt')
}
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("HELLO")
})

https.createServer(options, app).listen(port, () => {
  console.log(`Express started in ${app.get('env')} mode on https://localhost:${port}.`)
})