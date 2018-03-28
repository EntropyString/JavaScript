"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require("babel-runtime/core-js/math/log2");

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bits = function bits(total, risk) {
  if (total === 0) {
    return 0;
  }

  var log2 = _log2.default;


  var N = void 0;
  if (total < 1000) {
    N = log2(total) + log2(total - 1);
  } else {
    N = 2 * log2(total);
  }
  return N + log2(risk) - 1;
};

exports.default = {
  bits: bits
};