/**
 * Created by ciprian on 6/22/14.
 */
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
chai.should();
var SERVER = '192.168.0.52:11211';
var createMemcache = require('../../lib/storage/memcached');

describe("Memcached storage works properly", function() {

  it("The module connects and provides the CRUD api", function() {
    createMemcache.should.be.a('function');
    var connection = createMemcache();
    connection.should.contain.property('get');
    connection.get.should.be.a('function');
    connection.get.length.should.equal(2);
    connection.should.contain.property('del');
    connection.del.should.be.a('function');
    connection.del.length.should.equal(2);
    connection.should.contain.property('add');
    connection.add.should.be.a('function');
    connection.add.length.should.equal(3);
    connection.should.contain.property('set');
    connection.set.should.be.a('function');
    connection.set.length.should.equal(3);
  });

  it("ADD adds over existing keys", function(done) {
    var params = {server: SERVER, prefix: 'test', ttl: 30};
    var Memcached = require('memcached');
    var mem = new Memcached(params.server);
    var server = createMemcache(params);
    server.add('a2key', 'a2value', function(error, status) {
      expect(error).to.be.not.ok;
      status.should.be.ok;
      mem.get(params.prefix + 'a2key', function(ge, gr) {
        expect(ge).to.be.not.ok;
        gr.should.deep.equal('a2value');
        server.add('a2key', 'a2value', function(error, status) {
          expect(error).to.be.not.ok;
          status.should.be.ok;
          mem.get(params.prefix + 'a2key', function(ge, gr) {
            expect(ge).to.be.not.ok;
            gr.should.deep.equal('a2value');
            done();
          });
        });
      });
    });
  });

  it("SET adds over existing keys", function(done) {
    var params = {server: SERVER, prefix: 'test', ttl: 30};
    var Memcached = require('memcached');
    var mem = new Memcached(params.server);
    var server = createMemcache(params);
    server.add('s2key', 's2value', function(error, status) {
      expect(error).to.be.not.ok;
      status.should.be.ok;
      mem.get(params.prefix + 's2key', function(ge, gr) {
        expect(ge).to.be.not.ok;
        gr.should.deep.equal('s2value');
        server.set('s2key', 's2value', function(error, status) {
          expect(error).to.be.not.ok;
          status.should.be.ok;
          mem.get(params.prefix + 's2key', function(ge, gr) {
            expect(ge).to.be.not.ok;
            gr.should.deep.equal('s2value');
            done();
          });
        });
      });
    });
  });

  it("ADD adds scalar stuff in memcache", function(done) {
    var params = {server: SERVER, prefix: 'test', ttl: 30};
    var Memcached = require('memcached');
    var mem = new Memcached(params.server);
    var server = createMemcache(params);
    mem.del(params.prefix + 'akey', function() {
      server.add('akey', 'avalue', function(error, status) {
        expect(error).to.be.not.ok;
        status.should.be.ok;
        mem.get(params.prefix + 'akey', function(ge, gr) {
          expect(ge).to.be.not.ok;
          gr.should.deep.equal('avalue');
          done();
        });
      });
    });
  });

  it("SET adds scalar stuff in memcache", function(done) {
    var params = {server: SERVER, prefix: 'test', ttl: 30};
    var Memcached = require('memcached');
    var mem = new Memcached(params.server);
    var server = createMemcache(params);
    mem.del(params.prefix + 'Akey', function() {
      server.add('Akey', 'avalue', function(error, status) {
        expect(error).to.be.not.ok;
        status.should.be.ok;
        mem.get(params.prefix + 'Akey', function(ge, gr) {
          expect(ge).to.be.not.ok;
          gr.should.deep.equal('avalue');
          done();
        });
      });
    });
  });

  it('GET fetches scalar stuff from memcache', function(done) {
    var params = {server: SERVER, prefix: 'test', ttl: 30};
    var Memcached = require('memcached');
    var server = createMemcache(params);
    server.set('GetKey', 'GetValue', function(se, sr) {
      expect(se).to.be.not.ok;
      sr.should.be.true;
      server.get('GetKey', function(ge, gr) {
        expect(ge).to.be.not.ok;
        gr.should.deep.equal('GetValue');
        done();
      });
    });
  });

  it('DEL removes scalar stuff from memcache', function(done) {
    var params = {server: SERVER, prefix: 'test', ttl: 30};
    var Memcached = require('memcached');
    var server = createMemcache(params);
    server.set('DelKey', 'DelValue', function(se, sr) {
      expect(se).to.be.not.ok;
      sr.should.be.ok;
      server.del('DelKey', function(de, dr) {
        expect(de).to.be.not.ok;
        dr.should.be.ok;
        server.get('DelKey', function(ge, gr) {
          expect(ge).to.be.not.ok;
          gr.should.be.false;
          done();
        });
      });
    });
  });

  it("ADD adds JSON stuff in memcache", function(done) {
    var params = {server: SERVER, prefix: 'test', ttl: 30};
    var Memcached = require('memcached');
    var mem = new Memcached(params.server);
    var server = createMemcache(params);
    var val = {a:1,b:2,c:Math.random()};
    mem.del(params.prefix + 'akey', function() {
      server.add('akey', val, function(error, status) {
        expect(error).to.be.not.ok;
        status.should.be.ok;
        mem.get(params.prefix + 'akey', function(ge, gr) {
          expect(ge).to.be.not.ok;
          gr.should.deep.equal(val);
          done();
        });
      });
    });
  });

  it("SET adds JSON stuff in memcache", function(done) {
    var params = {server: SERVER, prefix: 'test', ttl: 30};
    var Memcached = require('memcached');
    var mem = new Memcached(params.server);
    var server = createMemcache(params);
    var val = {a:1,b:2,c:Math.random()};
    mem.del(params.prefix + 'Akey', function() {
      server.add('Akey', val, function(error, status) {
        expect(error).to.be.not.ok;
        status.should.be.ok;
        mem.get(params.prefix + 'Akey', function(ge, gr) {
          expect(ge).to.be.not.ok;
          gr.should.deep.equal(val);
          done();
        });
      });
    });
  });

  it('GET fetches JSON stuff from memcache', function(done) {
    var params = {server: SERVER, prefix: 'test', ttl: 30};
    var Memcached = require('memcached');
    var server = createMemcache(params);
    var val = {a:1,b:2,c:Math.random()};
    server.set('GetKey', val, function(se, sr) {
      expect(se).to.be.not.ok;
      sr.should.be.true;
      server.get('GetKey', function(ge, gr) {
        expect(ge).to.be.not.ok;
        gr.should.deep.equal(val);
        done();
      });
    });
  });

   it('DEL removes JSON stuff from memcache', function(done) {
    var params = {server: SERVER, prefix: 'test', ttl: 30};
    var Memcached = require('memcached');
    var server = createMemcache(params);
    var val = {a:1,b:2,c:Math.random()};
    server.set('DelKey', val, function(se, sr) {
      expect(se).to.be.not.ok;
      sr.should.be.ok;
      server.del('DelKey', function(de, dr) {
        expect(de).to.be.not.ok;
        dr.should.be.ok;
        server.get('DelKey', function(ge, gr) {
          expect(ge).to.be.not.ok;
          gr.should.be.false;
          done();
        });
      });
    });
  });

});