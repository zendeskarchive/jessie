var sys  = require('sys')
var fs   = require('fs')
var ansi = require('jessie/ansi').ansi

exports.formatter = {
  log: function() {},
  reportSpecStarting: function(spec) {},
  reportSuiteResults: function(suite) {},
  reportRunnerStarting: function(runner) {
    this.start = Number(new Date)
  },
  reportSpecResults: function(spec) {
    var result = spec.results()
    var failed = result.failedCount > 0
    if (failed) {
      sys.print(ansi.red + 'F' + ansi.none)
    } else {
      sys.print(ansi.green + '.' + ansi.none)
    }
  },
  reportRunnerResults: function(runner) {
    sys.puts('')
    var results = runner.results();
    var suites = runner.suites();

    var failures = []
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

          var stacktrace = found.stacktrace
          if (!stacktrace) {
            var stacktrace = []
            try {
              var parts = found.trace.stack.split(/\n\s+/)
              var regex = /(vendor\/jasmine\.js|jessie\/sugar\.js):\d+:\d+\)*/
              for (var i = 0, len = parts.length; i < len; i++) {
                var line = parts[i]
                if (regex.test(line)) continue
                stacktrace.push(line.replace())
              }
            } catch(e) {}
          }

          failures.push({
            description: spec.getFullName(),
            message: found.message,
            stacktrace: stacktrace
          })
        }
      })
    })

    if (failures.length > 0) {
      sys.puts('')
      sys.puts('Failures:')
      failures.forEach(function(failure, index) {
        sys.puts('')
        sys.puts('  ' + (index + 1) + ') ' + failure.description )
        sys.puts("    " + ansi.red + ' ' + failure.message + ansi.none)
        var stacktrace = failure.stacktrace
        stacktrace.shift()

        if (stacktrace[0]) {
          try {
            // Try to extract the exact line of failure, but not crash if it fails
            var first = stacktrace[0]
            var file_and_line = first.match(/([^ (]+:\d+):\d+\)*$/)[1]
            if (file_and_line) {
              var parts = file_and_line.split(':')
              var src = fs.readFileSync(parts[0]);
              var lines = src.toString().split(/\n/)
              var line = lines[parts[1]-1];
              line = line.replace(/^\s+/, '').replace(/\s$/, '')
              console.log("     " + ansi.red + '=> '+ line + ansi.none)
            }            
          } catch(e) {}
        }
        sys.print(ansi.grey)
        stacktrace.forEach(function(line) {
          sys.puts("     # " + line.replace(process.cwd() + '/', ''))
        })
        sys.print(ansi.none)
      })
    }

    sys.puts('')    
    sys.puts('Completed in ' + ((Number(new Date) - this.start).toString() / 1000) + ' seconds')
    if (failures.length > 0) {
      sys.print(ansi.red + results.totalCount + " " + (results.totalCount > 1 ? "examples" : "example") + ", " )      
      sys.puts(failures.length + " " +  (failures.length > 1 ? "failures" : "failure") + " " + ansi.none)      
    } else {
      sys.puts(ansi.green + results.totalCount + " " +  (results.totalCount > 1 ? "examples" : "example") + " " + ansi.none)
    }

  }
}