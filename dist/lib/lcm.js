"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var gcd = function gcd(a, b) {
  while (b !== 0) {
    var _ref = [b, a % b];
    a = _ref[0];
    b = _ref[1];
  }
  return Math.abs(a);
};

exports.default = function (a, b) {
  return a / gcd(a, b) * b;
};