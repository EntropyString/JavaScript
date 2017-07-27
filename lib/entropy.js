import CharSet from './charSet'
import lcm from './lcm'

const _log2  = Math.log2
const _log10 = Math.log10
const _log2_10 = _log2(10)

const _endianByteNum = (() => {
  const buf32 = new Uint32Array(1)
  const buf8  = new Uint8Array(buf32.buffer)
  buf32[0] = 0xff
  return (buf8[0] === 0xff) ? [2,3,4,5,6,7] : [0,1,2,3,6,7]
})()

const bits = (total, risk) => {
  if (total == 0) { return 0 }

  let N = 0
  if (total < 10001) {
    N = _log2(total) + _log2(total-1) + (_log2_10 * _log10(risk)) - 1
  }
  else {
    const n = 2 * _log10(total) + _log10(risk)
    N = n * _log2_10 - 1
  }
  return N
}

const bitsWithRiskPower = (total, rPower) => {
  if (total == 0) { return 0 }
  
  let N = 0
  if (total < 10001) {
    N = _log2(total) + _log2(total-1) + (_log2_10 * rPower) - 1
  }
  else {
    const n = 2 * _log10(total) + rPower
    N = n * _log2_10 - 1
  }
  return N
}

const bitsWithPowers = (tPower, rPower) => {
  let N = 0
  if (tPower < 5) {
    return bitsWithRiskPower(Math.pow(10, tPower), rPower)
  }
  else {
    const n = 2 * tPower + rPower
    N = n * _log2_10 - 1
  }
  return N
}

const string = (entropy, charSet) => {
  return stringWithBytes(entropy, charSet, _cryptoBytes(entropy, charSet))
}

const stringRandom = (entropy, charSet) => {
  return stringWithBytes(entropy, charSet, _randomBytes(entropy, charSet))
}

const stringWithBytes = (entropy, charSet, bytes) => {
  if (!CharSet.isValid(charSet)) {
    throw new Error('Invalid CharSet')
  }
  if (entropy <= 0) { return '' }
  
  const count = Math.ceil(entropy / charSet.entropyPerChar)
  if (count <= 0) { return '' }

  const needed = Math.ceil(count * (charSet.entropyPerChar/8))
  if (bytes.length < needed) {
    throw new Error('Insufficient bytes')
  }
  
  const chunks   = Math.floor(count / charSet.charsPerChunk)
  const partials = count % charSet.charsPerChunk

  let string = ''
  for (let chunk = 0; chunk < chunks; chunk++) {
    for (let slice = 0; slice < charSet.charsPerChunk; slice++) {
      let ndx = charSet.ndxFn(chunk, slice, bytes)
      string += charSet.chars[ndx]
    }
  }
  for (let slice = 0; slice < partials; slice++) {
    let ndx = charSet.ndxFn(chunks, slice, bytes)
    string += charSet.chars[ndx]
  }
  return string
}

const bytesNeeded = (entropy, charSet) => {
  if (!CharSet.isValid(charSet)) { throw new Error('Invalid CharSet') }
  const count = Math.ceil(entropy / charSet.entropyPerChar)
  if (count <= 0) { return 0 }

  const bytesPerSlice = charSet.entropyPerChar / 8
  return Math.ceil(count * bytesPerSlice)
}

const _cryptoBytes = (entropy, charSet) => {
  const crypto = require('crypto')
  return Buffer.from(crypto.randomBytes(bytesNeeded(entropy, charSet)))
}

const _randomBytes = (entropy, charSet) => {
  const byteCount = bytesNeeded(entropy, charSet)
  const randCount = Math.ceil(byteCount / 6)
  
  const buffer = new Buffer(byteCount)
  var dataView = new DataView(new ArrayBuffer(8))
  for (let rNum = 0; rNum < randCount; rNum++) {
    dataView.setFloat64(0, Math.random())
    for (let n = 0; n < 6; n++) {
      let fByteNum = _endianByteNum[n]
      let bByteNum = 6*rNum + n
      _bufferByte(buffer, bByteNum, fByteNum, byteCount, dataView)
    }
  }
  return buffer
}

const _bufferByte = (buffer, bByte, nByte, byteCount, dataView) => {
  if (bByte < byteCount) {
    buffer[bByte] = dataView.getUint8(nByte)
  }
}

export default {
  bits                  : bits,
  bitsWithRiskPower     : bitsWithRiskPower,
  bitsWithPowers        : bitsWithPowers,
  string                : string,
  stringRandom          : stringRandom,
  stringWithBytes       : stringWithBytes,
  bytesNeeded           : bytesNeeded,

  charSet64: CharSet.charSet64,
  charSet32: CharSet.charSet32,
  charSet16: CharSet.charSet16,
  charSet8:  CharSet.charSet8,
  charSet4:  CharSet.charSet4,
  charSet2:  CharSet.charSet2
}
