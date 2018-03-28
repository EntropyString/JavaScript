"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require("babel-runtime/core-js/math/log2");

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log2 = _log2.default;

var LOG2_OF_10 = log2(10);

var totalOf = function totalOf(numStrings, log2Risk) {
  if (numStrings === 0) {
    return 0;
  }

  var N = void 0;
  if (numStrings < 1000) {
    N = log2(numStrings) + log2(numStrings - 1);
  } else {
    N = 2 * log2(numStrings);
  }
  return N + log2Risk - 1;
};

var bits = function bits(total, risk) {
  if (total === 0) {
    return 0;
  }
  return totalOf(total, log2(risk));
};

// CxTBD Mark as obsolete
var bitsWithRiskPower = function bitsWithRiskPower(total, rPower) {
  var log2Risk = LOG2_OF_10 * rPower;
  return totalOf(total, log2Risk);
};

// CxTBD Mark as obsolete
var bitsWithPowers = function bitsWithPowers(tPower, rPower) {
  var nBits = void 0;
  if (tPower < 4) {
    nBits = bitsWithRiskPower(10 ** tPower, rPower);
  } else {
    nBits = (2 * tPower + rPower) * LOG2_OF_10 - 1;
  }
  return nBits;
};

exports.default = {
  bits: bits,
  bitsWithRiskPower: bitsWithRiskPower,
  bitsWithPowers: bitsWithPowers
};