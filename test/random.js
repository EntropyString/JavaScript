import Random from '../lib/random'
import CharSet, {charSet64, charSet32, charSet16, charSet8, charSet4, charSet2} from '../lib/charSet'

import test from 'ava'

test('Char Set Base 64 Strings', t => {
  let random = new Random(charSet64)
  t.is(random.stringWithBytes( 6, [0xdd]), '3')
  t.is(random.stringWithBytes(12, [0x78, 0xfc]), 'eP')
  t.is(random.stringWithBytes(18, [0xc5, 0x6f, 0x21]), 'xW8')
  t.is(random.stringWithBytes(24, [0xc9, 0x68, 0xc7]), 'yWjH')
  t.is(random.stringWithBytes(30, [0xa5, 0x62, 0x20, 0x87]), 'pWIgh')
  t.is(random.stringWithBytes(36, [0x39, 0x51, 0xca, 0xcc, 0x8b]), 'OVHKzI')
  t.is(random.stringWithBytes(42, [0x83, 0x89, 0x00, 0xc7, 0xf4, 0x02]), 'g4kAx_Q')
  t.is(random.stringWithBytes(48, [0x51, 0xbc, 0xa8, 0xc7, 0xc9, 0x17]), 'Ubyox8kX')
  t.is(random.stringWithBytes(54, [0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52]), '0uPp2hmXU')
  t.is(random.stringWithBytes(60, [0xd9, 0x39, 0xc1, 0xaf, 0x1e, 0x2e, 0x69, 0x48]), '2TnBrx4uaU')
  t.is(random.stringWithBytes(66, [0x78, 0x3f, 0xfd, 0x93, 0xd1, 0x06, 0x90, 0x4b, 0xd6]), 'eD_9k9EGkEv')
  t.is(random.stringWithBytes(72, [0x9d, 0x99, 0x4e, 0xa5, 0xd2, 0x3f, 0x8c, 0x86, 0x80]), 'nZlOpdI_jIaA')
})

test('Char Set Base 32 Strings', t => {
  let random = new Random(charSet32)
  t.is(random.stringWithBytes( 5, [0xdd]), 'N')
  t.is(random.stringWithBytes(10, [0x78, 0xfc]), 'p6')
  t.is(random.stringWithBytes(15, [0x78, 0xfc]), 'p6R')
  t.is(random.stringWithBytes(20, [0xc5, 0x6f, 0x21]), 'JFHt')
  t.is(random.stringWithBytes(25, [0xa5, 0x62, 0x20, 0x87]), 'DFr43')
  t.is(random.stringWithBytes(30, [0xa5, 0x62, 0x20, 0x87]), 'DFr433')
  t.is(random.stringWithBytes(35, [0x39, 0x51, 0xca, 0xcc, 0x8b]), 'b8dPFB7')
  t.is(random.stringWithBytes(40, [0x39, 0x51, 0xca, 0xcc, 0x8b]), 'b8dPFB7h')
  t.is(random.stringWithBytes(45, [0x83, 0x89, 0x00, 0xc7, 0xf4, 0x02]), 'qn7q3rTD2')
  t.is(random.stringWithBytes(50, [0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52]), 'MhrRBGqLtQ')
  t.is(random.stringWithBytes(55, [0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52]), 'MhrRBGqLtQf')
})

test('Char Set Base 16 Strings', t => {
  let random = new Random(charSet16)
  t.is(random.stringWithBytes( 4, [0x9d]), '9')
  t.is(random.stringWithBytes( 8, [0xae]), 'ae')
  t.is(random.stringWithBytes(12, [0x01, 0xf2]), '01f')
  t.is(random.stringWithBytes(16, [0xc7, 0xc9]), 'c7c9')
  t.is(random.stringWithBytes(20, [0xc7, 0xc9, 0x00]), 'c7c90')
})

test('Char Set Base 8 Strings', t => {
  let random = new Random(charSet8)
  t.is(random.stringWithBytes( 3, [0x5a]), '2')
  t.is(random.stringWithBytes( 6, [0x5a]), '26')
  t.is(random.stringWithBytes( 9, [0x21, 0xa4]), '103')
  t.is(random.stringWithBytes(12, [0x21, 0xa4]), '1032')
  t.is(random.stringWithBytes(15, [0xda, 0x19]), '66414')
  t.is(random.stringWithBytes(18, [0xfd, 0x93, 0xd1]), '773117')
  t.is(random.stringWithBytes(21, [0xfd, 0x93, 0xd1]), '7731172')
  t.is(random.stringWithBytes(24, [0xfd, 0x93, 0xd1]), '77311721')
  t.is(random.stringWithBytes(27, [0xc7, 0xc9, 0x07, 0xc9]), '617444076')
  t.is(random.stringWithBytes(30, [0xc7, 0xc9, 0x07, 0xc9]), '6174440762')  
})

test('Char Set Base 4 Strings', t => {
  let random = new Random(charSet4)
  t.is(random.stringWithBytes( 2, [0x5a]), 'T')
  t.is(random.stringWithBytes( 4, [0x5a]), 'TT')
  t.is(random.stringWithBytes( 6, [0x93]), 'CTA')
  t.is(random.stringWithBytes( 8, [0x93]), 'CTAG')
  t.is(random.stringWithBytes(10, [0x20, 0xf1]), 'ACAAG')
  t.is(random.stringWithBytes(12, [0x20, 0xf1]), 'ACAAGG')
  t.is(random.stringWithBytes(14, [0x20, 0xf1]), 'ACAAGGA')
  t.is(random.stringWithBytes(16, [0x20, 0xf1]), 'ACAAGGAT')
})

test('Char Set Base 2 Strings', t => {
  let random = new Random(charSet2)
  t.is(random.stringWithBytes( 1, [0x27]), '0')
  t.is(random.stringWithBytes( 2, [0x27]), '00')
  t.is(random.stringWithBytes( 3, [0x27]), '001')
  t.is(random.stringWithBytes( 4, [0x27]), '0010')
  t.is(random.stringWithBytes( 5, [0x27]), '00100')
  t.is(random.stringWithBytes( 6, [0x27]), '001001')
  t.is(random.stringWithBytes( 7, [0x27]), '0010011')
  t.is(random.stringWithBytes( 8, [0x27]), '00100111')
  t.is(random.stringWithBytes( 9, [0xe3, 0xe9]), '111000111')
  t.is(random.stringWithBytes(16, [0xe3, 0xe9]), '1110001111101001')
})

test('Char Set Strings', t => {
  let random = new Random()
  t.is(random.stringWithBytes(30, [0xa5, 0x62, 0x20, 0x87], charSet64), 'pWIgh')
  t.is(random.stringWithBytes(25, [0xa5, 0x62, 0x20, 0x87], charSet32), 'DFr43')
  t.is(random.stringWithBytes(16, [0xc7, 0xc9], charSet16), 'c7c9')
  t.is(random.stringWithBytes(24, [0xfd, 0x93, 0xd1], charSet8), '77311721')
  t.is(random.stringWithBytes(12, [0x20, 0xf1], charSet4), 'ACAAGG') 
  t.is(random.stringWithBytes( 6, [0x27], charSet2), '001001')
})

test('Small ID', t => {
  let random = new Random()
  t.is(random.smallID().length,           6)
  t.is(random.smallID(charSet64).length,  5)
  t.is(random.smallID(charSet32).length,  6)
  t.is(random.smallID(charSet16).length,  8)
  t.is(random.smallID(charSet8).length,  10)
  t.is(random.smallID(charSet4).length,  15)
  t.is(random.smallID(charSet2).length,  29)
})

test('Medium ID', t => {
  let random = new Random()
  t.is(random.mediumID().length,          14)
  t.is(random.mediumID(charSet64).length, 12)
  t.is(random.mediumID(charSet32).length, 14)
  t.is(random.mediumID(charSet16).length, 18)
  t.is(random.mediumID(charSet8).length,  23)
  t.is(random.mediumID(charSet4).length,  35)
  t.is(random.mediumID(charSet2).length,  69)
})

test('Large ID', t => {
  let random = new Random()
  t.is(random.largeID().length,          20)
  t.is(random.largeID(charSet64).length, 17)
  t.is(random.largeID(charSet32).length, 20)
  t.is(random.largeID(charSet16).length, 25)
  t.is(random.largeID(charSet8).length,  33)
  t.is(random.largeID(charSet4).length,  50)
  t.is(random.largeID(charSet2).length,  99)
})

test('Session ID', t => {
  let random = new Random()
  t.is(random.sessionID().length,           26)
  t.is(random.sessionID(charSet64).length,  22)
  t.is(random.sessionID(charSet32).length,  26)
  t.is(random.sessionID(charSet16).length,  32)
  t.is(random.sessionID(charSet8).length,   43)
  t.is(random.sessionID(charSet4).length,   64)
  t.is(random.sessionID(charSet2).length,  128)
})

test('Token', t => {
  let random = new Random()
  t.is(random.token().length,           52)
  t.is(random.token(charSet64).length,  43)
  t.is(random.token(charSet32).length,  52)
  t.is(random.token(charSet16).length,  64)
  t.is(random.token(charSet8).length,   86)
  t.is(random.token(charSet4).length,  128)
  t.is(random.token(charSet2).length,  256)
})

test('Custom 64 chars', t => {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ9876543210_-'
  let random = new Random(chars)

  let bytes = new Uint8Array([0x9d, 0x99, 0x4e, 0xa5, 0xd2, 0x3f, 0x8c, 0x86, 0x80])
  let string = random.stringWithBytes(72, bytes)
  t.is(string, 'NzLoPDi-JiAa')

  random = new Random()
  random.useChars(chars)
  string = random.stringWithBytes(72, bytes)
  t.is(string, 'NzLoPDi-JiAa')
})

test('Custom 32 chars', t => {
  let chars = '2346789BDFGHJMNPQRTbdfghjlmnpqrt'
  let random = new Random(chars)

  let bytes = new Uint8Array([0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52])
  let string = random.stringWithBytes(55, bytes)
  t.is(string, 'mHRrbgQlTqF')

  random = new Random()
  random.useChars(chars)
  string = random.stringWithBytes(55, bytes)
  t.is(string, 'mHRrbgQlTqF')
})

test('Custom 16 chars', t => {
  let chars = '0123456789ABCDEF'
  let random = new Random(chars)

  let bytes = new Uint8Array([0xc7, 0xc9, 0x00])
  let string = random.stringWithBytes(20, bytes)
  t.is(string, 'C7C90')

  random = new Random()
  random.useChars(chars)
  string = random.stringWithBytes(20, bytes)
  t.is(string, 'C7C90')
})

test('Custom 8 chars', t => {
  let chars = 'abcdefgh'
  let random = new Random(chars)

  let bytes = new Uint8Array([0xc7, 0xc9, 0x07, 0xc9])
  let string = random.stringWithBytes(30, bytes)
  t.is(string, 'gbheeeahgc')

  random = new Random()
  random.useChars(chars)
  string = random.stringWithBytes(30, bytes)
  t.is(string, 'gbheeeahgc')
})

test('Custom 4 chars', t => {
  let chars = 'atcg'
  let random = new Random(chars)

  let bytes = new Uint8Array([0x20, 0xf1])
  let string = random.stringWithBytes(16, bytes)
  t.is(string, 'acaaggat')

  random = new Random()
  random.useChars(chars)
  string = random.stringWithBytes(16, bytes)
  t.is(string, 'acaaggat')
})

test('Custom 2 chars', t => {
  let chars = 'HT'
  let random = new Random(chars)

  let bytes = new Uint8Array([0xe3, 0xe9])
  let string = random.stringWithBytes(16, bytes)
  t.is(string, 'TTTHHHTTTTTHTHHT')

  random = new Random()
  random.useChars(chars)
  string = random.stringWithBytes(16, bytes)
  t.is(string, 'TTTHHHTTTTTHTHHT')
})

test('Use Invalid Char Set', t => {
  try {
    let string = random.use(CharSet.base6)
    t.fail()
  }
  catch(error) {
    t.pass()
  }
})

test('Invalid chars', t => {
  let error = t.throws(() => {
    new Random('123')
  }, Error)
  t.regex(error.message, /Invalid.*count/)

  let random = new Random()
  error = t.throws(() => {
    random.useChars('123')
  }, Error)
  t.regex(error.message, /Invalid.*count/)
})

test('Invalid CharSet', t => {
  let error = t.throws(() => {
    new Random(false)
  }, Error)
  t.regex(error.message, /Invalid arg/)
})

test('Invalid bytes', t => {
  let random
  let regex = /Insufficient/

  random = new Random(charSet64)
  t.regex(invalidBytes(random, 7,  [1]), regex)
  t.regex(invalidBytes(random, 13, [1,2]), regex)
  t.regex(invalidBytes(random, 25, [1,2,3]), regex)
  t.regex(invalidBytes(random, 31, [1,2,3,4]), regex)
  
  random = new Random(charSet32)
  t.regex(invalidBytes(random,  6, [1]), regex)
  t.regex(invalidBytes(random, 16, [1,2]), regex)
  t.regex(invalidBytes(random, 21, [1,2,3]), regex)
  t.regex(invalidBytes(random, 31, [1,2,3,4]), regex)
  t.regex(invalidBytes(random, 32, [1,2,3,4]), regex)
  t.regex(invalidBytes(random, 41, [1,2,3,4,5]), regex)
  t.regex(invalidBytes(random, 46, [1,2,3,4,5,6]), regex)
  
  random = new Random(charSet16)
  t.regex(invalidBytes(random,  9, [1]), regex)
  t.regex(invalidBytes(random, 17, [1,2]), regex)
  
  random = new Random(charSet8)
  t.regex(invalidBytes(random,  7, [1]), regex)
  t.regex(invalidBytes(random, 16, [1,2]), regex)
  t.regex(invalidBytes(random, 25, [1,2,3]), regex)
  t.regex(invalidBytes(random, 31, [1,2,3,4]), regex)

  random = new Random(charSet4)
  t.regex(invalidBytes(random,  9, [1]), regex)
  t.regex(invalidBytes(random, 17, [1,2]), regex)
  
  random = new Random(charSet2)
  t.regex(invalidBytes(random,  9, [1]), regex)
  t.regex(invalidBytes(random, 17, [1,2]), regex)
})

//
// Convenience functions
//
const invalidBytes = (random, bits, bytes) => {
  try {
    random.stringWithBytes(bits, bytes)
    return 'false'
  }
  catch(error) {
    return error.message
  }
}
