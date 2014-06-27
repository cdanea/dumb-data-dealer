/**
 * Created by ciprian on 6/22/14.
 */
var Sequelize = require('sequelize');
var _ = require('underscore');
var util = require('../util');
var createConnection = module.exports = function (params) {
  params = _.extend({
    server: 'mysql://dev:dev@192.168.0.105/test',
    table: 'map',
    id: 'id',
    fields: {
      store : Sequelize.STRING(32),
      name  : Sequelize.STRING(64)
    },
    logging: false,
    maxConcurrentQueries: 100,
    dialect: 'mysql',
    native: true,
    define: {
      freeze: true,
      freezeTableName: true,
      tableName: params.table,
      underscored: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      createdAt: "created",
      updatedAt: "updated",
      deletedAt: "deleted",
      paranoid : true,
      timestamps: true
    },
    sync : {
      force: true
    }
  }, params || {});
  var mysql = {
    params: params,
    db: new Sequelize(params.server, params),
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
  var id = {};
  id[mysql.params.id] = {
    type     : Sequelize.STRING(40),
    allowNull: false,
    primaryKey: true,
    set: function(id) {
      if(id) {
        if(typeof id === typeof 'string' && id.length == 40) {
          this.setDataValue(mysql.params.id, id);
        } else {
          throw new Error('Invalid id format');
        }
      } else {
        this.setDataValue(mysql.params.id, crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex'));
      }
    }
  };
  var fields = _.extend({}, mysql.params.fields, id);
  var Object = mysql.db.define(mysql.params.table, fields, params.define);
  var fetchOptions = {raw:true, attributes: _.keys(fields)};
  return {
    newId: util.newId,
    model: Object,
    find: function(filter, params, callback) {
      callback = util.callback(callback);
    },
    get: function (id, callback) {
      var where = {};
      where[mysql.params.id] = id;
      Object.find({where: where}, fetchOptions).complete(function(error, row) {
        callback = util.callback(callback);
        if(error) {
          callback(error);
        } else {
          if(row) {
            callback(false, _.pick(row, fetchOptions.attributes));
          } else {
            callback(false, row);
          }
        }
      });
    },
    del: function (id, callback, blind) {
      if(blind) {
        var where = {};
        where[mysql.params.id] = id;
        this.model.destroy(where).error(callback).success(callback.bind(null, null, true));
      } else {
        var _this = this;
        this.get(id, function(error, model) {
          callback = util.callback(callback);
          if(error) {
            callback(error);
          } else {
            if(model) {
              var where = {};
              where[mysql.params.id] = id;
              _this.model.destroy(where).error(callback).success(callback.bind(null, null, true));
            } else {
              callback('Nothing to delete');
            }
          }
        });
      }
    },
    set: function(update, callback) {
      var up = _.pick(update, fetchOptions.attributes);
      Object.update(up).complete(function(error, result) {
        callback = util.callback(callback);
        if(error) {
          callback(error);
        } else {
          if(result) {
            callback(null, _.pick(up, fetchOptions.attributes));
          } else {
            callback(null, false);
          }
        }
      });
    },
    add: function(data, callback) {
      callback = util.callback(callback);
      if(_.isObject(data)) {
        Object.create(data).complete(function(error, result) {
          if(error) {
            callback(error);
          } else {
            callback(null, _.pick(data, fetchOptions.attributes));
          }
        });
      } else {
        callback('Invalid input');
      }
    }
  };
};
