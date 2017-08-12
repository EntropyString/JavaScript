'use strict';

var _log = require('babel-runtime/core-js/math/log2');

var _log2 = _interopRequireDefault(_log);

var _lcm = require('./lcm');

var _lcm2 = _interopRequireDefault(_lcm);

var _weakMap = require('weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CharSet = function () {
  var propMap = new _weakMap2.default();

  function CharSet(chars) {
    var bitsPerChar = Math.floor((0, _log2.default)(chars.length));
    if (bitsPerChar != (0, _log2.default)(chars.length)) {
      throw new Error('EntropyString only supports CharSets with a power of 2 characters');
    }
    var bitsPerByte = 8;

    var privProps = {
      chars: chars,
      bitsPerChar: bitsPerChar,
      ndxFn: ndxFn(bitsPerChar),
      charsPerChunk: (0, _lcm2.default)(bitsPerChar, bitsPerByte) / bitsPerChar
    };
    propMap.set(this, privProps);
  }

  CharSet.prototype.getChars = function () {
    return propMap.get(this).chars;
  };
  CharSet.prototype.getBitsPerChar = function () {
    return propMap.get(this).bitsPerChar;
  };
  CharSet.prototype.getNdxFn = function () {
    return propMap.get(this).ndxFn;
  };
  CharSet.prototype.getCharsPerChunk = function () {
    return propMap.get(this).charsPerChunk;
  };

  CharSet.prototype.setChars = function (chars) {
    var len = chars.length;
    // Ensure correct number of characters
    if (len != propMap.get(this).chars.length) {
      throw new Error('Invalid character count');
    }
    // Ensure no repeated characters
    for (var i = 0; i < len; i++) {
      var c = chars.charAt(i);
      for (var j = i + 1; j < len; j++) {
        if (c === chars.charAt(j)) {
          throw new Error('Characters not unique');
        }
      }
    }
    propMap.get(this).chars = chars;
  };
  // Alias
  CharSet.prototype.use = CharSet.prototype.setChars;

  var ndxFn = function ndxFn(bitsPerChar) {
    var bitsPerByte = 8;

    // If bitsPerBytes is a multiple of bitsPerChar, we can slice off an integer number
    // of chars per byte.
    if ((0, _lcm2.default)(bitsPerChar, bitsPerByte) === bitsPerByte) {
      return function (chunk, slice, bytes) {
        var lShift = bitsPerChar;
        var rShift = bitsPerByte - bitsPerChar;
        return (bytes[chunk] << lShift * slice & 0xff) >> rShift;
      };
    }
    // Otherwise, while slicing off bits per char, we will possibly straddle a couple
    // of bytes, so a bit more work is involved
    else {
        return function (chunk, slice, bytes) {
          var slicesPerChunk = (0, _lcm2.default)(bitsPerChar, bitsPerByte) / bitsPerByte;
          var bNum = chunk * slicesPerChunk;

          var rShift = bitsPerByte - bitsPerChar;
          var lOffset = Math.floor(slice * bitsPerChar / bitsPerByte);
          var lShift = slice * bitsPerChar % bitsPerByte;

          var ndx = (bytes[bNum + lOffset] << lShift & 0xff) >> rShift;

          var rOffset = Math.ceil(slice * bitsPerChar / bitsPerByte);
          var rShiftIt = ((rOffset + 1) * bitsPerByte - (slice + 1) * bitsPerChar) % bitsPerByte;
          if (rShift < rShiftIt) {
            ndx += bytes[bNum + rOffset] >> rShiftIt;
          }
          return ndx;
        };
      }
  };
  return CharSet;
}();

module.exports = {
  base64: new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'),
  base32: new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT'),
  base16: new CharSet('0123456789abcdef'),
  base8: new CharSet('01234567'),
  base4: new CharSet('ATCG'),
  base2: new CharSet('01'),
  isValid: function isValid(charSet) {
    return charSet instanceof CharSet;
  }
};