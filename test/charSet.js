import test from 'ava'

import CharSet, {charSet64, charSet32, charSet16, charSet8, charSet4, charSet2} from '../lib/charSet'

test.beforeEach('Create CharSets', t => {
  t.context.charSet64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
  t.context.charSet32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT')
  t.context.charSet16 = new CharSet('0123456789abcdef')
  t.context.charSet8  = new CharSet('01234567')
  t.context.charSet4  = new CharSet('ATCG')
  t.context.charSet2  = new CharSet('01')
})

test('char set 64', t => {
  const charSet = t.context.charSet64
  const length = charSet.getChars().length
  t.is(length, 64)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 4)
})

test('char set 32', t => {
  const charSet = t.context.charSet32
  const length = charSet.getChars().length
  t.is(length, 32)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})

test('char set 16', t => {
  const charSet = t.context.charSet16
  const length = charSet.getChars().length
  t.is(length, 16)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 2)
})

test('char set 8', t => {
  const charSet = t.context.charSet8
  const length = charSet.getChars().length
  t.is(length, 8)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})

test('char set 4', t => {
  const charSet = t.context.charSet4
  const length = charSet.getChars().length
  t.is(length, 4)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 4)
})

test('char set 2', t => {
  const charSet = t.context.charSet2
  const length = charSet.getChars().length
  t.is(length, 2)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})

test('Custom chars: 64', t => {
  let error = t.throws(() => {
    new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ab')
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)!@#$%^&*(+=0')
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)!@#$%^&*(+')
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Custom chars: 32', t => {
  let error = t.throws(() => {
    new CharSet('01234567890123456789012345678901')
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    new CharSet('0123456789abcdefghijklmnopqrstu')
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    new CharSet('0123456789abcdefghijklmnopqrstuvw')
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Custom chars: 16', t => {
  let error = t.throws(() => {
    new CharSet('0123456789abcde0')
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    new CharSet('0123456789abcde')
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    new CharSet('0123456789abcdefg')
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Custom chars: 8', t => {
  let error = t.throws(() => {
    new CharSet('abcdefga')
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    new CharSet('abcdefg')
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    new CharSet('abcdefghi')
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Custom chars: 4', t => {
  let error = t.throws(() => {
    new CharSet('abbc')
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    new CharSet('abc')
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    new CharSet('abcde')
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Custom chars: 2', t => {
  let error = t.throws(() => {
    new CharSet('TT')
  }, Error)
  t.regex(error.message, /.*unique/)

  error = t.throws(() => {
    new CharSet('T')
  }, Error)
  t.regex(error.message, /.*count/)

  error = t.throws(() => {
    new CharSet('H20')
  }, Error)
  t.regex(error.message, /.*count/)
})

test('Bytes needed', t => {
  let BITS_PER_BYTE = 8
  let doTest = (charSet, bits) => {
    let bytesNeeded = charSet.bytesNeeded(bits)
    let atLeast = Math.ceil(bits/BITS_PER_BYTE)
    t.true(atLeast <= bytesNeeded, 'CharSet: ' + charSet.chars() + ', Bits ' + bits)
    let atMost = atLeast + 1
    t.true(bytesNeeded <= atMost, 'CharSet: ' + charSet.chars() + ', Bits ' + bits)
  }
  
  let charSets = [charSet64, charSet32, charSet16, charSet8, charSet4, charSet2]
  charSets.forEach( (charSet) => {
    for (let bits = 0; bits <= 10; bits++) {
      doTest(charSet, bits)
    }
    for (let bits = 12; bits <= 132; bits += 5) {
      doTest(charSet, bits)
    }
  })
})
