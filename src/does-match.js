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
  var Range = function(start, end) {
    this.start = start;
    this.end = end;
  };

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
    validation
  */
  var validation = function() {
    var proto = {
      text: function(text) {
        if (!isString(text)) {
          throw new Error('`text`: expected string');
        }
      },
      query: function(query) {
        if (!isString(query)) {
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
        if (options.returnMatches !== undefined && typeof options.returnMatches !== 'boolean') {
          throw new Error('`returnMatches`: expected boolean');
        }
      }
    };

    function isString(src) {
      return typeof src === 'string'
    }

    return Object.create(proto);
  };

  /*
    defaults
  */
  var applyDefaults = function(options) {
    (options.minWord === undefined) && (options.minWord = 3);
    (options.replaceDiacritics === undefined) && (options.replaceDiacritics = true);
    (options.returnMatches === undefined) && (options.returnMatches = false);
    (options.matchStartToken === undefined) && (options.matchStartToken = '<strong>');
    (options.matchEndToken === undefined) && (options.matchEndToken = '</strong>');
  };

  /*
    highlight
  */
  var highlighText = function(text, start, end, options) {
    if (start === -1 && end === -1) return text;

    return text.slice(0, start)
      + options.matchStartToken
      + text.slice(start, end)
      + options.matchEndToken
      + text.slice(end)
    ;
  };

  var removeUnnecessaryMatchTokens = function(text, options) {
    text = text.replace(new RegExp(options.matchEndToken + ' ' + options.matchStartToken, 'g'), ' ');
    text = text.replace(new RegExp(options.matchEndToken + options.matchStartToken, 'g'));
    return text;
  };

  var highlightMatch = {
    whole: function(originalText, range, options) {
      return highlighText(originalText, range.start, range.end, options)
    },

    ranges: function(text, ranges, options) {
      ranges.sort(function(r1, r2) {
        return r1.start - r2.start;
      });
      for (var i = 0, size = ranges.length; i < size; i++) {
        var compensation = i * (options.matchStartToken.length + options.matchEndToken.length);
        text = highlighText(text, ranges[i].start + compensation, ranges[i].end + compensation, options);
      }
      return removeUnnecessaryMatchTokens(text, options);
    }
  };

  /*
    match
  */
  var bestMatch = function(originalText, preparedText, query, options) {
    var matches = matching();

    // whole match
    var wholeMatch = matches.whole(originalText, preparedText, query, options);
    var wholeRelevance = options.returnMatches ? wholeMatch.relevance : wholeMatch;
    // console.log('whole', wholeMatch, wholeRelevance);
    if (wholeRelevance) {
      return wholeMatch;
    }

    // words match or lookahead match
    var wordsMatch = matches.words(originalText, preparedText, query, options);
    var wordsRelevance = options.returnMatches ? wordsMatch.relevance : wordsMatch;
    var lookaheadMatch = matches.lookahead(originalText, preparedText, query, options);
    var lookaheadRelevance = options.returnMatches ? lookaheadMatch.relevance : lookaheadMatch;

    // console.log('words', wordsMatch, wordsRelevance);
    console.log('lookahead', lookaheadMatch, lookaheadRelevance);

    if (wordsRelevance > lookaheadRelevance) {
      return wordsMatch;
    } else {
      return lookaheadMatch;
    }
  };

  var matching = function() {
    var matchResult = function(originalText, relevance, highlightRanges, highlightFunction, options) {
      if (!options.returnMatches) {
        return relevance;
      }
      return {
        relevance: relevance,
        match: highlightFunction(originalText, highlightRanges, options)
      };
    };

    var proto = {
      whole: function(originalText, preparedText, query, options) {
        var relevance = 0;
        var start = preparedText.indexOf(query), end = -1;
        if (start > -1) {
          end = start + query.length;
          relevance = query.length * MULTIPLIERS.MATCH_WHOLE;
        }

        return matchResult(originalText, relevance, new Range(start, end), highlightMatch.whole, options);
      },

      words: function(originalText, preparedText, query, options) {
        var textWords = preparedText.split(' ');
        var queryWords = query.split(' ').filter(function(word) {
          return word.length >= options.minWord;
        });

        var ranges = [];
        var relevance = 0;
        var startIndex = 0;
        textWords.forEach(function(word) {
          if (queryWords.indexOf(word) > -1) {
            var start = startIndex, end = start + word.length;
            relevance += (word.length * MULTIPLIERS.MATCH_WORD);
            ranges.push(new Range(start, end));
          }
          startIndex += word.length + 1; // `+ 1` because of the space between words
        });

        return matchResult(originalText, relevance, ranges, highlightMatch.ranges, options);
      },

      lookahead: function(originalText, preparedText, query, options) {
        var relevance = 0;
        var ranges = [];

        query = clearWhitespaces(query);
        // console.log('originalText', originalText);
        // console.log('preparedText', preparedText);
        // console.log('query', query);
        try {
          query.split('').forEach(function(charQuery) {
            var j = preparedText.indexOf(charQuery);
            var didFindChar = j > -1;
            var isAdjacent = j === 0;

            if (!didFindChar) {
              throw new Error();
            } else if (isAdjacent) {
              relevance += MULTIPLIERS.MATCH_WORD;
            } else {
              relevance++;
            }

            // on next iteration, will look in the text hereinafter
            preparedText = preparedText.substring(parseInt(j) + 1);
          });
        } catch (e) {
          console.log(e);
          relevance = 0;
        }

        return matchResult(originalText, relevance, ranges, highlightMatch.ranges, options);
      }
    };

    function clearWhitespaces(str) {
      return str.replace(/ /g, '');
    }

    return Object.create(proto);
  };

  /*
    api
  */
  var doesMatch = function(originalText, query, options) {
    options = options || {};

    // validate
    var validate = validation();

    validate.text(originalText);
    validate.query(query);
    validate.options(options);

    // defaults
    applyDefaults(options);

    return bestMatch(
      originalText,
      prepareString(originalText, options),
      prepareString(query, options),
      options
    );
  };

  return doesMatch;
}));
