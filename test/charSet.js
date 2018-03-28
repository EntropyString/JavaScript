const CharSet = require('../lib/charSet').default
const {
  charSet64, charSet32, charSet16, charSet8, charSet4, charSet2
} = require('../lib/charSet')

const test = require('ava')

test('char set 64', (t) => {
  const charSet = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
  const { length } = charSet.getChars()
  t.is(length, 64)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 4)
})

test('char set 32', (t) => {
  const charSet = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT')
  const { length } = charSet.getChars()
  t.is(length, 32)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})

test('char set 16', (t) => {
  const charSet = new CharSet('0123456789abcdef')
  const { length } = charSet.getChars()
  t.is(length, 16)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 2)
})

test('char set 8', (t) => {
  const charSet = new CharSet('01234567')
  const { length } = charSet.getChars()
  t.is(length, 8)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})

test('char set 4', (t) => {
  const charSet = new CharSet('ATCG')
  const { length } = charSet.getChars()
  t.is(length, 4)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 4)
})

test('char set 2', (t) => {
  const charSet = new CharSet('01')
  const { length } = charSet.getChars()
  t.is(length, 2)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})

test('Custom chars: 64', (t) => {
  let error = t.throws(() => {
    const invalid = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ab')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    const invalid = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)!@#$%^&*(+=0')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    const invalid = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)!@#$%^&*(+')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Custom chars: 32', (t) => {
  let error = t.throws(() => {
    const invalid = new CharSet('01234567890123456789012345678901')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    const invalid = new CharSet('0123456789abcdefghijklmnopqrstu')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    const invalid = new CharSet('0123456789abcdefghijklmnopqrstuvw')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Custom chars: 16', (t) => {
  let error = t.throws(() => {
    const invalid = new CharSet('0123456789abcde0')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    const invalid = new CharSet('0123456789abcde')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    const invalid = new CharSet('0123456789abcdefg')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Custom chars: 8', (t) => {
  let error = t.throws(() => {
    const invalid = new CharSet('abcdefga')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    const invalid = new CharSet('abcdefg')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    const invalid = new CharSet('abcdefghi')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Custom chars: 4', (t) => {
  let error = t.throws(() => {
    const invalid = new CharSet('abbc')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    const invalid = new CharSet('abc')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    const invalid = new CharSet('abcde')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Custom chars: 2', (t) => {
  let error = t.throws(() => {
    const invalid = new CharSet('TT')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    const invalid = new CharSet('T')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    const invalid = new CharSet('H20')
    t.fail('variable \'invalid\' should not exist', invalid)
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Bytes needed', (t) => {
  const BITS_PER_BYTE = 8
  const doTest = (charSet, bits) => {
    const bytesNeeded = charSet.bytesNeeded(bits)
    const atLeast = Math.ceil(bits / BITS_PER_BYTE)
    t.true(atLeast <= bytesNeeded, `CharSet: ${charSet.chars()}, Bits ${bits}`)
    const atMost = atLeast + 1
    t.true(bytesNeeded <= atMost, `CharSet: ${charSet.chars()}, Bits ${bits}`)
  }

  const charSets = [charSet64, charSet32, charSet16, charSet8, charSet4, charSet2]
  charSets.forEach((charSet) => {
    for (let bits = 0; bits <= 10; bits += 1) {
      doTest(charSet, bits)
    }
    for (let bits = 12; bits <= 132; bits += 5) {
      doTest(charSet, bits)
    }
  })
})
