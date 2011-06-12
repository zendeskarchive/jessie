var sys  = require('sys')
var fs   = require('fs')
var colors = require('jessie/colors')

exports.formatter = {
  start: function() {
    this.depth = 0
  },
  specStart: function(spec) {
    this.printDepth()
  },
  spec: function(result, spec) {
    if (result.pending) {
      sys.puts(colors.yellow(spec.description))
    } else if (result.fail) {
      sys.puts(colors.red(spec.description))
    } else {
      sys.puts(colors.green(spec.description))
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
    if (result.pendings && result.pendings.length > 0)
      this.reporter.printPendings(result.pendings)

    this.reporter.printSummary(result)
  },
  printDepth: function() {
    for (var i = 0; i < this.depth; i++) sys.print('  ')
  }
}
