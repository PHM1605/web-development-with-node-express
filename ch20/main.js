// -------------------------------- MODULE EXPOSES MIDDLEWARE FUNCTION DIRECTLY ---------------------------------------------
module.exports = (req, res, next) => {
  next()
}
// => to use middleware
const middlewareFunc = require('<ten_file>')
app.use(middlewareFunc)

// --------------------- MODULE EXPOSES A FUNCTION (TO PASS IN CONFIG) THEN RETURNS A MIDDLEWARE -----------------------------
module.exports = (config) => {
  if (!config) config = {}
  return (req, res, next) => {
    next();
  }
}
// => to use middleware
const config = {};
const middlewareFunc = require('<ten_file>')(config);
app.use(middlewareFunc)

// ------------- MODULE EXPOSE A FUNCTION (TO PASS IN CONFIG) THAT RETURNS AN OBJECT THAT CONTAINS MANY MIDDLEWARES -----------
module.exports = (config) => {
  if (!config) config = {};
  return {
    middleware1: (req, res, next) => {
      next()
    },
    middleware2: (req, res, next) => {
      next();
    }
  }
}
// => to use the object with many middlewares
const config2 = {}
const middlewareObject = require('<ten_file>')(config2)
app.use(middlewareObject.middleware1)
app.use(middlewareObject.middleware2)