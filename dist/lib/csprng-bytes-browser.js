"use strict";

var csprngBytes = function csprngBytes(count) {
  return window.crypto.getRandomValues(new Uint8Array(count));
};

module.exports = {
  csprngBytes: csprngBytes
};