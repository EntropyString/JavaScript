'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _charSet = require('./charSet');

var _charSet2 = _interopRequireDefault(_charSet);

var _entropy = require('./entropy');

var _entropy2 = _interopRequireDefault(_entropy);

var _weakMap = require('weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propMap = new _weakMap2.default();

var BITS_PER_BYTE = 8;

var _class = function () {
  function _class(arg) {
    (0, _classCallCheck3.default)(this, _class);

    var charSet = void 0;
    if (arg === undefined) {
      charSet = _charSet.charSet32;
    } else if (arg instanceof _charSet2.default) {
      charSet = arg;
    } else if (typeof arg === 'string' || arg instanceof String) {
      charSet = new _charSet2.default(arg);
    } else {
      throw new Error('Invalid arg: must be either valid CharSet or valid chars');
    }
    var hideProps = {
      charSet: charSet
    };
    propMap.set(this, hideProps);
  }

  (0, _createClass3.default)(_class, [{
    key: 'smallID',
    value: function smallID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).charSet;

      return this.string(29, charSet);
    }
  }, {
    key: 'mediumID',
    value: function mediumID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).charSet;

      return this.string(69, charSet);
    }
  }, {
    key: 'largeID',
    value: function largeID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).charSet;

      return this.string(99, charSet);
    }
  }, {
    key: 'sessionID',
    value: function sessionID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).charSet;

      return this.string(128, charSet);
    }
  }, {
    key: 'token',
    value: function token() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).charSet;

      return this.string(256, charSet);
    }
  }, {
    key: 'string',
    value: function string(entropyBits) {
      var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charSet;

      var bytesNeeded = charSet.bytesNeeded(entropyBits);
      return this.stringWithBytes(entropyBits, _cryptoBytes(bytesNeeded), charSet);
    }
  }, {
    key: 'stringRandom',
    value: function stringRandom(entropyBits) {
      var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charSet;

      var bytesNeeded = charSet.bytesNeeded(entropyBits);
      return this.stringWithBytes(entropyBits, _randomBytes(bytesNeeded), charSet);
    }
  }, {
    key: 'stringWithBytes',
    value: function stringWithBytes(entropyBits, bytes) {
      var charSet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : propMap.get(this).charSet;

      return _stringWithBytes(entropyBits, bytes, charSet);
    }
  }, {
    key: 'bytesNeeded',
    value: function bytesNeeded(entropyBits) {
      var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charSet;

      return charSet.bytesNeeded(entropyBits);
    }
  }, {
    key: 'chars',
    value: function chars() {
      return propMap.get(this).charSet.chars();
    }
  }, {
    key: 'use',
    value: function use(charSet) {
      if (!(charSet instanceof _charSet2.default)) {
        throw new Error('Invalid CharSet');
      }
      propMap.get(this).charSet = charSet;
    }
  }, {
    key: 'useChars',
    value: function useChars(chars) {
      if (!(typeof chars === 'string' || chars instanceof String)) {
        throw new Error('Invalid chars: Must be string');
      }
      this.use(new _charSet2.default(chars));
    }
  }]);
  return _class;
}();

exports.default = _class;


var _stringWithBytes = function _stringWithBytes(entropyBits, bytes, charSet) {
  if (entropyBits <= 0) {
    return '';
  }

  var bitsPerChar = charSet.getBitsPerChar();
  var count = Math.ceil(entropyBits / bitsPerChar);
  if (count <= 0) {
    return '';
  }

  var need = Math.ceil(count * (bitsPerChar / BITS_PER_BYTE));
  if (bytes.length < need) {
    throw new Error('Insufficient bytes: need ' + need + ' and got ' + bytes.length);
  }

  var charsPerChunk = charSet.getCharsPerChunk();
  var chunks = Math.floor(count / charsPerChunk);
  var partials = count % charsPerChunk;

  var ndxFn = charSet.getNdxFn();
  var chars = charSet.getChars();

  var string = '';
  for (var chunk = 0; chunk < chunks; chunk++) {
    for (var slice = 0; slice < charsPerChunk; slice++) {
      var ndx = ndxFn(chunk, slice, bytes);
      string += chars[ndx];
    }
  }
  for (var _slice = 0; _slice < partials; _slice++) {
    var _ndx = ndxFn(chunks, _slice, bytes);
    string += chars[_ndx];
  }
  return string;
};

var _cryptoBytes = function _cryptoBytes(count) {
  var crypto = require('crypto');
  return Buffer.from(crypto.randomBytes(count));
};

var _randomBytes = function _randomBytes(count) {
  var BYTES_USED_PER_RANDOM_CALL = 6;
  var randCount = Math.ceil(count / BYTES_USED_PER_RANDOM_CALL);

  var buffer = new Buffer(count);
  var dataView = new DataView(new ArrayBuffer(BITS_PER_BYTE));
  for (var rNum = 0; rNum < randCount; rNum++) {
    dataView.setFloat64(0, Math.random());
    for (var n = 0; n < BYTES_USED_PER_RANDOM_CALL; n++) {
      var fByteNum = _endianByteNum[n];
      var bByteNum = rNum * BYTES_USED_PER_RANDOM_CALL + n;
      if (bByteNum < count) {
        buffer[bByteNum] = dataView.getUint8(fByteNum);
      }
    }
  }
  return buffer;
};

var _endianByteNum = function () {
  var buf32 = new Uint32Array(1);
  var buf8 = new Uint8Array(buf32.buffer);
  buf32[0] = 0xff;
  return buf8[0] === 0xff ? [2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 6, 7];
}();