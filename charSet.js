const BITS_PER_BYTE = 8
const {
  abs, ceil, floor, log2
} = Math

const gcd = (a, b) => {
  let la = a
  let lb = b
  while (lb !== 0) {
    [la, lb] = [lb, la % lb]
  }
  return abs(la)
}
const lcm = (a, b) => (a / gcd(a, b)) * b

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

  // Otherwise, while slicing off bits per char, we can possibly straddle two
  // of bytes, so a more work is involved
  const slicesPerChunk = lcm(bitsPerChar, BITS_PER_BYTE) / BITS_PER_BYTE
  return (chunk, slice, bytes) => {
    const bNum = chunk * slicesPerChunk

    const offset = (slice * bitsPerChar) / BITS_PER_BYTE
    const lOffset = floor(offset)
    const rOffset = ceil(offset)

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

class CharSet {
  constructor(chars) {
    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string')
    }

    const { length } = chars
    if (![2, 4, 8, 16, 32, 64].includes(length)) {
      throw new Error('Invalid char count: must be one of 2,4,8,16,32,64')
    }

    // Ensure no repeated characters
    for (let i = 0; i < length; i += 1) {
      const c = chars.charAt(i)
      for (let j = i + 1; j < length; j += 1) {
        if (c === chars.charAt(j)) {
          throw new Error('Characters not unique')
        }
      }
    }

    this.chars = chars
    this.bitsPerChar = floor(log2(length))
    this.length = length
    this.ndxFn = genNdxFn(this.bitsPerChar)
    this.charsPerChunk = lcm(this.bitsPerChar, BITS_PER_BYTE) / this.bitsPerChar
  }

  bytesNeeded(bitLen) {
    const count = ceil(bitLen / this.bitsPerChar)
    return ceil((count * this.bitsPerChar) / BITS_PER_BYTE)
  }
}

module.exports = {
  CharSet
}
