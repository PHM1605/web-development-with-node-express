const express = require('express');
const vhost = require('vhost');
const app = express();

const admin = express.Router();
app.use(vhost('admin.meadowlark.local', admin));

admin.get("*", (req, res) => res.send("Welcome, Admin!"))
app.get("*", (req, res) => res.send("Welcome, User!"))

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("\nmake sure you've added the following to your hosts file:" +
    "\n 127.0.0.1 admin.meadowlark.local" +
    "\n 127.0.0.1 meadowlark.local" +
    "\nthen navigate to:" + 
    `\n http://meadowlark.local:${port}` +
    `\nand http://admin.meadowlark.local:${port}`
  )
})