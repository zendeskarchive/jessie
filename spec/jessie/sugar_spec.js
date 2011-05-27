describe('jessie.sugar', function() {

  describe('.should_be', function() {

    it('should work with strings', function() {
      var variable = "Foo"
      expect(variable).toEqual("Foo")
      variable.should_be("Foo")
    })

    it('should work with numbers', function() {
      var variable = 4
      expect(variable).toEqual(4)
      variable.should_be(4)
      variable = 10.0
      variable.should_be(10.0)
    })

    it('should work with arrays', function() {
      var variable = [1,2]
      expect(variable).toEqual([1,2])
      variable.should_be([1,2])
    })

  })

  describe('.should_not_be', function() {

    it('should work with strings', function() {
      var variable = "Foo"
      variable.should_not_be("Boo")
    })

    it('should work with numbers', function() {
      var variable = 4
      variable.should_not_be(6)
      variable = 10.0
      variable.should_not_be(11.0)
    })

    it('should work with arrays', function() {
      var variable = [1,2]
      variable.should_not_be([1,2,3])
    })

  })

  describe('.should_match', function() {

    it('should work with strings', function() {
      var variable = "Michael Johnson"
      variable.should_match('Johnson')
    })

  })

  describe('.should_not_match', function() {

    it('should work with strings', function() {
      var variable = "Michael Johnson"
      variable.should_not_match('Jackson')
    })

  })

  describe('.should_be_a', function() {

    it('should work with strings', function() {
      var variable = "Foo"
      variable.should_be_a(String)
    })

    it('should work with strings', function() {
      var variable = 4
      variable.should_be_a(Number)
    })

    it('should work with arrays', function() {
      var variable = [1,2]
      variable.should_be_a(Array)
    })

    it('should work with functions', function() {
      var variable = function() {}
      variable.should_be_a(Function)
    })

  })

  describe('.should_have_been_called', function() {

    it('should work with functions', function() {
      object = { 'func': function() {} }
      spyOn(object, 'func')
      object.func()
      object.func.should_have_been_called()
    })

  })

  describe('.should_have_not_been_called', function() {

    it('should work with functions', function() {
      object = { 'func': function() {} }
      spyOn(object, 'func')
      object.func.should_have_not_been_called()
    })

  })

  describe('.should_have_been_called_with', function() {

    it('should work with functions', function() {
      object = { 'func': function() {} }
      spyOn(object, 'func')
      object.func('Foo')
      object.func.should_have_been_called()
      object.func.should_have_been_called_with("Foo")
    })

  })

  describe('jasmine', function() {

    it("should extend jasmine.PrettyPrinter.prototype.format with ability to run emitJasmine", function() {
      jasmine.PrettyPrinter.prototype.format.toString().should_match('value.emitJasmine')
    })

  })
})