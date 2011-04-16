// Syntactic sugar to make specs more like Rspec
exports.sugar = function() {
  var Sugar = {
    should_be:     function(compare) { expect(this).toEqual(compare); },
    should_not_be: function(compare) { expect(this).not.toEqual(compare); },
    should_match:  function(compare) { expect(this).toMatch(compare); }
  }
  // Object.prototype.emitJasmine       = function() { return this };
  String.prototype.emitJasmine      = function() { return this };
  Number.prototype.emitJasmine      = function() { return this };
  Array.prototype.emitJasmine       = function() { return this };
  
  Object.prototype.should_be        = Sugar.should_be
  Object.prototype.should_not_be    = Sugar.should_not_be
  String.prototype.should_match     = Sugar.should_match
};
