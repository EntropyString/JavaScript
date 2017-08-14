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
    key: 'sessionID',
    value: function sessionID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap.get(this).charSet;

      return this.string(128, charSet);
    }
  }, {
    key: 'string',
    value: function string(entropyBits) {
      var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charSet;

      return this.stringWithBytes(entropyBits, _cryptoBytes(entropyBits, charSet), charSet);
    }
  }, {
    key: 'stringRandom',
    value: function stringRandom(entropyBits) {
      var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap.get(this).charSet;

      return this.stringWithBytes(entropyBits, _randomBytes(entropyBits, charSet), charSet);
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

      return _bytesNeeded(entropyBits, charSet);
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


var _bitsPerByte = 8;

var _stringWithBytes = function _stringWithBytes(entropyBits, bytes, charSet) {
  if (entropyBits <= 0) {
    return '';
  }

  var bitsPerChar = charSet.getBitsPerChar();
  var count = Math.ceil(entropyBits / bitsPerChar);
  if (count <= 0) {
    return '';
  }

  var needed = Math.ceil(count * (bitsPerChar / _bitsPerByte));
  if (bytes.length < needed) {
    throw new Error('Insufficient bytes: need ' + needed + ' and got ' + bytes.length);
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

var _bytesNeeded = function _bytesNeeded(entropyBits, charSet) {
  var bitsPerChar = charSet.getBitsPerChar();
  var count = Math.ceil(entropyBits / bitsPerChar);
  if (count <= 0) {
    return 0;
  }

  var bytesPerSlice = bitsPerChar / _bitsPerByte;
  return Math.ceil(count * bytesPerSlice);
};

var _cryptoBytes = function _cryptoBytes(entropyBits, charSet) {
  var crypto = require('crypto');
  return Buffer.from(crypto.randomBytes(_bytesNeeded(entropyBits, charSet)));
};

var _randomBytes = function _randomBytes(entropyBits, charSet) {
  var byteCount = _bytesNeeded(entropyBits, charSet);
  var randCount = Math.ceil(byteCount / 6);

  var buffer = new Buffer(byteCount);
  var dataView = new DataView(new ArrayBuffer(_bitsPerByte));
  for (var rNum = 0; rNum < randCount; rNum++) {
    dataView.setFloat64(0, Math.random());
    for (var n = 0; n < 6; n++) {
      var fByteNum = _endianByteNum[n];
      var bByteNum = 6 * rNum + n;
      if (bByteNum < byteCount) {
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