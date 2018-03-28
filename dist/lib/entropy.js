'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.charset2 = exports.charset4 = exports.charset8 = exports.charset16 = exports.charset32 = exports.charset64 = exports.entropyBits = undefined;

var _log = require('babel-runtime/core-js/math/log2');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CharSet = require('./charset').default;

var entropyBits = exports.entropyBits = function entropyBits(total, risk) {
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

var charset64 = exports.charset64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_');
var charset32 = exports.charset32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT');
var charset16 = exports.charset16 = new CharSet('0123456789abcdef');
var charset8 = exports.charset8 = new CharSet('01234567');
var charset4 = exports.charset4 = new CharSet('ATCG');
var charset2 = exports.charset2 = new CharSet('01');