var expect = require('chai').expect;
var doesMatch = require('../../src/does-match');

describe('words match', function() {
  var text = 'this is the original text';

  it('should match query words when all match, with relevance of all `matchedWord.length * 2`', function() {
    var match = function(query) {
      var wordsLength = query.split(' ').reduce(function(acc, word) {
        return acc + word.length;
      }, 0);
      expect(doesMatch(text, query)).to.equal(wordsLength * 2);
    };

    match('this original');
    match('this text original');
    match('original text this');
  });

  it('should match query words not counting words with less than 3 characters', function() {
    expect(doesMatch(text, 'text original')).to.equal(24);
    expect(doesMatch(text, 'text is original')).to.equal(24); // doesn't match 'is'
    expect(doesMatch(text, 'the text is original')).to.equal(24); // doesn't match 'the', 'is'
  });

  it('should match query words even when some words don\'t match', function() {
    expect(doesMatch(text, 'text original')).to.equal(24);
    expect(doesMatch(text, 'text original xxxx yyyy')).to.equal(24); // doesn't match 'xxxx', 'yyyy'
    expect(doesMatch(text, 'text is original xxxx')).to.equal(24); // doesn't match 'is', 'xxxx'
  });
});
