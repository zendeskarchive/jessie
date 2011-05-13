var fs = require('fs'),
    path = require('path'),
    watcher = require('jezebel/watcher'),
    repl = require('repl'),
    childProcess = require('child_process'),
    sys = require('sys');
var binDir = fs.realpathSync(path.dirname(__filename) + '/../bin');
var selector = require('jezebel/test_selector');

var session;
var config = {};

function evalInRepl(statement) {
  process.stdin.emit('data', new Buffer(statement));
}

function runHook(name, args, defaultAction) {
  func = session.context["on" + name];
  if (func) {
    return func.apply(session.context, args);
  } 
}

function fileChanged(path, curr, prev) {
  if (curr.mtime.getTime() !== prev.mtime.getTime()) {
    var tests = runHook('Change', [path, curr, prev]) || selector.select(path, curr, prev);
    runTests(tests);
  }
}

function runTests(tests) {
  var child = childProcess.spawn(binDir + '/jessie', tests || ['spec']);
  child.stdout.addListener("data", function (chunk) { chunk && sys.print(chunk) });
  child.stderr.addListener("data", function (chunk) { chunk && sys.debug(chunk) });
  child.on('exit', function(fail) { 
    if (fail) {
      runHook('Fail');
    } else {
      runHook('Pass');
    }
    evalInRepl("\n") ;
  });
}

function loadConfig(callback) {
  var configFile = process.cwd() + '/.jezebel';
  path.exists(configFile, function(exists) {
    if (exists) { config = require(configFile); }
    callback();
  });
}

function startRepl() {
  session = repl.start("> ");
  session.context.runTests = runTests;
  for (i in config) {
    session.context[i] = config[i];
  }
}

// FIXME Hackity, hack, hack. For some reason, this module is not cached. Spying on a copy won't work.
exports.repl = repl;

exports.runTests = runTests;
exports.fileChanged = fileChanged;
exports.loadConfig = loadConfig;

exports.run = function(args, options) {
  loadConfig(function() {
    watcher.watchFiles(process.cwd(), fileChanged);
    startRepl();
    runTests();
  });
};
