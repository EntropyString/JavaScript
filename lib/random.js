import CharSet, {charSet32} from './charSet'
import Entropy from './entropy'

import WeakMap from 'weak-map'

const propMap = new WeakMap()

const BITS_PER_BYTE = 8

export default class {
  constructor(arg) {
    let charSet
    if (arg === undefined) {
      charSet = charSet32
    }
    else if (arg instanceof CharSet) {
      charSet = arg
    }
    else if ((typeof arg === 'string' || arg instanceof String)) {
      charSet = new CharSet(arg)
    }
    else {
      throw new Error('Invalid arg: must be either valid CharSet or valid chars')
    }
    const hideProps = {
      charSet
    }
    propMap.set(this, hideProps)
  }

  sessionID(charSet = propMap.get(this).charSet) {
    return this.string(128, charSet)
  }

  string(entropyBits, charSet = propMap.get(this).charSet) {
    let bytesNeeded = charSet.bytesNeeded(entropyBits)
    return this.stringWithBytes(entropyBits, _cryptoBytes(bytesNeeded), charSet)
  }

  stringRandom(entropyBits, charSet = propMap.get(this).charSet) {
    let bytesNeeded = charSet.bytesNeeded(entropyBits)
    return this.stringWithBytes(entropyBits, _randomBytes(bytesNeeded), charSet)
  }

  stringWithBytes(entropyBits,  bytes, charSet = propMap.get(this).charSet) {
    return _stringWithBytes(entropyBits, bytes, charSet)
  }

  bytesNeeded(entropyBits, charSet = propMap.get(this).charSet) {
    return charSet.bytesNeeded(entropyBits)
  }

  chars() {
    return propMap.get(this).charSet.chars()
  }

  use(charSet) {
    if (!(charSet instanceof CharSet)) { throw new Error('Invalid CharSet') }
    propMap.get(this).charSet = charSet
  }

  useChars(chars) {
    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string')
    }
    this.use(new CharSet(chars))
  }
}

const _stringWithBytes = (entropyBits,  bytes, charSet) => {
  if (entropyBits <= 0) { return '' }

  const bitsPerChar = charSet.getBitsPerChar()
  const count = Math.ceil(entropyBits / bitsPerChar)
  if (count <= 0) { return '' }

  const needed = Math.ceil(count * (bitsPerChar / BITS_PER_BYTE))
  if (bytes.length < needed) {
    throw new Error('Insufficient bytes: need ' + needed + ' and got ' + bytes.length)
  }

  const charsPerChunk = charSet.getCharsPerChunk()
  const chunks   = Math.floor(count / charsPerChunk)
  const partials = count % charsPerChunk

  const ndxFn = charSet.getNdxFn()
  const chars = charSet.getChars()
  
  let string = ''
  for (let chunk = 0; chunk < chunks; chunk++) {
    for (let slice = 0; slice < charsPerChunk; slice++) {
      let ndx = ndxFn(chunk, slice, bytes)
      string += chars[ndx]
    }
  }
  for (let slice = 0; slice < partials; slice++) {
    let ndx = ndxFn(chunks, slice, bytes)
    string += chars[ndx]
  }
  return string
}

const _cryptoBytes = (bytesNeeded) => {
  const crypto = require('crypto')
  return Buffer.from(crypto.randomBytes(bytesNeeded))
}

const _randomBytes = (bytesNeeded) => {
  let BYTES_USED_PER_RANDOM_CALL = 6
  const randCount = Math.ceil(bytesNeeded / BYTES_USED_PER_RANDOM_CALL)

  const buffer = new Buffer(bytesNeeded)
  var dataView = new DataView(new ArrayBuffer(BITS_PER_BYTE))
  for (let rNum = 0; rNum < randCount; rNum++) {
    dataView.setFloat64(0, Math.random())
    for (let n = 0; n < BYTES_USED_PER_RANDOM_CALL; n++) {
      let fByteNum = _endianByteNum[n]
      let bByteNum = rNum*BYTES_USED_PER_RANDOM_CALL + n
      if (bByteNum < bytesNeeded) {
        buffer[bByteNum] = dataView.getUint8(fByteNum)
      }
    }
  }
  return buffer
}

const _endianByteNum = (() => {
  const buf32 = new Uint32Array(1)
  const buf8  = new Uint8Array(buf32.buffer)
  buf32[0] = 0xff
  return (buf8[0] === 0xff) ? [2,3,4,5,6,7] : [0,1,2,3,6,7]
})()
