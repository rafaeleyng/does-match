var expect = require('chai').expect;
var doesMatch = require('../src/does-match');

describe('validation', function() {
  it('should throw if first param (`text`) is not a string', function() {
    expect(doesMatch.bind(doesMatch)).to.throw('`text`: expected string');
    expect(doesMatch.bind(doesMatch, null)).to.throw('`text`: expected string');
    expect(doesMatch.bind(doesMatch, 0, 'a string')).to.throw('`text`: expected string');
  });

  it('should throw if second param (`query`) is not a string', function() {
    expect(doesMatch.bind(doesMatch, 'a string')).to.throw('`query`: expected string');
    expect(doesMatch.bind(doesMatch, 'a string', null)).to.throw('`query`: expected string');
    expect(doesMatch.bind(doesMatch, 'a string', 0)).to.throw('`query`: expected string');
  });

  describe('options', function() {
    it('should work if `minWord` is between 1 and 10', function() {
      expect(doesMatch('some', 'string', {minWord: 1})).to.be.a('number');
      expect(doesMatch('some', 'string', {minWord: 10})).to.be.a('number');
    });

    it('should throw if `minWord` is not between 1 and 10', function() {
      expect(doesMatch.bind(doesMatch, 'some', 'string', {minWord: 0})).to.throw('`minWord`: expected number between 1 and 10');
      expect(doesMatch.bind(doesMatch, 'some', 'string', {minWord: 11})).to.throw('`minWord`: expected number between 1 and 10');
    });

    it('should throw if `minWord` option is not a number', function() {
      expect(doesMatch.bind(doesMatch, 'some', 'string', {minWord: 'invalid'})).to.throw('`minWord`: expected number');
    });

    it('should throw if `replaceDiacritics` option is not a boolean', function() {
      expect(doesMatch.bind(doesMatch, 'some', 'string', {replaceDiacritics: 'invalid'})).to.throw('`replaceDiacritics`: expected boolean');
    });

    it('should throw if `returnMatches` option is not a boolean', function() {
      expect(doesMatch.bind(doesMatch, 'some', 'string', {returnMatches: 'invalid'})).to.throw('`returnMatches`: expected boolean');
    });
  });
});
