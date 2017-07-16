"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var gcd = function gcd(a, b) {
  while (b != 0) {
    var h = a;
    a = b;
    b = h % b;
    // (a, b) = (b, a % b)
  }
  return Math.abs(a);
};

// const lcm = (a, b) => {
//   return (a / gcd(a, b)) * b
// }

exports.default = function (a, b) {
  return a / gcd(a, b) * b;
};