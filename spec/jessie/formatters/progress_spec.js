describe('formatters', function() {
  var reporter = new (require('jessie/reporter')).reporter('progress')

  describe('progress formatter', function() {

    describe('single spec', function() {

      it("should use a dot to render a successful spec", function() {
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.spec({fail: false})
        })
        capture.output().should_match('.')
        capture.output().should_match(/\033\[32m/) // green
      })

      it("should use a star to render a pending spec", function() {
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.spec({pending: true})
        })
        capture.output().should_match(/\*/)
        capture.output().should_match(/\033\[33m/) // yellow
      })

      it("should use a F to render a failed spec", function() {
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.spec({fail: true})
        })
        capture.output().should_match('F')
        capture.output().should_match(/\033\[31m/) // red
      })

    })

    describe('summary', function() {
      var result = {duration: 15, failed: 1, total: 2}
      result.failures= [{
        description: 'it should print errors',
        message: 'Expected A to be B',
        stacktrace: ['Expected A to be B', 'file.js:23:2', 'another_file.js:30:11']
      }]

      it("should properly render a summary", function() {
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.finish(result)
        })

        capture.output().should_match('2 examples, 1 failure')
        capture.output().should_match('Completed in 0.015 seconds')
        capture.output().should_match('it should print errors')
        capture.output().should_match('Expected A to be B')
        capture.output().should_match('file.js:23:2')
        capture.output().should_match('another_file.js:30:11')

      })

      it("should properly render a summary with pending and failing specs", function() {
        var result = {duration: 15, failed: 1, total: 3, pending: 1}
        result.failures= [{
          description: 'it should print errors',
          message: 'Expected A to be B',
          stacktrace: ['Expected A to be B', 'file.js:23:2', 'another_file.js:30:11']
        }]

        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.finish(result)
        })

        capture.output().should_match(/\033\[31m/) // red
        capture.output().should_match('3 examples, 1 failure, 1 pending')
        capture.output().should_match('Completed in 0.015 seconds')
        capture.output().should_match('it should print errors')
        capture.output().should_match('Expected A to be B')
        capture.output().should_match('file.js:23:2')
        capture.output().should_match('another_file.js:30:11')
      })

      it("should properly render a summary with pending and failing specs", function() {
        var result = {duration: 15, total: 3, pending: 1}
        result.failures= [{
          description: 'it should print errors',
          message: 'Expected A to be B',
          stacktrace: ['Expected A to be B', 'file.js:23:2', 'another_file.js:30:11']
        }]

        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.finish(result)
        })

        capture.output().should_match(/\033\[33m/) // yellow
        capture.output().should_match('3 examples, 1 pending')
        capture.output().should_match('Completed in 0.015 seconds')
        capture.output().should_match('it should print errors')
        capture.output().should_match('Expected A to be B')
        capture.output().should_match('file.js:23:2')
        capture.output().should_match('another_file.js:30:11')
      })

    })
  })

})

