import lcm from './lcm'

class CharSet {
  constructor(chars, ndxFn) {
    this.chars = chars
    this.ndxFn = ndxFn
    this.len = chars.length
    this.entropyPerChar = Math.floor(Math.log2(this.len))

    if (this.entropyPerChar != Math.log2(this.len)) {
      throw new Error('EntropyString only supports CharSets with a power of 2 characters')
    }
    
    this.charsPerChunk = lcm(this.entropyPerChar, 8) / this.entropyPerChar
  }

  use(chars) {
    const len = chars.length
    // Ensure correct number of characters
    if (len != this.len) {
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

const charSet64 =
      new CharSet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", _ndx64)
const charSet32 =
      new CharSet("2346789bdfghjmnpqrtBDFGHJLMNPQRT", _ndx32)
const charSet16 =
      new CharSet("0123456789abcdef", _ndx16)
const charSet8 =
      new CharSet("01234567", _ndx8)
const charSet4 =
      new CharSet("ATCG", _ndx4)
const charSet2 =
      new CharSet("01", _ndx2)

const isValid = (charSet) => {
  return charSet instanceof CharSet
}

export default {
  charSet64: charSet64,
  charSet32: charSet32,
  charSet16: charSet16,
  charSet8:  charSet8,
  charSet4:  charSet4,
  charSet2:  charSet2,
  isValid:   isValid
}
