var sys  = require('sys')
var fs   = require('fs')
var ansi = require('jessie/ansi').ansi

exports.formatter = {
  start: function() {},
  spec: function(result, spec) {
    if (result.fail) {
      sys.print(ansi.red + 'F' + ansi.none)
    } else {
      sys.print(ansi.green + '.' + ansi.none)
    }
  },
  // suite: function(result, spec) {},
  finish: function(result, runner) {
    sys.puts('')    
    if (result.failures.length > 0) 
      this.reporter.printFailures(result.failures)
    
    this.reporter.printSummary(result)
  }
}
