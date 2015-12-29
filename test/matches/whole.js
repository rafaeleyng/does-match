var expect = require('chai').expect;
var doesMatch = require('../../src/does-match');

describe('whole match', function() {
  var text = 'This is the Original Text';

  it('should match whole query, with relevance of `query.length * 4`', function() {
    var match = function(query) {
      expect(doesMatch(text, query)).to.equal(query.length * 4);
    };

    match('');
    match(text);
    match(text.substr(0, 1));
    match(text.substr(0, 4));
    match(text.substr(0, 10));
    match(text.substr(10, 20));
  });

  it('should return matched query, when returnMatches is `true`', function() {
    var match = function(query, expectedMatch) {
      var actualMatch = doesMatch(text, query, {returnMatches: true}).match;
      expect(actualMatch).to.equal(expectedMatch);
    };

    match(text, '<strong>' + text + '</strong>');
    match('is the original', 'This <strong>is the Original</strong> Text');
    match('text', 'This is the Original <strong>Text</strong>');
    match(' text', 'This is the Original<strong> Text</strong>');
  });
});
