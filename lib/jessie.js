var fs = require('fs')

var jessie    = {
  runner: require('jessie/runner').runner,
  sugar:  require('jessie/sugar').sugar
}

exports.sugar  = jessie.sugar
exports.runner = jessie.runner

exports.include = function(filename) {
  var src = fs.readFileSync(filename + '.js');
  require('vm').runInThisContext(src, filename + '.js');
}

exports.run    = function(args, options, callback) { 
  new jessie.runner(args, options, callback).run()
};