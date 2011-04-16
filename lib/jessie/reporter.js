var fs  = require('fs');
var sys = require('sys')
var ansi = require('jessie/ansi').ansi

exports.reporter = function(format, callback) {
  format = format || 'rspec'

  try {
    var formatter = require('jessie/formatters/' + format).formatter
  } catch(e) {
    sys.puts(ansi.red + "Failed to load formatter. Defaulting to rspec formatter" + ansi.none)
    var formatter = require('jessie/formatters/rspec').formatter
  }
  
  this.log                  = function()       { formatter.log() },
  this.reportSpecStarting   = function(spec)   { formatter.reportSpecStarting(spec) };
  this.reportSuiteResults   = function(suite)  { formatter.reportSuiteResults(suite) };
  this.reportRunnerStarting = function(runner) { formatter.reportRunnerStarting(runner) };
  this.reportSpecResults    = function(spec)   { formatter.reportSpecResults(spec) };
  this.reportRunnerResults  = function(runner) { 
    formatter.reportRunnerResults(runner); 
    var failed = (runner.results().failedCount > 0)
    if (callback) callback(failed)
  };
}