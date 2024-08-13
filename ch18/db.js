const credentials = require("./credentials");
const mongoose = require('mongoose');
const User = require("./models/user")

const connectionString = credentials.mongo;
if (!connectionString) {
  console.error('MongoDB connection string missing!');
  process.exit(1);
}
mongoose.connect(connectionString);
const db = mongoose.connection
db.on('error', err => {
  console.error('MongoDB error: ' + err.message);
  process.exit(1);
})
db.once('open', () => console.log('MongoDB connection established'));

module.exports = {
  getUserById: async id => User.findById(id),
  getUserByAuthId: async authId => User.findOne({ authId }),
  addUser: async data => new User(data).save(),
  close: () => mongoose.connection.close()
}
