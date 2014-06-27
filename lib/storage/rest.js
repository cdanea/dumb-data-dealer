/**
 * Created by ciprian on 6/28/14.
 */
var _ = require('underscore');
var crypto = require('crypto');
var util = require('../util');

var createConnection = module.exports = function (params) {
  params = _.extend({
    url: 'http://192.168.0.105:3000/test/',
    id: 'id',
    fields: ['id', 'store', 'name']
  }, params || {});
  var unirest = require('unirest');
  return {
    get: function (id, callback) {
      unirest.get(params.url + id)
        .type('json')
        .end(function (response) {
          if(response.error) {
            callback(response.error);
          } else {
            if(response.status == 200) {
              callback(null, response.body);
            } else {
              callback('Failed to fetch data.');
            }
          }
        });
    },
    del: function (id, callback) {
      unirest.del(params.url + id)
        .type('json')
        .end(function (response) {
          if(response.error) {
            callback(response.error);
          } else {
            if(response.status == 200) {
              callback(null, true);
            } else {
              callback('Failed to erase data.');
            }
          }
        });
    },
    set: function (update, callback) {
      unirest.put(params.url + update[params.id])
        .type('json')
        .send(update)
        .end(function (response) {
          if(response.error) {
            callback(response.error);
          } else {
            if(response.status == 200) {
              callback(null, response.body);
            } else {
              callback('Failed to send data.');
            }
          }
        });
    },
    add: function (data, callback) {
      unirest.post(params.url)
        .type('json')
        .send(data)
        .end(function (response) {
          if(response.error) {
            callback(response.error);
          } else {
            if(response.status == 200) {
              callback(null, response.body);
            } else {
              callback('Failed to send data.');
            }
          }
        });
    }
  };
};