const https = require('https');
const { URL } = require('url');

const _fetch = url => new Promise((resolve, reject) => {
  const {hostname, pathname, search} = new URL(url);
  const options = {
    hostname,
    path: pathname + search,
    headers: {
      'User-Agent': 'Meadowlark Travel'
    }
  };
  https.get(options, res => {
    let data = '';
    res.on('data', chunk => data += chunk)
    res.on('end', () => resolve(JSON.parse(data)))
  }).end();
})

// Getting new forecast every 15 minutes
// locations: [{name:'Portland', coordinates: {lat: 44, lng:-122}},{}...]
module.exports = locations => {
  const cache = {
    refreshFrequency: 15 * 60 * 1000,
    lastRefreshed: 0,
    refreshing: false,
    forecasts: locations.map(location => ({location}))
  }
  console.log("CACHE FORECASTS: ", cache.forecasts); // [{location: {name...}}]

  const updateForecast = async forecast => {
    if (!forecast.url) {
      const {lat, lng} = forecast.location.coordinates;
      const path = `/points/${lat.toFixed(4)},${lng.toFixed(4)}`;
      const points = await _fetch('https://api.weather.gov' + path);
      console.log(points)
      forecast.url = points.properties.forecast;
    }
    console.log("FORECAST URL: ", forecast.url);

    const {properties: {periods}} = await _fetch(forecast.url);
    // period[0]: current period weather, period[1]: next day period weather
    // console.log("PERIODS: ", periods);
    const currentPeriod = periods[0];
    Object.assign(forecast, {
      iconUrl: currentPeriod.icon,
      weather: currentPeriod.shortForecast,
      temp: currentPeriod.temperature + ' ' + currentPeriod.temperatureUnit
    });
    return forecast; //{location: {name:"",coordinates:{}}, url:"",iconUrl:"",weather:"",temp:""}
  }

  const getForecasts = async() =>{
    if (Date.now() > cache.lastRefreshed + cache.refreshFrequency) {
      cache.refreshing = true;
      cache.forecasts = await Promise.all(cache.forecasts.map(updateForecast));
    }
    return cache.forecasts;
  }

  return getForecasts;
}