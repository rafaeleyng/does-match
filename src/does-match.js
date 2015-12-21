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
    if ('àáãâ'.indexOf(c)>-1) return 'a';
    if ('èéê'.indexOf(c)>-1) return 'e';
    if ('ìíî'.indexOf(c)>-1) return 'i';
    if ('òóô'.indexOf(c)>-1) return 'o';
    if ('ùúû'.indexOf(c)>-1) return 'u';
    if ('ç'.indexOf(c)>-1) return 'c';
    if ('ñ'.indexOf(c)>-1) return 'n';
    return c;
  };

  var prepareString = function(string, options) {
    string = string.toLowerCase();
    if (!options.replaceDiacritics) {
      return string;
    }

    var replaced = string.split('').map(replaceDiacritics);

    return replaced.join('');
  };

  /*
    options
  */
  var validation = function() {
    var proto = {
      text: function(text) {
        if (isString(text)) {
          throw new Error('`text`: expected string');
        }
      },
      query: function(query) {
        if (isString(query)) {
          throw new Error('`query`: expected string');
        }
      },
      options: function(options) {
        var minWord = options.minWord;
        if (minWord !== undefined && typeof minWord !== 'number') {
          throw new Error('`minWord`: expected number');
        } else if (minWord < 1 || minWord > 10) {
          throw new Error('`minWord`: expected number between 1 and 10');
        }
        if (options.replaceDiacritics !== undefined && typeof options.replaceDiacritics !== 'boolean') {
          throw new Error('`replaceDiacritics`: expected boolean');
        }
      }
    };

    function isString(src) {
      return typeof src !== 'string'
    }

    return Object.create(proto);
  };

  /*
    match
  */
  var matching = function() {
    var proto = {
      chars: function(charWord, charQuery) {
        return charWord === charQuery;
      },

      whole: function(text, query, options) {
        if (text.indexOf(query)>-1) {
          return query.length * MULTIPLIERS.MATCH_WHOLE;
        }
        return 0;
      },

      words: function(text, query, options) {
        var queryWords = query.split(' ').filter(function(word) {
          return word.length > options.minWord;
        });

        return queryWords.reduce(function(acc, word) {
          var didMatch = text.indexOf(word)>-1;
          return acc + (didMatch ? word.length * MULTIPLIERS.MATCH_WORD : 0);
        }, 0);
      },

      lookahead: function(text, query, options) {
        var relevance = 0;

        query = clearWhitespaces(query);
        query.split('').forEach(function(charQuery) {
          var j = text.indexOf(charQuery);
          var didFindChar = j > -1;
          var isAdjacent = j === 0;

          if (isAdjacent) {
            relevance++;
          }

          if (!didFindChar) {
            return 0;
          }
          // on next iteration, will look in the text hereinafter
          text = text.substring(parseInt(j) + 1);
        });

        return relevance;
      }
    };

    function clearWhitespaces(str) {
      return str.replace(/ /g, '');
    }

    return Object.create(proto);
  };

  var bestMatch = function(text, query, options) {
    // matching
    var matches = matching();

    // whole match
    var wholeMatch = matches.whole(text, query, options);
    if (wholeMatch) {
      return wholeMatch;
    }
    // words match or lookahead match
    var wordsMatch = matches.words(text, query, options);
    var lookaheadMatch = matches.lookahead(text, query, options);
    if (wordsMatch || lookaheadMatch) {
      return Math.max(wordsMatch, lookaheadMatch);
    }
    return 0;
  };


  /*
    api
  */
  var doesMatch = function(text, query, options) {
    options = options || {};

    // validate
    var validate = validation();

    validate.text(text);
    validate.query(query);
    validate.options(options);

    // defaults
    options.minWord = options.minWord !== undefined ? options.minWord : 3;
    options.replaceDiacritics = options.replaceDiacritics !== undefined ? options.replaceDiacritics : true;

    // arrange
    text = prepareString(text, options);
    query = prepareString(query, options);

    return bestMatch(text, query, options);
  };

  return doesMatch;
}));
