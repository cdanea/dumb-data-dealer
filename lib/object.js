/**
 * Created by ciprian on 6/21/14.
 */

var makeObject = function(config) {
  var fields = config.fields || ['id', 'store'];
  var storage = config.storage ||
  {
    cache: {
      type: 'memcached',
      params: {},
      sync: true
    },
    db: {
      type: "mysql",
      params: {},
      sync: true
    },
    web: {
      type: "rest",
      params: {},
      sync: false
    }
  };
};