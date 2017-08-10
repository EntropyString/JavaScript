import lcm from './lcm'

class CharSet {
  constructor(chars, ndxFn) {
    this.chars = chars
    this.ndxFn = ndxFn
    this.bitsPerChar = Math.floor(Math.log2(chars.length))
    if (this.bitsPerChar != Math.log2(chars.length)) {
      throw new Error('EntropyString only supports CharSets with a power of 2 characters')
    }
    this.charsPerChunk = lcm(this.bitsPerChar, 8) / this.bitsPerChar
  }

  use(chars) {
    const len = chars.length
    // Ensure correct number of characters
    if (len != this.chars.length) {
      throw new Error('Invalid character count')
    }
    // Ensure no repeated characters
    for (let i = 0; i < len; i++) {
      let c = chars.charAt(i)
      for (let j = i+1; j < len; j++) {
        if (c === chars.charAt(j)) {
          throw new Error('Characters not unique')
        }
      }
    }
    this.chars = chars
  }
}

const _ndx64 = (chunk, slice, bytes) => {
  return _ndxGen(chunk, slice, bytes, 6)
}

const _ndx32 = (chunk, slice, bytes) => {
  return _ndxGen(chunk, slice, bytes, 5)
}

const _ndx16 = (chunk, slice, bytes) => {
  return _ndxDiv(chunk, slice, bytes, 4)
}

const _ndx8 = (chunk, slice, bytes) => {
  return _ndxGen(chunk, slice, bytes, 3)
}

const _ndx4 = (chunk, slice, bytes) => {
  return _ndxDiv(chunk, slice, bytes, 2)
}

const _ndx2 = (chunk, slice, bytes) => {
  return _ndxDiv(chunk, slice, bytes, 1)
}

const _ndxGen = (chunk, slice, bytes, bitsPerChar) => {
  let bitsPerByte = 8
  let slicesPerChunk = lcm(bitsPerChar, bitsPerByte) / bitsPerByte
  let bNum = chunk * slicesPerChunk

  let rShift = bitsPerByte - bitsPerChar
  let lOffset = Math.floor((slice*bitsPerChar)/bitsPerByte)
  let lShift = (slice*bitsPerChar) % bitsPerByte

  let ndx = ((bytes[bNum+lOffset]<<lShift)&0xff)>>rShift

  let rOffset = Math.ceil((slice*bitsPerChar)/bitsPerByte)
  let rShiftIt = ((rOffset+1)*bitsPerByte - (slice+1)*bitsPerChar) % bitsPerByte
  if (rShift < rShiftIt) {
    ndx += bytes[bNum+rOffset]>>rShiftIt
  }
  return ndx
}

const _ndxDiv = (chunk, slice, bytes, bitsPerChar) => {
  let lShift = bitsPerChar
  let rShift = 8 - bitsPerChar
  return ((bytes[chunk]<<(lShift*slice))&0xff)>>rShift
}

export default {
  charSet64: new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_', _ndx64),
  charSet32: new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT', _ndx32),
  charSet16: new CharSet('0123456789abcdef', _ndx16),
  charSet8:  new CharSet('01234567', _ndx8),
  charSet4:  new CharSet('ATCG', _ndx4),
  charSet2:  new CharSet('01', _ndx2),
  isValid:   (charSet) => charSet instanceof CharSet
}
