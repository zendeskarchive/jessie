var jessie = require('jessie')
jessie.sugar()

require('coffee-script');

// Custom matcher
beforeEach(function(){
  this.addMatchers({
    toBeGreaterThanTwo: function(number) {
      return !(number <= 2)
    }
  });
});
