var fs = require('fs');

exports.finder = function() {
  this.find = function(files_or_dirs, path) {
    path = path || '.'
    var regex  = /_spec\.js$/
    var specs  = [];
    var finder = this;
    files_or_dirs.forEach(function(file_or_dir) {
      file_or_dir = path + '/' + file_or_dir
      var stat = fs.statSync(file_or_dir);
      if (stat.isFile() && regex.test(file_or_dir)) {
        specs.push(file_or_dir)
      } else if (stat.isDirectory()) {
        var files = fs.readdirSync(file_or_dir)
        var found = finder.find(files, file_or_dir)
        found.forEach(function(file) {
          specs.push(file)
        });
      }
    })
    return specs;
  }
}