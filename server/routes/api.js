var express = require('express');
var router = express.Router();
const NodeCache = require('node-cache');
const yelpSDK = require('api')('@yelp-developers/v1.0#8e0h2zlqcimwm0');

const DEFAULT_LOCATION = '121%20Albright%20Wy%2C%20Los%20Gatos%2C%20CA%2095032';
const SORT_TYPES = ['best_match', 'ranking', 'distance'];
const yelpAPIKey = process.env.YELPAPIKEY;
const cache = new NodeCache({
  stdTTL: 3600
});

router.get('/find', function(req, res, next) {
  const { 
    location,
    sort,
    offset 
  } = req.query;

  const apiOffset = offset && !Number.isInteger(offset) ? 0 : offset;
  const apiSort = sort && !SORT_TYPES.includes(sort) ? 'best_match' : sort;

  const cacheKey = `${location||''}${sort||''}_boba`;
  console.log("Using cache key:", cacheKey);
  if (cache.has(cacheKey)) {
    console.log("Found cached data!");
    res.send(cache.get(cacheKey));
    return;
  }

  yelpSDK.auth(`Bearer ${yelpAPIKey}`);
  yelpSDK.v3_business_search({
    location: location || DEFAULT_LOCATION,
    term: 'boba%20shop',
    radius: '10000',
    sort_by: apiSort,
    limit: '25',
    offset: apiOffset
  })
    .then(({ data }) => {
      console.log("Caching results")
      cache.set(cacheKey, data);
      res.send(data);
    })
    .catch(err => {
      throw new Error("Failed to get boba shops.");
    });
});

module.exports = router;
