(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.EntropyString = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { csprngBytes } = require('./lib/csprng-bytes')
const { prngBytes } = require('./lib/prng-bytes')

const BITS_PER_BYTE = 8
const {
  abs, ceil, floor, log2, round
} = Math

const gcd = (a, b) => {
  let la = a
  let lb = b
  while (lb !== 0) {
    [la, lb] = [lb, la % lb]
  }
  return abs(la)
}
const lcm = (a, b) => (a / gcd(a, b)) * b

const genNdxFn = (bitsPerChar) => {
  // If BITS_PER_BYTEs is a multiple of bitsPerChar, we can slice off an integer number
  // of chars per byte.
  if (lcm(bitsPerChar, BITS_PER_BYTE) === BITS_PER_BYTE) {
    return (chunk, slice, bytes) => {
      const lShift = bitsPerChar
      const rShift = BITS_PER_BYTE - bitsPerChar
      return ((bytes[chunk] << (lShift * slice)) & 0xff) >> rShift
    }
  }

  // Otherwise, while slicing off bits per char, we can possibly straddle two
  // of bytes, so a more work is involved
  const slicesPerChunk = lcm(bitsPerChar, BITS_PER_BYTE) / BITS_PER_BYTE
  return (chunk, slice, bytes) => {
    const bNum = chunk * slicesPerChunk

    const offset = (slice * bitsPerChar) / BITS_PER_BYTE
    const lOffset = floor(offset)
    const rOffset = ceil(offset)

    const rShift = BITS_PER_BYTE - bitsPerChar
    const lShift = (slice * bitsPerChar) % BITS_PER_BYTE

    let ndx = ((bytes[bNum + lOffset] << lShift) & 0xff) >> rShift

    const r1Bits = (rOffset + 1) * BITS_PER_BYTE
    const s1Bits = (slice + 1) * bitsPerChar

    const rShiftIt = (r1Bits - s1Bits) % BITS_PER_BYTE
    if (rShift < rShiftIt) {
      ndx += bytes[bNum + rOffset] >> rShiftIt
    }
    return ndx
  }
}

class CharSet {
  constructor(chars) {
    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string')
    }
    const { length } = chars
    if (![2, 4, 8, 16, 32, 64].includes(length)) {
      throw new Error('Invalid char count: must be one of 2,4,8,16,32,64')
    }

    // Ensure no repeated characters
    for (let i = 0; i < length; i += 1) {
      const c = chars.charAt(i)
      for (let j = i + 1; j < length; j += 1) {
        if (c === chars.charAt(j)) {
          throw new Error('Characters not unique')
        }
      }
    }

    this.chars = chars
    this.bitsPerChar = floor(log2(length))
    this.length = length
    this.ndxFn = genNdxFn(this.bitsPerChar)
    this.charsPerChunk = lcm(this.bitsPerChar, BITS_PER_BYTE) / this.bitsPerChar
  }

  bytesNeeded(bitLen) {
    const count = ceil(bitLen / this.bitsPerChar)
    return ceil((count * this.bitsPerChar) / BITS_PER_BYTE)
  }
}

const charset64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
const charset32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT')
const charset16 = new CharSet('0123456789abcdef')
const charset8 = new CharSet('01234567')
const charset4 = new CharSet('ATCG')
const charset2 = new CharSet('01')

const stringWithBytes = (bytes, bitLen, charset) => {
  if (bitLen <= 0) { return '' }

  const { bitsPerChar } = charset
  const count = ceil(bitLen / bitsPerChar)
  if (count <= 0) { return '' }

  const need = ceil(count * (bitsPerChar / BITS_PER_BYTE))
  if (bytes.length < need) {
    throw new Error(`Insufficient bytes: need ${need} and got ${bytes.length}`)
  }

  const { ndxFn, charsPerChunk, chars } = charset

  const chunks = floor(count / charsPerChunk)
  const partials = count % charsPerChunk

  let string = ''
  for (let chunk = 0; chunk < chunks; chunk += 1) {
    for (let slice = 0; slice < charsPerChunk; slice += 1) {
      const ndx = ndxFn(chunk, slice, bytes)
      string += chars[ndx]
    }
  }
  for (let slice = 0; slice < partials; slice += 1) {
    const ndx = ndxFn(chunks, slice, bytes)
    string += chars[ndx]
  }
  return string
}

const entropyBits = (total, risk) => {
  if (total === 0) { return 0 }
  let N
  if (total < 1000) {
    N = log2(total) + log2(total - 1)
  } else {
    N = 2 * log2(total)
  }
  return (N + log2(risk)) - 1
}

class Entropy {
  constructor(params = { bits: 128, charset: charset32 }) {
    if (params !== undefined) {
      if (!(params instanceof Object)) {
        throw new Error('Invalid argument for Entropy constructor: Expect params object')
      }

      if (params.bits === undefined &&
          params.charset === undefined &&
          params.total === undefined &&
          params.risk === undefined &&
          params.prng === undefined) {
        throw new Error('Invalid Entropy params')
      }

      if (params.bits !== undefined) {
        if (typeof params.bits !== 'number') {
          throw new Error('Invalid Entropy params: non-numeric bits')
        }
        if (params.bits < 0) {
          throw new Error('Invalid Entropy params: negative bits')
        }
      }

      if (params.total !== undefined) {
        if (typeof params.total !== 'number') {
          throw new Error('Invalid Entropy params: non-numeric total')
        }
        if (params.total < 1) {
          throw new Error('Invalid Entropy params: non-positive total')
        }
      }

      if (params.risk !== undefined) {
        if (typeof params.risk !== 'number') {
          throw new Error('Invalid Entropy params: non-numeric risk')
        }
        if (params.risk < 1) {
          throw new Error('Invalid Entropy params: non-positive risk')
        }
      }

      if (params.risk !== undefined && typeof params.risk !== 'number') {
        throw new Error('Invalid Entropy params: non-numeric risk')
      }

      if ((params.total !== undefined && params.risk === undefined) ||
          (params.total === undefined && params.risk !== undefined)) {
        throw new Error('Invalid Entropy params: total and risk must be paired')
      }

      if (params.bits !== undefined &&
          (params.total !== undefined || params.risk !== undefined)) {
        throw new Error('Invalid Entropy params: bits with total and/or risk')
      }
    }

    let bitLen
    if (params.bits) {
      bitLen = round(params.bits)
    } else if (params.total && params.risk) {
      bitLen = round(entropyBits(params.total, params.risk))
    } else {
      bitLen = 128
    }

    let charset
    if (params.charset instanceof CharSet) {
      const { charset: cs } = params
      charset = cs
    } else if ((typeof params.charset === 'string' || params.charset instanceof String)) {
      charset = new CharSet(params.charset)
    } else {
      charset = charset32
    }

    this.charset = charset
    this.bitLen = bitLen
    this.prng = params.prng || false
  }

  static bits(total, risk) { return entropyBits(total, risk) }

  smallID(charset = this.charset) {
    return this.string(29, charset)
  }

  mediumID(charset = this.charset) {
    return this.string(69, charset)
  }

  largeID(charset = this.charset) {
    return this.string(99, charset)
  }

  sessionID(charset = this.charset) {
    return this.string(128, charset)
  }

  token(charset = this.charset) {
    return this.string(256, charset)
  }

  string(bitLen = this.bitLen, charset = this.charset) {
    const bytesNeeded = charset.bytesNeeded(bitLen)
    const bytes = this.prng ? prngBytes(bytesNeeded) : csprngBytes(bytesNeeded)
    return this.stringWithBytes(bytes, bitLen, charset)
  }

  stringWithBytes(
    bytes,
    bitLen = this.bitLen, charset = this.charset
  ) {
    return stringWithBytes(bytes, bitLen, charset)
  }

  bytesNeeded(bitLen = this.bitLen, charset = this.charset) {
    return charset.bytesNeeded(bitLen)
  }

  chars() {
    return this.charset.chars
  }

  bits() {
    return this.bitLen
  }

  use(charset) {
    if (!(charset instanceof CharSet)) { throw new Error('Invalid CharSet') }
    this.charset = charset
  }

  useChars(chars) {
    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string')
    }
    this.use(new CharSet(chars))
  }
}

module.exports = {
  CharSet,
  Entropy,
  charset2,
  charset4,
  charset8,
  charset16,
  charset32,
  charset64
}

},{"./lib/csprng-bytes":2,"./lib/prng-bytes":3}],2:[function(require,module,exports){
const csprngBytes = count => window.crypto.getRandomValues(new Uint8Array(count))

module.exports = {
  csprngBytes
}

},{}],3:[function(require,module,exports){
const { ceil, random } = Math

const BITS_PER_BYTE = 8

const endianByteNum = (() => {
  const buf32 = new Uint32Array(1)
  const buf8 = new Uint8Array(buf32.buffer)
  buf32[0] = 0xff
  return (buf8[0] === 0xff) ? [2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 6, 7]
})()

const prngBytes = (count) => {
  const BYTES_USED_PER_RANDOM_CALL = 6
  const randCount = ceil(count / BYTES_USED_PER_RANDOM_CALL)

  const buffer = new ArrayBuffer(count)
  const dataView = new DataView(new ArrayBuffer(BITS_PER_BYTE))
  for (let rNum = 0; rNum < randCount; rNum += 1) {
    dataView.setFloat64(0, random())
    for (let n = 0; n < BYTES_USED_PER_RANDOM_CALL; n += 1) {
      const fByteNum = endianByteNum[n]
      const bByteNum = (rNum * BYTES_USED_PER_RANDOM_CALL) + n
      if (bByteNum < count) {
        buffer[bByteNum] = dataView.getUint8(fByteNum)
      }
    }
  }
  return buffer
}

module.exports = {
  prngBytes
}

},{}]},{},[1])(1)
});
