const express = require('express');
const {engine} = require("express-handlebars");
const credentials = require("./credentials");
const createTwitterClient = require("./lib/twitter");
const handlers = require('./lib/handlers');
const weatherMiddleware = require('./lib/middleware/weather');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'))
app.use(weatherMiddleware);
app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
}))
app.set('view engine', 'handlebars')

const twitterClient = createTwitterClient(credentials.twitter);

const getTopTweets = ((twitterClient, search) => {
  const topTweets = {
    count: 10,
    lastRefreshed: 0,
    refreshInterval: 15 * 60 * 1000,
    tweets: []
  };
  return async () => {
    if (Date.now() > topTweets.lastRefreshed + topTweets.refreshInterval) {
      const tweets = await twitterClient.search('#Oregon #travel', topTweets.count);
      console.log("TWEETS: ", tweets)
      const formattedTweets = await Promise.all(
        tweets.statuses.map(async ({id_str, user}) => {
          const url = `https://twitter.com/${user.id_str}/statuses/${id_str}`;
          // omit_script turns on to not include the 'widget.js' - will do it once later
          const embeddedTweet = await twitterClient.embed(url, {omit_script: 1});
          return embeddedTweet.html;
        })
      );
      topTweets.lastRefreshed = Date.now();
      topTweets.tweets = formattedTweets;
    }
    return topTweets.tweets;
  }
})(twitterClient, '#Oregon #travel')

app.get('/', handlers.home)
app.get('/social', async (req, res) => {
  res.render('social', {tweets: await getTopTweets});
})
app.get("/api/vacations", handlers.getVacationsApi);
app.get("/vacations-map", async (req, res) => {
  res.render('vacations-map', {googleApiKey: credentials.google.apiKey})
})

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port} and http://localhost:${port}/social; press Ctrl-C to terminate.`)
  })
} else {
  module.exports = app;
}