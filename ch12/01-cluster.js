const cluster = require('cluster');

function startWorker() {
  const worker = cluster.fork(); // take 1 cpu from pool
  console.log(`CLUSTER: Worker ${worker.id} started`);
}

// when running directly via "node 01-cluster.js"
if (cluster.isMaster) {
  require('os').cpus().forEach(startWorker);
  // when a worker disconnects -> log (later it will exit)
  cluster.on('disconnect', worker => console.log(
    `CLUSTER: Worker ${worker.id} disconnected from the cluster.`
  ))
  // when worker exit -> create new one
  cluster.on('exit', (worker, code, signal) => {
    console.log(`CLUSTER: Worker ${worker.id} died with exit code ${code} (${signal})`)
    startWorker();
  })
} 
// when worker starts running
else {
  const port = process.env.PORT || 3000;
  require("./01-server.js")(port);
}