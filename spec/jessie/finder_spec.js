describe('jessie.finder', function() {
  var finder = new (require('jessie/finder').finder)()
  
  it("should find files if only dir is specified", function() {
    finder.find(['spec']).length.should_be(9)
  })
  
  it("should find files if only files are specified", function() {
    finder.find(['spec/jessie/finder_spec.js', 'spec/jessie/sugar_spec.js']).length.should_be(2)
  })
  
  it("should find files if both dirs and files are specified", function() {
    finder.find(['spec/jessie/formatters', 'spec/jessie/finder_spec.js']).length.should_be(3)
  })
  
})
