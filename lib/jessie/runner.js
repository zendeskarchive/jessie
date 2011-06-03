exports.runner = function(args, options, callback) {
  this.jasmine  = jasmine.getEnv();
  this.finder   = new (require('jessie/finder')).finder(),
  this.reporter = new (require('jessie/reporter')).reporter(options.format, callback)
  this.run = function() {
    var specs   = this.finder.find(args, process.cwd())
    var runner  = this;
    var spec_helper = process.cwd() + '/spec/spec_helper.js'
    if (require('path').existsSync(spec_helper))
      require(spec_helper)
    specs.forEach(function(spec) { require(spec); })
    this.jasmine.reporter = this.reporter
    this.jasmine.execute()
  }
}