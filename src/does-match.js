(function(factory) {
  // establish the root object
  var root = (typeof self == 'object' && self.self == self && self) ||
            (typeof global == 'object' && global.global == global && global);

  // node.js/commonjs
  if (typeof exports !== 'undefined') {
    module.exports = factory(root);
  // browser global
  } else {
    root.doesMatch = factory(root);
  }

}(function(root) {
  /*
    helpers
  */
  var MULTIPLIERS = {
    MATCH_WHOLE: 4,
    MATCH_WORD: 2
  };

  var replaceDiacritics = function(c) {
    'àáãâ'.indexOf(c)>-1 && (c = 'a');
     'èéê'.indexOf(c)>-1 && (c = 'e');
     'ìíî'.indexOf(c)>-1 && (c = 'i');
     'òóô'.indexOf(c)>-1 && (c = 'o');
     'ùúû'.indexOf(c)>-1 && (c = 'u');
       'ç'.indexOf(c)>-1 && (c = 'c');
       'ñ'.indexOf(c)>-1 && (c = 'n');
    return c;
  };

  var validateText = function(text) {
    if (typeof text !== 'string') {
      throw new Error('`text` should be string');
    }
  };

  var validateQuery = function(query) {
    if (typeof query !== 'string') {
      throw new Error('`query` should be string');
    }
  };

  /*
    match
  */
  var matchChars = function(charWord, charQuery) {
    return replaceDiacritics(charWord) === replaceDiacritics(charQuery);
  };

  var matchWhole = function(text, query) {
    if (text.indexOf(query)>-1) {
      return query.length * MULTIPLIERS.MATCH_WHOLE;
    }
    return 0;
  };

  var matchWords = function(text, query) {
    var queryWords = query.split(' ').filter(function(word) {
      return word.length > 3; // only account for words bigger than 3
    });
    return queryWords.reduce(function(acc, word) {
      var didMatch = text.indexOf(word)>-1;
      return acc + (didMatch ? word.length * MULTIPLIERS.MATCH_WORD : 0);
    }, 0);
  };

  var matchLookahead = function(text, query) {
    query = query.replace(/ /g, '');

    var relevance = 0;
    for (var i in query) {
      var charQuery = query[i];
      var didFindChar = false;
      var isAdjacent = true;
      for (var j in text) {
        var charText = text[j];
        if (matchChars(charQuery, charText)) {
          didFindChar = true;
          break;
        }
        isAdjacent = false;
      }
      if (isAdjacent) {
        relevance++;
      }
      if (!didFindChar) {
        return 0;
      }
      text = text.substring(parseInt(j) + 1); // on next iteration, will look in the text hereinafter
    }
    return relevance;
  }

  /*
    api
  */
  var doesMatch = function(text, query) {
    // validate
    validateText(text);
    validateQuery(query);

    // arrange
    text = text.toLowerCase();
    query = query.toLowerCase();

    // matches
    // whole match
    var wholeMatch = matchWhole(text, query)
    if (wholeMatch) {
      return wholeMatch;
    }
    // words match
    var wordsMatch = matchWords(text, query)
    if (wordsMatch) {
      return wordsMatch;
    }
    // lookahead match
    var lookaheadMatch = matchLookahead(text, query);
    if (lookaheadMatch) {
      return lookaheadMatch;
    }

    return 0;
  };

  return doesMatch;
}));
