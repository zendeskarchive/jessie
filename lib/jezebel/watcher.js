var fs = require('fs');
var fileExtensionPattern = new RegExp(".*\.(js)");

function watchGivenFile (watch, callback) {
  fs.watchFile(watch, callback);
}

function watchFiles(path, callback) {
  fs.stat(path, function(err, stats){
    if (err) {
      sys.error('Error retrieving stats for file: ' + path);
    } else {
      if (stats.isDirectory()) {
        fs.readdir(path, function(err, fileNames) {
          if(err) {
            sys.puts('Error reading path: ' + path);
          }
          else {
            fileNames.forEach(function (fileName) {
              watchFiles(path + '/' + fileName, callback);
            });
          }
        });
      } else {
        if (path.match(fileExtensionPattern)) {
          watchGivenFile(path, function (curr, prev) {
            callback(path, curr, prev);
          });
        }
      }
    }
  });
}

exports.watchFiles = watchFiles;

