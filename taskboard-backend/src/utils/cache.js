const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

const cacheMiddleware = (key) => (req, res, next) => {
    const cachedData = cache.get(key);
    if (cachedData) {
      return res.json(cachedData);
    }
    next();
  };

const getCache = (key) => cache.get(key);

const setCache = (key, data) => cache.set(key, data);

module.exports = { 
    getCache, 
    setCache,
    cacheMiddleware,
    cache 
};
