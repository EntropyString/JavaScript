import lcm from './lcm'
import WeakMap from 'weak-map'

var CharSet = (function() {
  const propMap = new WeakMap()

  function CharSet(chars) {
    const bitsPerChar = Math.floor(Math.log2(chars.length))
    if (bitsPerChar != Math.log2(chars.length)) {
      throw new Error('EntropyString only supports CharSets with a power of 2 characters')
    }
    const bitsPerByte = 8

    const privProps = {
      chars: chars,
      bitsPerChar: bitsPerChar,
      ndxFn: ndxFn(bitsPerChar),
      charsPerChunk: lcm(bitsPerChar, bitsPerByte) / bitsPerChar
    }
    propMap.set(this, privProps)
  }

  CharSet.prototype.getChars = function() {
    return propMap.get(this).chars
  }
  CharSet.prototype.getBitsPerChar = function() {
    return propMap.get(this).bitsPerChar
  }
  CharSet.prototype.getNdxFn = function() {
    return propMap.get(this).ndxFn
  }
  CharSet.prototype.getCharsPerChunk = function() {
    return propMap.get(this).charsPerChunk
  }

  CharSet.prototype.setChars = function(chars) {
    const len = chars.length
    // Ensure correct number of characters
    if (len != propMap.get(this).chars.length) {
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
    propMap.get(this).chars = chars
  }
  // Alias
  CharSet.prototype.use = CharSet.prototype.setChars

  const ndxFn = (bitsPerChar) => {
    let bitsPerByte = 8

    // If bitsPerBytes is a multiple of bitsPerChar, we can slice off an integer number
    // of chars per byte.
    if (lcm(bitsPerChar, bitsPerByte) === bitsPerByte) {
      return function(chunk, slice, bytes) {
        let lShift = bitsPerChar
        let rShift = bitsPerByte - bitsPerChar
        return ((bytes[chunk]<<(lShift*slice))&0xff)>>rShift
      }
    }
    // Otherwise, while slicing off bits per char, we will possibly straddle a couple
    // of bytes, so a bit more work is involved
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
  return CharSet
}())

export default {
  charSet64: new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'),
  charSet32: new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT'),
  charSet16: new CharSet('0123456789abcdef'),
  charSet8:  new CharSet('01234567'),
  charSet4:  new CharSet('ATCG'),
  charSet2:  new CharSet('01'),
  isValid:   (charSet) => charSet instanceof CharSet
}
