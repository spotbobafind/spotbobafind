const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const yelpSDK = require('api')('@yelp-developers/v1.0#8e0h2zlqcimwm0');
const config = require('config');

const locations = config.get('locations') || [];
const SEARCH_TERM = 'boba shop';
const DEFAULT_SORT = 'best_match';
const SORT_TYPES = ['best_match', 'rating', 'distance'];
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

  const apiOffset = !Number.isInteger(parseInt(offset, 10)) ? 0 : offset;
  const apiSort = SORT_TYPES.includes(sort) ? sort : DEFAULT_SORT;
  const selectedLocation = locations.filter(l => l.id === location).pop() || locations[0];
  const locationId = selectedLocation.id;
  const apiLocation = selectedLocation.address;

  const cacheKey = `${locationId||''}_${apiSort||''}_${apiOffset}_boba`;
  console.log("Using cache key:", cacheKey);
  if (cache.has(cacheKey)) {
    console.log("Found cached data!");
    res.send(cache.get(cacheKey));
    return;
  }

  const searchOptions = {
    location: encodeURI(apiLocation),
    term: encodeURI(SEARCH_TERM),
    radius: '10000',
    sort_by: encodeURI(apiSort),
    limit: '25',
    offset: encodeURI(apiOffset)
  };
  yelpSDK.auth(`Bearer ${yelpAPIKey}`);
  yelpSDK.v3_business_search(searchOptions)
    .then(({ data }) => {
      console.log("Caching results");
      cache.set(cacheKey, data);
      res.send(data);
    })
    .catch(err => {
      console.log("Failed to get boba shops.", searchOptions);
      res.send({});
    });
});

module.exports = router;
