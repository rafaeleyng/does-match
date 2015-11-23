var expect = require('chai').expect;
var doesMatch = require('../../src/does-match');

describe('lookahead match', function() {
  var text = 'The Curious Case of Benjamin Button';

  it('should make lookahead match, with relevance of 1 per matched adjacent pair of chars', function() {
    expect(doesMatch(text, 'cu ca')).to.equal(2);
    expect(doesMatch(text, 'cu ca be')).to.equal(3);
    expect(doesMatch(text, 'cur cas')).to.equal(4);
    expect(doesMatch(text, 'cur cas ben')).to.equal(6);
    expect(doesMatch(text, 'cur cas ben butto')).to.equal(10);
  });

  it('shouldn\'t be relevant if there\'s no adjacents matched chars', function() {
    expect(doesMatch(text, 'cr cs bnmn btn')).to.equal(0);
  });

  it('should return the best match between words match and lookahead match', function() {
    expect(doesMatch(text, 'crious cse bnjamin button')).to.equal(15);
  });
});
