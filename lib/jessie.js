require('jessie/jasmine')
exports.sugar   = require('jessie/sugar').sugar
exports.runner  = require('jessie/runner').runner

exports.include = function(filename) { 
  var src = require('fs').readFileSync(filename + '.js');
  require('vm').runInThisContext(src, filename + '.js');
}

exports.run    = function(args, options, callback) { 
  new exports.runner(args, options, callback).run()
};