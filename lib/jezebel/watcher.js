// Basically stolen from supervisor.js, so there are no tests
// https://github.com/isaacs/node-supervisor

var fs = require('fs');
var ignoredFiles = ['.git', 'node_modules'];

function watchGivenFile (watch, callback) {
  fs.watchFile(watch, {persistent: true, interval: 500}, callback);
}

function isInProject(path) {
  return ignoredFiles.indexOf(path.toLowerCase()) === -1;
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
              if (isInProject(fileName)) {
                watchFiles(path + '/' + fileName, callback);
              }
            });
          }
        });
      } else {
        watchGivenFile(path, function (curr, prev) {
          callback(path, curr, prev);
        });
      }
    }
  });
}

exports.watchFiles = watchFiles;

