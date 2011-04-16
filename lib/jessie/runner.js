var fs   = require('fs')
var path = require('path')
// Great trick by mhevery
global.window = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval
};

var filename  = __dirname + '/../../vendor/jasmine.js';
var src       = fs.readFileSync(filename);
var jasmine   = require('vm').runInThisContext(src + "\njasmine;", filename);
for (var key in jasmine)
  global[key] = jasmine[key];

delete global.window

require('jessie/jasmine').extend(jasmine)

exports.runner = function(args, options, callback) {
  this.jasmine  = jasmine.getEnv();
  this.finder   = new (require('jessie/finder')).finder(),
  this.reporter = new (require('jessie/reporter')).reporter(options.format, callback)
  this.run = function() {
    var specs   = this.finder.find(args, process.cwd())
    var runner  = this;
    var spec_helper = process.cwd() + '/spec/spec_helper.js'
    if (path.existsSync(spec_helper))
      require(spec_helper)
    specs.forEach(function(spec) { require(spec); })
    this.jasmine.reporter = this.reporter
    this.jasmine.execute()
  } 
}