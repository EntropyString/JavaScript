const WeakMap = require('weak-map')

const { default: lcm } = require('./lcm')

const propMap = new WeakMap()

const BITS_PER_BYTE = 8

const genNdxFn = (bitsPerChar) => {
  // If BITS_PER_BYTEs is a multiple of bitsPerChar, we can slice off an integer number
  // of chars per byte.
  if (lcm(bitsPerChar, BITS_PER_BYTE) === BITS_PER_BYTE) {
    return (chunk, slice, bytes) => {
      const lShift = bitsPerChar
      const rShift = BITS_PER_BYTE - bitsPerChar
      return ((bytes[chunk] << (lShift * slice)) & 0xff) >> rShift
    }
  }
  // Otherwise, while slicing off bits per char, we will possibly straddle a couple
  // of bytes, so a bit more work is involved

  const slicesPerChunk = lcm(bitsPerChar, BITS_PER_BYTE) / BITS_PER_BYTE
  return (chunk, slice, bytes) => {
    const bNum = chunk * slicesPerChunk

    const offset = (slice * bitsPerChar) / BITS_PER_BYTE
    const lOffset = Math.floor(offset)
    const rOffset = Math.ceil(offset)

    const rShift = BITS_PER_BYTE - bitsPerChar
    const lShift = (slice * bitsPerChar) % BITS_PER_BYTE

    let ndx = ((bytes[bNum + lOffset] << lShift) & 0xff) >> rShift

    const r1Bits = (rOffset + 1) * BITS_PER_BYTE
    const s1Bits = (slice + 1) * bitsPerChar

    const rShiftIt = (r1Bits - s1Bits) % BITS_PER_BYTE
    if (rShift < rShiftIt) {
      ndx += bytes[bNum + rOffset] >> rShiftIt
    }
    return ndx
  }
}

export default class CharSet {
  constructor(chars) {
    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string')
    }
    const { length } = chars
    if (![2, 4, 8, 16, 32, 64].includes(length)) {
      throw new Error('Invalid char count: must be one of 2,4,8,16,32,64')
    }
    const bitsPerChar = Math.floor(Math.log2(length))
    // Ensure no repeated characters
    for (let i = 0; i < length; i += 1) {
      const c = chars.charAt(i)
      for (let j = i + 1; j < length; j += 1) {
        if (c === chars.charAt(j)) {
          throw new Error('Characters not unique')
        }
      }
    }
    const privProps = {
      chars,
      bitsPerChar,
      length,
      ndxFn: genNdxFn(bitsPerChar),
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

  bytesNeeded(bitLen) {
    const count = Math.ceil(bitLen / this.bitsPerChar())
    return Math.ceil((count * this.bitsPerChar()) / BITS_PER_BYTE)
  }

  // Aliases
  chars() { return this.getChars() }
  ndxFn() { return this.getNdxFn() }
  bitsPerChar() { return this.getBitsPerChar() }
}

