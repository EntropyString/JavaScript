'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require('babel-runtime/core-js/math/log10');

var _log3 = _interopRequireDefault(_log);

var _log4 = require('babel-runtime/core-js/math/log2');

var _log5 = _interopRequireDefault(_log4);

var _charSet = require('./charSet');

var _charSet2 = _interopRequireDefault(_charSet);

var _lcm = require('./lcm');

var _lcm2 = _interopRequireDefault(_lcm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _log2 = _log5.default;
var _log10 = _log3.default;
var _log2_10 = _log2(10);

var _endianByteNum = function () {
  var buf32 = new Uint32Array(1);
  var buf8 = new Uint8Array(buf32.buffer);
  buf32[0] = 0xff;
  return buf8[0] === 0xff ? [2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 6, 7];
}();

var bits = function bits(total, risk) {
  if (total == 0) {
    return 0;
  }

  var N = 0;
  if (total < 10001) {
    N = _log2(total) + _log2(total - 1) + _log2_10 * _log10(risk) - 1;
  } else {
    var n = 2 * _log10(total) + _log10(risk);
    N = n * _log2_10 - 1;
  }
  return N;
};

var bitsWithRiskPower = function bitsWithRiskPower(total, rPower) {
  if (total == 0) {
    return 0;
  }

  var N = 0;
  if (total < 10001) {
    N = _log2(total) + _log2(total - 1) + _log2_10 * rPower - 1;
  } else {
    var n = 2 * _log10(total) + rPower;
    N = n * _log2_10 - 1;
  }
  return N;
};

var bitsWithPowers = function bitsWithPowers(tPower, rPower) {
  var N = 0;
  if (tPower < 5) {
    return bitsWithRiskPower(Math.pow(10, tPower), rPower);
  } else {
    var n = 2 * tPower + rPower;
    N = n * _log2_10 - 1;
  }
  return N;
};

var randomString = function randomString(entropy, charSet) {
  var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!(opt === null || opt instanceof Uint8Array || typeof opt == 'boolean')) {
    throw new Error('Optional 3rd argument must be either an Uint8Array or a boolean');
  }

  var bytes = opt instanceof Uint8Array ? opt : opt === false ? _randomBytes(entropy, charSet) : _cryptoBytes(entropy, charSet);
  return randomStringWithBytes(entropy, charSet, bytes);
};

var randomStringWithBytes = function randomStringWithBytes(entropy, charSet, bytes) {
  if (!_charSet2.default.isValid(charSet)) {
    throw new Error('Invalid CharSet');
  }
  if (entropy <= 0) {
    return '';
  }

  var count = Math.ceil(entropy / charSet.entropyPerChar);
  if (count <= 0) {
    return '';
  }

  var needed = Math.ceil(count * (charSet.entropyPerChar / 8));
  if (bytes.length < needed) {
    throw new Error('Insufficient bytes');
  }

  var chunks = Math.floor(count / charSet.charsPerChunk);
  var partials = count % charSet.charsPerChunk;

  var chars = void 0,
      ndxFn = void 0;
  switch (charSet) {
    case _charSet2.default.charSet64:
      chars = _charSet2.default.charSet64.chars;
      ndxFn = _ndx64;
      break;
    case _charSet2.default.charSet32:
      chars = _charSet2.default.charSet32.chars;
      ndxFn = _ndx32;
      break;
    case _charSet2.default.charSet16:
      chars = _charSet2.default.charSet16.chars;
      ndxFn = _ndx16;
      break;
    case _charSet2.default.charSet8:
      chars = _charSet2.default.charSet8.chars;
      ndxFn = _ndx8;
      break;
    case _charSet2.default.charSet4:
      chars = _charSet2.default.charSet4.chars;
      ndxFn = _ndx4;
      break;
    case _charSet2.default.charSet2:
      chars = _charSet2.default.charSet2.chars;
      ndxFn = _ndx2;
      break;
    default:
      break;
  }

  var string = '';
  for (var chunk = 0; chunk < chunks; chunk++) {
    for (var slice = 0; slice < charSet.charsPerChunk; slice++) {
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

var bytesNeeded = function bytesNeeded(entropy, charSet) {
  if (!_charSet2.default.isValid(charSet)) {
    throw new Error('Invalid CharSet');
  }
  var count = Math.ceil(entropy / charSet.entropyPerChar);
  if (count <= 0) {
    return 0;
  }

  var bytesPerSlice = charSet.entropyPerChar / 8;
  return Math.ceil(count * bytesPerSlice);
};

var _cryptoBytes = function _cryptoBytes(entropy, charSet) {
  var crypto = require('crypto');
  return Buffer.from(crypto.randomBytes(bytesNeeded(entropy, charSet)));
};

var _randomBytes = function _randomBytes(entropy, charSet) {
  var byteCount = bytesNeeded(entropy, charSet);
  var randCount = Math.ceil(byteCount / 6);

  var buffer = new Buffer(byteCount);
  var dataView = new DataView(new ArrayBuffer(8));
  for (var rNum = 0; rNum < randCount; rNum++) {
    dataView.setFloat64(0, Math.random());
    for (var n = 0; n < 6; n++) {
      var fByteNum = _endianByteNum[n];
      var bByteNum = 6 * rNum + n;
      _bufferByte(buffer, bByteNum, fByteNum, byteCount, dataView);
    }
  }
  return buffer;
};

var _bufferByte = function _bufferByte(buffer, bByte, nByte, byteCount, dataView) {
  if (bByte < byteCount) {
    buffer[bByte] = dataView.getUint8(nByte);
  }
};

var _ndx64 = function _ndx64(chunk, slice, bytes) {
  return _ndxGen(chunk, slice, bytes, 6);
};

var _ndx32 = function _ndx32(chunk, slice, bytes) {
  return _ndxGen(chunk, slice, bytes, 5);
};

var _ndx16 = function _ndx16(chunk, slice, bytes) {
  return (bytes[chunk] << 4 * slice & 0xff) >> 4;
};

var _ndx8 = function _ndx8(chunk, slice, bytes) {
  return _ndxGen(chunk, slice, bytes, 3);
};

var _ndx4 = function _ndx4(chunk, slice, bytes) {
  return (bytes[chunk] << 2 * slice & 0xff) >> 6;
};

var _ndx2 = function _ndx2(chunk, slice, bytes) {
  return (bytes[chunk] << slice & 0xff) >> 7;
};

var _ndxGen = function _ndxGen(chunk, slice, bytes, bitsPerSlice) {
  var bitsPerByte = 8;
  var slicesPerChunk = (0, _lcm2.default)(bitsPerSlice, bitsPerByte) / bitsPerByte;

  var bNum = chunk * slicesPerChunk;

  var rShift = bitsPerByte - bitsPerSlice;

  var lOffset = Math.floor(slice * bitsPerSlice / bitsPerByte);
  var lShift = slice * bitsPerSlice % bitsPerByte;

  var ndx = (bytes[bNum + lOffset] << lShift & 0xff) >> rShift;

  var rOffset = Math.ceil(slice * bitsPerSlice / bitsPerByte);
  var rShiftIt = ((rOffset + 1) * bitsPerByte - (slice + 1) * bitsPerSlice) % bitsPerByte;
  if (rShift < rShiftIt) {
    ndx += bytes[bNum + rOffset] >> rShiftIt;
  }
  return ndx;
};

exports.default = {
  bits: bits,
  bitsWithRiskPower: bitsWithRiskPower,
  bitsWithPowers: bitsWithPowers,
  randomString: randomString,
  randomStringWithBytes: randomStringWithBytes,
  bytesNeeded: bytesNeeded,

  charSet64: _charSet2.default.charSet64,
  charSet32: _charSet2.default.charSet32,
  charSet16: _charSet2.default.charSet16,
  charSet8: _charSet2.default.charSet8,
  charSet4: _charSet2.default.charSet4,
  charSet2: _charSet2.default.charSet2
};