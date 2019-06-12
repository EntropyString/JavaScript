"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _require = require('./lib/csprng-bytes'),
    csprngBytes = _require.csprngBytes;

var _require2 = require('./lib/prng-bytes'),
    prngBytes = _require2.prngBytes;

var BITS_PER_BYTE = 8;
var abs = Math.abs,
    ceil = Math.ceil,
    floor = Math.floor,
    log2 = Math.log2,
    round = Math.round;

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
  } // Otherwise, while slicing off bits per char, we can possibly straddle two
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

var CharSet =
/*#__PURE__*/
function () {
  function CharSet(chars) {
    (0, _classCallCheck2["default"])(this, CharSet);

    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string');
    }

    var length = chars.length;

    if (![2, 4, 8, 16, 32, 64].includes(length)) {
      throw new Error('Invalid char count: must be one of 2,4,8,16,32,64');
    } // Ensure no repeated characters


    for (var i = 0; i < length; i += 1) {
      var c = chars.charAt(i);

      for (var j = i + 1; j < length; j += 1) {
        if (c === chars.charAt(j)) {
          throw new Error('Characters not unique');
        }
      }
    }

    this.chars = chars;
    this.bitsPerChar = floor(log2(length));
    this.length = length;
    this.ndxFn = genNdxFn(this.bitsPerChar);
    this.charsPerChunk = lcm(this.bitsPerChar, BITS_PER_BYTE) / this.bitsPerChar;
  }

  (0, _createClass2["default"])(CharSet, [{
    key: "bytesNeeded",
    value: function bytesNeeded(bitLen) {
      var count = ceil(bitLen / this.bitsPerChar);
      return ceil(count * this.bitsPerChar / BITS_PER_BYTE);
    }
  }]);
  return CharSet;
}();

var charset64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_');
var charset32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT');
var charset16 = new CharSet('0123456789abcdef');
var charset8 = new CharSet('01234567');
var charset4 = new CharSet('ATCG');
var charset2 = new CharSet('01');

var _stringWithBytes = function stringWithBytes(bytes, bitLen, charset) {
  if (bitLen <= 0) {
    return '';
  }

  var bitsPerChar = charset.bitsPerChar;
  var count = ceil(bitLen / bitsPerChar);

  if (count <= 0) {
    return '';
  }

  var need = ceil(count * (bitsPerChar / BITS_PER_BYTE));

  if (bytes.length < need) {
    throw new Error("Insufficient bytes: need ".concat(need, " and got ").concat(bytes.length));
  }

  var ndxFn = charset.ndxFn,
      charsPerChunk = charset.charsPerChunk,
      chars = charset.chars;
  var chunks = floor(count / charsPerChunk);
  var partials = count % charsPerChunk;
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

var entropyBits = function entropyBits(total, risk) {
  if (total === 0) {
    return 0;
  }

  var N;

  if (total < 1000) {
    N = log2(total) + log2(total - 1);
  } else {
    N = 2 * log2(total);
  }

  return N + log2(risk) - 1;
};

var Entropy =
/*#__PURE__*/
function () {
  function Entropy() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      bits: 128,
      charset: charset32
    };
    (0, _classCallCheck2["default"])(this, Entropy);

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

    var bitLen;

    if (params.bits) {
      bitLen = round(params.bits);
    } else if (params.total && params.risk) {
      bitLen = round(entropyBits(params.total, params.risk));
    } else {
      bitLen = 128;
    }

    var charset;

    if (params.charset instanceof CharSet) {
      var cs = params.charset;
      charset = cs;
    } else if (typeof params.charset === 'string' || params.charset instanceof String) {
      charset = new CharSet(params.charset);
    } else {
      charset = charset32;
    }

    this.charset = charset;
    this.bitLen = bitLen;
    this.prng = params.prng || false;
  }

  (0, _createClass2["default"])(Entropy, [{
    key: "smallID",
    value: function smallID() {
      var charset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.charset;
      return this.string(29, charset);
    }
  }, {
    key: "mediumID",
    value: function mediumID() {
      var charset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.charset;
      return this.string(69, charset);
    }
  }, {
    key: "largeID",
    value: function largeID() {
      var charset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.charset;
      return this.string(99, charset);
    }
  }, {
    key: "sessionID",
    value: function sessionID() {
      var charset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.charset;
      return this.string(128, charset);
    }
  }, {
    key: "token",
    value: function token() {
      var charset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.charset;
      return this.string(256, charset);
    }
  }, {
    key: "string",
    value: function string() {
      var bitLen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.bitLen;
      var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.charset;
      var bytesNeeded = charset.bytesNeeded(bitLen);
      var bytes = this.prng ? prngBytes(bytesNeeded) : csprngBytes(bytesNeeded);
      return this.stringWithBytes(bytes, bitLen, charset);
    }
  }, {
    key: "stringWithBytes",
    value: function stringWithBytes(bytes) {
      var bitLen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bitLen;
      var charset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.charset;
      return _stringWithBytes(bytes, bitLen, charset);
    }
  }, {
    key: "bytesNeeded",
    value: function bytesNeeded() {
      var bitLen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.bitLen;
      var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.charset;
      return charset.bytesNeeded(bitLen);
    }
  }, {
    key: "chars",
    value: function chars() {
      return this.charset.chars;
    }
  }, {
    key: "bits",
    value: function bits() {
      return this.bitLen;
    }
  }, {
    key: "use",
    value: function use(charset) {
      if (!(charset instanceof CharSet)) {
        throw new Error('Invalid CharSet');
      }

      this.charset = charset;
    }
  }, {
    key: "useChars",
    value: function useChars(chars) {
      if (!(typeof chars === 'string' || chars instanceof String)) {
        throw new Error('Invalid chars: Must be string');
      }

      this.use(new CharSet(chars));
    }
  }], [{
    key: "bits",
    value: function bits(total, risk) {
      return entropyBits(total, risk);
    }
  }]);
  return Entropy;
}();

module.exports = {
  CharSet: CharSet,
  Entropy: Entropy,
  charset2: charset2,
  charset4: charset4,
  charset8: charset8,
  charset16: charset16,
  charset32: charset32,
  charset64: charset64
};