var fs  = require('fs');
var sys = require('sys')
var ansi = require('jessie/ansi')

exports.reporter = function(format, callback) {
  format = format || 'progress'
  this.callback = callback
  try {
    this.formatter = require('jessie/formatters/' + format).formatter
  } catch(e) {
    sys.puts(ansi.red + "Failed to load " + format + " formatter. Defaulting to progress formatter" + ansi.none)
    this.formatter = require('jessie/formatters/progress').formatter
  }
  var formatter = this.formatter
  this.formatter.reporter = this;
}

// Wrapper around the formatter to log
exports.reporter.prototype.log    = function(suite)  {
  if (this.formatter.log)
    this.formatter.log()
}

// Wrapper around the formatter to render spec starting
exports.reporter.prototype.reportSpecStarting    = function(spec)  {
  if (this.formatter.specStart)
    this.formatter.specStart(spec)
  if (this.formatter.reportSpecStarting)
    this.formatter.reportSpecStarting(spec)
};

// Wrapper around the formatter to render suite starting
exports.reporter.prototype.reportSuiteStarting   = function(suite)  {
  if (this.formatter.suiteStart)
    this.formatter.suiteStart(suite)
  if (this.formatter.reportSuiteResults)
    this.formatter.reportSuiteResults(suite)
};

// Wrapper around the formatter to render runner starting
exports.reporter.prototype.reportRunnerStarting  = function(runner) {
  this.start_time = Number(new Date)
  if (this.formatter.start)
    this.formatter.start()
  if (this.formatter.reportRunnerStarting)
    this.formatter.reportRunnerStarting(runner)
}

// Wrapper around the formatter to render single spec results
exports.reporter.prototype.reportSpecResults   = function(spec) {
  if (this.formatter.spec) {
    var pending = false
    spec.results().getItems().forEach(function(item) {
      if (!item.passed() && item.pending)
        pending = true
    })
    var result = {
      pending: pending,
      fail: spec.results().failedCount > 0
    }
    this.formatter.spec(result, spec)
  }
  if (this.formatter.reportSpecResults)
    this.formatter.reportSpecResults(spec)
}

// Wrapper around the formatter to render suite results starting
exports.reporter.prototype.reportSuiteResults  = function(suite) {
  if (this.formatter.suite)
    this.formatter.suite({}, suite)
  if (this.formatter.reportSuiteResults)
    this.formatter.reportSuiteResults(suite)
}

// Wrapper around the formatter to render run results
// Extracts useful info before passing it to the formatter
// Additionally, call the finish callback of present
exports.reporter.prototype.reportRunnerResults = function(runner) {
  var results = runner.results();
  var suites = runner.suites();
  var result = {
    failures: this.extractFailures(runner),
    pendings: this.extractPendings(runner)
  }
  result.total = 0
  suites.forEach(function(suite) {
    result.total += suite.specs().length
  });
  result.duration = (Number(new Date) - this.start_time)
  result.failed  = result.failures.length
  result.pending = result.pendings.length

  if (this.formatter.finish)
    this.formatter.finish(result, runner);
  if (this.formatter.reportRunnerResults)
    this.formatter.reportRunnerResults(runner);

  var failed = result.failed > 0
  if (this.callback) this.callback(failed)
}

// Print an rspec-compatible summary of the run
exports.reporter.prototype.printSummary = function(result) {
  sys.puts('')
  sys.puts('Completed in ' + (result.duration / 1000) + ' seconds')
  if (result.failed > 0) {
    sys.print(ansi.red + result.total + " " + (result.total > 1 ? "examples" : "example") + ", " )
    sys.print(result.failed + " " +  (result.failed > 1 ? "failures" : "failure") + "")
    if (result.pending > 0)
      sys.print(', ' + result.pending + " pending")
    sys.puts(ansi.none)
  } else if (result.pending > 0) {
    sys.print(ansi.yellow + result.total + " " + (result.total > 1 ? "examples" : "example") + ", " )
    sys.puts(result.pending + " pending" + ansi.none)
  } else {
    sys.puts(ansi.green + result.total + " " +  (result.total > 1 ? "examples" : "example") + " " + ansi.none)
  }
};

// Wrapper function for accessing items within specs and finding the ones that did not pass
// It accepts a filter function which will be run with the each found item
exports.reporter.prototype.collectFailedSpecItems = function(runner, filter) {
  var suites = runner.suites();
  var collected = []
  suites.forEach(function(suite) {
    suite.specs().forEach(function(spec) {
      var result = spec.results()
      var failed = result.failedCount > 0
      if (failed) {
        var found;
        var items = result.getItems()
        for(var i = 0, len = items.length; i < len; i++) {
          if (!items[i].passed()) {
            found = items[i];
            break
          }
        }

        // If filter fails, return and continue with loop
        if (!filter(found)) return
        var stacktrace = found.stacktrace
        if (!stacktrace) {
          var stacktrace = []
          try {
            var parts = found.trace.stack.split(/\n\s+/)
            var regex = /(vendor\/jasmine\.js|jessie\/sugar\.js|lib\/jessie\/jasmine\.js):\d+:\d+\)*/
            var trace_verifier = /^at /
            for (var i = 0, len = parts.length; i < len; i++) {
              var line = parts[i]
              if (!trace_verifier.test(line)) continue
              if (regex.test(line)) continue
              stacktrace.push(line.replace())
            }
          } catch(e) {}
        }
        found.description = spec.getFullName()
        found.stacktrace = stacktrace
        collected.push(found)
      }
    })
  })
  return collected;
}

// Extracts failures from runner
exports.reporter.prototype.extractFailures = function(runner) {
  var suites = runner.suites();
  var failures = []
  this.collectFailedSpecItems(runner, function(item) {
    // Failed specs are simply failed, they are not pending
    return !item.pending
  }).forEach(function(item) {
    failures.push({
      pending:     false,
      description: item.description,
      message:     item.message,
      stacktrace:  item.stacktrace
    })
  })
  return failures;
}

// Extracts failures from runner
exports.reporter.prototype.extractPendings = function(runner) {
  var suites = runner.suites();
  var pendings = []
  this.collectFailedSpecItems(runner, function(item) {
    // Failed specs are simply failed, they are not pending
    return item.pending
  }).forEach(function(item) {
    pendings.push({
      pending:     true,
      description: item.description,
      message:     item.message,
      stacktrace:  item.stacktrace
    })
  })
  return pendings;
}
// Extract the line of code
// Argument should be a string like this "file.js:1:1"
exports.reporter.prototype.extractFailureLine = function(line) {
  try {
    // Try to extract the exact line of failure, but not crash if it fails
    var first = line
    var file_and_line = first.match(/([^ (]+:\d+):\d+\)*$/)[1]
    if (file_and_line) {
      var parts = file_and_line.split(':')
      var src = fs.readFileSync(parts[0]);
      var lines = src.toString().split(/\n/)
      var line = lines[parts[1]-1];
      line = line.replace(/^\s+/, '').replace(/\s$/, '')
      sys.puts("     " + ansi.red + '=> '+ line + ansi.none)
    }
  } catch(e) {}
}

// Helper function - prints out failures in a rspec-compatible format
exports.reporter.prototype.printFailures = function(failures) {
  var reporter = this;
  sys.puts('')
  sys.puts('Failures:')
  failures.forEach(function(failure, index) {
    sys.puts('')
    sys.puts('  ' + (index + 1) + ') ' + failure.description )
    sys.puts("    " + ansi.red + ' ' + failure.message + ansi.none)
    var stacktrace = failure.stacktrace
    if (stacktrace[0] && !failure.pending)
      reporter.extractFailureLine(stacktrace[0])
    sys.print(ansi.grey)
    stacktrace.forEach(function(line) {
      sys.puts("     # " + line.replace(process.cwd() + '/', ''))
    })
    sys.print(ansi.none)
  })
}

// Helper function - prints out pendings in a rspec-compatible format
exports.reporter.prototype.printPendings = function(failures) {
  var reporter = this;
  sys.puts('')
  sys.puts('Pending:')
  failures.forEach(function(failure, index) {
    sys.puts('')
    sys.puts('  ' + (index + 1) + ') ' + failure.description )
    sys.puts("    " + ansi.yellow + ' ' + failure.message + ansi.none)
    var stacktrace = failure.stacktrace
    stacktrace.shift()
    if (stacktrace[0] && !failure.pending)
      reporter.extractFailureLine(stacktrace[0])
    sys.print(ansi.grey)
    stacktrace.forEach(function(line) {
      sys.puts("     # " + line.replace(process.cwd() + '/', ''))
    })
    sys.print(ansi.none)
  })
}
