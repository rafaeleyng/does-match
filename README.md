DoesMatch
---------

[![Build Status](https://travis-ci.org/rafaeleyng/does-match.svg?branch=master)](https://travis-ci.org/rafaeleyng/does-match)

A small lib for matching text searches by relevance.

[Live demo](http://rafaeleyng.github.io/does-match/).

## Installation

```
npm install does-match
```

## Usage

### CommonsJS

```javascript
var doesMatch = require('does-match');
doesMatch(text, query);
```

### Browser global

```javascript
doesMatch(text, query);
```

## Example

Matching songs names to match a search and order by relevance:

```javascript
var doesMatch = require('does-match');
var search = 'somebody to love';

doesMatch('Somebody To Love', search); // 64
doesMatch('To Love Somebody', search); // 24
doesMatch('Use Somebody', search); // 16
doesMatch('One Way Road', search); // 0
```

## Options

Defaults :

```javascript
doesMatch(text, query, {
  highlightMatches: false,
  highlightStart: '<strong>',
  highlightEnd: '</strong>',
  minWord: 3,
  replaceDiacritics: true
});
```

Explanation of each option:

### `highlightMatches`

`boolean`

If `false`, the return of the function will be only the relevance score.
If `true`, the return of the function will be an object containing the relevance and the original text with the matched parts highlighted.

```javascript
doesMatch('Somebody To Love', 'love some', { highlightMatches: true });
```

will return:

```javascript
{
  match: '<strong>Some</strong>body To <strong>Love</strong>',
  relevance: 16
}
```

### `highlightStart`

`string`

The token to be used in the start of each highlighted part.

### `highlightEnd`

`string`

The token to be used in the end of each highlighted part.

### `minWord`

`number`

Minimum word length to take in account in words match.

### `replaceDiacritics`

`boolean`

If `true`, the text `'Québec'` will be matched both by `'quebec'` and `'québec'` queries.

If `false`, the text `'Québec'` will be matched only by `'québec'`.

## How does it work

`doesMatch` will try to match your query in 3 ways and return the one with the highest relevance score:

1. *whole match*: will try to find the whole exact query inside the text
1. *words match*: will try to find as much words from the query as possible inside the text, in any order
1. *lookahead match*: something like what text editors do when looking for a file, it will try to find all chars from the query, in order. Something like finding "dos mtch" inside "does match"
