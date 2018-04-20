'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.charset2 = exports.charset4 = exports.charset8 = exports.charset16 = exports.charset32 = exports.charset64 = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _log = require('babel-runtime/core-js/math/log2');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Crypto = require('crypto');
var WeakMap = require('weak-map');

var _require = require('./charset'),
    CharSet = _require.default;

var charset64 = exports.charset64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_');
var charset32 = exports.charset32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT');
var charset16 = exports.charset16 = new CharSet('0123456789abcdef');
var charset8 = exports.charset8 = new CharSet('01234567');
var charset4 = exports.charset4 = new CharSet('ATCG');
var charset2 = exports.charset2 = new CharSet('01');

var propMap = new WeakMap();

var BITS_PER_BYTE = 8;

var endianByteNum = function () {
  var buf32 = new Uint32Array(1);
  var buf8 = new Uint8Array(buf32.buffer);
  buf32[0] = 0xff;
  return buf8[0] === 0xff ? [2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 6, 7];
}();

var _stringWithBytes = function _stringWithBytes(bytes, bitLen, charset) {
  if (bitLen <= 0) {
    return '';
  }

  var bitsPerChar = charset.getBitsPerChar();
  var count = Math.ceil(bitLen / bitsPerChar);
  if (count <= 0) {
    return '';
  }

  var need = Math.ceil(count * (bitsPerChar / BITS_PER_BYTE));
  if (bytes.length < need) {
    throw new Error('Insufficient bytes: need ' + need + ' and got ' + bytes.length);
  }

  var charsPerChunk = charset.getCharsPerChunk();
  var chunks = Math.floor(count / charsPerChunk);
  var partials = count % charsPerChunk;

  var ndxFn = charset.getNdxFn();
  var chars = charset.getChars();

  var string = '';
  for (var chunk = 0; chunk < chunks; chunk += 1) {
    for (var slice = 0; slice < charsPerChunk; slice += 1) {
      var ndx = ndxFn(chunk, slice, bytes);
      string += chars[ndx];
    }
  }
  for (var _slice = 0; _slice < partials; _slice += 1) {
    var _ndx = ndxFn(chunks, _slice, bytes);
    string += chars[_ndx];
  }
  return string;
};

var cryptoBytes = function cryptoBytes(count) {
  return Buffer.from(Crypto.randomBytes(count));
};

var randomBytes = function randomBytes(count) {
  var BYTES_USED_PER_RANDOM_CALL = 6;
  var randCount = Math.ceil(count / BYTES_USED_PER_RANDOM_CALL);

  var buffer = Buffer.alloc(count);
  var dataView = new DataView(new ArrayBuffer(BITS_PER_BYTE));
  for (var rNum = 0; rNum < randCount; rNum += 1) {
    dataView.setFloat64(0, Math.random());
    for (var n = 0; n < BYTES_USED_PER_RANDOM_CALL; n += 1) {
      var fByteNum = endianByteNum[n];
      var bByteNum = rNum * BYTES_USED_PER_RANDOM_CALL + n;
      if (bByteNum < count) {
        buffer[bByteNum] = dataView.getUint8(fByteNum);
      }
    }
  }
  return buffer;
};

var entropyBits = function entropyBits(total, risk) {
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

var createCharset = function createCharset(arg) {
  if (arg instanceof CharSet) {
    return arg;
  } else if (typeof arg === 'string' || arg instanceof String) {
    return new CharSet(arg);
  }
  return charset32;
};

var _class = function () {
  function _class() {
    var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { bits: 128, charset: charset32 };
    (0, _classCallCheck3.default)(this, _class);

    var charset = void 0;
    var bitLen = 0;

    if (arg instanceof CharSet || arg instanceof String || typeof arg === 'string') {
      charset = createCharset(arg);
    } else if (arg instanceof Object) {
      var round = Math.round;

      if (typeof arg.bits === 'number') {
        bitLen = round(arg.bits);
      } else if (typeof arg.total === 'number' && typeof arg.risk === 'number') {
        bitLen = round(entropyBits(arg.total, arg.risk));
      } else {
        bitLen = 128;
      }
      charset = createCharset(arg.charset);
    } else {
      throw new Error('Constructor arg must either be a valid CharSet, valid characters, or valid Entropy params');
    }

    if (charset === undefined) {
      throw new Error('Invalid constructor CharSet declaration');
    } else if (bitLen < 0) {
      throw new Error('Invalid constructor declaration of bits less than zero');
    }

    propMap.set(this, {
      charset: charset,
      bitLen: bitLen,
      bytesNeeded: charset.bytesNeeded(bitLen)
    });
  }

  (0, _createClass3.default)(_class, [{
    key: 'smallID',
    value: function smallID() {
      var charset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).charset;

      return this.string(29, charset);
    }
  }, {
    key: 'mediumID',
    value: function mediumID() {
      var charset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).charset;

      return this.string(69, charset);
    }
  }, {
    key: 'largeID',
    value: function largeID() {
      var charset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).charset;

      return this.string(99, charset);
    }
  }, {
    key: 'sessionID',
    value: function sessionID() {
      var charset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).charset;

      return this.string(128, charset);
    }
  }, {
    key: 'token',
    value: function token() {
      var charset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).charset;

      return this.string(256, charset);
    }
  }, {
    key: 'string',
    value: function string() {
      var bitLen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).bitLen;
      var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charset;

      var bytesNeeded = charset.bytesNeeded(bitLen);
      return this.stringWithBytes(cryptoBytes(bytesNeeded), bitLen, charset);
    }
  }, {
    key: 'stringPRNG',
    value: function stringPRNG() {
      var bitLen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).bitLen;
      var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charset;

      var bytesNeeded = charset.bytesNeeded(bitLen);
      return this.stringWithBytes(randomBytes(bytesNeeded), bitLen, charset);
    }

    /**
     * @deprecated Since version 3.1. Will be deleted in version 4.0. Use stringPRNG instead.
    */

  }, {
    key: 'stringRandom',
    value: function stringRandom() {
      var bitLen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).bitLen;
      var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charset;

      return this.stringPRNG(bitLen, charset);
    }
  }, {
    key: 'stringWithBytes',
    value: function stringWithBytes(bytes, bitLen) {
      var charset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : propMap.get(this).charset;

      return _stringWithBytes(bytes, bitLen, charset);
    }
  }, {
    key: 'bytesNeeded',
    value: function bytesNeeded() {
      var bitLen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).bitLen;
      var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charset;

      return charset.bytesNeeded(bitLen);
    }
  }, {
    key: 'chars',
    value: function chars() {
      return propMap.get(this).charset.chars();
    }
  }, {
    key: 'bits',
    value: function bits() {
      return propMap.get(this).bitLen;
    }
  }, {
    key: 'use',
    value: function use(charset) {
      if (!(charset instanceof CharSet)) {
        throw new Error('Invalid CharSet');
      }
      propMap.get(this).charset = charset;
    }
  }, {
    key: 'useChars',
    value: function useChars(chars) {
      if (!(typeof chars === 'string' || chars instanceof String)) {
        throw new Error('Invalid chars: Must be string');
      }
      this.use(new CharSet(chars));
    }
  }], [{
    key: 'bits',
    value: function bits(total, risk) {
      return entropyBits(total, risk);
    }
  }]);
  return _class;
}();

exports.default = _class;