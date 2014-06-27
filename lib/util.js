/**
 * Created by ciprian on 6/27/14.
 */

var crypto = require('crypto');

module.exports = {
  newId : function() {return crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex');},
  callback: function(callback, silent) {
    if(callback instanceof Function) {
      return callback;
    } else {
      return silent ? new Function : function(error) {if(error)throw new Error(error);};
    }
  }
}