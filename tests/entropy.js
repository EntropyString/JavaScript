const {
  Entropy,
  CharSet,
  charset64, charset32, charset16, charset8, charset4, charset2
} = require('../entropy-string')

const { round } = Math

const rbits = (t, r) => round(Entropy.bits(t, r))

test('Entropy constructor', () => {
  let entropy = new Entropy()
  expect(entropy.bits()).toBe(128)
  expect(entropy.chars()).toBe(charset32.chars)
  expect(entropy.bytesNeeded()).toBe(17)

  entropy = new Entropy({ bits: 32 })
  expect(entropy.bits()).toBe(32)
  expect(entropy.chars()).toBe(charset32.chars)
  expect(entropy.bytesNeeded()).toBe(5)

  entropy = new Entropy({ total: 1000, risk: 1e9 })
  expect(entropy.bits()).toBe(49)
  expect(entropy.chars()).toBe(charset32.chars)
  expect(entropy.bytesNeeded()).toBe(7)

  entropy = new Entropy({ bits: 32, charset: charset16 })
  expect(entropy.bits()).toBe(32)
  expect(entropy.chars()).toBe(charset16.chars)
  expect(entropy.bytesNeeded()).toBe(4)

  entropy = new Entropy({ total: 1e6, risk: 10000000, charset: charset16 })
  expect(entropy.bits()).toBe(62)
  expect(entropy.chars()).toBe(charset16.chars)
  expect(entropy.bytesNeeded()).toBe(8)
})

test('Zero entropy', () => {
  expect(Entropy.bits(0, 10)).toBe(0)

  const entropy = new Entropy()
  expect(entropy.string(0)).toBe('')
})

test('Bits using total, risk', () => {
  expect(rbits(10, 1000)).toBe(15)
  expect(rbits(10, 10000)).toBe(19)
  expect(rbits(10, 100000)).toBe(22)

  expect(rbits(100, 1000)).toBe(22)
  expect(rbits(100, 10000)).toBe(26)
  expect(rbits(100, 100000)).toBe(29)

  expect(rbits(1000, 1000)).toBe(29)
  expect(rbits(1000, 10000)).toBe(32)
  expect(rbits(1000, 100000)).toBe(36)

  expect(rbits(10000, 1000)).toBe(36)
  expect(rbits(10000, 10000)).toBe(39)
  expect(rbits(10000, 100000)).toBe(42)

  expect(rbits(100000, 1000)).toBe(42)
  expect(rbits(100000, 10000)).toBe(46)
  expect(rbits(100000, 100000)).toBe(49)
})

// preshing.com tests come from table at http://preshing.com/20110504/hash-collision-probabilities/
test('Bits from preshing.com, 32-bit column', () => {
  expect(rbits(30084, 10)).toBe(32)
  expect(rbits(9292, 100)).toBe(32)
  expect(rbits(2932, 1e3)).toBe(32)
  expect(rbits(927, 1e4)).toBe(32)
  expect(rbits(294, 1e5)).toBe(32)
  expect(rbits(93, 1e6)).toBe(32)
  expect(rbits(30, 1e7)).toBe(32)
  expect(rbits(10, 1e8)).toBe(32)
})

test('Bits from preshing.com, 64-bit column', () => {
  expect(rbits(1.97e9, 10)).toBe(64)
  expect(rbits(6.09e8, 100)).toBe(64)
  expect(rbits(1.92e8, 1e3)).toBe(64)
  expect(rbits(6.07e7, 1e4)).toBe(64)
  expect(rbits(1.92e7, 1e5)).toBe(64)
  expect(rbits(6.07e6, 1e6)).toBe(64)
  expect(rbits(1.92e6, 1e7)).toBe(64)
  expect(rbits(607401, 1e8)).toBe(64)
  expect(rbits(192077, 1e9)).toBe(64)
  expect(rbits(60704, 1e10)).toBe(64)
  expect(rbits(19208, 1e11)).toBe(64)
  expect(rbits(6074, 1e12)).toBe(64)
  expect(rbits(1921, 1e13)).toBe(64)
  expect(rbits(608, 1e14)).toBe(64)
  expect(rbits(193, 1e15)).toBe(64)
  expect(rbits(61, 1e16)).toBe(64)
  expect(rbits(20, 1e17)).toBe(64)
  expect(rbits(7, 1e18)).toBe(64)
})

test('Bits from preshing.com, 160-bit column', () => {
  expect(rbits(1.42e24, 2)).toBe(160)
  expect(rbits(5.55e23, 10)).toBe(160)
  expect(rbits(1.71e23, 100)).toBe(160)
  expect(rbits(5.41e22, 1000)).toBe(160)
  expect(rbits(1.71e22, 1.0e04)).toBe(160)
  expect(rbits(5.41e21, 1.0e05)).toBe(160)
  expect(rbits(1.71e21, 1.0e06)).toBe(160)
  expect(rbits(5.41e20, 1.0e07)).toBe(160)
  expect(rbits(1.71e20, 1.0e08)).toBe(160)
  expect(rbits(5.41e19, 1.0e09)).toBe(160)
  expect(rbits(1.71e19, 1.0e10)).toBe(160)
  expect(rbits(5.41e18, 1.0e11)).toBe(160)
  expect(rbits(1.71e18, 1.0e12)).toBe(160)
  expect(rbits(5.41e17, 1.0e13)).toBe(160)
  expect(rbits(1.71e17, 1.0e14)).toBe(160)
  expect(rbits(5.41e16, 1.0e15)).toBe(160)
  expect(rbits(1.71e16, 1.0e16)).toBe(160)
  expect(rbits(5.41e15, 1.0e17)).toBe(160)
  expect(rbits(1.71e15, 1.0e18)).toBe(160)
})

test('Char Set Base 64 Strings', () => {
  const entropy = new Entropy({ charset: charset64 })
  expect(entropy.stringWithBytes([0xdd], 6)).toBe('3')
  expect(entropy.stringWithBytes([0x78, 0xfc], 12)).toBe('eP')
  expect(entropy.stringWithBytes([0xc5, 0x6f, 0x21], 18)).toBe('xW8')
  expect(entropy.stringWithBytes([0xc9, 0x68, 0xc7], 24)).toBe('yWjH')
  expect(entropy.stringWithBytes([0xa5, 0x62, 0x20, 0x87], 30)).toBe('pWIgh')
  expect(entropy.stringWithBytes([0x39, 0x51, 0xca, 0xcc, 0x8b], 36)).toBe('OVHKzI')
  expect(entropy.stringWithBytes([0x83, 0x89, 0x00, 0xc7, 0xf4, 0x02], 42)).toBe('g4kAx_Q')
  expect(entropy.stringWithBytes([0x51, 0xbc, 0xa8, 0xc7, 0xc9, 0x17], 48)).toBe('Ubyox8kX')
  expect(entropy.stringWithBytes([0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52], 54)).toBe('0uPp2hmXU')
  expect(entropy.stringWithBytes([0xd9, 0x39, 0xc1, 0xaf, 0x1e, 0x2e, 0x69, 0x48], 60)).toBe('2TnBrx4uaU')
  expect(entropy.stringWithBytes([0x78, 0x3f, 0xfd, 0x93, 0xd1, 0x06, 0x90, 0x4b, 0xd6], 66)).toBe('eD_9k9EGkEv')
  expect(entropy.stringWithBytes([0x9d, 0x99, 0x4e, 0xa5, 0xd2, 0x3f, 0x8c, 0x86, 0x80], 72)).toBe('nZlOpdI_jIaA')
})

test('Char Set Base 32 Strings', () => {
  const entropy = new Entropy({ charset: charset32 })
  expect(entropy.stringWithBytes([0xdd], 5)).toBe('N')
  expect(entropy.stringWithBytes([0x78, 0xfc], 10)).toBe('p6')
  expect(entropy.stringWithBytes([0x78, 0xfc], 15)).toBe('p6R')
  expect(entropy.stringWithBytes([0xc5, 0x6f, 0x21], 20)).toBe('JFHt')
  expect(entropy.stringWithBytes([0xa5, 0x62, 0x20, 0x87], 25)).toBe('DFr43')
  expect(entropy.stringWithBytes([0xa5, 0x62, 0x20, 0x87], 30)).toBe('DFr433')
  expect(entropy.stringWithBytes([0x39, 0x51, 0xca, 0xcc, 0x8b], 35)).toBe('b8dPFB7')
  expect(entropy.stringWithBytes([0x39, 0x51, 0xca, 0xcc, 0x8b], 40)).toBe('b8dPFB7h')
  expect(entropy.stringWithBytes([0x83, 0x89, 0x00, 0xc7, 0xf4, 0x02], 45)).toBe('qn7q3rTD2')
  expect(entropy.stringWithBytes([0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52], 50)).toBe('MhrRBGqLtQ')
  expect(entropy.stringWithBytes([0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52], 55)).toBe('MhrRBGqLtQf')
})

test('Char Set Base 16 Strings', () => {
  const entropy = new Entropy({ charset: charset16 })
  expect(entropy.stringWithBytes([0x9d], 4)).toBe('9')
  expect(entropy.stringWithBytes([0xae], 8)).toBe('ae')
  expect(entropy.stringWithBytes([0x01, 0xf2], 12)).toBe('01f')
  expect(entropy.stringWithBytes([0xc7, 0xc9], 16)).toBe('c7c9')
  expect(entropy.stringWithBytes([0xc7, 0xc9, 0x00], 20)).toBe('c7c90')
})

test('Char Set Base 8 Strings', () => {
  const entropy = new Entropy({ charset: charset8 })
  expect(entropy.stringWithBytes([0x5a], 3)).toBe('2')
  expect(entropy.stringWithBytes([0x5a], 6)).toBe('26')
  expect(entropy.stringWithBytes([0x21, 0xa4], 9)).toBe('103')
  expect(entropy.stringWithBytes([0x21, 0xa4], 12)).toBe('1032')
  expect(entropy.stringWithBytes([0xda, 0x19], 15)).toBe('66414')
  expect(entropy.stringWithBytes([0xfd, 0x93, 0xd1], 18)).toBe('773117')
  expect(entropy.stringWithBytes([0xfd, 0x93, 0xd1], 21)).toBe('7731172')
  expect(entropy.stringWithBytes([0xfd, 0x93, 0xd1], 24)).toBe('77311721')
  expect(entropy.stringWithBytes([0xc7, 0xc9, 0x07, 0xc9], 27)).toBe('617444076')
  expect(entropy.stringWithBytes([0xc7, 0xc9, 0x07, 0xc9], 30)).toBe('6174440762')
})

test('Char Set Base 4 Strings', () => {
  const entropy = new Entropy({ charset: charset4 })
  expect(entropy.stringWithBytes([0x5a], 2)).toBe('T')
  expect(entropy.stringWithBytes([0x5a], 4)).toBe('TT')
  expect(entropy.stringWithBytes([0x93], 6)).toBe('CTA')
  expect(entropy.stringWithBytes([0x93], 8)).toBe('CTAG')
  expect(entropy.stringWithBytes([0x20, 0xf1], 10)).toBe('ACAAG')
  expect(entropy.stringWithBytes([0x20, 0xf1], 12)).toBe('ACAAGG')
  expect(entropy.stringWithBytes([0x20, 0xf1], 14)).toBe('ACAAGGA')
  expect(entropy.stringWithBytes([0x20, 0xf1], 16)).toBe('ACAAGGAT')
})

test('Char Set Base 2 Strings', () => {
  const entropy = new Entropy({ charset: charset2 })
  expect(entropy.stringWithBytes([0x27], 1)).toBe('0')
  expect(entropy.stringWithBytes([0x27], 2)).toBe('00')
  expect(entropy.stringWithBytes([0x27], 3)).toBe('001')
  expect(entropy.stringWithBytes([0x27], 4)).toBe('0010')
  expect(entropy.stringWithBytes([0x27], 5)).toBe('00100')
  expect(entropy.stringWithBytes([0x27], 6)).toBe('001001')
  expect(entropy.stringWithBytes([0x27], 7)).toBe('0010011')
  expect(entropy.stringWithBytes([0x27], 8)).toBe('00100111')
  expect(entropy.stringWithBytes([0xe3, 0xe9], 9)).toBe('111000111')
  expect(entropy.stringWithBytes([0xe3, 0xe9], 16)).toBe('1110001111101001')
})

test('Char Set Strings', () => {
  const entropy = new Entropy()
  expect(entropy.stringWithBytes([0xa5, 0x62, 0x20, 0x87], 30, charset64)).toBe('pWIgh')
  expect(entropy.stringWithBytes([0xa5, 0x62, 0x20, 0x87], 25, charset32)).toBe('DFr43')
  expect(entropy.stringWithBytes([0xc7, 0xc9], 16, charset16)).toBe('c7c9')
  expect(entropy.stringWithBytes([0xfd, 0x93, 0xd1], 24, charset8)).toBe('77311721')
  expect(entropy.stringWithBytes([0x20, 0xf1], 12, charset4)).toBe('ACAAGG')
  expect(entropy.stringWithBytes([0x27], 6, charset2)).toBe('001001')
})

test('Small ID', () => {
  const entropy = new Entropy()
  expect(entropy.smallID().length).toBe(6)
  expect(entropy.smallID(charset64).length).toBe(5)
  expect(entropy.smallID(charset32).length).toBe(6)
  expect(entropy.smallID(charset16).length).toBe(8)
  expect(entropy.smallID(charset8).length).toBe(10)
  expect(entropy.smallID(charset4).length).toBe(15)
  expect(entropy.smallID(charset2).length).toBe(29)
})

test('Medium ID', () => {
  const entropy = new Entropy()
  expect(entropy.mediumID().length).toBe(14)
  expect(entropy.mediumID(charset64).length).toBe(12)
  expect(entropy.mediumID(charset32).length).toBe(14)
  expect(entropy.mediumID(charset16).length).toBe(18)
  expect(entropy.mediumID(charset8).length).toBe(23)
  expect(entropy.mediumID(charset4).length).toBe(35)
  expect(entropy.mediumID(charset2).length).toBe(69)
})

test('Large ID', () => {
  const entropy = new Entropy()
  expect(entropy.largeID().length).toBe(20)
  expect(entropy.largeID(charset64).length).toBe(17)
  expect(entropy.largeID(charset32).length).toBe(20)
  expect(entropy.largeID(charset16).length).toBe(25)
  expect(entropy.largeID(charset8).length).toBe(33)
  expect(entropy.largeID(charset4).length).toBe(50)
  expect(entropy.largeID(charset2).length).toBe(99)
})

test('Session ID', () => {
  const entropy = new Entropy()
  expect(entropy.sessionID().length).toBe(26)
  expect(entropy.sessionID(charset64).length).toBe(22)
  expect(entropy.sessionID(charset32).length).toBe(26)
  expect(entropy.sessionID(charset16).length).toBe(32)
  expect(entropy.sessionID(charset8).length).toBe(43)
  expect(entropy.sessionID(charset4).length).toBe(64)
  expect(entropy.sessionID(charset2).length).toBe(128)
})

test('Token', () => {
  const entropy = new Entropy()
  expect(entropy.token().length).toBe(52)
  expect(entropy.token(charset64).length).toBe(43)
  expect(entropy.token(charset32).length).toBe(52)
  expect(entropy.token(charset16).length).toBe(64)
  expect(entropy.token(charset8).length).toBe(86)
  expect(entropy.token(charset4).length).toBe(128)
  expect(entropy.token(charset2).length).toBe(256)
})

test('Custom 64 chars', () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ9876543210_-'
  const bits = 72
  const expected = 'NzLoPDi-JiAa'

  let entropy = new Entropy({ charset: chars })

  const bytes = new Uint8Array([0x9d, 0x99, 0x4e, 0xa5, 0xd2, 0x3f, 0x8c, 0x86, 0x80])
  expect(entropy.bytesNeeded(bits)).toBe(bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  expect(entropy.string().length).toBe(expected.length)
})

test('Custom 32 chars', () => {
  const chars = '2346789BDFGHJMNPQRTbdfghjlmnpqrt'
  const bits = 55
  const expected = 'mHRrbgQlTqF'

  let entropy = new Entropy({ charset: chars })

  const bytes = new Uint8Array([0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52])
  expect(entropy.bytesNeeded(bits)).toBe(bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  expect(entropy.string().length).toBe(expected.length)
})

test('Custom 16 chars', () => {
  const chars = '0123456789ABCDEF'
  const bits = 20
  const expected = 'C7C90'

  let entropy = new Entropy({ charset: chars })

  const bytes = new Uint8Array([0xc7, 0xc9, 0x00])
  expect(entropy.bytesNeeded(bits)).toBe(bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  expect(entropy.string().length).toBe(expected.length)
})

test('Custom 8 chars', () => {
  const chars = 'abcdefgh'
  const bits = 30
  const expected = 'gbheeeahgc'

  let entropy = new Entropy({ charset: chars })

  const bytes = new Uint8Array([0xc7, 0xc9, 0x07, 0xc9])
  expect(entropy.bytesNeeded(bits)).toBe(bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  expect(entropy.string().length).toBe(expected.length)
})

test('Custom 4 chars', () => {
  const chars = 'atcg'
  const bits = 16
  const expected = 'acaaggat'

  let entropy = new Entropy({ charset: chars })

  const bytes = new Uint8Array([0x20, 0xf1])
  expect(entropy.bytesNeeded(bits)).toBe(bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  expect(entropy.string().length).toBe(expected.length)
})

test('Custom 2 chars', () => {
  const chars = 'HT'
  const bits = 16
  const expected = 'TTTHHHTTTTTHTHHT'

  let entropy = new Entropy({ charset: chars })

  const bytes = new Uint8Array([0xe3, 0xe9])
  expect(entropy.bytesNeeded(bits)).toBe(bytes.length)
  let string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy()
  entropy.useChars(chars)
  string = entropy.stringWithBytes(bytes, bits)
  expect(string).toBe(expected)

  entropy = new Entropy({ charset: chars, bits })
  string = entropy.string()
  expect(entropy.string().length).toBe(expected.length)
})

test('Entropy params total and risk', () => {
  const entropy = new Entropy({ total: 1e6, risk: 1e9 })

  expect(entropy.bits()).toBe(69)
  expect(entropy.string().length).toBe(14)
})

test('Entropy params total, risk and Charset', () => {
  const entropy = new Entropy({ total: 1e7, risk: 1e15, charset: charset64 })
  expect(entropy.string().length).toBe(16)
})

test('Entropy params total, risk and characters', () => {
  const entropy = new Entropy({ total: 100, risk: 1e12, charset: 'dingosky' })
  expect(entropy.string().length).toBe(18)
})

test('Entropy params bits', () => {
  const entropy = new Entropy({ bits: 48 })
  expect(entropy.string().length).toBe(10)
})

test('PRNG', () => {
  const entropy = new Entropy({ prng: true })

  let string = entropy.string()
  expect(typeof string).toBe('string')
  expect(string.length).toBe(26)

  string = entropy.string(64)
  expect(typeof string).toBe('string')
  expect(string.length).toBe(13)

  string = entropy.string(64, charset16)
  expect(typeof string).toBe('string')
  expect(string.length).toBe(16)
})

test('Invalid bits', () => {
  expect(() => {
    const _ = new Entropy({ bits: -1 })
  }).toThrowError(Error)
})

test('Invalid total', () => {
  expect(() => {
    const _ = new Entropy({ total: 0, risk: 10 })
  }).toThrowError(Error)
})

test('Invalid risk', () => {
  expect(() => {
    const _ = new Entropy({ total: 10, risk: 0 })
  }).toThrowError(Error)
})

test('Invalid total without risk', () => {
  expect(() => {
    const _ = new Entropy({ total: 10 })
  }).toThrowError(Error)
})

test('Invalid risk without total', () => {
  expect(() => {
    const _ = new Entropy({ risk: 10 })
  }).toThrowError(Error)
})

test('Invalid CharSet', () => {
  expect(() => {
    const entropy = new Entropy({ risk: 10 })
    entropy.use(CharSet.base6)
  }).toThrowError(Error)
})

test('Invalid char count', () => {
  expect(() => {
    const _ = new Entropy({ charset: '123' })
  }).toThrowError(Error)

  expect(() => {
    const entropy = new Entropy()
    entropy.useChars('123')
  }).toThrowError(Error)

  expect(() => {
    const _ = new Entropy({ total: 100, risk: 1e6, charset: 'dingo' })
  }).toThrowError(Error)

  expect(() => {
    const _ = new Entropy({ bits: 100, charset: '12344567' })
  }).toThrowError(Error)
})

test('Invalid constructor argument', () => {
  expect(() => {
    const _ = new Entropy(false)
  }).toThrowError(Error)
})

const invalidBytes = (entropy, bytes, bits) => {
  try {
    entropy.stringWithBytes(bytes, bits)
    return 'false'
  } catch (error) {
    return error.message
  }
}

test('Invalid bytes', () => {
  let entropy
  const regex = /Insufficient/

  entropy = new Entropy({ charset: charset64 })
  expect(invalidBytes(entropy, [1], 7)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2], 13)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2, 3], 25)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2, 3, 4], 31)).toMatch(regex)

  entropy = new Entropy({ charset: charset32 })
  expect(invalidBytes(entropy, [1], 6)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2], 16)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2, 3], 21)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2, 3, 4], 31)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2, 3, 4], 32)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2, 3, 4, 5], 41)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2, 3, 4, 5, 6], 46)).toMatch(regex)

  entropy = new Entropy({ charset: charset16 })
  expect(invalidBytes(entropy, [1], 9)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2], 17)).toMatch(regex)

  entropy = new Entropy({ charset: charset8 })
  expect(invalidBytes(entropy, [1], 7)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2], 16)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2, 3], 25)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2, 3, 4], 31)).toMatch(regex)

  entropy = new Entropy({ charset: charset4 })
  expect(invalidBytes(entropy, [1], 9)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2], 17)).toMatch(regex)

  entropy = new Entropy({ charset: charset2 })
  expect(invalidBytes(entropy, [1], 9)).toMatch(regex)
  expect(invalidBytes(entropy, [1, 2], 17)).toMatch(regex)
})
