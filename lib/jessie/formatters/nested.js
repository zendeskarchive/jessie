var sys  = require('sys')
var fs   = require('fs')
var ansi = require('jessie/ansi')

exports.formatter = {
  start: function() {
    this.depth = 0
  },
  specStart: function(spec) {
    this.printDepth()
  },
  spec: function(result, spec) {
    if (result.fail) {
      sys.puts(ansi.red + spec.description + ansi.none)
    } else {
      sys.puts(ansi.green + spec.description + ansi.none)
    }
  },
  suiteStart: function(suite) {
    this.printDepth()
    this.depth += 1
    sys.puts(suite.description)
  },
  suite: function(result, suite) {
    this.depth -= 1
  },
  finish: function(result, runner) {
    if (result.failures.length > 0) 
      this.reporter.printFailures(result.failures)
    
    this.reporter.printSummary(result)
  },
  printDepth: function() {
    for (var i = 0; i < this.depth; i++) sys.print('  ')
  }
}
