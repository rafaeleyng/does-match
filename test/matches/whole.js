var expect = require('chai').expect;
var doesMatch = require('../../src/does-match');

describe('whole match', function() {
  var text = 'this is the original text';

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
});
