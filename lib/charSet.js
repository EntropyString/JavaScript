import lcm from './lcm'

class CharSet {
  constructor(chars) {
    this.chars = chars
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

const charSet64 =
      new CharSet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_")
const charSet32 =
      new CharSet("2346789bdfghjmnpqrtBDFGHJLMNPQRT")
const charSet16 =
      new CharSet("0123456789abcdef")
const charSet8 =
      new CharSet("01234567")
const charSet4 =
      new CharSet("ATCG")
const charSet2 =
      new CharSet("01")

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
