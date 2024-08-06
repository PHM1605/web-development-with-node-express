const express = require('express');
const cluster = require('cluster');

const app = express();

app.use((req, res, next) => {
  if (cluster.isWorker) {
    console.log(`Worker ${cluster.worker.id} received request`);
    next();
  }
})

app.get("/fail", (req, res) =>{
  throw new Error("Nope!");
})

app.get('/epic-fail', (req, res)=>{
  process.nextTick(()=>{
    throw new Error('Kaboom!');
  })
  res.send('embarrased');
})

app.get("*", (req, res) => res.send("online"));

// it will catch "epic-fail" without crashing the server
process.on('uncaughtException', err =>{
  console.error('UNCAUGHT EXCEPTION\n', err.stack);
  // do any cleanups you need here e.g. close database connections
  process.exit(1);
})

function startServer(port) {
  app.listen(port, function() {
    console.log(`Express started in ${app.get('env')} mode on http://localhost:${port}; press Ctrl-C to terminate.`);
  })
}

if (require.main === module) {
  startServer(process.env.PORT || 3000);
} else {
  module.exports = startServer;
}