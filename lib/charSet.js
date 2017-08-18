import lcm from './lcm'
import WeakMap from 'weak-map'

const propMap = new WeakMap()

const BITS_PER_BYTE = 8

export default class CharSet {
  constructor(chars) {
    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string')
    }
    const length = chars.length
    if (![2,4,8,16,32,64].includes(length)) {
      throw new Error('Invalid char count: must be one of 2,4,8,16,32,64')
    }
    const bitsPerChar = Math.floor(Math.log2(length))
    // Ensure no repeated characters
    for (let i = 0; i < length; i++) {
      let c = chars.charAt(i)
      for (let j = i+1; j < length; j++) {
        if (c === chars.charAt(j)) {
          throw new Error('Characters not unique')
        }
      }
    }
    const privProps = {
      chars,
      bitsPerChar,
      length,
      ndxFn: _ndxFn(bitsPerChar),
      charsPerChunk: lcm(bitsPerChar, BITS_PER_BYTE) / bitsPerChar
    }
    propMap.set(this, privProps)
  }

  getChars() {
    return propMap.get(this).chars
  }

  getBitsPerChar() {
    return propMap.get(this).bitsPerChar
  }

  getNdxFn() {
    return propMap.get(this).ndxFn
  }

  getCharsPerChunk() {
    return propMap.get(this).charsPerChunk
  }

  length() {
    return propMap.get(this).length
  }

  getNdxFn() {
    return propMap.get(this).ndxFn
  }

  bytesNeeded(entropyBits) {
    const count = Math.ceil(entropyBits / this.bitsPerChar())
    return Math.ceil(count * this.bitsPerChar() / BITS_PER_BYTE)
  }

  // Aliases
  chars() { return this.getChars() }
  ndxFn() { return this.getNdxFn() }
  bitsPerChar() { return this.getBitsPerChar() }
}

const _ndxFn = (bitsPerChar) => {
  // If BITS_PER_BYTEs is a multiple of bitsPerChar, we can slice off an integer number
  // of chars per byte.
  if (lcm(bitsPerChar, BITS_PER_BYTE) === BITS_PER_BYTE) {
    return function(chunk, slice, bytes) {
      let lShift = bitsPerChar
      let rShift = BITS_PER_BYTE - bitsPerChar
      return ((bytes[chunk]<<(lShift*slice))&0xff)>>rShift
    }
  }
  // Otherwise, while slicing off bits per char, we will possibly straddle a couple
  // of bytes, so a bit more work is involved
  else {
    return function(chunk, slice, bytes) {
      let slicesPerChunk = lcm(bitsPerChar, BITS_PER_BYTE) / BITS_PER_BYTE
      let bNum = chunk * slicesPerChunk

      let offset = (slice*bitsPerChar)/BITS_PER_BYTE
      let lOffset = Math.floor(offset)
      let rOffset = Math.ceil(offset)

      let rShift = BITS_PER_BYTE - bitsPerChar
      let lShift = (slice*bitsPerChar) % BITS_PER_BYTE

      let ndx = ((bytes[bNum+lOffset]<<lShift)&0xff)>>rShift

      let rShiftIt = ((rOffset+1)*BITS_PER_BYTE - (slice+1)*bitsPerChar) % BITS_PER_BYTE
      if (rShift < rShiftIt) {
        ndx += bytes[bNum+rOffset]>>rShiftIt
      }
      return ndx
    }
  }
}

export let charSet64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
export let charSet32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT')
export let charSet16 = new CharSet('0123456789abcdef')
export let charSet8  = new CharSet('01234567')
export let charSet4  = new CharSet('ATCG')
export let charSet2  = new CharSet('01')
