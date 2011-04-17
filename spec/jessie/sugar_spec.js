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

    it('should work with objects', function() {
      var variable = { a: 1, b: 2 }
      expect(variable).toEqual({ a: 1, b: 2})
      variable.should_be({ a: 1, b: 2})
    })

  })
  
})