const { csprngBytes } = require('./csprng-bytes')
const { prngBytes } = require('./prng-bytes')
const { CharSet } = require('./charSet')

const BITS_PER_BYTE = 8
const {
  ceil, floor, log2, round
} = Math

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

      if (params.bits === undefined
          && params.charset === undefined
          && params.total === undefined
          && params.risk === undefined
          && params.prng === undefined) {
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

      if ((params.total !== undefined && params.risk === undefined)
          || (params.total === undefined && params.risk !== undefined)) {
        throw new Error('Invalid Entropy params: total and risk must be paired')
      }

      if (params.bits !== undefined
          && (params.total !== undefined || params.risk !== undefined)) {
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
