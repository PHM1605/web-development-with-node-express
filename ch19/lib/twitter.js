const https = require('https');
module.exports = twitterOptions => {
  let accessToken = null;

  const getAccessToken = async() => {
    if (accessToken) return accessToken;
    // if null, request token from Twitter
    const bearerToken = Buffer(encodeURIComponent(twitterOptions.consumerApiKey), encodeURIComponent(twitterOptions.apiSecretKey)).toString('base64');
    const options = {
      hostname: 'api.twitter.com',
      port: 443,
      method: 'POST',
      path: '/oauth2/token?grant_type=client_credentials',
      headers: {
        'Authorization': 'Basic ' + bearerToken
      }
    };
    
  }

  return {
    search: async (query, count) => {

    }
  }
}