const crypto = require('crypto')

import CharSet from './charSet'
import lcm from './lcm'

const log2  = Math.log2
const log10 = Math.log10
const log2_10 = log2(10)

const bits = (total, risk) => {
  if (total == 0) { return 0 }

  let N = 0
  if (total < 10001) {
    N = log2(total) + log2(total-1) + (log2_10 * log10(risk)) - 1
  }
  else {
    const n = 2 * log10(total) + log10(risk)
    N = n * log2_10 - 1
  }
  return N
}

const bitsWithRiskPower = (total, rPower) => {
  if (total == 0) { return 0 }
  
  let N = 0
  if (total < 10001) {
    N = log2(total) + log2(total-1) + (log2_10 * rPower) - 1
  }
  else {
    const n = 2 * log10(total) + rPower
    N = n * log2_10 - 1
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
    N = n * log2_10 - 1
  }
  return N
}

const randomString = (bits, charSet) => {
  const bytes = cryptoBytes(bits, charSet)
  return randomStringWithBytes(bits, charSet, bytes)
}

const randomStringWithBytes = (bits, charSet, bytes) => {
  if (!CharSet.isValid(charSet)) {
    throw new Error('Invalid CharSet')
  }
  if (bits <= 0) { return '' }
  
  const count = Math.ceil(bits / charSet.entropyPerChar)
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
    ndxFn = ndx64
    break
  case CharSet.charSet32:
    chars = CharSet.charSet32.chars
    ndxFn = ndx32
    break
  case CharSet.charSet16:
    chars = CharSet.charSet16.chars
    ndxFn = ndx16
    break
  case CharSet.charSet8:
    chars = CharSet.charSet8.chars
    ndxFn = ndx8
    break
  case CharSet.charSet4:
    chars = CharSet.charSet4.chars
    ndxFn = ndx4
    break
  case CharSet.charSet2:
    chars = CharSet.charSet2.chars
    ndxFn = ndx2
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

const cryptoBytes = (entropy, charSet) => {
  return Buffer.from(crypto.randomBytes(bytesNeeded(entropy, charSet)))
}

const ndx64 = (chunk, slice, bytes) => {
  return ndxGen(chunk, slice, bytes, 6)
}

const ndx32 = (chunk, slice, bytes) => {
  return ndxGen(chunk, slice, bytes, 5)
}

const ndx16 = (chunk, slice, bytes) => {
  return ((bytes[chunk]<<(4*slice))&0xff)>>4
}
  
const ndx8 = (chunk, slice, bytes) => {
  return ndxGen(chunk, slice, bytes, 3)
}

const ndx4 = (chunk, slice, bytes) => {
  return ((bytes[chunk]<<(2*slice))&0xff)>>6
}

const ndx2 = (chunk, slice, bytes) => {
  return ((bytes[chunk]<<slice)&0xff)>>7
}

const ndxGen = (chunk, slice, bytes, bitsPerSlice) => {
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
