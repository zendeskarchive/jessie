var sys  = require('sys')
var fs   = require('fs')
var colors = require('jessie/colors')

exports.formatter = {
  spec: function(result, spec) {
    if (result.pending) {
      sys.print(colors.yellow('*'))
    } else if (result.fail) {
      sys.print(colors.red('F'))
    } else {
      sys.print(colors.green('.'))
    }
  },
  finish: function(result, runner) {
    sys.puts('')
    if (result.failures.length > 0)
      this.reporter.printFailures(result.failures)
    if (result.pendings && result.pendings.length > 0)
      this.reporter.printPendings(result.pendings)

    this.reporter.printSummary(result)
  }
}
