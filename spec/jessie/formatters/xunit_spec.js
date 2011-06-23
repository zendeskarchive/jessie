function outputAsArray(output) {
  var array = output.split('\n');
  return array.splice(0, array.length-1);
}

/* Remove the surrounding testsuite tag */
function specsAsArray(output) {
  var array = outputAsArray(output);
  return array.splice(1, array.length-1);
}

describe('XUnit formatter', function() {
  var formatter = new (require('jessie/reporter')).reporter('xunit').formatter

  var knownResults;
  var emptyRunner;
  var runnerWithOneSpec;

  beforeEach(function() {
    knownResults = { total: 2, failed: 1, pending: 1, duration: 2500 };
    emptyRunner = { suites: function() { return []; } };
    var suiteStub =  { getFullName: function() { return 'SuiteName'; } };
    var items = [ { message: 'ReasonMessage' , trace: {
      type: 'ReasonType',
      message: 'TraceReasonMessage',
      stack: 'FailureStack'
    }}];
    var results = { getItems: function() { return items; } }
    var specStub = { description: 'SpecName', suite: suiteStub, duration: 5000,
      results: function() { return results; }
    };
    suiteStub.specs = function() { return [ specStub ]; };
    runnerWithOneSpec = { suites: function() { return [ suiteStub ]; } };
  });

  it('should record the start time of a spec', function() {
    var emptySpec = {};
    formatter.specStart(emptySpec);
    expect(emptySpec.duration != undefined).toEqual(true);
    expect(emptySpec.duration > 0).toEqual(true);
  });

  it('should add an open testsuite tag with the summary in the first position of the output buffer', function() {
    capture = require('helpers/stdout').capture(function() {
      formatter.finish(knownResults, emptyRunner);
    });
    var tag = outputAsArray(capture.output())[0];
    tag.should_match('<testsuite');
    tag.should_match('name="Jasmine Tests"');
    tag.should_match('tests="2"');
    tag.should_match('failures="1"');
    tag.should_match('skip="1"');
    tag.should_match('time="2.5"');
    tag.should_match('timestamp="');
    tag.should_match('>');
  });

  it('should have the last tag as a close testsuite tag', function() {
    capture = require('helpers/stdout').capture(function() {
      formatter.finish(knownResults, emptyRunner);
    });
    var output = outputAsArray(capture.output());
    var tag = output[output.length - 1];
    tag.should_be('</testsuite>');
  });

  it('should add an open tastcase tag with the summary to the output buffer for successful specs', function() {
    capture = require('helpers/stdout').capture(function() {
      formatter.finish(knownResults, runnerWithOneSpec);
    });
    var tag = specsAsArray(capture.output())[0];
    tag.should_match('<testcase');
    tag.should_match('classname="SuiteName"');
    tag.should_match('name="SpecName"');
    tag.should_match('time="5"');
    tag.should_match('/>');
  });

  it('should add the reasons of a pended spec to the output buffer', function() {
    runnerWithOneSpec.suites()[0].specs()[0].results().getItems()[0].pending = true;
    capture = require('helpers/stdout').capture(function() {
      formatter.finish(knownResults, runnerWithOneSpec);
    });
    var tag = specsAsArray(capture.output())[0];
    tag.should_match('<skipped');
    tag.should_match('message="TraceReasonMessage"');
    tag.should_match('/>');
  });

  it('should add the reasons of a failed spec to the output buffer', function() {
    runnerWithOneSpec.suites()[0].specs()[0].results().failedCount = 1;
    capture = require('helpers/stdout').capture(function() {
      formatter.finish(knownResults, runnerWithOneSpec);
    });
    var tag = specsAsArray(capture.output())[0];
    tag.should_match('<failure');
    tag.should_match('message="ReasonMessage"');
    tag.should_match('type="ReasonType"');
    tag.should_match(/<!\[CDATA\[FailureStack\]\]>/);
    tag.should_match('</failure>');
  });
});

