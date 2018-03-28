const CharSet = require('../lib/charset').default
const {
  charset64, charset32, charset16, charset8, charset4, charset2
} = require('../lib/charset')

const test = require('ava')

test('char set 64', (t) => {
  const charset = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
  const { length } = charset.getChars()
  t.is(length, 64)
  const bitsPerChar = Math.log2(length)
  t.is(charset.getBitsPerChar(), bitsPerChar)
  t.is(charset.getCharsPerChunk(), 4)
})

test('char set 32', (t) => {
  const charset = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT')
  const { length } = charset.getChars()
  t.is(length, 32)
  const bitsPerChar = Math.log2(length)
  t.is(charset.getBitsPerChar(), bitsPerChar)
  t.is(charset.getCharsPerChunk(), 8)
})

test('char set 16', (t) => {
  const charset = new CharSet('0123456789abcdef')
  const { length } = charset.getChars()
  t.is(length, 16)
  const bitsPerChar = Math.log2(length)
  t.is(charset.getBitsPerChar(), bitsPerChar)
  t.is(charset.getCharsPerChunk(), 2)
})

test('char set 8', (t) => {
  const charset = new CharSet('01234567')
  const { length } = charset.getChars()
  t.is(length, 8)
  const bitsPerChar = Math.log2(length)
  t.is(charset.getBitsPerChar(), bitsPerChar)
  t.is(charset.getCharsPerChunk(), 8)
})

test('char set 4', (t) => {
  const charset = new CharSet('ATCG')
  const { length } = charset.getChars()
  t.is(length, 4)
  const bitsPerChar = Math.log2(length)
  t.is(charset.getBitsPerChar(), bitsPerChar)
  t.is(charset.getCharsPerChunk(), 4)
})

test('char set 2', (t) => {
  const charset = new CharSet('01')
  const { length } = charset.getChars()
  t.is(length, 2)
  const bitsPerChar = Math.log2(length)
  t.is(charset.getBitsPerChar(), bitsPerChar)
  t.is(charset.getCharsPerChunk(), 8)
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
  const doTest = (charset, bits) => {
    const bytesNeeded = charset.bytesNeeded(bits)
    const atLeast = Math.ceil(bits / BITS_PER_BYTE)
    t.true(atLeast <= bytesNeeded, `CharSet: ${charset.chars()}, Bits ${bits}`)
    const atMost = atLeast + 1
    t.true(bytesNeeded <= atMost, `CharSet: ${charset.chars()}, Bits ${bits}`)
  }

  const charsets = [charset64, charset32, charset16, charset8, charset4, charset2]
  charsets.forEach((charset) => {
    for (let bits = 0; bits <= 10; bits += 1) {
      doTest(charset, bits)
    }
    for (let bits = 12; bits <= 132; bits += 5) {
      doTest(charset, bits)
    }
  })
})
