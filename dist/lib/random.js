'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CharSet = require('./charset').default;

var _require = require('./charset'),
    charset32 = _require.charset32;

var Crypto = require('crypto');
var WeakMap = require('weak-map');

var propMap = new WeakMap();

var BITS_PER_BYTE = 8;

var endianByteNum = function () {
  var buf32 = new Uint32Array(1);
  var buf8 = new Uint8Array(buf32.buffer);
  buf32[0] = 0xff;
  return buf8[0] === 0xff ? [2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 6, 7];
}();

var _stringWithBytes = function _stringWithBytes(entropyBits, bytes, charset) {
  if (entropyBits <= 0) {
    return '';
  }

  var bitsPerChar = charset.getBitsPerChar();
  var count = Math.ceil(entropyBits / bitsPerChar);
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

var _class = function () {
  function _class(arg) {
    (0, _classCallCheck3.default)(this, _class);

    var charset = void 0;
    if (arg === undefined) {
      charset = charset32;
    } else if (arg instanceof CharSet) {
      charset = arg;
    } else if (typeof arg === 'string' || arg instanceof String) {
      charset = new CharSet(arg);
    } else {
      throw new Error('Invalid arg: must be either valid CharSet or valid chars');
    }
    var hideProps = {
      charset: charset
    };
    propMap.set(this, hideProps);
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
    value: function string(entropyBits) {
      var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charset;

      var bytesNeeded = charset.bytesNeeded(entropyBits);
      return this.stringWithBytes(entropyBits, cryptoBytes(bytesNeeded), charset);
    }
  }, {
    key: 'stringRandom',
    value: function stringRandom(entropyBits) {
      var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charset;

      var bytesNeeded = charset.bytesNeeded(entropyBits);
      return this.stringWithBytes(entropyBits, randomBytes(bytesNeeded), charset);
    }
  }, {
    key: 'stringWithBytes',
    value: function stringWithBytes(entropyBits, bytes) {
      var charset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : propMap.get(this).charset;

      return _stringWithBytes(entropyBits, bytes, charset);
    }
  }, {
    key: 'bytesNeeded',
    value: function bytesNeeded(entropyBits) {
      var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charset;

      return charset.bytesNeeded(entropyBits);
    }
  }, {
    key: 'chars',
    value: function chars() {
      return propMap.get(this).charset.chars();
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
  }]);
  return _class;
}();

exports.default = _class;