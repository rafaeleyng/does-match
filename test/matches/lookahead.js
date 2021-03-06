var expect = require('chai').expect;
var doesMatch = require('../../src/does-match');

describe('lookahead match', function() {
  var text = 'The Curious Case of Benjamin Button';

  it('should make lookahead match, with relevance of 1 per first matched char in group and 2 for adjacent chars', function() {
    expect(doesMatch(text, 'cu ca')).to.equal(6);
    expect(doesMatch(text, 'cu ca be')).to.equal(9);
    expect(doesMatch(text, 'cur cas')).to.equal(10);
    expect(doesMatch(text, 'cur cas ben')).to.equal(15);
    expect(doesMatch(text, 'cur cas ben butto')).to.equal(24);
  });

  it('should be relevant if when there\'s no adjacents matched chars', function() {
    expect(doesMatch(text, 'cr cs bnmn btn')).to.be.above(0);
  });

  it('should return the best match between words match and lookahead match', function() {
    expect(doesMatch(text, 'crious cse bnjamin button')).to.equal(37);
  });

  it('should not relevant if there\'s an unmatched char', function() {
    expect(doesMatch(text, 'curcaZZZ')).to.equal(0);
  });

  it('should return matched query, when highlightMatches is `true`', function() {
    var match = function(query, expectedMatch) {
      var actualMatch = doesMatch(text, query, {highlightMatches: true}).match;
      expect(actualMatch).to.equal(expectedMatch);
    };

    match('c c b b', 'The <strong>C</strong>urious <strong>C</strong>ase of <strong>B</strong>enjamin <strong>B</strong>utton');

    match('cur ca b b', 'The <strong>Cur</strong>ious <strong>Ca</strong>se of <strong>B</strong>enjamin <strong>B</strong>utton');

    match('cur ca b bu', 'The <strong>Cur</strong>ious <strong>Ca</strong>se of <strong>B</strong>enjamin <strong>Bu</strong>tton');

    match('cu cse benj ton', 'The <strong>Cu</strong>rious <strong>C</strong>a<strong>se</strong> of <strong>Benj</strong>amin Bu<strong>t</strong>t<strong>on</strong>');

    match('cur ca benj ton', 'The <strong>Cur</strong>ious <strong>Ca</strong>se of <strong>Benj</strong>amin Bu<strong>t</strong>t<strong>on</strong>');

    match('curous ca benj ton', 'The <strong>Cur</strong>i<strong>ous Ca</strong>se of <strong>Benj</strong>amin Bu<strong>t</strong>t<strong>on</strong>');
  });

  it('should work', function() {
    var match = function(text, query, expectedRelevance, expectedMatch) {
      var result = doesMatch(text, query, {highlightMatches: true, minWord: 2});
      expect(result.relevance).to.equal(expectedRelevance);
      expect(result.match).to.equal(expectedMatch);
    };

    match(
      'All These Things That I\'ve Done',
      'all the ', // with space, so it won't fall under wholeMatch!
      11,
      '<strong>All The</strong>se Things That I\'ve Done'
    );
  });

  it('should not highlight when doesn\'t match', function() {
    var match = function(text, query, expectedRelevance, expectedMatch) {
      var result = doesMatch(text, query, {highlightMatches: true, minWord: 2});
      expect(result.relevance).to.equal(0);
      expect(result.match).to.equal(text);
    };

    match('anything', 'don\'t match');
    match('other', 'don\'t match');
    match('aaa', 'bbb');
    match('bbb', 'c');
  });
});
