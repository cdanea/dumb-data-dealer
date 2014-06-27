/**
 * Created by ciprian on 6/22/14.
 */
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var Sequelize = require('sequelize');
var _ = require('underscore');
var Table = {
  server: 'mysql://dev:dev@192.168.0.53/test_map',
  table: 'map_test',
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
chai.should();
var createDbStorage = require('../../lib/storage/sequelize');
var conn = createDbStorage(Table);

describe("Sequelize storage works properly", function() {

  before(function(done) {
    conn.model.sync({force:true}).complete(done.bind(null, null));
  });

  after(function(done) {
    conn.model.drop({force:true}).complete(done.bind(null, null));
  });

  it("Should connect", function(done) {
    conn.get("123", function(err, res) {
      expect(err).to.be.not.ok;
      expect(res).to.be.not.ok;
      done();
    });
  });

  it("GET works", function(done) {
    var db = new Sequelize(Table.server, {logging:false});
    var rVals = [conn.newId(), 'a', 'b'];
    var row = _.object(_.keys(Table.fields), rVals);
    db.query("insert into " + Table.table + " (`" + _.keys(Table.fields).join('`, `') + "`) values (:"
        + _.keys(Table.fields).join(',:') + ")", null, {raw:true, plain:true/*,logging:console.log*/}, row)
      .complete(function(err) {
          expect(err).to.be.not.ok;
          conn.get(row.id, function(err, res) {
            expect(err).to.be.not.ok;
            expect(res).to.be.ok;
            res.should.deep.equal(row);
            db.query("delete from `"+Table.table+"` where id = ?", null, {raw:true}, [row.id]);
            done();
          });
      });
  });

  it("Set works aswell", function(done) {
    var db = new Sequelize(Table.server, {logging:false});
    var data = {id:conn.newId(), store: 'test', name: 'name'};
    conn.model.create(data).complete(function(err, mdl) {
      var row = _.pick(mdl, _.keys(data));
      conn.get(data.id, function(err, map) {
        expect(err).to.be.not.ok;
        map.should.deep.equal(row);
        var update = _.extend({}, row, {store: 'modified'});
        conn.set(update, function(error, result) {
          expect(error).to.be.not.ok;
          result.should.deep.equal(update);
          done();
        });
      });
    });
  });

  it("Add works well", function(done) {
    var data = {id:conn.newId(), store: 'test2', name: 'name2'};
    conn.add(data, function(error, map) {
      expect(error).to.be.not.ok;
      map.should.deep.equal(data);
      conn.get(data.id, function(err, row) {
        expect(err).to.be.not.ok;
        row.should.deep.equal(data);
        done();
      });
    });
  });

  it("Add works well without a callback", function(done) {
    var data = {id:conn.newId(), store: 'test2', name: 'name2'};
    var async = require('async');
    conn.add.bind(null, data, null)();
    setTimeout(function() {
      conn.get(data.id, function(err, row) {
        expect(err).to.be.not.ok;
        row.should.deep.equal(data);
        done();
      });
    }, 80);
  });

  it("Del works as expected", function (done) {
    var data = {id:conn.newId(), store: 'test2', name: 'name2'};
    conn.add(data, function(error, map) {
      conn.del(data.id, function(e, r) {
        expect(e).to.be.not.ok;
        r.should.be.ok;
        done();
      });
    });
  });
});