exports.select = function(path, curr, prev) {
  if (path.match(/\_spec.js$/)) {
    return [path.replace(process.cwd() + '/', '')];
  }
  if (path.match(/\.js$/)) {
    return ['spec'];
  }
}
