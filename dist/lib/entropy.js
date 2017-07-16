'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require('babel-runtime/core-js/math/log10');

var _log2 = _interopRequireDefault(_log);

var _log3 = require('babel-runtime/core-js/math/log2');

var _log4 = _interopRequireDefault(_log3);

var _charSet = require('./charSet');

var _charSet2 = _interopRequireDefault(_charSet);

var _lcm = require('./lcm');

var _lcm2 = _interopRequireDefault(_lcm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require('crypto');

var log2 = _log4.default;
var log10 = _log2.default;
var log2_10 = log2(10);

var bits = function bits(total, risk) {
  if (total == 0) {
    return 0;
  }

  var N = 0;
  if (total < 10001) {
    N = log2(total) + log2(total - 1) + log2_10 * log10(risk) - 1;
  } else {
    var n = 2 * log10(total) + log10(risk);
    N = n * log2_10 - 1;
  }
  return N;
};

var bitsWithRiskPower = function bitsWithRiskPower(total, rPower) {
  if (total == 0) {
    return 0;
  }

  var N = 0;
  if (total < 10001) {
    N = log2(total) + log2(total - 1) + log2_10 * rPower - 1;
  } else {
    var n = 2 * log10(total) + rPower;
    N = n * log2_10 - 1;
  }
  return N;
};

var bitsWithPowers = function bitsWithPowers(tPower, rPower) {
  var N = 0;
  if (tPower < 5) {
    return bitsWithRiskPower(Math.pow(10, tPower), rPower);
  } else {
    var n = 2 * tPower + rPower;
    N = n * log2_10 - 1;
  }
  return N;
};

var randomString = function randomString(bits, charSet) {
  if (!_charSet2.default.isValid(charSet)) {
    throw new Error('Invalid CharSet');
  }

  var count = Math.ceil(bits / charSet.entropyPerChar);
  if (count <= 0) {
    return '';
  }

  var bytes = randomBytes(count, charSet);

  return randomStringWithBytes(bits, charSet, bytes);
};

var randomStringWithBytes = function randomStringWithBytes(bits, charSet, bytes) {
  if (!_charSet2.default.isValid(charSet)) {
    console.log('WTF?');
    throw new Error('Invalid CharSet');
  }

  if (bits <= 0) {
    return '';
  }

  var count = Math.ceil(bits / charSet.entropyPerChar);
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
      ndxFn = ndx64;
      break;
    case _charSet2.default.charSet32:
      chars = _charSet2.default.charSet32.chars;
      ndxFn = ndx32;
      break;
    case _charSet2.default.charSet16:
      chars = _charSet2.default.charSet16.chars;
      ndxFn = ndx16;
      break;
    case _charSet2.default.charSet8:
      chars = _charSet2.default.charSet8.chars;
      ndxFn = ndx8;
      break;
    case _charSet2.default.charSet4:
      chars = _charSet2.default.charSet4.chars;
      ndxFn = ndx4;
      break;
    case _charSet2.default.charSet2:
      chars = _charSet2.default.charSet2.chars;
      ndxFn = ndx2;
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

var randomBytes = function randomBytes(count, charSet) {
  var bytesPerSlice = charSet.entropyPerChar / 8;
  var bytesNeeded = Math.ceil(count * bytesPerSlice);
  return Buffer.from(crypto.randomBytes(bytesNeeded));
};

var ndx64 = function ndx64(chunk, slice, bytes) {
  return ndxGen(chunk, slice, bytes, 6);
};

var ndx32 = function ndx32(chunk, slice, bytes) {
  return ndxGen(chunk, slice, bytes, 5);
};

var ndx16 = function ndx16(chunk, slice, bytes) {
  return (bytes[chunk] << 4 * slice & 0xff) >> 4;
};

var ndx8 = function ndx8(chunk, slice, bytes) {
  return ndxGen(chunk, slice, bytes, 3);
};

var ndx4 = function ndx4(chunk, slice, bytes) {
  return (bytes[chunk] << 2 * slice & 0xff) >> 6;
};

var ndx2 = function ndx2(chunk, slice, bytes) {
  return (bytes[chunk] << slice & 0xff) >> 7;
};

var ndxGen = function ndxGen(chunk, slice, bytes, bitsPerSlice) {
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

  charSet64: _charSet2.default.charSet64,
  charSet32: _charSet2.default.charSet32,
  charSet16: _charSet2.default.charSet16,
  charSet8: _charSet2.default.charSet8,
  charSet4: _charSet2.default.charSet4,
  charSet2: _charSet2.default.charSet2
};