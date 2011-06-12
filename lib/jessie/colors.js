var codes = {
  grey:   '\033[90m',
  green:  '\033[32m',
  red:    '\033[31m',
  yellow: '\033[33m',
  clear:    '\033[0m'
}

var colorizer = {
  enabled: true,
  colorize: function(string, color) {
    if (this.enabled) {
      return codes[color] + string + codes.clear;
    } else {
      return string;
    }
  },
  grey: function(string) { return this.colorize(string, 'grey'); },
  green: function(string) { return this.colorize(string, 'green'); },
  yellow: function(string) { return this.colorize(string, 'yellow'); },
  red: function(string) { return this.colorize(string, 'red'); },
}

module.exports = colorizer
