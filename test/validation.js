var expect = require('chai').expect;
var doesMatch = require('../src/does-match.js');

describe('validation', function() {
  it('should throw if first param is not a string', function() {
    expect(doesMatch.bind(doesMatch)).to.throw('`text` should be string');
    expect(doesMatch.bind(doesMatch, null)).to.throw('`text` should be string');
    expect(doesMatch.bind(doesMatch, 0, 'a string')).to.throw('`text` should be string');
  });

  it('should throw if second param is not a string', function() {
    expect(doesMatch.bind(doesMatch, 'a string')).to.throw('`query` should be string');
    expect(doesMatch.bind(doesMatch, 'a string', null)).to.throw('`query` should be string');
    expect(doesMatch.bind(doesMatch, 'a string', 0)).to.throw('`query` should be string');
  });
});
