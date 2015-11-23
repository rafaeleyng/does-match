var expect = require('chai').expect;
var doesMatch = require('../../src/does-match');

describe('minWord', function() {
  var text = 'this is the original text';

  it('should not matter when matching the whole query', function() {
    expect(doesMatch(text, text)).to.equal(doesMatch(text, text, {minWord: 10}));
  });

  it('should default to 3', function() {
    expect(doesMatch(text, 'the original text is this')).to.equal(doesMatch(text, 'the original text is this', {minWord: 3}));
  });

  it('should work when setting a smaller value', function() {
    expect(doesMatch(text, 'the original text is this', {minWord: 2})).to.be.above(doesMatch(text, 'the original text is this'));
    expect(doesMatch(text, 'the original text is this', {minWord: 1})).to.be.above(doesMatch(text, 'the original text is this'));
  });

  it('should work when setting a bigger value', function() {
    expect(doesMatch(text, 'the original text is this', {minWord: 4})).to.be.below(doesMatch(text, 'the original text is this'));
    expect(doesMatch(text, 'the original text is this', {minWord: 10})).to.be.below(doesMatch(text, 'the original text is this'));
  });
});
