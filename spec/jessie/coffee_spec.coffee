describe 'Coffee Script support', ->

  it 'should pass', ->
    'Foo'.should_be 'Foo'

  it "should work with external Coffee Script code", ->
    animals = require('./../coffee/animals.coffee')
    sam = new animals.Snake "Sammy"
    tom = new animals.Horse "Tommy"

    sam.move().should_be 'Sammy moved 5m.'
    tom.move().should_be 'Tommy moved 45m.'
