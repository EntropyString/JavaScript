'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.charSet2 = exports.charSet4 = exports.charSet8 = exports.charSet16 = exports.charSet32 = exports.charSet64 = undefined;

var _log = require('babel-runtime/core-js/math/log2');

var _log2 = _interopRequireDefault(_log);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WeakMap = require('weak-map');

var lcm = require('./lcm').default;

var propMap = new WeakMap();

var BITS_PER_BYTE = 8;

var genNdxFn = function genNdxFn(bitsPerChar) {
  // If BITS_PER_BYTEs is a multiple of bitsPerChar, we can slice off an integer number
  // of chars per byte.
  if (lcm(bitsPerChar, BITS_PER_BYTE) === BITS_PER_BYTE) {
    return function (chunk, slice, bytes) {
      var lShift = bitsPerChar;
      var rShift = BITS_PER_BYTE - bitsPerChar;
      return (bytes[chunk] << lShift * slice & 0xff) >> rShift;
    };
  }
  // Otherwise, while slicing off bits per char, we will possibly straddle a couple
  // of bytes, so a bit more work is involved

  var slicesPerChunk = lcm(bitsPerChar, BITS_PER_BYTE) / BITS_PER_BYTE;
  return function (chunk, slice, bytes) {
    var bNum = chunk * slicesPerChunk;

    var offset = slice * bitsPerChar / BITS_PER_BYTE;
    var lOffset = Math.floor(offset);
    var rOffset = Math.ceil(offset);

    var rShift = BITS_PER_BYTE - bitsPerChar;
    var lShift = slice * bitsPerChar % BITS_PER_BYTE;

    var ndx = (bytes[bNum + lOffset] << lShift & 0xff) >> rShift;

    var r1Bits = (rOffset + 1) * BITS_PER_BYTE;
    var s1Bits = (slice + 1) * bitsPerChar;

    var rShiftIt = (r1Bits - s1Bits) % BITS_PER_BYTE;
    if (rShift < rShiftIt) {
      ndx += bytes[bNum + rOffset] >> rShiftIt;
    }
    return ndx;
  };
};

var CharSet = function () {
  function CharSet(chars) {
    (0, _classCallCheck3.default)(this, CharSet);

    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string');
    }
    var length = chars.length;

    if (![2, 4, 8, 16, 32, 64].includes(length)) {
      throw new Error('Invalid char count: must be one of 2,4,8,16,32,64');
    }
    var bitsPerChar = Math.floor((0, _log2.default)(length));
    // Ensure no repeated characters
    for (var i = 0; i < length; i += 1) {
      var c = chars.charAt(i);
      for (var j = i + 1; j < length; j += 1) {
        if (c === chars.charAt(j)) {
          throw new Error('Characters not unique');
        }
      }
    }
    var privProps = {
      chars: chars,
      bitsPerChar: bitsPerChar,
      length: length,
      ndxFn: genNdxFn(bitsPerChar),
      charsPerChunk: lcm(bitsPerChar, BITS_PER_BYTE) / bitsPerChar
    };
    propMap.set(this, privProps);
  }

  (0, _createClass3.default)(CharSet, [{
    key: 'getChars',
    value: function getChars() {
      return propMap.get(this).chars;
    }
  }, {
    key: 'getBitsPerChar',
    value: function getBitsPerChar() {
      return propMap.get(this).bitsPerChar;
    }
  }, {
    key: 'getNdxFn',
    value: function getNdxFn() {
      return propMap.get(this).ndxFn;
    }
  }, {
    key: 'getCharsPerChunk',
    value: function getCharsPerChunk() {
      return propMap.get(this).charsPerChunk;
    }
  }, {
    key: 'length',
    value: function length() {
      return propMap.get(this).length;
    }
  }, {
    key: 'bytesNeeded',
    value: function bytesNeeded(entropyBits) {
      var count = Math.ceil(entropyBits / this.bitsPerChar());
      return Math.ceil(count * this.bitsPerChar() / BITS_PER_BYTE);
    }

    // Aliases

  }, {
    key: 'chars',
    value: function chars() {
      return this.getChars();
    }
  }, {
    key: 'ndxFn',
    value: function ndxFn() {
      return this.getNdxFn();
    }
  }, {
    key: 'bitsPerChar',
    value: function bitsPerChar() {
      return this.getBitsPerChar();
    }
  }]);
  return CharSet;
}();

exports.default = CharSet;
var charSet64 = exports.charSet64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_');
var charSet32 = exports.charSet32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT');
var charSet16 = exports.charSet16 = new CharSet('0123456789abcdef');
var charSet8 = exports.charSet8 = new CharSet('01234567');
var charSet4 = exports.charSet4 = new CharSet('ATCG');
var charSet2 = exports.charSet2 = new CharSet('01');