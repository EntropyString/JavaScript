import entropy from '../lib/entropy'
import random from '../lib/random'
import CharSet from '../lib/charSet'

import test from 'ava'

const round = Math.round

test('zero entropy', t => {
  t.is(entropy.bits(0, 10), 0)
})

test('Bits using total, risk', t => {
  t.is(round(entropy.bits(    10,   1000)),   15)
  t.is(round(entropy.bits(    10,  10000)),   19)
  t.is(round(entropy.bits(    10, 100000)),   22)

  t.is(round(entropy.bits(   100,   1000)),   22)
  t.is(round(entropy.bits(   100,  10000)),   26)
  t.is(round(entropy.bits(   100, 100000)),   29)
  
  t.is(round(entropy.bits(  1000,   1000)),   29)
  t.is(round(entropy.bits(  1000,  10000)),   32)
  t.is(round(entropy.bits(  1000, 100000)),   36)

  t.is(round(entropy.bits( 10000,   1000)),   36)
  t.is(round(entropy.bits( 10000,  10000)),   39)
  t.is(round(entropy.bits( 10000, 100000)),   42)
  
  t.is(round(entropy.bits(100000,   1000)),   42)
  t.is(round(entropy.bits(100000,  10000)),   46)
  t.is(round(entropy.bits(100000, 100000)),   49)
})

test('Bits using total, risk power', t => {
  t.is(round(entropy.bitsWithRiskPower(    10, 3)), 15)
  t.is(round(entropy.bitsWithRiskPower(    10, 4)), 19)
  t.is(round(entropy.bitsWithRiskPower(    10, 5)), 22)
  
  t.is(round(entropy.bitsWithRiskPower(   100, 3)), 22)
  t.is(round(entropy.bitsWithRiskPower(   100, 4)), 26)
  t.is(round(entropy.bitsWithRiskPower(   100, 5)), 29)
  
  t.is(round(entropy.bitsWithRiskPower(  1000, 3)), 29)
  t.is(round(entropy.bitsWithRiskPower(  1000, 4)), 32)
  t.is(round(entropy.bitsWithRiskPower(  1000, 5)), 36)
  
  t.is(round(entropy.bitsWithRiskPower( 10000, 3)), 36)
  t.is(round(entropy.bitsWithRiskPower( 10000, 4)), 39)
  t.is(round(entropy.bitsWithRiskPower( 10000, 5)), 42)
  
  t.is(round(entropy.bitsWithRiskPower(100000, 3)), 42)
  t.is(round(entropy.bitsWithRiskPower(100000, 4)), 46)
  t.is(round(entropy.bitsWithRiskPower(100000, 5)), 49)
})

test('Bits using total power, risk power', t => {
  t.is(round(entropy.bitsWithPowers(1, 3)), 15)
  t.is(round(entropy.bitsWithPowers(1, 4)), 19)
  t.is(round(entropy.bitsWithPowers(1, 5)), 22)
  
  t.is(round(entropy.bitsWithPowers(2, 3)), 22)
  t.is(round(entropy.bitsWithPowers(2, 4)), 26)
  t.is(round(entropy.bitsWithPowers(2, 5)), 29)
  
  t.is(round(entropy.bitsWithPowers(3, 3)), 29)
  t.is(round(entropy.bitsWithPowers(3, 4)), 32)
  t.is(round(entropy.bitsWithPowers(3, 5)), 36)
  
  t.is(round(entropy.bitsWithPowers(4, 3)), 36)
  t.is(round(entropy.bitsWithPowers(4, 4)), 39)
  t.is(round(entropy.bitsWithPowers(4, 5)), 42)
  
  t.is(round(entropy.bitsWithPowers(5, 3)), 42)
  t.is(round(entropy.bitsWithPowers(5, 4)), 46)
  t.is(round(entropy.bitsWithPowers(5, 5)), 49)
})

test('String lengths using bits', t => {
  t.is(bitsStringLength(30, 1000000, CharSet.base64),  5)
  t.is(bitsStringLength(30, 1000000, CharSet.base32),  6)
  t.is(bitsStringLength(30, 1000000, CharSet.base16),  8)
  t.is(bitsStringLength(30, 1000000, CharSet.base8),  10)
  t.is(bitsStringLength(30, 1000000, CharSet.base4),  15)
  t.is(bitsStringLength(30, 1000000, CharSet.base2),  29)
})

test('String lengths using bitsWithRiskPower', t => {
  t.is(bitsWithRiskPowerStringLength(30, 6, CharSet.base64),  5)
  t.is(bitsWithRiskPowerStringLength(30, 6, CharSet.base32),  6)
  t.is(bitsWithRiskPowerStringLength(30, 6, CharSet.base16),  8)
  t.is(bitsWithRiskPowerStringLength(30, 6, CharSet.base8),  10)
  t.is(bitsWithRiskPowerStringLength(30, 6, CharSet.base4),  15)
  t.is(bitsWithRiskPowerStringLength(30, 6, CharSet.base2),  29)

  t.is(bitsWithRiskPowerStringLength(1000,   10, CharSet.base64),  9)
  t.is(bitsWithRiskPowerStringLength(1000,   10, CharSet.base32), 11)
  t.is(bitsWithRiskPowerStringLength(1000,   10, CharSet.base16), 14)
  t.is(bitsWithRiskPowerStringLength(1000,   10, CharSet.base8),  18)
  t.is(bitsWithRiskPowerStringLength(1000,   10, CharSet.base4),  27)
  t.is(bitsWithRiskPowerStringLength(1000,   10, CharSet.base2),  53)

  t.is(bitsWithRiskPowerStringLength(100000, 12, CharSet.base64), 13)
  t.is(bitsWithRiskPowerStringLength(100000, 12, CharSet.base32), 15)
  t.is(bitsWithRiskPowerStringLength(100000, 12, CharSet.base16), 19)
  t.is(bitsWithRiskPowerStringLength(100000, 12, CharSet.base8),  25)
  t.is(bitsWithRiskPowerStringLength(100000, 12, CharSet.base4),  37)
  t.is(bitsWithRiskPowerStringLength(100000, 12, CharSet.base2),  73)

  let uint64 = 18446744073709551615
  t.is(bitsWithRiskPowerStringLength(uint64, 15, CharSet.base64), 30)
  t.is(bitsWithRiskPowerStringLength(uint64, 15, CharSet.base32), 36)
  t.is(bitsWithRiskPowerStringLength(uint64, 15, CharSet.base16), 45)
  t.is(bitsWithRiskPowerStringLength(uint64, 15, CharSet.base8),  59)
  t.is(bitsWithRiskPowerStringLength(uint64, 15, CharSet.base4),  89)
  t.is(bitsWithRiskPowerStringLength(uint64, 15, CharSet.base2), 177)
})

test('String lengths using bitsWithPowers', t => {
  t.is(bitsWithPowersStringLength( 3,  10, CharSet.base64),  9)
  t.is(bitsWithPowersStringLength( 3,  10, CharSet.base32), 11)
  t.is(bitsWithPowersStringLength( 3,  10, CharSet.base16), 14)
  t.is(bitsWithPowersStringLength( 3,  10, CharSet.base8),  18)
  t.is(bitsWithPowersStringLength( 3,  10, CharSet.base4),  27)
  t.is(bitsWithPowersStringLength( 3,  10, CharSet.base2),  53)
  
  t.is(bitsWithPowersStringLength( 5, 12, CharSet.base64), 13)
  t.is(bitsWithPowersStringLength( 5, 12, CharSet.base32), 15)
  t.is(bitsWithPowersStringLength( 5, 12, CharSet.base16), 19)
  t.is(bitsWithPowersStringLength( 5, 12, CharSet.base8),  25)
  t.is(bitsWithPowersStringLength( 5, 12, CharSet.base4),  37)
  t.is(bitsWithPowersStringLength( 5, 12, CharSet.base2),  73)
  
  t.is(bitsWithPowersStringLength(10,  9, CharSet.base64), 16)
  t.is(bitsWithPowersStringLength(10,  9, CharSet.base32), 20)
  t.is(bitsWithPowersStringLength(10,  9, CharSet.base16), 24)
  t.is(bitsWithPowersStringLength(10,  9, CharSet.base8),  32)
  t.is(bitsWithPowersStringLength(10,  9, CharSet.base4),  48)
  t.is(bitsWithPowersStringLength(10,  9, CharSet.base2),  96)
})

// preshing.com tests come from table at http://preshing.com/20110504/hash-collision-probabilities/
test('preshing.com, 32-bit column', t => {
  t.is(round(entropy.bits(30084,        10)), 32)
  t.is(round(entropy.bits( 9292,       100)), 32)
  t.is(round(entropy.bits( 2932,      1000)), 32)
  t.is(round(entropy.bits(  927,     10000)), 32)
  t.is(round(entropy.bits(  294,    100000)), 32)
  t.is(round(entropy.bits(   93,   1000000)), 32)
  t.is(round(entropy.bits(   30,  10000000)), 32)
  t.is(round(entropy.bits(   10, 100000000)), 32)

  t.is(round(entropy.bitsWithRiskPower(30084, 1)), 32)
  t.is(round(entropy.bitsWithRiskPower( 9292, 2)), 32)
  t.is(round(entropy.bitsWithRiskPower( 2932, 3)), 32)
  t.is(round(entropy.bitsWithRiskPower(  927, 4)), 32)
  t.is(round(entropy.bitsWithRiskPower(  294, 5)), 32)
  t.is(round(entropy.bitsWithRiskPower(   93, 6)), 32)
  t.is(round(entropy.bitsWithRiskPower(   30, 7)), 32)
  t.is(round(entropy.bitsWithRiskPower(   10, 8)), 32)  
})

test('preshing.com, 64-bit column', t => {
  t.is(round(entropy.bitsWithRiskPower(1970000000,  1)), 64)
  t.is(round(entropy.bitsWithRiskPower( 609000000,  2)), 64)
  t.is(round(entropy.bitsWithRiskPower( 192000000,  3)), 64)
  t.is(round(entropy.bitsWithRiskPower(  60700000,  4)), 64)
  t.is(round(entropy.bitsWithRiskPower(  19200000,  5)), 64)
  t.is(round(entropy.bitsWithRiskPower(   6070000,  6)), 64)
  t.is(round(entropy.bitsWithRiskPower(   1920000,  7)), 64)
  t.is(round(entropy.bitsWithRiskPower(    607401,  8)), 64)
  t.is(round(entropy.bitsWithRiskPower(    192077,  9)), 64)
  t.is(round(entropy.bitsWithRiskPower(     60704, 10)), 64)
  t.is(round(entropy.bitsWithRiskPower(     19208, 11)), 64)
  t.is(round(entropy.bitsWithRiskPower(      6074, 12)), 64)
  t.is(round(entropy.bitsWithRiskPower(      1921, 13)), 64)
  t.is(round(entropy.bitsWithRiskPower(       608, 14)), 64)
  t.is(round(entropy.bitsWithRiskPower(       193, 15)), 64)
  t.is(round(entropy.bitsWithRiskPower(        61, 16)), 64)
  t.is(round(entropy.bitsWithRiskPower(        20, 17)), 64)
  t.is(round(entropy.bitsWithRiskPower(         7, 18)), 64)
})

test('preshing.com, 160-bit column, modified and extended', t => {
  t.is(round(entropy.bitsWithPowers(24,  1)), 162)
  t.is(round(entropy.bitsWithPowers(23,  1)), 155)
  t.is(round(entropy.bitsWithPowers(24,  2)), 165)
  t.is(round(entropy.bitsWithPowers(23,  2)), 158)
  t.is(round(entropy.bitsWithPowers(23,  3)), 162)
  t.is(round(entropy.bitsWithPowers(22,  3)), 155)
  t.is(round(entropy.bitsWithPowers(23,  4)), 165)
  t.is(round(entropy.bitsWithPowers(22,  4)), 158)
  t.is(round(entropy.bitsWithPowers(22,  5)), 162)
  t.is(round(entropy.bitsWithPowers(21,  5)), 155)
  t.is(round(entropy.bitsWithPowers(22,  6)), 165)
  t.is(round(entropy.bitsWithPowers(21,  6)), 158)
  t.is(round(entropy.bitsWithPowers(21,  7)), 162)
  t.is(round(entropy.bitsWithPowers(20,  7)), 155)
  t.is(round(entropy.bitsWithPowers(21,  8)), 165)
  t.is(round(entropy.bitsWithPowers(20,  8)), 158)
  t.is(round(entropy.bitsWithPowers(20,  9)), 162)
  t.is(round(entropy.bitsWithPowers(19,  9)), 155)
  t.is(round(entropy.bitsWithPowers(20, 10)), 165)
  t.is(round(entropy.bitsWithPowers(19, 10)), 158)
  t.is(round(entropy.bitsWithPowers(19, 11)), 162)
  t.is(round(entropy.bitsWithPowers(18, 11)), 155)
  t.is(round(entropy.bitsWithPowers(19, 12)), 165)
  t.is(round(entropy.bitsWithPowers(18, 12)), 158)
  t.is(round(entropy.bitsWithPowers(18, 13)), 162)
  t.is(round(entropy.bitsWithPowers(17, 13)), 155)
  t.is(round(entropy.bitsWithPowers(18, 14)), 165)
  t.is(round(entropy.bitsWithPowers(17, 14)), 158)
  t.is(round(entropy.bitsWithPowers(17, 15)), 162)
  t.is(round(entropy.bitsWithPowers(16, 15)), 155)
  t.is(round(entropy.bitsWithPowers(17, 16)), 165)
  t.is(round(entropy.bitsWithPowers(16, 16)), 158)
  t.is(round(entropy.bitsWithPowers(16, 17)), 162)
  t.is(round(entropy.bitsWithPowers(15, 17)), 155)
  t.is(round(entropy.bitsWithPowers(16, 18)), 165)
  t.is(round(entropy.bitsWithPowers(15, 18)), 158)
  t.is(round(entropy.bitsWithPowers(15, 19)), 162)
  t.is(round(entropy.bitsWithPowers(14, 19)), 155)
  t.is(round(entropy.bitsWithPowers(15, 20)), 165)
  t.is(round(entropy.bitsWithPowers(14, 20)), 158)
  t.is(round(entropy.bitsWithPowers(14, 21)), 162)
  t.is(round(entropy.bitsWithPowers(13, 21)), 155)
  t.is(round(entropy.bitsWithPowers(14, 22)), 165)
  t.is(round(entropy.bitsWithPowers(13, 22)), 158)
  t.is(round(entropy.bitsWithPowers(13, 23)), 162)
  t.is(round(entropy.bitsWithPowers(12, 23)), 155)
  t.is(round(entropy.bitsWithPowers(13, 24)), 165)
  t.is(round(entropy.bitsWithPowers(12, 24)), 158)
  t.is(round(entropy.bitsWithPowers(12, 25)), 162)
  t.is(round(entropy.bitsWithPowers(11, 25)), 155)
  t.is(round(entropy.bitsWithPowers(12, 26)), 165)
  t.is(round(entropy.bitsWithPowers(11, 26)), 158)
  t.is(round(entropy.bitsWithPowers(11, 27)), 162)
  t.is(round(entropy.bitsWithPowers(10, 27)), 155)
  t.is(round(entropy.bitsWithPowers(11, 28)), 165)
  t.is(round(entropy.bitsWithPowers(10, 28)), 158)
  t.is(round(entropy.bitsWithPowers(10, 29)), 162)
  t.is(round(entropy.bitsWithPowers( 9, 29)), 155)
  t.is(round(entropy.bitsWithPowers(10, 30)), 165)
  t.is(round(entropy.bitsWithPowers( 9, 30)), 158)
})

const bitsStringLength = (total, risk, charSet) => {
  return random.string(entropy.bits(total, risk), charSet).length
}

const bitsWithRiskPowerStringLength = (total, rPower, charSet) => {
  return random.string(entropy.bitsWithRiskPower(total, rPower), charSet).length
}

const bitsWithPowersStringLength = (tPower, rPower, charSet) => {
  return random.string(entropy.bitsWithPowers(tPower, rPower), charSet).length
}

