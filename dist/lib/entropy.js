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

  var floor = Math.floor,
      ceil = Math.ceil;


  var bitsPerChar = charset.getBitsPerChar();
  var count = ceil(bitLen / bitsPerChar);
  if (count <= 0) {
    return '';
  }

  var need = ceil(count * (bitsPerChar / BITS_PER_BYTE));
  if (bytes.length < need) {
    throw new Error('Insufficient bytes: need ' + need + ' and got ' + bytes.length);
  }

  var charsPerChunk = charset.getCharsPerChunk();
  var chunks = floor(count / charsPerChunk);
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

var prngBytes = function prngBytes(count) {
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

var _class = function () {
  function _class() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { bits: 128, charset: charset32 };
    (0, _classCallCheck3.default)(this, _class);

    if (params !== undefined) {
      if (!(params instanceof Object)) {
        throw new Error('Invalid argument for Entropy constructor: Expect params object');
      }

      if (params.bits === undefined && params.charset === undefined && params.total === undefined && params.risk === undefined && params.prng === undefined) {
        throw new Error('Invalid Entropy params');
      }

      if (params.bits !== undefined) {
        if (typeof params.bits !== 'number') {
          throw new Error('Invalid Entropy params: non-numeric bits');
        }
        if (params.bits < 0) {
          throw new Error('Invalid Entropy params: negative bits');
        }
      }

      if (params.total !== undefined) {
        if (typeof params.total !== 'number') {
          throw new Error('Invalid Entropy params: non-numeric total');
        }
        if (params.total < 1) {
          throw new Error('Invalid Entropy params: non-positive total');
        }
      }

      if (params.risk !== undefined) {
        if (typeof params.risk !== 'number') {
          throw new Error('Invalid Entropy params: non-numeric risk');
        }
        if (params.risk < 1) {
          throw new Error('Invalid Entropy params: non-positive risk');
        }
      }

      if (params.risk !== undefined && typeof params.risk !== 'number') {
        throw new Error('Invalid Entropy params: non-numeric risk');
      }

      if (params.total !== undefined && params.risk === undefined || params.total === undefined && params.risk !== undefined) {
        throw new Error('Invalid Entropy params: total and risk must be paired');
      }

      if (params.bits !== undefined && (params.total !== undefined || params.risk !== undefined)) {
        throw new Error('Invalid Entropy params: bits with total and/or risk');
      }
    }

    var bitLen = void 0;
    var round = Math.round;

    if (params.bits) {
      bitLen = round(params.bits);
    } else if (params.total && params.risk) {
      bitLen = round(entropyBits(params.total, params.risk));
    } else {
      bitLen = 128;
    }

    var charset = void 0;
    if (params.charset instanceof CharSet) {
      var cs = params.charset;

      charset = cs;
    } else if (typeof params.charset === 'string' || params.charset instanceof String) {
      charset = new CharSet(params.charset);
    } else {
      charset = charset32;
    }

    var prng = params.prng || false;

    propMap.set(this, { charset: charset, bitLen: bitLen, prng: prng });
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
      var bytes = propMap.get(this).prng ? prngBytes(bytesNeeded) : cryptoBytes(bytesNeeded);
      return this.stringWithBytes(bytes, bitLen, charset);
    }
  }, {
    key: 'stringWithBytes',
    value: function stringWithBytes(bytes) {
      var bitLen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).bitLen;
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