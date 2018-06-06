'use strict';

var Crypto = require('crypto');

var csprngBytes = function csprngBytes(count) {
  return Buffer.from(Crypto.randomBytes(count));
};

module.exports = {
  csprngBytes: csprngBytes
};