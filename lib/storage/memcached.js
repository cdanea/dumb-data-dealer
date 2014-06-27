/**
 * Created by ciprian on 6/21/14.
 */
var Memcache = require('memcached');
var _ = require('underscore');

var createConnection = module.exports = function (params) {
  params = _.extend({
    ttl: 86400,
    prefix:'',
    server: 'localhost:11211',
    id: 'id'
  }, params || {});
  var memcache = {
    params: params,
    ttl: params.ttl || 86400,
    prefix: params.prefix || '',
    key: function (key) {
      return memcache.prefix + key;
    },
    cache: new Memcache(params.server, params),
    callback: function (callback, context) {
      if (callback instanceof Function) {
        return callback.bind(context);
      } else {
        return function (error) {
          if (error) {
            throw new Error(error);
          }
        }
      }
    }
  };
  var cacheSet = function (key, value, callback) {
    memcache.cache.set(memcache.key(key), value, memcache.ttl, memcache.callback(callback));
  };
  return {
    get: function (key, callback) {
      memcache.cache.get(memcache.key(key), memcache.callback(callback));
    },
    del: function (key, callback) {
      memcache.cache.del(memcache.key(key), memcache.callback(callback));
    },
    set: cacheSet,
    add: cacheSet
  };
};
