'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _log = require('babel-runtime/core-js/math/log2');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WeakMap = require('weak-map');

var propMap = new WeakMap();
var BITS_PER_BYTE = 8;
var abs = Math.abs,
    ceil = Math.ceil,
    floor = Math.floor,
    log2 = _log2.default;


var gcd = function gcd(a, b) {
  var la = a;
  var lb = b;
  while (lb !== 0) {
    var _ref = [lb, la % lb];
    la = _ref[0];
    lb = _ref[1];
  }
  return abs(la);
};
var lcm = function lcm(a, b) {
  return a / gcd(a, b) * b;
};

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

  // Otherwise, while slicing off bits per char, we can possibly straddle two
  // of bytes, so a more work is involved
  var slicesPerChunk = lcm(bitsPerChar, BITS_PER_BYTE) / BITS_PER_BYTE;
  return function (chunk, slice, bytes) {
    var bNum = chunk * slicesPerChunk;

    var offset = slice * bitsPerChar / BITS_PER_BYTE;
    var lOffset = floor(offset);
    var rOffset = ceil(offset);

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
    var bitsPerChar = floor(log2(length));
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
    value: function bytesNeeded(bitLen) {
      var count = ceil(bitLen / this.bitsPerChar());
      return ceil(count * this.bitsPerChar() / BITS_PER_BYTE);
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