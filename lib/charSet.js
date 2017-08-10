import lcm from './lcm'

class CharSet {
  constructor(chars) {
    let bitsPerByte = 8
    
    this.chars = chars
    this.bitsPerChar = Math.floor(Math.log2(chars.length))
    if (this.bitsPerChar != Math.log2(chars.length)) {
      throw new Error('EntropyString only supports CharSets with a power of 2 characters')
    }
    this.ndxFn = this._ndxFn(this.bitsPerChar)
    this.charsPerChunk = lcm(this.bitsPerChar, bitsPerByte) / this.bitsPerChar
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

  _ndxFn(bitsPerChar) {
    let bitsPerByte = 8
    
    if (lcm(bitsPerChar, bitsPerByte) === bitsPerByte) {
      return function(chunk, slice, bytes) {
        let lShift = bitsPerChar
        let rShift = bitsPerByte - bitsPerChar
        return ((bytes[chunk]<<(lShift*slice))&0xff)>>rShift
      }
    }
    else {
      return function(chunk, slice, bytes) {
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
    }
  }
}

export default {
  charSet64: new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'),
  charSet32: new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT'),
  charSet16: new CharSet('0123456789abcdef'),
  charSet8:  new CharSet('01234567'),
  charSet4:  new CharSet('ATCG'),
  charSet2:  new CharSet('01'),
  isValid:   (charSet) => charSet instanceof CharSet
}
