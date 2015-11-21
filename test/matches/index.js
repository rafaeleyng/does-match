var expect = require('chai').expect;
var doesMatch = require('../../src/does-match.js');

describe('matches', function() {
  require('./whole.js');
  require('./word.js');
  require('./lookahead.js');
});
