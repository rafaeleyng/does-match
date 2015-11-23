var expect = require('chai').expect;
var doesMatch = require('../../src/does-match');

describe('diacritics', function() {
  var avec = 'Paris est une fête';
  var sans = 'Paris est une fete';

  it('should replace diacritics by default', function() {
    expect(doesMatch(avec, sans)).to.equal(doesMatch(avec, sans, {replaceDiacritics: true}));
  });

  it('should match correctly when replacing diacritics', function() {
    expect(doesMatch(avec, sans)).to.not.equal(doesMatch(avec, sans, {replaceDiacritics: false}));
  });
});
