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

const randomString = (entropy, charSet, crypto = true) => {
  const bytes = crypto ? _cryptoBytes(entropy, charSet) : _randomBytes(entropy, charSet)
  return randomStringWithBytes(entropy, charSet, bytes)
}

const randomStringWithBytes = (entropy, charSet, bytes) => {
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

  let chars, ndxFn
  switch (charSet) {
  case CharSet.charSet64:
    chars = CharSet.charSet64.chars
    ndxFn = _ndx64
    break
  case CharSet.charSet32:
    chars = CharSet.charSet32.chars
    ndxFn = _ndx32
    break
  case CharSet.charSet16:
    chars = CharSet.charSet16.chars
    ndxFn = _ndx16
    break
  case CharSet.charSet8:
    chars = CharSet.charSet8.chars
    ndxFn = _ndx8
    break
  case CharSet.charSet4:
    chars = CharSet.charSet4.chars
    ndxFn = _ndx4
    break
  case CharSet.charSet2:
    chars = CharSet.charSet2.chars
    ndxFn = _ndx2
    break
  default:
    break
  }

  let string = ''
  for (let chunk = 0; chunk < chunks; chunk++) {
    for (let slice = 0; slice < charSet.charsPerChunk; slice++) {
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

const _ndx64 = (chunk, slice, bytes) => {
  return _ndxGen(chunk, slice, bytes, 6)
}

const _ndx32 = (chunk, slice, bytes) => {
  return _ndxGen(chunk, slice, bytes, 5)
}

const _ndx16 = (chunk, slice, bytes) => {
  return ((bytes[chunk]<<(4*slice))&0xff)>>4
}
  
const _ndx8 = (chunk, slice, bytes) => {
  return _ndxGen(chunk, slice, bytes, 3)
}

const _ndx4 = (chunk, slice, bytes) => {
  return ((bytes[chunk]<<(2*slice))&0xff)>>6
}

const _ndx2 = (chunk, slice, bytes) => {
  return ((bytes[chunk]<<slice)&0xff)>>7
}

const _ndxGen = (chunk, slice, bytes, bitsPerSlice) => {
  let bitsPerByte = 8
  let slicesPerChunk = lcm(bitsPerSlice, bitsPerByte) / bitsPerByte
  
  let bNum = chunk * slicesPerChunk
  
  let rShift = bitsPerByte - bitsPerSlice

  let lOffset = Math.floor((slice*bitsPerSlice)/bitsPerByte)
  let lShift = (slice*bitsPerSlice) % bitsPerByte

  let ndx = ((bytes[bNum+lOffset]<<lShift)&0xff)>>rShift

  let rOffset = Math.ceil((slice*bitsPerSlice)/bitsPerByte)
  let rShiftIt = ((rOffset+1)*bitsPerByte - (slice+1)*bitsPerSlice) % bitsPerByte
  if (rShift < rShiftIt) {
    ndx += bytes[bNum+rOffset]>>rShiftIt
  }
  return ndx
}

export default {
  bits                  : bits,
  bitsWithRiskPower     : bitsWithRiskPower,
  bitsWithPowers        : bitsWithPowers,
  randomString          : randomString,
  randomStringWithBytes : randomStringWithBytes,
  bytesNeeded           : bytesNeeded,

  charSet64: CharSet.charSet64,
  charSet32: CharSet.charSet32,
  charSet16: CharSet.charSet16,
  charSet8:  CharSet.charSet8,
  charSet4:  CharSet.charSet4,
  charSet2:  CharSet.charSet2
}
