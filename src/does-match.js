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

  var prepareString = function(string, options) {
    string = string.toLowerCase();
    if (!options.replaceDiacritics) {
      return string;
    }

    var replaced = '';
    for (var i in string) {
      replaced += replaceDiacritics(string[i]);
    }

    return replaced;
  };

  /*
    options
  */
  var validate = {
    text: function(text) {
      if (typeof text !== 'string') {
        throw new Error('`text`: expected string');
      }
    },
    query: function(query) {
      if (typeof query !== 'string') {
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

  /*
    match
  */
  var match = {
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
      query = query.replace(/ /g, '');

      var relevance = 0;
      for (var i in query) {
        var charQuery = query[i];
        var didFindChar = false;
        var isAdjacent = true;
        for (var j in text) {
          var charText = text[j];
          if (charQuery === charText) {
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
  };

  /*
    api
  */
  var doesMatch = function(text, query, options) {
    options = options || {};

    // validate
    validate.text(text);
    validate.query(query);
    validate.options(options);

    // defaults
    options.minWord = options.minWord !== undefined ? options.minWord : 3;
    options.replaceDiacritics = options.replaceDiacritics !== undefined ? options.replaceDiacritics : true;

    // arrange
    text = prepareString(text, options);
    query = prepareString(query, options);

    // matches
    // whole match
    var wholeMatch = match.whole(text, query, options);
    if (wholeMatch) {
      return wholeMatch;
    }
    // words match
    var wordsMatch = match.words(text, query, options);
    if (wordsMatch) {
      return wordsMatch;
    }
    // lookahead match
    var lookaheadMatch = match.lookahead(text, query, options);
    if (lookaheadMatch) {
      return lookaheadMatch;
    }

    return 0;
  };

  return doesMatch;
}));
