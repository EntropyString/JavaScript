import random from '../lib/random'
import CharSet from '../lib/charSet'
import entropy from '../lib/entropy'

import test from 'ava'

test('Char Set 64 Strings', t => {
  const charSet = CharSet.base64
  t.is(randomString( 6, charSet, [0xdd]), '3')
  t.is(randomString(12, charSet, [0x78, 0xfc]), 'eP')
  t.is(randomString(18, charSet, [0xc5, 0x6f, 0x21]), 'xW8')
  t.is(randomString(24, charSet, [0xc9, 0x68, 0xc7]), 'yWjH')
  t.is(randomString(30, charSet, [0xa5, 0x62, 0x20, 0x87]), 'pWIgh')
  t.is(randomString(36, charSet, [0x39, 0x51, 0xca, 0xcc, 0x8b]), 'OVHKzI')
  t.is(randomString(42, charSet, [0x83, 0x89, 0x00, 0xc7, 0xf4, 0x02]), 'g4kAx_Q')
  t.is(randomString(48, charSet, [0x51, 0xbc, 0xa8, 0xc7, 0xc9, 0x17]), 'Ubyox8kX')
  t.is(randomString(54, charSet, [0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52]), '0uPp2hmXU')
  t.is(randomString(60, charSet, [0xd9, 0x39, 0xc1, 0xaf, 0x1e, 0x2e, 0x69, 0x48]), '2TnBrx4uaU')
  t.is(randomString(66, charSet, [0x78, 0x3f, 0xfd, 0x93, 0xd1, 0x06, 0x90, 0x4b, 0xd6]), 'eD_9k9EGkEv')
  t.is(randomString(72, charSet, [0x9d, 0x99, 0x4e, 0xa5, 0xd2, 0x3f, 0x8c, 0x86, 0x80]), 'nZlOpdI_jIaA')
})

test('Char Set 32 Strings', t => {
  const charSet = CharSet.base32
  t.is(randomString( 5, charSet, [0xdd]), 'N')
  t.is(randomString(10, charSet, [0x78, 0xfc]), 'p6')
  t.is(randomString(15, charSet, [0x78, 0xfc]), 'p6R')
  t.is(randomString(20, charSet, [0xc5, 0x6f, 0x21]), 'JFHt')
  t.is(randomString(25, charSet, [0xa5, 0x62, 0x20, 0x87]), 'DFr43')
  t.is(randomString(30, charSet, [0xa5, 0x62, 0x20, 0x87]), 'DFr433')
  t.is(randomString(35, charSet, [0x39, 0x51, 0xca, 0xcc, 0x8b]), 'b8dPFB7')
  t.is(randomString(40, charSet, [0x39, 0x51, 0xca, 0xcc, 0x8b]), 'b8dPFB7h')
  t.is(randomString(45, charSet, [0x83, 0x89, 0x00, 0xc7, 0xf4, 0x02]), 'qn7q3rTD2')
  t.is(randomString(50, charSet, [0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52]), 'MhrRBGqLtQ')
  t.is(randomString(55, charSet, [0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52]), 'MhrRBGqLtQf')
})

test('Char Set 16 Strings', t => {
  const charSet = CharSet.base16
  t.is(randomString( 4, charSet, [0x9d]), '9')
  t.is(randomString( 8, charSet, [0xae]), 'ae')
  t.is(randomString(12, charSet, [0x01, 0xf2]), '01f')
  t.is(randomString(16, charSet, [0xc7, 0xc9]), 'c7c9')
  t.is(randomString(20, charSet, [0xc7, 0xc9, 0x00]), 'c7c90')
})

test('Char Set 8 Strings', t => {
  const charSet = CharSet.base8
  t.is(randomString( 3, charSet, [0x5a]), '2')
  t.is(randomString( 6, charSet, [0x5a]), '26')
  t.is(randomString( 9, charSet, [0x21, 0xa4]), '103')
  t.is(randomString(12, charSet, [0x21, 0xa4]), '1032')
  t.is(randomString(15, charSet, [0xda, 0x19]), '66414')
  t.is(randomString(18, charSet, [0xfd, 0x93, 0xd1]), '773117')
  t.is(randomString(21, charSet, [0xfd, 0x93, 0xd1]), '7731172')
  t.is(randomString(24, charSet, [0xfd, 0x93, 0xd1]), '77311721')
  t.is(randomString(27, charSet, [0xc7, 0xc9, 0x07, 0xc9]), '617444076')
  t.is(randomString(30, charSet, [0xc7, 0xc9, 0x07, 0xc9]), '6174440762')  
})

test('Char Set 4 Strings', t => {
  const charSet = CharSet.base4
  t.is(randomString( 2, charSet, [0x5a]), 'T')
  t.is(randomString( 4, charSet, [0x5a]), 'TT')
  t.is(randomString( 6, charSet, [0x93]), 'CTA')
  t.is(randomString( 8, charSet, [0x93]), 'CTAG')
  t.is(randomString(10, charSet, [0x20, 0xf1]), 'ACAAG')
  t.is(randomString(12, charSet, [0x20, 0xf1]), 'ACAAGG')
  t.is(randomString(14, charSet, [0x20, 0xf1]), 'ACAAGGA')
  t.is(randomString(16, charSet, [0x20, 0xf1]), 'ACAAGGAT')
})

test('Char Set 2 Strings', t => {
  const charSet = CharSet.base2
  t.is(randomString( 1, charSet, [0x27]), '0')
  t.is(randomString( 2, charSet, [0x27]), '00')
  t.is(randomString( 3, charSet, [0x27]), '001')
  t.is(randomString( 4, charSet, [0x27]), '0010')
  t.is(randomString( 5, charSet, [0x27]), '00100')
  t.is(randomString( 6, charSet, [0x27]), '001001')
  t.is(randomString( 7, charSet, [0x27]), '0010011')
  t.is(randomString( 8, charSet, [0x27]), '00100111')
  t.is(randomString( 9, charSet, [0xe3, 0xe9]), '111000111')
  t.is(randomString(16, charSet, [0xe3, 0xe9]), '1110001111101001')
})

test('Char Set 64 string lengths', t => {
  const charSet = CharSet.base64
  const fns = [randomStringLength, randomStringLengthNoCrypto]
  for (let i = 0; i < 2; i++) {
    t.is(fns[i](  5, charSet),  1)
    t.is(fns[i](  6, charSet),  1)
    t.is(fns[i](  7, charSet),  2)
    t.is(fns[i]( 18, charSet),  3)
    t.is(fns[i]( 50, charSet),  9)
    t.is(fns[i](122, charSet), 21)
    t.is(fns[i](128, charSet), 22)
    t.is(fns[i](132, charSet), 22)
  }
})

test('Char Set 32 string lengths', t => {
  const charSet = CharSet.base32
  const fns = [randomStringLength, randomStringLengthNoCrypto]
  for (let i = 0; i < 2; i++) {
    t.is(fns[i](  4, charSet),  1)
    t.is(fns[i](  5, charSet),  1)
    t.is(fns[i](  6, charSet),  2)
    t.is(fns[i]( 20, charSet),  4)
    t.is(fns[i]( 32, charSet),  7)
    t.is(fns[i](122, charSet), 25)
    t.is(fns[i](128, charSet), 26)
    t.is(fns[i](130, charSet), 26)
  }
})

test('Char Set 16 string lengths', t => {
  const charSet = CharSet.base16
  const fns = [randomStringLength, randomStringLengthNoCrypto]
  for (let i = 0; i < 2; i++) {
    t.is(fns[i](  3, charSet),  1)
    t.is(fns[i](  4, charSet),  1)
    t.is(fns[i](  5, charSet),  2)
    t.is(fns[i]( 14, charSet),  4)
    t.is(fns[i]( 40, charSet), 10)
    t.is(fns[i](122, charSet), 31)
    t.is(fns[i](128, charSet), 32)
  }
})

test('Char Set 8 string lengths', t => {
  const charSet = CharSet.base8
  const fns = [randomStringLength, randomStringLengthNoCrypto]
  for (let i = 0; i < 2; i++) {
    t.is(fns[i](  2, charSet),  1)
    t.is(fns[i](  3, charSet),  1)
    t.is(fns[i](  4, charSet),  2)
    t.is(fns[i]( 32, charSet), 11)
    t.is(fns[i]( 48, charSet), 16)
    t.is(fns[i](120, charSet), 40)
    t.is(fns[i](122, charSet), 41)
    t.is(fns[i](128, charSet), 43)
  }
    
})

test('Char Set 4 string lengths', t => {
  const charSet = CharSet.base4
  const fns = [randomStringLength, randomStringLengthNoCrypto]
  for (let i = 0; i < 2; i++) {
    t.is(fns[i](  1, charSet),  1)
    t.is(fns[i](  2, charSet),  1)
    t.is(fns[i](  3, charSet),  2)
    t.is(fns[i]( 32, charSet), 16)
    t.is(fns[i]( 48, charSet), 24)
    t.is(fns[i](122, charSet), 61)
    t.is(fns[i](128, charSet), 64)
  }
})

test('Char Set 2 string lengths', t => {
  const charSet = CharSet.base2
  const fns = [randomStringLength, randomStringLengthNoCrypto]
  for (let i = 0; i < 2; i++) {
    t.is(fns[i](  1, charSet),   1)
    t.is(fns[i](  2, charSet),   2)
    t.is(fns[i](  3, charSet),   3)
    t.is(fns[i]( 32, charSet),  32)
    t.is(fns[i]( 48, charSet),  48)
    t.is(fns[i](122, charSet), 122)
    t.is(fns[i](128, charSet), 128)
  }
})

test('Invalid bytes', t => {
  t.is(invalidBytes( 7, CharSet.base64, [1]), true)
  t.is(invalidBytes(13, CharSet.base64, [1,2]), true)
  t.is(invalidBytes(25, CharSet.base64, [1,2,3]), true)
  t.is(invalidBytes(31, CharSet.base64, [1,2,3,4]), true)
  
  t.is(invalidBytes( 6, CharSet.base32, [1]), true)
  t.is(invalidBytes(16, CharSet.base32, [1,2]), true)
  t.is(invalidBytes(21, CharSet.base32, [1,2,3]), true)
  t.is(invalidBytes(31, CharSet.base32, [1,2,3,4]), true)
  t.is(invalidBytes(41, CharSet.base32, [1,2,3,4,5]), true)
  t.is(invalidBytes(46, CharSet.base32, [1,2,3,4,5,6]), true)
  
  t.is(invalidBytes( 9, CharSet.base16, [1]), true)
  t.is(invalidBytes(17, CharSet.base16, [1,2]), true)
  
  t.is(invalidBytes( 7, CharSet.base8,  [1]), true)
  t.is(invalidBytes(16, CharSet.base8,  [1,2]), true)
  t.is(invalidBytes(25, CharSet.base8,  [1,2,3]), true)
  t.is(invalidBytes(31, CharSet.base8,  [1,2,3,4]), true)

  t.is(invalidBytes( 9, CharSet.base4,  [1]), true)
  t.is(invalidBytes(17, CharSet.base4,  [1,2]), true)
  
  t.is(invalidBytes( 9, CharSet.base2,  [1]), true)
  t.is(invalidBytes(17, CharSet.base2,  [1,2]), true)

  t.is(invalidBytes(32, CharSet.base32, [250, 200, 150, 100]), true)
})

test('Custom 64 chars', t => {
  let charSet = CharSet.base64
  try {
    charSet.use('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ9876543210_-')
    let bytes = new Uint8Array([0x9d, 0x99, 0x4e, 0xa5, 0xd2, 0x3f, 0x8c, 0x86, 0x80])
    let string = random.stringWithBytes(72, bytes, charSet)
                                               
    t.is(string, 'NzLoPDi-JiAa')
  }
  catch(error) {
    console.log('Error: ' + error)
    t.fail()
  }
})

test('Custom 32 chars', t => {
  let charSet = CharSet.base32
  try {
    charSet.use('2346789BDFGHJMNPQRTbdfghjlmnpqrt')
    let bytes = new Uint8Array([0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52])
    let string = random.stringWithBytes(55, bytes, charSet)
    t.is(string, 'mHRrbgQlTqF')
  }
  catch(error) {
    console.log('Error: ' + error)
    t.fail()
  }
})

test('Custom 16 chars', t => {
  let charSet = CharSet.base16
  try {
    charSet.use('0123456789ABCDEF')
    let string = random.stringWithBytes(20, new Uint8Array([0xc7, 0xc9, 0x00], charSet))
    t.is(string, 'C7C90')
  }
  catch(error) {
    console.log('Error: ' + error)
    t.fail()
  }
})

test('Custom 8 chars', t => {
  let charSet = CharSet.base8
  try {
    charSet.use('abcdefgh')
    let string = random.stringWithBytes(30, new Uint8Array([0xc7, 0xc9, 0x07, 0xc9]), charSet)
    t.is(string, 'gbheeeahgc')
  }
  catch(error) {
    console.log('Error: ' + error)
    t.fail()
  }
})

test('Custom 4 chars', t => {
  let charSet = CharSet.base4
  try {
    charSet.use('atcg')
    let string = random.stringWithBytes(16, new Uint8Array([0x20, 0xf1]), charSet)
    t.is(string, 'acaaggat')
  }
  catch(error) {
    console.log('Error: ' + error)
    t.fail()
  }
})

test('Custom 2 chars', t => {
  let charSet = CharSet.base2
  try {
    charSet.use('HT')
    let string = random.stringWithBytes(16, new Uint8Array([0xe3, 0xe9]),  charSet)
    t.is(string, 'TTTHHHTTTTTHTHHT')
  }
  catch(error) {
    console.log('Error: ' + error)
    t.fail()
  }
})

test('Invalid Char Set', t => {
  try {
    random.string(5, CharSet.base6)
    t.fail()
  }
  catch(error) {
    t.pass()
  }
})

test('No crypto', t => {
  let charSet = CharSet.base32
  t.is(randomStringLengthNoCrypto(5, charSet), 1)
  t.is(randomStringLengthNoCrypto(6, charSet), 2)
})

const randomString = (bits, charSet, arr) => {
  return random.stringWithBytes(bits, Buffer.from(arr), charSet)
}

const randomStringLength = (bits, charSet) => {
  return random.string(bits, charSet).length
}

const randomStringLengthNoCrypto = (bits, charSet) => {
  return random.stringRandom(bits, charSet).length
}

const invalidBytes = (bits, bytes, charSet) => {
  try {
    randomString(bits, bytes, charSet)
    return false
  }
  catch(error) {
    return true
  }
}
