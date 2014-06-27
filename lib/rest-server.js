/**
 * Created by ciprian on 6/28/14.
 */

module.exports = function(config, source) {
  var express = require('express');
  var app = express();
  var _ = require('underscore');
  var options = {
    caseSensitive: true,
    strict: false
  };
  var router = express.Router(_.extend(options, _.pick(config, _.keys(options))));

  router.get("/:id", function(request, response) {
    source.get(request.params.id, function(error, result) {
      if(error) {
        response.statusCode = 500;
        response.json(error);
      } else {
        if(result) {
          response.json(result);
        } else {
          response.statusCode = 404;
          response.json(null);
        }
      }
    });
  });
  router.post("/", function(request, response) {
    source.add(request.body, function(error, result) {
      console.log('adding', request);
      if(error) {
        response.statusCode = 500;
        response.json(error);
      } else {
        if(result) {
          response.json(result);
        } else {
          response.statusCode = 404;
          response.json(null);
        }
      }
    });
  });
  router.put("/:id", function(request, response) {
    var id = {};
    id[config.id] = request.params.id;
    source.set(_.extend({}, request.body, id), function(error, result) {
      if(error) {
        response.statusCode = 500;
        response.json(error);
      } else {
        if(result) {
          response.json(result);
        } else {
          response.statusCode = 404;
          response.json(null);
        }
      }
    });
  });
  router.delete("/:id", function(request, response) {
    source.del(request.params.id, function(error, result) {
      if(error) {
        response.statusCode = 500;
        response.json(error);
      } else {
        if(result) {
          response.json(result && true);
        } else {
          response.statusCode = 404;
          response.json(null);
        }
      }
    });
  });
  app.use(router);
  return app;
};
