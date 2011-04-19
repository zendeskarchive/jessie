// Great trick by mhevery
global.window = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval
};

var filename  = __dirname + '/../../vendor/jasmine.js';
var src       = require('fs').readFileSync(__dirname + '/../../vendor/jasmine.js');

// Load up jasmine
require('vm').runInThisContext(src + "\njasmine;", filename);

// Remove the global window to not pollute the global namespace
delete global.window

// Extend the fail to extract the proper stacktrace
jasmine.Spec.prototype.fail = function (e) {
  var expectationResult = new jasmine.ExpectationResult({
    passed: false,
    message: e ? jasmine.util.formatException(e) : 'Exception'
  });
  // Extract the stacktrace and remove the jasmine noise
  expectationResult.stacktrace = []
  var parts = e.stack.split(/\n\s+/)
  expectationResult.stacktrace.push(parts.shift())
  var regex = /(vendor|jessie)\/jasmine\.js:\d+:\d+\)*/
  for (var i = 0, len = parts.length; i < len; i++) {
    var line = parts[i]
    if (regex.test(line)) continue
    expectationResult.stacktrace.push(line)
  }
  expectationResult.stacktrace = expectationResult.stacktrace
  this.results_.addResult(expectationResult);
};
  

// Modify iterateObject to skip should_ properties
jasmine.PrettyPrinter.prototype.iterateObject = function(obj, fn) {
  var should_regex = /should_\w+/
  for (var property in obj) {
    if (property == '__Jasmine_been_here_before__') continue;
    if (should_regex.test(property)) continue;
    fn(property, obj.__lookupGetter__ ? (obj.__lookupGetter__(property) != null) : false);
  }
};
  
// Add missing reportSuiteStarting to Suite
jasmine.Suite.prototype.execute = function(onComplete) {
  this.env.reporter.reportSuiteStarting(this);
  var self = this;
  this.queue.start(function () {
    self.finish(onComplete);
  });
};