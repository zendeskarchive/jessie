var fs = require('fs'),
    path = require('path'),
    watcher = require('jezebel/watcher'),
    repl = require('repl'),
    childProcess = require('child_process'),
    sys = require('sys');
var binDir = fs.realpathSync(path.dirname(__filename) + '/../bin');

var session;

function evalInRepl(statement) {
  process.stdin.emit('data', new Buffer(statement));
}

function triggerTestRun() {
  evalInRepl("runTests()\n");
}

function fileChanged(path, curr, prev) {
  if (curr.mtime.getTime() !== prev.mtime.getTime()) {
    triggerTestRun();
  }
}

function runTests() {
  // This _should_ work, and would be ideal, but I get very strange behavior
  //
  // var sandbox = {
  //   jessie: jessie,
  //   Buffer: Buffer,
  //   console: console
  // };
  // var script = "jessie.run(['spec'], {format: 'progress'}, function(fail) {console.log(fail);});"
  // vm.runInNewContext(script, sandbox, 'jezebel-script');

  // Running the top level script in a new context is kinda tricky :-(
  //
  //var scriptFile = binDir + '/jessie';
  //var script = fs.readFileSync(scriptFile).toString();
  //script = script.replace(/#.*/, '');
  //var sandbox = {
  //  require:require,
  //  __filename: scriptFile,
  //  __dirname: binDir,
  //  process: {
  //    args: ['spec'],
  //    cwd: process.cwd,
  //    on: process.on,
  //    emit: process.emit
  //  }
  //};
  //vm.runInNewContext(script, sandbox, scriptFile);
  
  // In process test running. Creates a class reloading problem. :-(
  //
  //jessie.run(['spec'], {format: 'progress'}, function(fail) {
  //  process.stdin.emit('data', new Buffer('\n'));
  //})

  // Out of process test running. Prevents direct access to test results :-(
  var child = childProcess.spawn(binDir + '/jessie', ['spec']);
  child.stdout.addListener("data", function (chunk) { chunk && sys.print(chunk) });
  child.stderr.addListener("data", function (chunk) { chunk && sys.debug(chunk) });
  child.on('exit', function() { evalInRepl("\n") });
}

function startRepl() {
  session = repl.start("> ");
  session.context.runTests = runTests;
}

// FIXME Hackity, hack, hack. For some reason, this module is not cached. Spying on a copy won't work.
exports.repl = repl;

exports.runTests = runTests;
exports.fileChanged = fileChanged;
exports.run = function(args, options) {
  watcher.watchFiles(process.cwd(), fileChanged);
  startRepl();
  triggerTestRun();
};
