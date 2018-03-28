const { entropyBits } = require('../lib/entropy')
const test = require('ava')

const rbits = (t, r) => {
  return Math.round(entropyBits(t,r))
}

test('zero entropy', (t) => {
  t.is(entropyBits(0, 10), 0)
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
test('preshing.com, 32-bit column', (t) => {
  t.is(rbits(30084, 10), 32)
  t.is(rbits(9292, 100), 32)
  t.is(rbits(2932, 1e3), 32)
  t.is(rbits(927, 1e4), 32)
  t.is(rbits(294, 1e5), 32)
  t.is(rbits(93, 1e6), 32)
  t.is(rbits(30, 1e7), 32)
  t.is(rbits(10, 1e8), 32)
})

test('preshing.com, 64-bit column', (t) => {
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

test('preshing.com, 160-bit column', (t) => {
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
