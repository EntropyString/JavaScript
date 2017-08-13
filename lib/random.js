import CharSet from './charSet'
import Entropy from './entropy'

import WeakMap from 'weak-map'

export let charSet64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
export let charSet32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT')
export let charSet16 = new CharSet('0123456789abcdef')
export let charSet8  = new CharSet('01234567')
export let charSet4  = new CharSet('ATCG')
export let charSet2  = new CharSet('01')

const propMap = new WeakMap()

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
    return this.stringWithBytes(entropyBits, _cryptoBytes(entropyBits, charSet), charSet)
  }

  stringRandom (entropyBits, charSet = propMap.get(this).charSet) {
    return this.stringWithBytes(entropyBits, _randomBytes(entropyBits, charSet), charSet)
  }

  stringWithBytes(entropyBits,  bytes, charSet = propMap.get(this).charSet) {
    return _stringWithBytes(entropyBits, bytes, charSet)
  }

  bytesNeeded(entropyBits, charSet = propMap.get(this).charSet) {
    return _bytesNeeded(entropyBits, charSet)
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

const _bitsPerByte = 8

const _stringWithBytes = (entropyBits,  bytes, charSet) => {
  if (entropyBits <= 0) { return '' }

  const bitsPerChar = charSet.getBitsPerChar()
  const count = Math.ceil(entropyBits / bitsPerChar)
  if (count <= 0) { return '' }

  const needed = Math.ceil(count * (bitsPerChar / _bitsPerByte))
  if (bytes.length < needed) {
    throw new Error('Insufficient bytes. Need ' + needed)
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

const _bytesNeeded = (entropyBits, charSet) => {
  const bitsPerChar = charSet.getBitsPerChar()
  const count = Math.ceil(entropyBits / bitsPerChar)
  if (count <= 0) { return 0 }
  
  const bytesPerSlice = bitsPerChar / _bitsPerByte
  return Math.ceil(count * bytesPerSlice)
}

const _cryptoBytes = (entropyBits, charSet) => {
  const crypto = require('crypto')
  return Buffer.from(crypto.randomBytes(_bytesNeeded(entropyBits, charSet)))
}

const _randomBytes = (entropyBits, charSet) => {
  const byteCount = _bytesNeeded(entropyBits, charSet)
  const randCount = Math.ceil(byteCount / 6)

  const buffer = new Buffer(byteCount)
  var dataView = new DataView(new ArrayBuffer(_bitsPerByte))
  for (let rNum = 0; rNum < randCount; rNum++) {
    dataView.setFloat64(0, Math.random())
    for (let n = 0; n < 6; n++) {
      let fByteNum = _endianByteNum[n]
      let bByteNum = 6*rNum + n
      if (bByteNum < byteCount) {
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
