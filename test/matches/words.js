var expect = require('chai').expect;
var doesMatch = require('../../src/does-match');

describe('words match', function() {
  var text = 'This is the Original Text';

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
    expect(doesMatch(text, 'the text is original')).to.equal(30); // doesn't match 'is'
  });

  it('should match query words even when some words don\'t match', function() {
    expect(doesMatch(text, 'text original')).to.equal(24);
    expect(doesMatch(text, 'text original')).to.equal(24);
    expect(doesMatch(text, 'text original xxxx yyyy')).to.equal(24); // doesn't match 'xxxx', 'yyyy'
    expect(doesMatch(text, 'text is original xxxx')).to.equal(24); // doesn't match 'is', 'xxxx'
  });

  it('should not count multiple times the same word', function() {
    expect(doesMatch(text, 'text original original')).to.equal(doesMatch(text, 'text original'));
    expect(
      doesMatch('This is the Original Original Text', 'text original text original original')
    ).to.equal(
      doesMatch('This is the Original Original Text', 'text original original')
    );
  });

  it('should return matched query, when highlightMatches is `true`', function() {
    var match = function(query, expectedMatch) {
      var actualMatch = doesMatch(text, query, {highlightMatches: true, minWord: 2}).match;
      expect(actualMatch).to.equal(expectedMatch);
    };

    match('text original', 'This is the <strong>Original Text</strong>');
    match('text is original', 'This <strong>is</strong> the <strong>Original Text</strong>');
    match('this text original', '<strong>This</strong> is the <strong>Original Text</strong>');
    match('this the text original', '<strong>This</strong> is <strong>the Original Text</strong>');

    // matching all the sentence, with words in wrong order
    match('text original the is this', '<strong>This is the Original Text</strong>');
    match('text text the original this is', '<strong>This is the Original Text</strong>');
  });

  it('should work the same when words are out of order', function() {
    expect(
      doesMatch('Somebody To Love', 'somebody love', {highlightMatches: true}).relevance
    ).to.equal(
      doesMatch('Somebody To Love', 'love somebody', {highlightMatches: true}).relevance
    );
  });

  it('should work with partial words', function() {
    var match = function(query, expectedMatch, expectedRelevance) {
      var result = doesMatch('Somebody To Love', query, {highlightMatches: true, minWord: 2});
      expect(result.match).to.equal(expectedMatch);
      expect(result.relevance).to.equal(expectedRelevance);
    };

    match('love some', '<strong>Some</strong>body To <strong>Love</strong>', 16);
  });
});
