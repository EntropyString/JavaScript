'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require('babel-runtime/core-js/math/log2');

var _log2 = _interopRequireDefault(_log);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lcm = require('./lcm');

var _lcm2 = _interopRequireDefault(_lcm);

var _weakMap = require('weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propMap = new _weakMap2.default();
var bitsPerByte = 8;

var _class = function () {
  function _class(chars) {
    (0, _classCallCheck3.default)(this, _class);

    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string');
    }
    var length = chars.length;
    if (![2, 4, 8, 16, 32, 64].includes(length)) {
      throw new Error('Invalid char count: must be one of 2,4,8,16,32,64');
    }
    var bitsPerChar = Math.floor((0, _log2.default)(length));
    // Ensure no repeated characters
    for (var i = 0; i < length; i++) {
      var c = chars.charAt(i);
      for (var j = i + 1; j < length; j++) {
        if (c === chars.charAt(j)) {
          throw new Error('Characters not unique');
        }
      }
    }
    var privProps = {
      chars: chars,
      bitsPerChar: bitsPerChar,
      length: length,
      ndxFn: _ndxFn(bitsPerChar),
      charsPerChunk: (0, _lcm2.default)(bitsPerChar, bitsPerByte) / bitsPerChar
    };
    propMap.set(this, privProps);
  }

  (0, _createClass3.default)(_class, [{
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
    key: 'getNdxFn',
    value: function getNdxFn() {
      return propMap.get(this).ndxFn;
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
  }]);
  return _class;
}();

exports.default = _class;


var _ndxFn = function _ndxFn(bitsPerChar) {
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