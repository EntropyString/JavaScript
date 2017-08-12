import test from 'ava'

import CharSet from '../lib/charSet';

test('char set 64', t => {
  const charSet = CharSet.base64
  const length = charSet.getChars().length
  t.is(length, 64)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 4)
})

test('char set 32', t => {
  const charSet = CharSet.base32
  const length = charSet.getChars().length
  t.is(length, 32)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})

test('char set 16', t => {
  const charSet = CharSet.base16
  const length = charSet.getChars().length
  t.is(length, 16)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 2)
})

test('char set 8', t => {
  const charSet = CharSet.base8
  const length = charSet.getChars().length
  t.is(length, 8)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})

test('char set 4', t => {
  const charSet = CharSet.base4
  const length = charSet.getChars().length
  t.is(length, 4)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 4)
})

test('char set 2', t => {
  const charSet = CharSet.base2
  const length = charSet.getChars().length
  t.is(length, 2)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})

test('Custom 64 chars', t => {
  let charSet = CharSet.base64
  t.is(invalidChars(charSet,
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ab'), true)
  t.is(invalidChars(charSet,
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)!@#$%^&*(+=0'), true)
  t.is(invalidChars(charSet,
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)!@#$%^&*(+'), true)
})

test('Custom 32 chars', t => {
  let charSet = CharSet.base32
  t.is(invalidChars(charSet, '01234567890123456789012345678901'),  true)
  t.is(invalidChars(charSet, '0123456789abcdefghijklmnopqrstu'),   true)
  t.is(invalidChars(charSet, '0123456789abcdefghijklmnopqrstuvw'), true)
})

test('Custom 16 chars', t => {
  let charSet = CharSet.base16
  t.is(invalidChars(charSet, '0123456789abcde0'),  true)
  t.is(invalidChars(charSet, '0123456789abcde'),   true)
  t.is(invalidChars(charSet, '0123456789abcdefg'), true)
})

test('Custom 8 chars', t => {
  let charSet = CharSet.base8
  t.is(invalidChars(charSet, 'abcdefga'),  true)
  t.is(invalidChars(charSet, 'abcdefg'),   true)
  t.is(invalidChars(charSet, 'abcdefghi'), true)
})

test('Custom 4 chars', t => {
  let charSet = CharSet.base4
  t.is(invalidChars(charSet, 'abcb'),  true)
  t.is(invalidChars(charSet, 'abc'),   true)
  t.is(invalidChars(charSet, 'abcde'), true)
})

test('Custom 2 chars', t => {
  let charSet = CharSet.base2
  t.is(invalidChars(charSet, 'TT'),  true)
  t.is(invalidChars(charSet, 'T'),   true)
  t.is(invalidChars(charSet, 'H20'), true)
})

const invalidChars = (charSet, chars) => {
  try {
    charSet.use(chars)
    return false
  }
  catch(error) {
    return true
  }
}
