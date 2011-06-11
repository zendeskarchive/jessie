describe('jessie.jasmine', function() {

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

  it("should extend Jasmine with ability to define a pending spec by calling a it without a callback", function() {
    spyOn(jasmine.Env.prototype, 'it_without_default_pending').andReturn('')
    jasmine.Env.prototype.it("Foo")
    jasmine.Env.prototype.it_without_default_pending.should_have_been_called_with("Foo", jasmine.placeholderPendingFunction)
  })
})
