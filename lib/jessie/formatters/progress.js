var sys  = require('sys')
var fs   = require('fs')
var ansi = require('jessie/ansi')

exports.formatter = {
  spec: function(result, spec) {
    if (result.pending) {
      sys.print(ansi.yellow + '*' + ansi.none)
    } else if (result.fail) {
      sys.print(ansi.red + 'F' + ansi.none)
    } else {
      sys.print(ansi.green + '.' + ansi.none)
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
