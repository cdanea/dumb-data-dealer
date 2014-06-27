/**
 * Created by ciprian on 6/21/14.
 */
var async = require('async');
var _ = require('underscore');
async.race = function (tasks, callback) {
  if (_.isArray(tasks) || _.isObject(tasks)) {
    var Tasks = _.map(_.values(tasks), function (task, key) {
      if(!task instanceof Function) {
        throw new Error('Not all participants can run.');
      }
      return function (done) {
        task(function (error, result) {
          if (error) {
            done(error);
          } else {
            done(-1 - key, result);
          }
        });
      };
    });
    if (Tasks.length > 0) {
      async.parallel(Tasks,
          function (err, results) {
            if (err <= -1) {
              callback(false, results[-err - 1]);
            } else {
              callback(err);
            }
          }
      );
    } else {
      if(callback instanceof Function) {
        callback('Invalid tasks');
      } else {
        throw new Error('Invalid tasks')
      }
    }
  } else {
    if(callback instanceof Function) {
      callback('Invalid tasks');
    } else {
      throw new Error('Invalid tasks')
    }
  }
};

module.exports = async;