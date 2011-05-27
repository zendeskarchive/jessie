describe('jessie.finder', function() {
  var path = require('path');
  var finder = new (require('jessie/finder').finder)()

  it("should find files if only dir is specified", function() {
    finder.find(['spec']).length.should_be(9)
  })

  it("should find files with Jasmine original spec names like FooSpec.js", function() {
    finder.find(['spec/jessie/compatibility']).length.should_be(1)
  })

  it('leaves non-relative paths alone', function() {
    finder.find([path.resolve('spec')]).length.should_be(9)
  });

  it("should find files if only files are specified", function() {
    finder.find(['spec/jessie/finder_spec.js', 'spec/jessie/sugar_spec.js']).length.should_be(2)
  })

  it("should find files if both dirs and files are specified", function() {
    finder.find(['spec/jessie/formatters', 'spec/jessie/finder_spec.js']).length.should_be(3)
  })

})
