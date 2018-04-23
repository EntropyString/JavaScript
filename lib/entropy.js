const Crypto = require('crypto')
const WeakMap = require('weak-map')

const { default: CharSet } = require('./charset')

export const charset64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
export const charset32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT')
export const charset16 = new CharSet('0123456789abcdef')
export const charset8 = new CharSet('01234567')
export const charset4 = new CharSet('ATCG')
export const charset2 = new CharSet('01')

const propMap = new WeakMap()
const BITS_PER_BYTE = 8
const {
  ceil, floor, log2, random, round
} = Math

const endianByteNum = (() => {
  const buf32 = new Uint32Array(1)
  const buf8 = new Uint8Array(buf32.buffer)
  buf32[0] = 0xff
  return (buf8[0] === 0xff) ? [2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 6, 7]
})()

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

const csprngBytes = count => Buffer.from(Crypto.randomBytes(count))

const prngBytes = (count) => {
  const BYTES_USED_PER_RANDOM_CALL = 6
  const randCount = ceil(count / BYTES_USED_PER_RANDOM_CALL)

  const buffer = Buffer.alloc(count)
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

export default class {
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

    propMap.set(this, { charset, bitLen, prng })
  }

  static bits(total, risk) { return entropyBits(total, risk) }

  smallID(charset = propMap.get(this).charset) {
    return this.string(29, charset)
  }

  mediumID(charset = propMap.get(this).charset) {
    return this.string(69, charset)
  }

  largeID(charset = propMap.get(this).charset) {
    return this.string(99, charset)
  }

  sessionID(charset = propMap.get(this).charset) {
    return this.string(128, charset)
  }

  token(charset = propMap.get(this).charset) {
    return this.string(256, charset)
  }

  string(bitLen = propMap.get(this).bitLen, charset = propMap.get(this).charset) {
    const bytesNeeded = charset.bytesNeeded(bitLen)
    const bytes = propMap.get(this).prng ? prngBytes(bytesNeeded) : csprngBytes(bytesNeeded)
    return this.stringWithBytes(bytes, bitLen, charset)
  }

  stringWithBytes(bytes, bitLen = propMap.get(this).bitLen, charset = propMap.get(this).charset) {
    return stringWithBytes(bytes, bitLen, charset)
  }

  bytesNeeded(bitLen = propMap.get(this).bitLen, charset = propMap.get(this).charset) {
    return charset.bytesNeeded(bitLen)
  }

  chars() {
    return propMap.get(this).charset.chars()
  }

  bits() {
    return propMap.get(this).bitLen
  }

  use(charset) {
    if (!(charset instanceof CharSet)) { throw new Error('Invalid CharSet') }
    propMap.get(this).charset = charset
  }

  useChars(chars) {
    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string')
    }
    this.use(new CharSet(chars))
  }
}
