describe('jessie.runner', function() {

  var runner = new (require('jessie/runner')).runner([''], {})

  it("should load finder", function() {
    expect(runner.finder).toBeDefined()
  })

  it("should load reporter", function() {
    expect(runner.reporter).toBeDefined()
  })

  it("should fire execute() on jasmine", function() {
    var check = 0
    runner.jasmine = {
      execute: function() {
        check = 1
      }
    }
    runner.run()
    check.should_be(1)
  })

})