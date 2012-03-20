var jessie = require('../lib/jessie')
jessie.sugar()

require('coffee-script');

jessie.callbacks.bind('finish', function() {
  console.log('Finished!')
});

// Custom matcher
beforeEach(function(){
  this.addMatchers({
    toBeGreaterThanTwo: function(number) {
      return !(number <= 2)
    }
  });
});
