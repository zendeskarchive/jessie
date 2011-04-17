var extendStackTrace = function(jasmine) {

  jasmine.Spec.prototype.fail = function (e) {
    var expectationResult = new jasmine.ExpectationResult({
      passed: false,
      message: e ? jasmine.util.formatException(e) : 'Exception'
    });
    // Extract the stacktrace and remove the jasmine noise
    expectationResult.stacktrace = []
    var parts = e.stack.split(/\n\s+/)
    expectationResult.stacktrace.push(parts.shift())
    var regex = /vendor\/jasmine\.js:\d+:\d+\)*/
    for (var i = 0, len = parts.length; i < len; i++) {
      var line = parts[i]
      if (regex.test(line)) continue
      expectationResult.stacktrace.push(line)
    }
    expectationResult.stacktrace = expectationResult.stacktrace
    this.results_.addResult(expectationResult);
  };
  
};


var extendPrettyPrint = function(jasmine) {
  var format = jasmine.PrettyPrinter.prototype.format;
  
  jasmine.PrettyPrinter.prototype.format = function(value) {
    if (value && value.emitJasmine) {
      this.append(value.emitJasmine());
    } else {
      format.apply(this, arguments)
    }
  };
  
  jasmine.PrettyPrinter.prototype.iterateObject = function(obj, fn) {
    var should_regex = /should_\w+/
    for (var property in obj) {
      if (property == '__Jasmine_been_here_before__') continue;
      if (should_regex.test(property)) continue;
      fn(property, obj.__lookupGetter__ ? (obj.__lookupGetter__(property) != null) : false);
    }
  };
  
};

var extendJasmineSuite = function(jasmine) {
  jasmine.Suite.prototype.execute = function(onComplete) {
    this.env.reporter.reportSuiteStarting(this);
    var self = this;
    this.queue.start(function () {
      self.finish(onComplete);
    });
  };
};

exports.extend = function(jasmine) {
  extendStackTrace(jasmine)
  extendPrettyPrint(jasmine)
  extendJasmineSuite(jasmine)
};