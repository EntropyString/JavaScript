const {
  CharSet,
  charset64, charset32, charset16, charset8, charset4, charset2
} = require('../entropy-string')

test('charset64', () => {
  const charset = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
  const { length } = charset.chars
  expect(length).toBe(64)
  const bitsPerChar = Math.log2(length)
  expect(charset.bitsPerChar).toBe(bitsPerChar)
  expect(charset.charsPerChunk).toBe(4)
})

test('charset32', () => {
  const charset = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT')
  const { length } = charset.chars
  expect(length).toBe(32)
  const bitsPerChar = Math.log2(length)
  expect(charset.bitsPerChar).toBe(bitsPerChar)
  expect(charset.charsPerChunk).toBe(8)
})

test('charset16', () => {
  const charset = new CharSet('0123456789abcdef')
  const { length } = charset.chars
  expect(length).toBe(16)
  const bitsPerChar = Math.log2(length)
  expect(charset.bitsPerChar).toBe(bitsPerChar)
  expect(charset.charsPerChunk).toBe(2)
})

test('charset8', () => {
  const charset = new CharSet('01234567')
  const { length } = charset.chars
  expect(length).toBe(8)
  const bitsPerChar = Math.log2(length)
  expect(charset.bitsPerChar).toBe(bitsPerChar)
  expect(charset.charsPerChunk).toBe(8)
})

test('charset4', () => {
  const charset = new CharSet('ATCG')
  const { length } = charset.chars
  expect(length).toBe(4)
  const bitsPerChar = Math.log2(length)
  expect(charset.bitsPerChar).toBe(bitsPerChar)
  expect(charset.charsPerChunk).toBe(4)
})

test('charset2', () => {
  const charset = new CharSet('01')
  const { length } = charset.chars
  expect(length).toBe(2)
  const bitsPerChar = Math.log2(length)
  expect(charset.bitsPerChar).toBe(bitsPerChar)
  expect(charset.charsPerChunk).toBe(8)
})

test('Custom chars: 64', () => {
  expect(() => {
    const _ = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ab')
  }).toThrow(Error)

  expect(() => {
    const _ = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)!@#$%^&*(+=0')
  }).toThrowError(Error)

  expect(() => {
    const _ = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)!@#$%^&*(+')
  }).toThrowError(Error)
})

test('Custom chars: 32', () => {
  expect(() => {
    const _ = new CharSet('01234567890123456789012345678901')
  }).toThrowError(Error)

  expect(() => {
    const _ = new CharSet('0123456789abcdefghijklmnopqrstu')
  }).toThrowError(Error)

  expect(() => {
    const _ = new CharSet('0123456789abcdefghijklmnopqrstuvw')
  }).toThrowError(Error)
})

test('Custom chars: 16', () => {
  expect(() => {
    const _ = new CharSet('0123456789abcde0')
  }).toThrowError(Error)

  expect(() => {
    const _ = new CharSet('0123456789abcde')
  }).toThrowError(Error)

  expect(() => {
    const _ = new CharSet('0123456789abcdefg')
  }).toThrowError(Error)
})

test('Custom chars: 8', () => {
  expect(() => {
    const _ = new CharSet('abcdefga')
  }).toThrowError(Error)

  expect(() => {
    const _ = new CharSet('abcdefg')
  }).toThrowError(Error)

  expect(() => {
    const _ = new CharSet('abcdefghi')
  }).toThrowError(Error)
})

test('Custom chars: 4', () => {
  expect(() => {
    const _ = new CharSet('abbc')
  }).toThrowError(Error)

  expect(() => {
    const _ = new CharSet('abc')
  }).toThrowError(Error)

  expect(() => {
    const _ = new CharSet('abcde')
  }).toThrowError(Error)
})

test('Custom chars: 2', () => {
  expect(() => {
    const _ = new CharSet('TT')
  }).toThrowError(Error)

  expect(() => {
    const _ = new CharSet('T')
  }).toThrowError(Error)

  expect(() => {
    const _ = new CharSet('H20')
  }).toThrowError(Error)
})

test('Bytes needed', () => {
  const BITS_PER_BYTE = 8
  const doTest = (charset, bits) => {
    const bytesNeeded = charset.bytesNeeded(bits)
    const atLeast = Math.ceil(bits / BITS_PER_BYTE)
    expect(atLeast <= bytesNeeded).toBe(true)
    const atMost = atLeast + 1
    expect(bytesNeeded <= atMost).toBe(true)
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
