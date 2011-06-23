var sys  = require('sys');

exports.formatter = {
  specStart: function(spec) {
    spec.duration = Number(new Date);
  },

  reportSpecResults: function(spec) {
    spec.duration = (Number(new Date) - spec.duration);
  },

  finish: function(result, runner) {
    sys.puts(tag('testsuite', {
      name: 'Jasmine Tests',
      tests: result.total,
      failures: result.failed,
      skip: result.pending,
      timestamp: (new Date).toUTCString(),
      time: result.duration / 1000
    }, false));
    runner.suites().forEach(handleSuite);
    sys.puts(end('testsuite'));
  }
};

function handleSuite(suite) {
  suite.specs().forEach(handleSpec);
}

function handleSpec(spec) {
  var r = extractResult(spec);
  var attributes = {
    classname: spec.suite.getFullName(),
    name: spec.description,
    time: spec.duration / 1000
  };

  var reason = r.pending? pendingSpecTag(spec) : r.fail? failedSpecTag(spec) : '';
  var specTag = reason?
    tag('testcase', attributes, false, reason) :
    tag('testcase', attributes, true)

  sys.puts(specTag);
}

function pendingSpecTag(spec) {
  return tag('skipped', { message: encode(spec.results().getItems()[0].trace.message) }, true);
}

function failedSpecTag(spec) {
  var reason = spec.results().getItems()[0];
  var attributes = { message: encode(reason.message) };
  reason.trace.type && (attributes.type = reason.trace.type)
  return tag('failure', attributes, false, cdata(reason.trace.stack));
}

function extractResult(spec) {
  var pending = false
  spec.results().getItems().forEach(function(item) {
    pending = item.pending || false;
  });
  return { pending: pending, fail: spec.results().failedCount > 0 };
}

function encode(value) {
  return !value ? value :
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/\u001b\[\d{1,2}m/g, '');
}

function tag(name, attribs, single, content) {
  var tag;
  var end = single ? ' />' : '>'
  var strAttr = [];
  for (var attr in attribs) {
    attribs.hasOwnProperty(attr) && strAttr.push(attr + '="' + encode(attribs[attr]) + '"');
  }

  tag = '<' + name + (strAttr.length? ' ' + strAttr.join(' ') : '' ) + end
  tag = content? (tag + content + '</' + name + end) : tag
  return tag;
}

function end(name) {
  return '</' + name + '>';
}

function cdata(data) {
  return '<![CDATA[' + encode(data) + ']]>';
}

