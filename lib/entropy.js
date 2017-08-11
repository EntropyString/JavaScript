import CharSet from './charSet'
import lcm from './lcm'

const _log2  = Math.log2
const _log10 = Math.log10
const _log2_10 = _log2(10)
const _bitsPerByte = 8

const _endianByteNum = (() => {
  const buf32 = new Uint32Array(1)
  const buf8  = new Uint8Array(buf32.buffer)
  buf32[0] = 0xff
  return (buf8[0] === 0xff) ? [2,3,4,5,6,7] : [0,1,2,3,6,7]
})()

const _totalOf = (numStrings, log2Risk) => {
  if (numStrings == 0) { return 0 }

  let N
  if (numStrings < 10001) {
    N = _log2(numStrings) + _log2(numStrings-1)
  }
  else {
    N = 2 * _log2(numStrings)
  }
  return N + log2Risk - 1
}

const bits = (total, risk) => {
  if (total == 0) { return 0 }
  return _totalOf(total, _log2(risk))
}

const bitsWithRiskPower = (total, rPower) => {
  let log2Risk = _log2_10 * rPower
  return _totalOf(total, log2Risk)
}

const bitsWithPowers = (tPower, rPower) => {
  let N = 0
  if (tPower < 5) {
    return bitsWithRiskPower(Math.pow(10, tPower), rPower)
  }
  else {
    return (2 * tPower + rPower) * _log2_10 - 1
  }
}

const string = (entropyBits, charSet) => {
  return stringWithBytes(entropyBits, charSet, _cryptoBytes(entropyBits, charSet))
}

const stringRandom = (entropyBits, charSet) => {
  return stringWithBytes(entropyBits, charSet, _randomBytes(entropyBits, charSet))
}

const stringWithBytes = (entropyBits, charSet, bytes) => {
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

export default {
  bits,
  bitsWithRiskPower,
  bitsWithPowers,
  string,
  stringRandom,
  stringWithBytes,
  bytesNeeded,

  charSet64: CharSet.charSet64,
  charSet32: CharSet.charSet32,
  charSet16: CharSet.charSet16,
  charSet8:  CharSet.charSet8,
  charSet4:  CharSet.charSet4,
  charSet2:  CharSet.charSet2
}
