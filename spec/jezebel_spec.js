describe('jezebel', function() {
  var childProcess = require('child_process'),
      sys = require('sys');
  var watcher, jezebel, repl, session; 

  beforeEach(function() {
    watcher = require('jezebel/watcher');
    jezebel = require('jezebel');
    session = {context: {}}; 
    spyOn(jezebel.repl, 'start').andReturn(session);
    spyOn(watcher, 'watchFiles');
    spyOn(process.stdin, 'emit');
    spyOn(require('path'), 'exists').andCallFake(function(file, callback) {
      expect(file).toEqual(process.cwd() + '/.jezebel');
      callback(true);
    });
  });

  function binDir() {
    var path = require('path')
    var fs = require('fs');
    return fs.realpathSync(path.dirname(fs.realpathSync(__filename)) + '/../bin');
  }

  function expectReplEval(statement) {
    expect(process.stdin.emit).toHaveBeenCalled();
    expect(process.stdin.emit.argsForCall[0][0]).toEqual('data');
    expect(process.stdin.emit.argsForCall[0][1].toString()).toEqual(statement);
  }

  describe('run', function() {
    it('watches for all the files in the specified directory', function() {
      jezebel.run([], {});
      expect(watcher.watchFiles).toHaveBeenCalledWith(process.cwd(), jezebel.fileChanged);
    });

    it('stars the repl', function() {
      jezebel.run([], {});
      expect(jezebel.repl.start).toHaveBeenCalledWith('> ');
    });
  });

  describe('fileChanged', function() {
    it('runs tests if the file has changed', function() {
      spyOn(childProcess, 'spawn').andReturn(process);
      jezebel.fileChanged("", {mtime: new Date(100)}, {mtime: new Date(0)});
      expect(childProcess.spawn).toHaveBeenCalled();
    });

    it('does not run the tests if the file has not actually changed', function() {
      jezebel.fileChanged("", {mtime: new Date(0)}, {mtime: new Date(0)});
      expect(process.stdin.emit).not.toHaveBeenCalled();
    });

    it('invokes the config callback to determine the tests to run', function() {
      pending();
    });
  });

  describe('runTests', function() {
    var child;

    beforeEach(function() {
      spyOn(childProcess, 'spawn').andReturn(child = {
        stdout: jasmine.createSpyObj('stdout', ['addListener']),
        stderr: jasmine.createSpyObj('stderr', ['addListener']),
        on: jasmine.createSpy('on')
      });
    });

    it('runs the specified tests', function() {
      jezebel.runTests();
      expect(childProcess.spawn).toHaveBeenCalledWith(binDir() + '/jessie', ['spec']);
    });

    it('writes stdout to sys.print', function() {
      spyOn(sys, 'print');
      jezebel.runTests();
      child.stdout.addListener.argsForCall[0][1]('hello');
      expect(sys.print).toHaveBeenCalledWith('hello');
    });

    it('writes stderr to sys.debug', function() {
      spyOn(sys, 'debug');
      jezebel.runTests();
      child.stderr.addListener.argsForCall[0][1]('goodbye');
      expect(sys.debug).toHaveBeenCalledWith('goodbye');
    });

    it('adds a line feed after running to re-prompt the repl', function() {
      jezebel.runTests();
      child.on.argsForCall[0][1]();
      expectReplEval("\n");
    });
  });
});

