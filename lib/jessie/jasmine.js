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

// We need to add it in the global scope as Jasmine adds it, describe and so on in the global scope
global.pending = function(message) {
  error = new Error(message || 'Not Yet Implemented')
  error.type = 'pending'
  throw error
};

// Remove the global window to not pollute the global namespace
delete global.window

jasmine.placeholderPendingFunction = function() { pending() }

jasmine.Env.prototype.it_without_default_pending = jasmine.Env.prototype.it

// Add default pending function when no func is supplied
jasmine.Env.prototype.it = function(description, func) {
  if (!func) func = jasmine.placeholderPendingFunction
  this.it_without_default_pending(description, func)
};

// Extend the fail to extract the proper stacktrace
jasmine.Spec.prototype.fail = function (e) {
  var expectationResult = new jasmine.ExpectationResult({
    passed: false,
    message: e ? jasmine.util.formatException(e) : 'Exception'
  });
  // Making sure that the stack trace is passed from the exception to return proper file name
  if (e.stack) {
    expectationResult.trace = e
  }
  if (e.type == 'pending') {
    expectationResult.pending = true
    expectationResult.message = ['PENDING', e.message].join(': ')
  }
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
