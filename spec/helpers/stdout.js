var StdoutCapture = function() {
  var sys = require('sys')
  var originals = {
    puts: sys.puts,
    print: sys.print
  }
  var output = ''
  sys.puts  = function(msg) { output += msg + "\n" };
  sys.print = function(msg) { output += msg };
  this.stop = function() {
    sys.puts  = originals.puts
    sys.print = originals.print
  }
  this.output = function() {
    return output;
  }
}
exports.capture = function(callback) {
  capture = new StdoutCapture()
  if (callback) {
    try {
      callback()
    } finally {
      capture.stop()
    }
  }
  return capture
};