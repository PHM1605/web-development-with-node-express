const express = require("express");
const { engine } = require("express-handlebars");
const handlers = require("./lib/handlers");

const app = express();
app.engine("handlebars", engine({
  defaultLayout: "main",
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this);
      return null;
    }
  }
}))
app.set('view engine', 'handlebars');
const port = process.env.PORT || 3000;

app.get("/", handlers.home);
app.get("/section-test", handlers.sectionTest);
app.use(handlers.notFound);
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`)})
} else {
  module.exports = app;
}