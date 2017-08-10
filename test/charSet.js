import test from 'ava'

import CharSet from '../lib/charSet';

test('char set 64', t => {
  const charSet = CharSet.charSet64
  const length = charSet.getChars().length
  t.is(length, 64)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 4)
})

test('char set 32', t => {
  const charSet = CharSet.charSet32
  const length = charSet.getChars().length
  t.is(length, 32)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})

test('char set 16', t => {
  const charSet = CharSet.charSet16
  const length = charSet.getChars().length
  t.is(length, 16)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 2)
})

test('char set 8', t => {
  const charSet = CharSet.charSet8
  const length = charSet.getChars().length
  t.is(length, 8)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})

test('char set 4', t => {
  const charSet = CharSet.charSet4
  const length = charSet.getChars().length
  t.is(length, 4)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 4)
})

test('char set 2', t => {
  const charSet = CharSet.charSet2
  const length = charSet.getChars().length
  t.is(length, 2)
  const bitsPerChar = Math.log2(length)
  t.is(charSet.getBitsPerChar(), bitsPerChar)
  t.is(charSet.getCharsPerChunk(), 8)
})
