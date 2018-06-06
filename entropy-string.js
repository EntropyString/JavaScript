const WeakMap = require('weak-map')

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

const charsetProps = new WeakMap()
class CharSet {
  constructor(chars) {
    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string')
    }
    const { length } = chars
    if (![2, 4, 8, 16, 32, 64].includes(length)) {
      throw new Error('Invalid char count: must be one of 2,4,8,16,32,64')
    }
    const bitsPerChar = floor(log2(length))
    // Ensure no repeated characters
    for (let i = 0; i < length; i += 1) {
      const c = chars.charAt(i)
      for (let j = i + 1; j < length; j += 1) {
        if (c === chars.charAt(j)) {
          throw new Error('Characters not unique')
        }
      }
    }
    const privProps = {
      chars,
      bitsPerChar,
      length,
      ndxFn: genNdxFn(bitsPerChar),
      charsPerChunk: lcm(bitsPerChar, BITS_PER_BYTE) / bitsPerChar
    }
    charsetProps.set(this, privProps)
  }

  getChars() {
    return charsetProps.get(this).chars
  }

  getBitsPerChar() {
    return charsetProps.get(this).bitsPerChar
  }

  getNdxFn() {
    return charsetProps.get(this).ndxFn
  }

  getCharsPerChunk() {
    return charsetProps.get(this).charsPerChunk
  }

  length() {
    return charsetProps.get(this).length
  }

  bytesNeeded(bitLen) {
    const count = ceil(bitLen / this.bitsPerChar())
    return ceil((count * this.bitsPerChar()) / BITS_PER_BYTE)
  }

  // Aliases
  chars() { return this.getChars() }
  ndxFn() { return this.getNdxFn() }
  bitsPerChar() { return this.getBitsPerChar() }
}

const charset64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
const charset32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT')
const charset16 = new CharSet('0123456789abcdef')
const charset8 = new CharSet('01234567')
const charset4 = new CharSet('ATCG')
const charset2 = new CharSet('01')

const stringWithBytes = (bytes, bitLen, charset) => {
  if (bitLen <= 0) { return '' }

  const bitsPerChar = charset.getBitsPerChar()
  const count = ceil(bitLen / bitsPerChar)
  if (count <= 0) { return '' }

  const need = ceil(count * (bitsPerChar / BITS_PER_BYTE))
  if (bytes.length < need) {
    throw new Error(`Insufficient bytes: need ${need} and got ${bytes.length}`)
  }

  const charsPerChunk = charset.getCharsPerChunk()
  const chunks = floor(count / charsPerChunk)
  const partials = count % charsPerChunk

  const ndxFn = charset.getNdxFn()
  const chars = charset.getChars()

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

const entropyProps = new WeakMap()
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

    const prng = params.prng || false

    entropyProps.set(this, { charset, bitLen, prng })
  }

  static bits(total, risk) { return entropyBits(total, risk) }

  smallID(charset = entropyProps.get(this).charset) {
    return this.string(29, charset)
  }

  mediumID(charset = entropyProps.get(this).charset) {
    return this.string(69, charset)
  }

  largeID(charset = entropyProps.get(this).charset) {
    return this.string(99, charset)
  }

  sessionID(charset = entropyProps.get(this).charset) {
    return this.string(128, charset)
  }

  token(charset = entropyProps.get(this).charset) {
    return this.string(256, charset)
  }

  string(bitLen = entropyProps.get(this).bitLen, charset = entropyProps.get(this).charset) {
    const bytesNeeded = charset.bytesNeeded(bitLen)
    const bytes = entropyProps.get(this).prng ? prngBytes(bytesNeeded) : csprngBytes(bytesNeeded)
    return this.stringWithBytes(bytes, bitLen, charset)
  }

  stringWithBytes(
    bytes,
    bitLen = entropyProps.get(this).bitLen, charset = entropyProps.get(this).charset
  ) {
    return stringWithBytes(bytes, bitLen, charset)
  }

  bytesNeeded(bitLen = entropyProps.get(this).bitLen, charset = entropyProps.get(this).charset) {
    return charset.bytesNeeded(bitLen)
  }

  chars() {
    return entropyProps.get(this).charset.chars()
  }

  bits() {
    return entropyProps.get(this).bitLen
  }

  use(charset) {
    if (!(charset instanceof CharSet)) { throw new Error('Invalid CharSet') }
    entropyProps.get(this).charset = charset
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
