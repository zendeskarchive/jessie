exports.callbacks = {
  _callbacks: {
    'finish': []
  },
  bind: function(name, func) {
    this._callbacks[name].push(func)
  },
  trigger: function(name) {
    var calls = this._callbacks[name];
    var len   = calls.length;
    for (var i = 0; i < len; i++) {
      calls[i]();
    }
  }
}