const https = require('https');
const credentials = require('../credentials');

console.log("API KEY: ", credentials.google.apiKey)

module.exports = async query => {
  const options = {
    hostname: 'maps.googleapis.com',
    path: `/maps/api/geocode/json?address=${encodeURIComponent(query)}$key=${credentials.google.apiKey}`
  }
  return new Promise((resolve, reject) =>
    https.request(options, res =>{
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        data = JSON.parse(data);
        console.log("DATA:", data)
        if (!data.results.length) {
          return reject(new Error(`no results for "${query}"`));
        }
        resolve(data.results[0].geometry.location);
      })
    }).end()
  )
}