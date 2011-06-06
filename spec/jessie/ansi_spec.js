describe('jessie.ansi', function() {

  var ansi = require('jessie/ansi')

  it('should have proper red', function() {
    ansi.red.should_match(/\033\[31m/)
  })

  it('should have proper green', function() {
    ansi.green.should_match(/\033\[32m/)
  })

  it('should have proper yellow', function() {
    ansi.yellow.should_match(/\033\[33m/)
  })

  it('should have proper grey', function() {
    ansi.grey.should_match(/\033\[90m/)
  })

  it('should have a cancel color', function() {
    ansi.none.should_match(/\033\[0m/)
  })

})
