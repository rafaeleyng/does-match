var expect = require('chai').expect;
var doesMatch = require('../src/does-match.js');

describe('module', function() {
  it('should not define global function in CommonJS environment', function() {
    expect(global.doesMatch).to.be.undefined;
  });
});
