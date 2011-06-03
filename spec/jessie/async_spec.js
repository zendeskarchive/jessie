describe('Jessie', function() {

  it('should be able to handle async specs using waits', function() {
    var func = jasmine.createSpy()

    setTimeout(func, 10)

    setTimeout(function() {
      func.should_have_been_called()
    }, 10)

    waits(10)

  })

  it('should be able to handle async specs using waitsFor', function() {
    var func = jasmine.createSpy()
    var a = 0

    setTimeout(function() {
      func()
      a = 1
    }, 10)

    waitsFor(function() {
      if (a == 1) {
        func.should_have_been_called()
        return true
      } else {
        return false
      }
    }, 10, 'result')

  })


})
