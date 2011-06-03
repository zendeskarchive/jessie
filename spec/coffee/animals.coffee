class Animal
  constructor: (@name) ->

  move: (meters) ->
    @name + " moved " + meters + "m."

class Snake extends Animal
  move: ->
    super 5

class Horse extends Animal
  move: ->
    super 45

exports.Animal = Animal
exports.Snake = Snake
exports.Horse = Horse