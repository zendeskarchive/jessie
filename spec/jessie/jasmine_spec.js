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

})