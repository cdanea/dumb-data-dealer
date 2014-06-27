/**
 * Created by ciprian on 6/21/14.
 */

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
chai.should();
var _ = require('underscore');
var async = require('../lib/async');

describe("Async race plugin", function() {
  it("Empty race should callback with an error.", function(done) {
    async.race([], function(error, result) {
      error.should.be.ok;
      error.should.be.a('string');
      expect(result).to.be.not.ok;
      done();
    })
  });

  it("Null race should callback with an error.", function(done) {
    async.race(null, function(error, result) {
      error.should.be.ok;
      error.should.be.a('string');
      expect(result).to.be.not.ok;
      done();
    })
  });

  it("Missing tasks should throw an exception.", function() {
    expect(function() {
      async.race();
    }).to.throw(Error);
  });

  it("Invalid tasks should throw an exception.", function() {
    expect(function() {
      async.race(new Date);
    }).to.throw(Error);
  });

  it("Invalid tasks and no callback to complain to should throw an exception.", function() {
    expect(function() {
      async.race(['bogus race participant that cannot run']);
    }).to.throw(Error);
  });

  it("Race should make sure that only the first task to the finishing line is declared the winner.", function(done) {
    var tasks = [];
    var intervals = [0.04, 0.01, 0.0101, 0.02, .53];
    intervals.forEach(function(timeout) {
      tasks.push(function(callback) {
        setTimeout(callback.bind(null, false, timeout), timeout * 1000);
      });
    });
    async.race(tasks, function(err, result) {
      expect(err).to.be.false;
      result.should.be.closeTo(_.min(intervals), 0.001);// (+/-)1ms
      done();
    });
  });

});