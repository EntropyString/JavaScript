const test = require('ava')

const {
  default: Entropy,
  charset64, charset32, charset16, charset8, charset4, charset2
} = require('../lib/entropy')

const { default: CharSet } = require('../lib/charset')

const { round } = Math

const rbits = (t, r) => round(Entropy.bits(t, r))

test('Entropy constructor', (t) => {
  let entropy = new Entropy()
  t.is(entropy.bits(), 128)
  t.is(entropy.chars(), charset32.chars())
  t.is(entropy.bytesNeeded(), 17)

  entropy = new Entropy({ bits: 32 })
  t.is(entropy.bits(), 32)
  t.is(entropy.chars(), charset32.chars())
  t.is(entropy.bytesNeeded(), 5)

  entropy = new Entropy({ total: 1000, risk: 1e9 })
  t.is(entropy.bits(), 49)
  t.is(entropy.chars(), charset32.chars())
  t.is(entropy.bytesNeeded(), 7)

  entropy = new Entropy({ bits: 32, charset: charset16 })
  t.is(entropy.bits(), 32)
  t.is(entropy.chars(), charset16.chars())
  t.is(entropy.bytesNeeded(), 4)

  entropy = new Entropy({ total: 1e6, risk: 10000000, charset: charset16 })
  t.is(entropy.bits(), 62)
  t.is(entropy.chars(), charset16.chars())
  t.is(entropy.bytesNeeded(), 8)
})

test('Zero entropy', (t) => {
  t.is(Entropy.bits(0, 10), 0)

  const entropy = new Entropy()
  t.is(entropy.string(0), '')
})

test('Bits using total, risk', (t) => {
  t.is(rbits(10, 1000), 15)
  t.is(rbits(10, 10000), 19)
  t.is(rbits(10, 100000), 22)

  t.is(rbits(100, 1000), 22)
  t.is(rbits(100, 10000), 26)
  t.is(rbits(100, 100000), 29)

  t.is(rbits(1000, 1000), 29)
  t.is(rbits(1000, 10000), 32)
  t.is(rbits(1000, 100000), 36)

  t.is(rbits(10000, 1000), 36)
  t.is(rbits(10000, 10000), 39)
  t.is(rbits(10000, 100000), 42)

  t.is(rbits(100000, 1000), 42)
  t.is(rbits(100000, 10000), 46)
  t.is(rbits(100000, 100000), 49)
})

// preshing.com tests come from table at http://preshing.com/20110504/hash-collision-probabilities/
test('Bits from preshing.com, 32-bit column', (t) => {
  t.is(rbits(30084, 10), 32)
  t.is(rbits(9292, 100), 32)
  t.is(rbits(2932, 1e3), 32)
  t.is(rbits(927, 1e4), 32)
  t.is(rbits(294, 1e5), 32)
  t.is(rbits(93, 1e6), 32)
  t.is(rbits(30, 1e7), 32)
  t.is(rbits(10, 1e8), 32)
})

test('Bits from preshing.com, 64-bit column', (t) => {
  t.is(rbits(1.97e9, 10), 64)
  t.is(rbits(6.09e8, 100), 64)
  t.is(rbits(1.92e8, 1e3), 64)
  t.is(rbits(6.07e7, 1e4), 64)
  t.is(rbits(1.92e7, 1e5), 64)
  t.is(rbits(6.07e6, 1e6), 64)
  t.is(rbits(1.92e6, 1e7), 64)
  t.is(rbits(607401, 1e8), 64)
  t.is(rbits(192077, 1e9), 64)
  t.is(rbits(60704, 1e10), 64)
  t.is(rbits(19208, 1e11), 64)
  t.is(rbits(6074, 1e12), 64)
  t.is(rbits(1921, 1e13), 64)
  t.is(rbits(608, 1e14), 64)
  t.is(rbits(193, 1e15), 64)
  t.is(rbits(61, 1e16), 64)
  t.is(rbits(20, 1e17), 64)
  t.is(rbits(7, 1e18), 64)
})

test('Bits from preshing.com, 160-bit column', (t) => {
  t.is(rbits(1.42e24, 2), 160)
  t.is(rbits(5.55e23, 10), 160)
  t.is(rbits(1.71e23, 100), 160)
  t.is(rbits(5.41e22, 1000), 160)
  t.is(rbits(1.71e22, 1.0e04), 160)
  t.is(rbits(5.41e21, 1.0e05), 160)
  t.is(rbits(1.71e21, 1.0e06), 160)
  t.is(rbits(5.41e20, 1.0e07), 160)
  t.is(rbits(1.71e20, 1.0e08), 160)
  t.is(rbits(5.41e19, 1.0e09), 160)
  t.is(rbits(1.71e19, 1.0e10), 160)
  t.is(rbits(5.41e18, 1.0e11), 160)
  t.is(rbits(1.71e18, 1.0e12), 160)
  t.is(rbits(5.41e17, 1.0e13), 160)
  t.is(rbits(1.71e17, 1.0e14), 160)
  t.is(rbits(5.41e16, 1.0e15), 160)
  t.is(rbits(1.71e16, 1.0e16), 160)
  t.is(rbits(5.41e15, 1.0e17), 160)
  t.is(rbits(1.71e15, 1.0e18), 160)
})

test('Char Set Base 64 Strings', (t) => {
  const entropy = new Entropy(charset64)
  t.is(entropy.stringWithBytes([0xdd], 6), '3')
  t.is(entropy.stringWithBytes([0x78, 0xfc], 12), 'eP')
  t.is(entropy.stringWithBytes([0xc5, 0x6f, 0x21], 18), 'xW8')
  t.is(entropy.stringWithBytes([0xc9, 0x68, 0xc7], 24), 'yWjH')
  t.is(entropy.stringWithBytes([0xa5, 0x62, 0x20, 0x87], 30), 'pWIgh')
  t.is(entropy.stringWithBytes([0x39, 0x51, 0xca, 0xcc, 0x8b], 36), 'OVHKzI')
  t.is(entropy.stringWithBytes([0x83, 0x89, 0x00, 0xc7, 0xf4, 0x02], 42), 'g4kAx_Q')
  t.is(entropy.stringWithBytes([0x51, 0xbc, 0xa8, 0xc7, 0xc9, 0x17], 48), 'Ubyox8kX')
  t.is(entropy.stringWithBytes([0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52], 54), '0uPp2hmXU')
  t.is(entropy.stringWithBytes([0xd9, 0x39, 0xc1, 0xaf, 0x1e, 0x2e, 0x69, 0x48], 60), '2TnBrx4uaU')
  t.is(entropy.stringWithBytes([0x78, 0x3f, 0xfd, 0x93, 0xd1, 0x06, 0x90, 0x4b, 0xd6], 66), 'eD_9k9EGkEv')
  t.is(entropy.stringWithBytes([0x9d, 0x99, 0x4e, 0xa5, 0xd2, 0x3f, 0x8c, 0x86, 0x80], 72), 'nZlOpdI_jIaA')
})

test('Char Set Base 32 Strings', (t) => {
  const entropy = new Entropy(charset32)
  t.is(entropy.stringWithBytes([0xdd], 5), 'N')
  t.is(entropy.stringWithBytes([0x78, 0xfc], 10), 'p6')
  t.is(entropy.stringWithBytes([0x78, 0xfc], 15), 'p6R')
  t.is(entropy.stringWithBytes([0xc5, 0x6f, 0x21], 20), 'JFHt')
  t.is(entropy.stringWithBytes([0xa5, 0x62, 0x20, 0x87], 25), 'DFr43')
  t.is(entropy.stringWithBytes([0xa5, 0x62, 0x20, 0x87], 30), 'DFr433')
  t.is(entropy.stringWithBytes([0x39, 0x51, 0xca, 0xcc, 0x8b], 35), 'b8dPFB7')
  t.is(entropy.stringWithBytes([0x39, 0x51, 0xca, 0xcc, 0x8b], 40), 'b8dPFB7h')
  t.is(entropy.stringWithBytes([0x83, 0x89, 0x00, 0xc7, 0xf4, 0x02], 45), 'qn7q3rTD2')
  t.is(entropy.stringWithBytes([0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52], 50), 'MhrRBGqLtQ')
  t.is(entropy.stringWithBytes([0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52], 55), 'MhrRBGqLtQf')
})

test('Char Set Base 16 Strings', (t) => {
  const entropy = new Entropy(charset16)
  t.is(entropy.stringWithBytes([0x9d], 4), '9')
  t.is(entropy.stringWithBytes([0xae], 8), 'ae')
  t.is(entropy.stringWithBytes([0x01, 0xf2], 12), '01f')
  t.is(entropy.stringWithBytes([0xc7, 0xc9], 16), 'c7c9')
  t.is(entropy.stringWithBytes([0xc7, 0xc9, 0x00], 20), 'c7c90')
})

test('Char Set Base 8 Strings', (t) => {
  const entropy = new Entropy(charset8)
  t.is(entropy.stringWithBytes([0x5a], 3), '2')
  t.is(entropy.stringWithBytes([0x5a], 6), '26')
  t.is(entropy.stringWithBytes([0x21, 0xa4], 9), '103')
  t.is(entropy.stringWithBytes([0x21, 0xa4], 12), '1032')
  t.is(entropy.stringWithBytes([0xda, 0x19], 15), '66414')
  t.is(entropy.stringWithBytes([0xfd, 0x93, 0xd1], 18), '773117')
  t.is(entropy.stringWithBytes([0xfd, 0x93, 0xd1], 21), '7731172')
  t.is(entropy.stringWithBytes([0xfd, 0x93, 0xd1], 24), '77311721')
  t.is(entropy.stringWithBytes([0xc7, 0xc9, 0x07, 0xc9], 27), '617444076')
  t.is(entropy.stringWithBytes([0xc7, 0xc9, 0x07, 0xc9], 30), '6174440762')
})

test('Char Set Base 4 Strings', (t) => {
  const entropy = new Entropy(charset4)
  t.is(entropy.stringWithBytes([0x5a], 2), 'T')
  t.is(entropy.stringWithBytes([0x5a], 4), 'TT')
  t.is(entropy.stringWithBytes([0x93], 6), 'CTA')
  t.is(entropy.stringWithBytes([0x93], 8), 'CTAG')
  t.is(entropy.stringWithBytes([0x20, 0xf1], 10), 'ACAAG')
  t.is(entropy.stringWithBytes([0x20, 0xf1], 12), 'ACAAGG')
  t.is(entropy.stringWithBytes([0x20, 0xf1], 14), 'ACAAGGA')
  t.is(entropy.stringWithBytes([0x20, 0xf1], 16), 'ACAAGGAT')
})

test('Char Set Base 2 Strings', (t) => {
  const entropy = new Entropy(charset2)
  t.is(entropy.stringWithBytes([0x27], 1), '0')
  t.is(entropy.stringWithBytes([0x27], 2), '00')
  t.is(entropy.stringWithBytes([0x27], 3), '001')
  t.is(entropy.stringWithBytes([0x27], 4), '0010')
  t.is(entropy.stringWithBytes([0x27], 5), '00100')
  t.is(entropy.stringWithBytes([0x27], 6), '001001')
  t.is(entropy.stringWithBytes([0x27], 7), '0010011')
  t.is(entropy.stringWithBytes([0x27], 8), '00100111')
  t.is(entropy.stringWithBytes([0xe3, 0xe9], 9), '111000111')
  t.is(entropy.stringWithBytes([0xe3, 0xe9], 16), '1110001111101001')
})

test('Char Set Strings', (t) => {
  const entropy = new Entropy()
  t.is(entropy.stringWithBytes([0xa5, 0x62, 0x20, 0x87], 30, charset64), 'pWIgh')
  t.is(entropy.stringWithBytes([0xa5, 0x62, 0x20, 0x87], 25, charset32), 'DFr43')
  t.is(entropy.stringWithBytes([0xc7, 0xc9], 16, charset16), 'c7c9')
  t.is(entropy.stringWithBytes([0xfd, 0x93, 0xd1], 24, charset8), '77311721')
  t.is(entropy.stringWithBytes([0x20, 0xf1], 12, charset4), 'ACAAGG')
  t.is(entropy.stringWithBytes([0x27], 6, charset2), '001001')
})

test('Small ID', (t) => {
  const entropy = new Entropy()
  t.is(entropy.smallID().length, 6)
  t.is(entropy.smallID(charset64).length, 5)
  t.is(entropy.smallID(charset32).length, 6)
  t.is(entropy.smallID(charset16).length, 8)
  t.is(entropy.smallID(charset8).length, 10)
  t.is(entropy.smallID(charset4).length, 15)
  t.is(entropy.smallID(charset2).length, 29)
})

test('Medium ID', (t) => {
  const entropy = new Entropy()
  t.is(entropy.mediumID().length, 14)
  t.is(entropy.mediumID(charset64).length, 12)
  t.is(entropy.mediumID(charset32).length, 14)
  t.is(entropy.mediumID(charset16).length, 18)
  t.is(entropy.mediumID(charset8).length, 23)
  t.is(entropy.mediumID(charset4).length, 35)
  t.is(entropy.mediumID(charset2).length, 69)
})

test('Large ID', (t) => {
  const entropy = new Entropy()
  t.is(entropy.largeID().length, 20)
  t.is(entropy.largeID(charset64).length, 17)
  t.is(entropy.largeID(charset32).length, 20)
  t.is(entropy.largeID(charset16).length, 25)
  t.is(entropy.largeID(charset8).length, 33)
  t.is(entropy.largeID(charset4).length, 50)
  t.is(entropy.largeID(charset2).length, 99)
})

test('Session ID', (t) => {
  const entropy = new Entropy()
  t.is(entropy.sessionID().length, 26)
  t.is(entropy.sessionID(charset64).length, 22)
  t.is(entropy.sessionID(charset32).length, 26)
  t.is(entropy.sessionID(charset16).length, 32)
  t.is(entropy.sessionID(charset8).length, 43)
  t.is(entropy.sessionID(charset4).length, 64)
  t.is(entropy.sessionID(charset2).length, 128)
})

test('Token', (t) => {
  const entropy = new Entropy()
  t.is(entropy.token().length, 52)
  t.is(entropy.token(charset64).length, 43)
  t.is(entropy.token(charset32).length, 52)
  t.is(entropy.token(charset16).length, 64)
  t.is(entropy.token(charset8).length, 86)
  t.is(entropy.token(charset4).length, 128)
  t.is(entropy.token(charset2).length, 256)
})

test('Custom 64 chars', (t) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ9876543210_-'
  const bits = 72
  const expected = 'NzLoPDi-JiAa'

  let entropy = new Entropy(chars)

  const bytes = new Uint8Array([0x9d, 0x99, 0x4e, 0xa5, 0xd2, 0x3f, 0x8c, 0x86, 0x80])
  t.is(entropy.bytesNeeded(bits), bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  t.is(entropy.string().length, expected.length)
})

test('Custom 32 chars', (t) => {
  const chars = '2346789BDFGHJMNPQRTbdfghjlmnpqrt'
  const bits = 55
  const expected = 'mHRrbgQlTqF'

  let entropy = new Entropy(chars)

  const bytes = new Uint8Array([0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52])
  t.is(entropy.bytesNeeded(bits), bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  t.is(entropy.string().length, expected.length)
})

test('Custom 16 chars', (t) => {
  const chars = '0123456789ABCDEF'
  const bits = 20
  const expected = 'C7C90'

  let entropy = new Entropy(chars)

  const bytes = new Uint8Array([0xc7, 0xc9, 0x00])
  t.is(entropy.bytesNeeded(bits), bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  t.is(entropy.string().length, expected.length)
})

test('Custom 8 chars', (t) => {
  const chars = 'abcdefgh'
  const bits = 30
  const expected = 'gbheeeahgc'

  let entropy = new Entropy(chars)

  const bytes = new Uint8Array([0xc7, 0xc9, 0x07, 0xc9])
  t.is(entropy.bytesNeeded(bits), bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  t.is(entropy.string().length, expected.length)
})

test('Custom 4 chars', (t) => {
  const chars = 'atcg'
  const bits = 16
  const expected = 'acaaggat'

  let entropy = new Entropy(chars)

  const bytes = new Uint8Array([0x20, 0xf1])
  t.is(entropy.bytesNeeded(bits), bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  t.is(entropy.string().length, expected.length)
})

test('Custom 2 chars', (t) => {
  const chars = 'HT'
  const bits = 16
  const expected = 'TTTHHHTTTTTHTHHT'

  let entropy = new Entropy(chars)

  const bytes = new Uint8Array([0xe3, 0xe9])
  t.is(entropy.bytesNeeded(bits), bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  t.is(string, expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  t.is(entropy.string().length, expected.length)
})

test('Entropy params total and risk', (t) => {
  const entropy = new Entropy({
    total: 1e6,
    risk: 1e9
  })

  t.is(entropy.bits(), 69)
  t.is(entropy.string().length, 14)
})

test('Entropy params total, risk and Charset', (t) => {
  const entropy = new Entropy({
    total: 1e7,
    risk: 1e15,
    charset: charset64
  })
  t.is(entropy.string().length, 16)
})

test('Entropy params total, risk and characters', (t) => {
  const entropy = new Entropy({
    total: 100,
    risk: 1e12,
    charset: 'dingosky'
  })
  t.is(entropy.string().length, 18)
})

test('Entropy params bits', (t) => {
  const entropy = new Entropy({
    bits: 48
  })
  t.is(entropy.string().length, 10)
})

test('PRNG', (t) => {
  const entropy = new Entropy()

  let string = entropy.stringPRNG()
  t.is(typeof string, 'string')
  t.is(string.length, 26)

  string = entropy.stringPRNG(64)
  t.is(typeof string, 'string')
  t.is(string.length, 13)

  string = entropy.stringPRNG(64, charset16)
  t.is(typeof string, 'string')
  t.is(string.length, 16)

  string = entropy.stringRandom()
  t.is(typeof string, 'string')
  t.is(string.length, 26)
})

test('Invalid bits', (t) => {
  const error = t.throws(() => {
    const entropy = new Entropy({ bits: -1 })
    t.fail('Creating entropy with negative bits should throw error', entropy)
  }, Error)
  t.regex(error.message, /Invalid.*bits/)
})

test('Use Invalid Char Set', (t) => {
  try {
    const entropy = new Entropy()
    entropy.use(CharSet.base6)
    t.fail('Using invalid CharSet should fail')
  } catch (error) {
    t.pass()
  }
})

test('Invalid char count', (t) => {
  let error = t.throws(() => {
    const entropy = new Entropy('123')
    t.fail('Creating entropy should throw error', entropy)
  }, Error)
  t.regex(error.message, /Invalid.*count/)

  error = t.throws(() => {
    const entropy = new Entropy()
    entropy.useChars('123')
  }, Error)
  t.regex(error.message, /Invalid.*count/)

  error = t.throws(() => {
    const entropy = new Entropy({
      total: 100,
      risk: 1e6,
      charset: 'dingo'
    })
    entropy.bits()
  }, Error)
  t.regex(error.message, /Invalid.*count/)

  error = t.throws(() => {
    const entropy = new Entropy({
      bits: 100,
      charset: '12344567'
    })
    entropy.bits()
  }, Error)
  t.regex(error.message, /unique/)
})

test('Invalid Constructor Arg', (t) => {
  const error = t.throws(() => {
    const entropy = new Entropy(false)
    t.fail('Creating entropy should throw error', entropy)
  }, Error)
  t.regex(error.message, /Constructor/)
})

const invalidBytes = (entropy, bytes, bits) => {
  try {
    entropy.stringWithBytes(bytes, bits)
    return 'false'
  } catch (error) {
    return error.message
  }
}

test('Invalid bytes', (t) => {
  let entropy
  const regex = /Insufficient/

  entropy = new Entropy(charset64)
  t.regex(invalidBytes(entropy, [1], 7), regex)
  t.regex(invalidBytes(entropy, [1, 2], 13), regex)
  t.regex(invalidBytes(entropy, [1, 2, 3], 25), regex)
  t.regex(invalidBytes(entropy, [1, 2, 3, 4], 31), regex)

  entropy = new Entropy(charset32)
  t.regex(invalidBytes(entropy, [1], 6), regex)
  t.regex(invalidBytes(entropy, [1, 2], 16), regex)
  t.regex(invalidBytes(entropy, [1, 2, 3], 21), regex)
  t.regex(invalidBytes(entropy, [1, 2, 3, 4], 31), regex)
  t.regex(invalidBytes(entropy, [1, 2, 3, 4], 32), regex)
  t.regex(invalidBytes(entropy, [1, 2, 3, 4, 5], 41), regex)
  t.regex(invalidBytes(entropy, [1, 2, 3, 4, 5, 6], 46), regex)

  entropy = new Entropy(charset16)
  t.regex(invalidBytes(entropy, [1], 9), regex)
  t.regex(invalidBytes(entropy, [1, 2], 17), regex)

  entropy = new Entropy(charset8)
  t.regex(invalidBytes(entropy, [1], 7), regex)
  t.regex(invalidBytes(entropy, [1, 2], 16), regex)
  t.regex(invalidBytes(entropy, [1, 2, 3], 25), regex)
  t.regex(invalidBytes(entropy, [1, 2, 3, 4], 31), regex)

  entropy = new Entropy(charset4)
  t.regex(invalidBytes(entropy, [1], 9), regex)
  t.regex(invalidBytes(entropy, [1, 2], 17), regex)

  entropy = new Entropy(charset2)
  t.regex(invalidBytes(entropy, [1], 9), regex)
  t.regex(invalidBytes(entropy, [1, 2], 17), regex)
})
