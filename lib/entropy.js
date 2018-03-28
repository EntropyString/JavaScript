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

const endianByteNum = (() => {
  const buf32 = new Uint32Array(1)
  const buf8 = new Uint8Array(buf32.buffer)
  buf32[0] = 0xff
  return (buf8[0] === 0xff) ? [2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 6, 7]
})()

const stringWithBytes = (bitLen, bytes, charset) => {
  if (bitLen <= 0) { return '' }

  const bitsPerChar = charset.getBitsPerChar()
  const count = Math.ceil(bitLen / bitsPerChar)
  if (count <= 0) { return '' }

  const need = Math.ceil(count * (bitsPerChar / BITS_PER_BYTE))
  if (bytes.length < need) {
    throw new Error(`Insufficient bytes: need ${need} and got ${bytes.length}`)
  }

  const charsPerChunk = charset.getCharsPerChunk()
  const chunks = Math.floor(count / charsPerChunk)
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

const cryptoBytes = count => Buffer.from(Crypto.randomBytes(count))

const randomBytes = (count) => {
  const BYTES_USED_PER_RANDOM_CALL = 6
  const randCount = Math.ceil(count / BYTES_USED_PER_RANDOM_CALL)

  const buffer = Buffer.alloc(count)
  const dataView = new DataView(new ArrayBuffer(BITS_PER_BYTE))
  for (let rNum = 0; rNum < randCount; rNum += 1) {
    dataView.setFloat64(0, Math.random())
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

export default class {
  constructor(arg) {
    let charset
    if (arg === undefined) {
      charset = charset32
    } else if (arg instanceof CharSet) {
      charset = arg
    } else if ((typeof arg === 'string' || arg instanceof String)) {
      charset = new CharSet(arg)
    } else {
      throw new Error('Invalid arg: must be either valid CharSet or valid chars')
    }
    const hideProps = {
      charset
    }
    propMap.set(this, hideProps)
  }

  static bits(total, risk) {
    if (total === 0) { return 0 }

    const { log2 } = Math

    let N
    if (total < 1000) {
      N = log2(total) + log2(total - 1)
    } else {
      N = 2 * log2(total)
    }
    return (N + log2(risk)) - 1
  }

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

  string(bitLen, charset = propMap.get(this).charset) {
    const bytesNeeded = charset.bytesNeeded(bitLen)
    return this.stringWithBytes(bitLen, cryptoBytes(bytesNeeded), charset)
  }

  stringRandom(bitLen, charset = propMap.get(this).charset) {
    const bytesNeeded = charset.bytesNeeded(bitLen)
    return this.stringWithBytes(bitLen, randomBytes(bytesNeeded), charset)
  }

  stringWithBytes(bitLen, bytes, charset = propMap.get(this).charset) {
    return stringWithBytes(bitLen, bytes, charset)
  }

  bytesNeeded(bitLen, charset = propMap.get(this).charset) {
    return charset.bytesNeeded(bitLen)
  }

  chars() {
    return propMap.get(this).charset.chars()
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
