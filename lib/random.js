import CharSet from './charSet'
import Entropy from './entropy'

const _bitsPerByte = 8

const sessionID = () => {
  return string(128, CharSet.base64)
}

const string = (entropyBits, charSet = CharSet.base32) => {
  return stringWithBytes(entropyBits, _cryptoBytes(entropyBits, charSet), charSet)
}

const stringRandom = (entropyBits, charSet = CharSet.base32) => {
  return stringWithBytes(entropyBits, _randomBytes(entropyBits, charSet), charSet)
}

const stringWithBytes = (entropyBits,  bytes, charSet = CharSet.base32) => {
  if (!CharSet.isValid(charSet)) {
    throw new Error('Invalid CharSet')
  }
  if (entropyBits <= 0) { return '' }

  const bitsPerChar = charSet.getBitsPerChar()
  const count = Math.ceil(entropyBits / bitsPerChar)
  if (count <= 0) { return '' }

  const needed = Math.ceil(count * (bitsPerChar / _bitsPerByte))
  if (bytes.length < needed) {
    throw new Error('Insufficient bytes')
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

const bytesNeeded = (entropyBits, charSet) => {
  if (!CharSet.isValid(charSet)) { throw new Error('Invalid CharSet') }

  const bitsPerChar = charSet.getBitsPerChar()
  const count = Math.ceil(entropyBits / bitsPerChar)
  if (count <= 0) { return 0 }

  const bytesPerSlice = bitsPerChar / _bitsPerByte
  return Math.ceil(count * bytesPerSlice)
}

const _cryptoBytes = (entropyBits, charSet) => {
  const crypto = require('crypto')
  return Buffer.from(crypto.randomBytes(bytesNeeded(entropyBits, charSet)))
}

const _randomBytes = (entropyBits, charSet) => {
  const byteCount = bytesNeeded(entropyBits, charSet)
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

module.exports = {
  sessionID,
  string,
  stringRandom,
  stringWithBytes,
  bytesNeeded,

  charSet64: CharSet.base64,
  charSet32: CharSet.base32,
  charSet16: CharSet.base16,
  charSet8:  CharSet.base8,
  charSet4:  CharSet.base4,
  charSet2:  CharSet.base2
}
