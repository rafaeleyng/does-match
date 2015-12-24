DoesMatch!
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
