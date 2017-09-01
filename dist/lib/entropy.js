'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require('babel-runtime/core-js/math/log10');

var _log3 = _interopRequireDefault(_log);

var _log4 = require('babel-runtime/core-js/math/log2');

var _log5 = _interopRequireDefault(_log4);

var _lcm = require('./lcm');

var _lcm2 = _interopRequireDefault(_lcm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _log2 = _log5.default;
var _log10 = _log3.default;
var _log2_10 = _log2(10);
var _bitsPerByte = 8;

var _totalOf = function _totalOf(numStrings, log2Risk) {
  if (numStrings == 0) {
    return 0;
  }

  var N = void 0;
  if (numStrings < 1000) {
    N = _log2(numStrings) + _log2(numStrings - 1);
  } else {
    N = 2 * _log2(numStrings);
  }
  return N + log2Risk - 1;
};

var bits = function bits(total, risk) {
  if (total == 0) {
    return 0;
  }
  return _totalOf(total, _log2(risk));
};

var bitsWithRiskPower = function bitsWithRiskPower(total, rPower) {
  var log2Risk = _log2_10 * rPower;
  return _totalOf(total, log2Risk);
};

var bitsWithPowers = function bitsWithPowers(tPower, rPower) {
  var N = 0;
  if (tPower < 4) {
    return bitsWithRiskPower(Math.pow(10, tPower), rPower);
  } else {
    return (2 * tPower + rPower) * _log2_10 - 1;
  }
};

exports.default = {
  bits: bits,
  bitsWithRiskPower: bitsWithRiskPower,
  bitsWithPowers: bitsWithPowers
};