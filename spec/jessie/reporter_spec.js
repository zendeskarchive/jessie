describe('jessie.reporter', function() {
  var reporter = new (require('jessie/reporter')).reporter('progress')

  it("should load formatter", function() {
    expect(reporter.formatter.constructor).toEqual(Object)
  })

  it("should respond to jasmine reporter methods", function() {
    reporter.log.should_be_a(Function)
    reporter.reportSpecStarting.should_be_a(Function)
    reporter.reportSuiteStarting.should_be_a(Function)
    reporter.reportRunnerStarting.should_be_a(Function)
    reporter.reportSpecResults.should_be_a(Function)
    reporter.reportSuiteResults.should_be_a(Function)
    reporter.reportRunnerResults.should_be_a(Function)
  })

  describe('#printSummary', function() {

    it("should print a summary of a good run", function() {
      capture = require('helpers/stdout').capture(function() {
        reporter.printSummary({duration: 12, failed: 0, total: 2})
      })
      capture.output().should_match('2 examples')
      capture.output().should_match(/\033\[32m/) // green
      capture.output().should_match('Completed in 0.012 seconds')
    })

    it("should print a summary a failed run", function() {
      capture = require('helpers/stdout').capture(function() {
        reporter.printSummary({duration: 15, failed: 1, total: 2})
      })
      capture.output().should_match(/\033\[31m/) // red
      capture.output().should_match('2 examples, 1 failure')
      capture.output().should_match('Completed in 0.015 seconds')
    })

    it("should print a summary a pending and failed run", function() {
      capture = require('helpers/stdout').capture(function() {
        reporter.printSummary({duration: 15, failed: 1, total: 3, pending: 1})
      })
      capture.output().should_match(/\033\[31m/) // red
      capture.output().should_match('3 examples, 1 failure, 1 pending')
      capture.output().should_match('Completed in 0.015 seconds')
    })

    it("should print a summary of a pending", function() {
      capture = require('helpers/stdout').capture(function() {
        reporter.printSummary({duration: 15, total: 3, pending: 1})
      })
      capture.output().should_match(/\033\[33m/) // yellow
      capture.output().should_match('3 examples, 1 pending')
      capture.output().should_match('Completed in 0.015 seconds')
    })

  })

  describe('#extractFailureLine', function() {

    it("should extract a line from a stacktrace line", function() {
      capture = require('helpers/stdout').capture(function() {
        reporter.extractFailureLine('./spec/jessie/reporter_spec.js:1:1')
      })
      capture.output().should_match(/describe\(\'jessie.reporter\', function\(\) \{/)
    })

  })

  describe('#printFailures', function() {

    it("should print errors with stack trace", function() {
      var failures= [{
        description: 'it should print errors',
        message: 'Expected A to be B',
        stacktrace: ['Expected A to be B', 'file.js:23:2', 'another_file.js:30:11']
      }]

      capture = require('helpers/stdout').capture(function() {
        reporter.printFailures(failures)
      })

      capture.output().should_match(/\033\[31m/) // red

      capture.output().should_match('Failures:')
      capture.output().should_match('it should print errors')
      capture.output().should_match('Expected A to be B')
      capture.output().should_match('file.js:23:2')
      capture.output().should_match('another_file.js:30:11')
    })

    it("should print pending with stack trace", function() {
      var failures= [{
        pending: true,
        description: 'it should print errors',
        message: 'Expected A to be B',
        stacktrace: ['Expected A to be B', 'file.js:23:2', 'another_file.js:30:11']
      }]

      capture = require('helpers/stdout').capture(function() {
        reporter.printPendings(failures)
      })

      capture.output().should_match('Pending:')
      capture.output().should_match(/\033\[33m/) // yellow
      capture.output().should_match('it should print errors')
      capture.output().should_match('Expected A to be B')
      capture.output().should_match('file.js:23:2')
      capture.output().should_match('another_file.js:30:11')
    })

  })

})