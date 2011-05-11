describe('jessie.jasmine', function() {
  
  it('should extend jasmine.Spec.prototype.fail with stacktrace', function() {
    jasmine.Spec.prototype.fail.toString().should_match('expectationResult.stacktrace')
  })

  it('should extend jasmine.PrettyPrinter.prototype.iterateObject with checking for should_ properties', function() {
    jasmine.PrettyPrinter.prototype.iterateObject.toString().should_match('var should_regex')
  })
  
  it('should extend jasmine.Suite.prototype.execute with reportSuiteStarting event', function() {
    jasmine.Suite.prototype.execute.toString().should_match('reportSuiteStarting')
  })

  it('should handle exceptions with no stack traces', function() {
    jasmine.Spec.prototype.results_ = jasmine.createSpyObj('results', ['addResult']);
    jasmine.Spec.prototype.fail("this is an error");
    expect(jasmine.Spec.prototype.results_.addResult).toHaveBeenCalled();
    expect(jasmine.Spec.prototype.results_.addResult.argsForCall[0][0].message);
  });
  
  it("should extend Jasmine with ability to add pending notification", function() {
    var raised = 0, exception = null
    try {
      pending()
    } catch(e) {
      raised = 1, exception = e
    }
    raised.should_be(1)
    exception.type.should_be('pending')
    exception.message.should_be('Not Yet Implemented')
  })

  it("should extend Jasmine with ability to add pending notification with custom message", function() {
    var raised = 0, exception = null
    try {
      pending('Write some specs')
    } catch(e) {
      raised = 1, exception = e
    }
    raised.should_be(1)
    exception.type.should_be('pending')
    exception.message.should_be('Write some specs')
  })

})
