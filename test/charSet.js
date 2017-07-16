import test from 'ava'

import CharSet from '../lib/charSet';

test('char set 64', t => {
  const charSet = CharSet.charSet64
  t.is(charSet.chars.length, 64)
  const entropyPerChar = Math.log2(charSet.chars.length)
  t.is(charSet.entropyPerChar, entropyPerChar)
  t.is(charSet.charsPerChunk, 4)
})

test('char set 32', t => {
  const charSet = CharSet.charSet32
  t.is(charSet.chars.length, 32)
  const entropyPerChar = Math.log2(charSet.chars.length)
  t.is(charSet.entropyPerChar, entropyPerChar)
  t.is(charSet.charsPerChunk, 8)
})

test('char set 16', t => {
  const charSet = CharSet.charSet16
  t.is(charSet.chars.length, 16)
  const entropyPerChar = Math.log2(charSet.chars.length)
  t.is(charSet.entropyPerChar, entropyPerChar)
  t.is(charSet.charsPerChunk, 2)
})

test('char set 8', t => {
  const charSet = CharSet.charSet8
  t.is(charSet.chars.length, 8)
  const entropyPerChar = Math.log2(charSet.chars.length)
  t.is(charSet.entropyPerChar, entropyPerChar)
  t.is(charSet.charsPerChunk, 8)
})

test('char set 4', t => {
  const charSet = CharSet.charSet4
  t.is(charSet.chars.length, 4)
  const entropyPerChar = Math.log2(charSet.chars.length)
  t.is(charSet.entropyPerChar, entropyPerChar)
  t.is(charSet.charsPerChunk, 4)
})

test('char set 2', t => {
  const charSet = CharSet.charSet2
  t.is(charSet.chars.length, 2)
  const entropyPerChar = Math.log2(charSet.chars.length)
  t.is(charSet.entropyPerChar, entropyPerChar)
  t.is(charSet.charsPerChunk, 8)
})

