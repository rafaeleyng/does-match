DoesMatch
---------

A small lib for matching text searches by relevance.

[Live demo](https://github.com/rafaeleyng/does-match).

## Installation

```
npm install does-match
```

## Usage

### CommonsJS

```
var doesMatch = require('does-match');
doesMatch(text, query);
```

### Browser global

```
doesMatch(text, query);
```

## Example

Matching songs names to match a search and order by relevance:

```
var doesMatch = require('does-match');
var search = 'somebody to love';

doesMatch('Somebody To Love', search); // 64
doesMatch('To Love Somebody', search); // 24
doesMatch('Use Somebody', search); // 16
doesMatch('One Way Road', search); // 0
```
