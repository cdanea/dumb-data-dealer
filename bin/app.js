/**
 * Created by ciprian on 5/8/14.
 */


var http = require('http');
var express = require('express');
var restApp = require('./../lib/rest-server');
var app = express();
var Sequelize = require('sequelize');
var createDbStorage = require('./../lib/storage/sequelize');
var bodyParser = require('body-parser')
var Table = {
  server: 'mysql://dev:dev@192.168.0.53/test_map',
  table: 'map_test_data',
  id: 'id',
  fields: {
    id    : {
      type: Sequelize.STRING(40),
      primaryKey:true
    },
    store : Sequelize.STRING(32),
    name  : Sequelize.STRING(64)
  }
};
var source = createDbStorage(Table);
source.model.sync({force:true}).success(function() {
  app.use(bodyParser.json());
  app.use('/rest/', restApp({}, createDbStorage(Table)));
  http.createServer(app).listen(3000, '0.0.0.0', function(){
    console.log('Listening on http://0.0.0.0:3000');
  });
});
