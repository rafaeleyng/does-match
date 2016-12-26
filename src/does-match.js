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
    return string.split('').map(replaceDiacritics).join('');
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
        if (options.highlightMatches !== undefined && typeof options.highlightMatches !== 'boolean') {
          throw new Error('`highlightMatches`: expected boolean');
        }
      }
    };

    var isString = function(src) {
      return typeof src === 'string';
    };

    return Object.create(proto);
  };

  /*
    defaults
  */
  var applyDefaults = function(options) {
    (options.minWord === undefined) && (options.minWord = 3);
    (options.replaceDiacritics === undefined) && (options.replaceDiacritics = true);
    (options.highlightMatches === undefined) && (options.highlightMatches = false);
    (options.highlightStart === undefined) && (options.highlightStart = '<strong>');
    (options.highlightEnd === undefined) && (options.highlightEnd = '</strong>');
  };

  /*
    match
  */
  var bestMatch = function(originalText, preparedText, query, options) {
    var matches = matching();

    // whole match
    var wholeMatch = matches.whole(originalText, preparedText, query, options);
    var wholeRelevance = options.highlightMatches ? wholeMatch.relevance : wholeMatch;
    if (wholeRelevance) {
      return wholeMatch;
    }

    // words match or lookahead match
    var wordsMatch = matches.words(originalText, preparedText, query, options);
    var wordsRelevance = options.highlightMatches ? wordsMatch.relevance : wordsMatch;
    var lookaheadMatch = matches.lookahead(originalText, preparedText, query, options);
    var lookaheadRelevance = options.highlightMatches ? lookaheadMatch.relevance : lookaheadMatch;

    if (wordsRelevance > lookaheadRelevance) {
      return wordsMatch;
    } else {
      return lookaheadMatch;
    }
  };

  var matching = function() {
    var matchResult = function(originalText, relevance, highlightRanges, options) {
      var highlightText = function(text, start, end, options) {
        if (start === -1 && end === -1) return text;

        return text.slice(0, start)
          + options.highlightStart
          + text.slice(start, end)
          + options.highlightEnd
          + text.slice(end)
        ;
      };

      var removeUnnecessaryHighlightTokens = function(text, options) {
        // remove empty
        text = text.replace(new RegExp(options.highlightStart + ' ' + options.highlightEnd, 'g'), ' ');
        text = text.replace(new RegExp(options.highlightStart + options.highlightEnd, 'g'), '');
        // remove superfluous
        text = text.replace(new RegExp(options.highlightEnd + ' ' + options.highlightStart, 'g'), ' ');
        text = text.replace(new RegExp(options.highlightEnd + options.highlightStart, 'g'), '');
        return text;
      };

      var highlightMatch = function(text, ranges, options) {
        ranges.sort(function(r1, r2) {
          return r1.start - r2.start;
        });
        for (var i = 0, size = ranges.length; i < size; i++) {
          var compensation = i * (options.highlightStart.length + options.highlightEnd.length);
          text = highlightText(text, ranges[i].start + compensation, ranges[i].end + compensation, options);
        }
        return removeUnnecessaryHighlightTokens(text, options);
      };

      if (!options.highlightMatches) {
        return relevance;
      }
      return {
        relevance: relevance,
        match: highlightMatch(originalText, highlightRanges, options)
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

        return matchResult(originalText, relevance, [new Range(start, end)], options);
      },

      words: function(originalText, preparedText, query, options) {
        var someQueryWordMatchesWord = function(queryWords, textWord) {
          // try to match whole word
          for (var i = 0; i < queryWords.length; i++) {
            if (queryWords[i] === textWord) {
              return {
                word: queryWords[i],
                offset: 0
              };
            }
          }

          // try to match partial word
          for (var i = 0; i < queryWords.length; i++) {
            var indexOf = textWord.indexOf(queryWords[i]);
            if (indexOf > -1) {
              return {
                word: queryWords[i],
                offset: indexOf
              };
            }
          }
          return {};
        };

        var textWords = preparedText.split(' ');
        var queryWords = query.split(' ').filter(function(word) {
          return word.length >= options.minWord;
        });

        var ranges = [];
        var relevance = 0;
        var startIndex = 0;
        var unmatchedQueryWords = queryWords;

        textWords.forEach(function(textWord) {
          var queryWordMatchResult = someQueryWordMatchesWord(unmatchedQueryWords, textWord);

          if (queryWordMatchResult.word) {
            unmatchedQueryWords.splice(unmatchedQueryWords.indexOf(queryWordMatchResult.word), 1);
            var start = startIndex + queryWordMatchResult.offset, end = start + queryWordMatchResult.word.length;
            relevance += (queryWordMatchResult.word.length * MULTIPLIERS.MATCH_WORD);
            ranges.push(new Range(start, end));
          }
          startIndex += textWord.length + 1; // `+ 1` because of the space between words
        });

        return matchResult(originalText, relevance, ranges, options);
      },

      lookahead: function(originalText, preparedText, query, options) {
        var ranges = [];
        var start = 0;
        var relevance = 0;
        var adjacentChars = 0;
        var consumedChars = 0;

        try {
          var isFirstIteration = true;
          clearWhitespaces(query).split('').forEach(function(charQuery) {
            var j = preparedText.indexOf(charQuery);
            var didFindChar = j > -1;
            var isAdjacent = j === 0;

            if (!didFindChar) {
              throw new Error();
            } else if (isAdjacent) {
              adjacentChars++;
              relevance += MULTIPLIERS.MATCH_WORD;
            } else {
              if (isFirstIteration) {
                ranges.push(new Range(start, start + adjacentChars));
              } else {
                ranges.push(new Range(start, start + adjacentChars + 1));
              }
              isFirstIteration = false;
              start = j + consumedChars;
              adjacentChars = 0;
              relevance++;
            }

            consumedChars += j + 1;
            // on next iteration, will look in the text hereinafter
            preparedText = preparedText.substring(parseInt(j) + 1);
          });
        } catch (e) {
          ranges = [];
          relevance = 0;
        }
        if (relevance !== 0) {
          ranges.push(new Range(start, start + adjacentChars + 1));
        }

        return matchResult(originalText, relevance, ranges, options);
      }
    };

    var clearWhitespaces = function(str) {
      return str.replace(/ /g, '');
    };

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
