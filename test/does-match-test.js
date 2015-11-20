var expect = require('chai').expect;
var doesMatch = require('../src/does-match.js');

describe('doesMatch', function() {

  describe('matches', function() {
    var text = 'this is the original text';

    describe('whole match', function() {
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

    describe('word match', function() {
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
    });
  });

  describe('param validation', function() {
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

  describe('module', function() {
    it('should not define global function in CommonJS environment', function() {
      expect(global.doesMatch).to.be.undefined;
    });
  });
});
