'use strict';

var _charSet = require('./charSet');

var _charSet2 = _interopRequireDefault(_charSet);

var _entropy = require('./entropy');

var _entropy2 = _interopRequireDefault(_entropy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _bitsPerByte = 8;

var sessionID = function sessionID() {
  return string(128, _charSet2.default.base64);
};

var string = function string(entropyBits) {
  var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _charSet2.default.base32;

  return stringWithBytes(entropyBits, _cryptoBytes(entropyBits, charSet), charSet);
};

var stringRandom = function stringRandom(entropyBits) {
  var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _charSet2.default.base32;

  return stringWithBytes(entropyBits, _randomBytes(entropyBits, charSet), charSet);
};

var stringWithBytes = function stringWithBytes(entropyBits, bytes) {
  var charSet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _charSet2.default.base32;

  if (!_charSet2.default.isValid(charSet)) {
    throw new Error('Invalid CharSet');
  }
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
    throw new Error('Insufficient bytes');
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

var bytesNeeded = function bytesNeeded(entropyBits, charSet) {
  if (!_charSet2.default.isValid(charSet)) {
    throw new Error('Invalid CharSet');
  }

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
  return Buffer.from(crypto.randomBytes(bytesNeeded(entropyBits, charSet)));
};

var _randomBytes = function _randomBytes(entropyBits, charSet) {
  var byteCount = bytesNeeded(entropyBits, charSet);
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

module.exports = {
  sessionID: sessionID,
  string: string,
  stringRandom: stringRandom,
  stringWithBytes: stringWithBytes,
  bytesNeeded: bytesNeeded
};