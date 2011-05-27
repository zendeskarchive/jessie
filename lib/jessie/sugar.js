// Syntactic sugar to make specs more like Rspec
exports.sugar = function() {
  var Sugar = {
    should_be:                    function(compare) { expect(this).toEqual(compare); },
    should_be_a:                  function(object)  { expect(this.constructor).toEqual(object) },
    should_be_an_instance_of:     function(object)  { expect(true).toEqual(this instanceof(object)) },
    should_not_be:                function(compare) { expect(this).not.toEqual(compare); },
    should_match:                 function(compare) { expect(this).toMatch(compare); },
    should_not_match:             function(compare) { expect(this).not.toMatch(compare); },
    should_have_been_called:      function()        { expect(this).toHaveBeenCalled(); },
    should_have_been_called_with: function() {
      var expectation = expect(this);
      expectation.toHaveBeenCalledWith.apply(expectation, arguments);
    },
    should_have_not_been_called:  function()        { expect(this).not.toHaveBeenCalled(); }
  }
  // Object.prototype.emitJasmine       = function() { return this };
  String.prototype.emitJasmine      = function() { return this };
  Number.prototype.emitJasmine      = function() { return this };
  Array.prototype.emitJasmine       = function() { return this };

  String.prototype.should_be        = Sugar.should_be
  Number.prototype.should_be        = Sugar.should_be
  Array.prototype.should_be         = Sugar.should_be

  String.prototype.should_not_be    = Sugar.should_not_be
  Number.prototype.should_not_be    = Sugar.should_not_be
  Array.prototype.should_not_be     = Sugar.should_not_be

  String.prototype.should_be_a      = Sugar.should_be_a
  Number.prototype.should_be_a      = Sugar.should_be_a
  Array.prototype.should_be_a       = Sugar.should_be_a
  Function.prototype.should_be_a    = Sugar.should_be_a

  String.prototype.should_match     = Sugar.should_match
  String.prototype.should_not_match = Sugar.should_not_match

  Function.prototype.should_have_been_called      = Sugar.should_have_been_called
  Function.prototype.should_have_not_been_called  = Sugar.should_have_not_been_called
  Function.prototype.should_have_been_called_with = Sugar.should_have_been_called_with

};

// Extend jasmine.PrettyPrinter#format to try a emitJasmine method on an object - it is used when sugar is loaded
var originalformat = jasmine.PrettyPrinter.prototype.format;
jasmine.PrettyPrinter.prototype.format = function(value) {
  if (value && value.emitJasmine) {
    this.append(value.emitJasmine());
  } else {
    originalformat.apply(this, arguments)
  }
};
