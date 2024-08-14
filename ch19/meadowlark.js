const express = require('express');
const {engine} = require("express-handlebars");
const credentials = require("./credentials");
const createTwitterClient = require("./lib/twitter");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'))
app.engine('handlebars', engine({
  defaultLayout: 'main'
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

app.get('/social', async (req, res) => {
  res.render('social', {tweets: await getTopTweets});
})

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}/social; press Ctrl-C to terminate.`)
  })
} else {
  module.exports = app;
}