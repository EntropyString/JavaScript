import entropy from '../lib/entropy'
import test from 'ava'

const round = Math.round

test('zero entropy', t => {
  t.is(entropy.bits(0, 10), 0)
})

test('Char Set 64 Strings', t => {
  const charSet = entropy.charSet64
  t.is(entropyString( 6, charSet, [0xdd]), '3')
  t.is(entropyString(12, charSet, [0x78, 0xfc]), 'eP')
  t.is(entropyString(18, charSet, [0xc5, 0x6f, 0x21]), 'xW8')
  t.is(entropyString(24, charSet, [0xc9, 0x68, 0xc7]), 'yWjH')
  t.is(entropyString(30, charSet, [0xa5, 0x62, 0x20, 0x87]), 'pWIgh')
  t.is(entropyString(36, charSet, [0x39, 0x51, 0xca, 0xcc, 0x8b]), 'OVHKzI')
  t.is(entropyString(42, charSet, [0x83, 0x89, 0x00, 0xc7, 0xf4, 0x02]), 'g4kAx_Q')
  t.is(entropyString(48, charSet, [0x51, 0xbc, 0xa8, 0xc7, 0xc9, 0x17]), 'Ubyox8kX')
  t.is(entropyString(54, charSet, [0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52]), '0uPp2hmXU')
  t.is(entropyString(60, charSet, [0xd9, 0x39, 0xc1, 0xaf, 0x1e, 0x2e, 0x69, 0x48]), '2TnBrx4uaU')
  t.is(entropyString(66, charSet, [0x78, 0x3f, 0xfd, 0x93, 0xd1, 0x06, 0x90, 0x4b, 0xd6]), 'eD_9k9EGkEv')
  t.is(entropyString(72, charSet, [0x9d, 0x99, 0x4e, 0xa5, 0xd2, 0x3f, 0x8c, 0x86, 0x80]), 'nZlOpdI_jIaA')
})

test('Char Set 32 Strings', t => {
  const charSet = entropy.charSet32
  t.is(entropyString( 5, charSet, [0xdd]), 'N')
  t.is(entropyString(10, charSet, [0x78, 0xfc]), 'p6')
  t.is(entropyString(15, charSet, [0x78, 0xfc]), 'p6R')
  t.is(entropyString(20, charSet, [0xc5, 0x6f, 0x21]), 'JFHt')
  t.is(entropyString(25, charSet, [0xa5, 0x62, 0x20, 0x87]), 'DFr43')
  t.is(entropyString(30, charSet, [0xa5, 0x62, 0x20, 0x87]), 'DFr433')
  t.is(entropyString(35, charSet, [0x39, 0x51, 0xca, 0xcc, 0x8b]), 'b8dPFB7')
  t.is(entropyString(40, charSet, [0x39, 0x51, 0xca, 0xcc, 0x8b]), 'b8dPFB7h')
  t.is(entropyString(45, charSet, [0x83, 0x89, 0x00, 0xc7, 0xf4, 0x02]), 'qn7q3rTD2')
  t.is(entropyString(50, charSet, [0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52]), 'MhrRBGqLtQ')
  t.is(entropyString(55, charSet, [0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52]), 'MhrRBGqLtQf')
})

test('Char Set 16 Strings', t => {
  const charSet = entropy.charSet16
  t.is(entropyString( 4, charSet, [0x9d]), '9')
  t.is(entropyString( 8, charSet, [0xae]), 'ae')
  t.is(entropyString(12, charSet, [0x01, 0xf2]), '01f')
  t.is(entropyString(16, charSet, [0xc7, 0xc9]), 'c7c9')
  t.is(entropyString(20, charSet, [0xc7, 0xc9, 0x00]), 'c7c90')
})

test('Char Set 8 Strings', t => {
  const charSet = entropy.charSet8
  t.is(entropyString( 3, charSet, [0x5a]), '2')
  t.is(entropyString( 6, charSet, [0x5a]), '26')
  t.is(entropyString( 9, charSet, [0x21, 0xa4]), '103')
  t.is(entropyString(12, charSet, [0x21, 0xa4]), '1032')
  t.is(entropyString(15, charSet, [0xda, 0x19]), '66414')
  t.is(entropyString(18, charSet, [0xfd, 0x93, 0xd1]), '773117')
  t.is(entropyString(21, charSet, [0xfd, 0x93, 0xd1]), '7731172')
  t.is(entropyString(24, charSet, [0xfd, 0x93, 0xd1]), '77311721')
  t.is(entropyString(27, charSet, [0xc7, 0xc9, 0x07, 0xc9]), '617444076')
  t.is(entropyString(30, charSet, [0xc7, 0xc9, 0x07, 0xc9]), '6174440762')  
})

test('Char Set 4 Strings', t => {
  const charSet = entropy.charSet4
  t.is(entropyString( 2, charSet, [0x5a]), 'T')
  t.is(entropyString( 4, charSet, [0x5a]), 'TT')
  t.is(entropyString( 6, charSet, [0x93]), 'CTA')
  t.is(entropyString( 8, charSet, [0x93]), 'CTAG')
  t.is(entropyString(10, charSet, [0x20, 0xf1]), 'ACAAG')
  t.is(entropyString(12, charSet, [0x20, 0xf1]), 'ACAAGG')
  t.is(entropyString(14, charSet, [0x20, 0xf1]), 'ACAAGGA')
  t.is(entropyString(16, charSet, [0x20, 0xf1]), 'ACAAGGAT')
})

test('Char Set 2 Strings', t => {
  const charSet = entropy.charSet2
  t.is(entropyString( 1, charSet, [0x27]), '0')
  t.is(entropyString( 2, charSet, [0x27]), '00')
  t.is(entropyString( 3, charSet, [0x27]), '001')
  t.is(entropyString( 4, charSet, [0x27]), '0010')
  t.is(entropyString( 5, charSet, [0x27]), '00100')
  t.is(entropyString( 6, charSet, [0x27]), '001001')
  t.is(entropyString( 7, charSet, [0x27]), '0010011')
  t.is(entropyString( 8, charSet, [0x27]), '00100111')
  t.is(entropyString( 9, charSet, [0xe3, 0xe9]), '111000111')
  t.is(entropyString(16, charSet, [0xe3, 0xe9]), '1110001111101001')
})

test('Char Set 64 string lengths', t => {
  const charSet = entropy.charSet64
  const fns = [entropyStringLength, entropyStringLengthNoCrypto]
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
  const charSet = entropy.charSet32
  const fns = [entropyStringLength, entropyStringLengthNoCrypto]
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
  const charSet = entropy.charSet16
  const fns = [entropyStringLength, entropyStringLengthNoCrypto]
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
  const charSet = entropy.charSet8
  const fns = [entropyStringLength, entropyStringLengthNoCrypto]
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
  const charSet = entropy.charSet4
  const fns = [entropyStringLength, entropyStringLengthNoCrypto]
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
  const charSet = entropy.charSet2
  const fns = [entropyStringLength, entropyStringLengthNoCrypto]
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
  t.is(bitsStringLength(30, 1000000, entropy.charSet64),  5)
  t.is(bitsStringLength(30, 1000000, entropy.charSet32),  6)
  t.is(bitsStringLength(30, 1000000, entropy.charSet16),  8)
  t.is(bitsStringLength(30, 1000000, entropy.charSet8),  10)
  t.is(bitsStringLength(30, 1000000, entropy.charSet4),  15)
  t.is(bitsStringLength(30, 1000000, entropy.charSet2),  29)
})

test('String lengths using bitsWithRiskPower', t => {
  t.is(bitsWithRiskPowerStringLength(30, 6, entropy.charSet64),  5)
  t.is(bitsWithRiskPowerStringLength(30, 6, entropy.charSet32),  6)
  t.is(bitsWithRiskPowerStringLength(30, 6, entropy.charSet16),  8)
  t.is(bitsWithRiskPowerStringLength(30, 6, entropy.charSet8),  10)
  t.is(bitsWithRiskPowerStringLength(30, 6, entropy.charSet4),  15)
  t.is(bitsWithRiskPowerStringLength(30, 6, entropy.charSet2),  29)

  t.is(bitsWithRiskPowerStringLength(1000,   10, entropy.charSet64),  9)
  t.is(bitsWithRiskPowerStringLength(1000,   10, entropy.charSet32), 11)
  t.is(bitsWithRiskPowerStringLength(1000,   10, entropy.charSet16), 14)
  t.is(bitsWithRiskPowerStringLength(1000,   10, entropy.charSet8),  18)
  t.is(bitsWithRiskPowerStringLength(1000,   10, entropy.charSet4),  27)
  t.is(bitsWithRiskPowerStringLength(1000,   10, entropy.charSet2),  53)

  t.is(bitsWithRiskPowerStringLength(100000, 12, entropy.charSet64), 13)
  t.is(bitsWithRiskPowerStringLength(100000, 12, entropy.charSet32), 15)
  t.is(bitsWithRiskPowerStringLength(100000, 12, entropy.charSet16), 19)
  t.is(bitsWithRiskPowerStringLength(100000, 12, entropy.charSet8),  25)
  t.is(bitsWithRiskPowerStringLength(100000, 12, entropy.charSet4),  37)
  t.is(bitsWithRiskPowerStringLength(100000, 12, entropy.charSet2),  73)

  let uint64 = 18446744073709551615
  t.is(bitsWithRiskPowerStringLength(uint64, 15, entropy.charSet64), 30)
  t.is(bitsWithRiskPowerStringLength(uint64, 15, entropy.charSet32), 36)
  t.is(bitsWithRiskPowerStringLength(uint64, 15, entropy.charSet16), 45)
  t.is(bitsWithRiskPowerStringLength(uint64, 15, entropy.charSet8),  59)
  t.is(bitsWithRiskPowerStringLength(uint64, 15, entropy.charSet4),  89)
  t.is(bitsWithRiskPowerStringLength(uint64, 15, entropy.charSet2), 177)
})

test('String lengths using bitsWithPowers', t => {
  t.is(bitsWithPowersStringLength( 3, 10, entropy.charSet64),  9)
  t.is(bitsWithPowersStringLength( 3,  10, entropy.charSet32), 11)
  t.is(bitsWithPowersStringLength( 3,  10, entropy.charSet16), 14)
  t.is(bitsWithPowersStringLength( 3,  10, entropy.charSet8),  18)
  t.is(bitsWithPowersStringLength( 3,  10, entropy.charSet4),  27)
  t.is(bitsWithPowersStringLength( 3,  10, entropy.charSet2),  53)
  
  t.is(bitsWithPowersStringLength( 5, 12, entropy.charSet64), 13)
  t.is(bitsWithPowersStringLength( 5, 12, entropy.charSet32), 15)
  t.is(bitsWithPowersStringLength( 5, 12, entropy.charSet16), 19)
  t.is(bitsWithPowersStringLength( 5, 12, entropy.charSet8),  25)
  t.is(bitsWithPowersStringLength( 5, 12, entropy.charSet4),  37)
  t.is(bitsWithPowersStringLength( 5, 12, entropy.charSet2),  73)
  
  t.is(bitsWithPowersStringLength(10,  9, entropy.charSet64), 16)
  t.is(bitsWithPowersStringLength(10,  9, entropy.charSet32), 20)
  t.is(bitsWithPowersStringLength(10,  9, entropy.charSet16), 24)
  t.is(bitsWithPowersStringLength(10,  9, entropy.charSet8),  32)
  t.is(bitsWithPowersStringLength(10,  9, entropy.charSet4),  48)
  t.is(bitsWithPowersStringLength(10,  9, entropy.charSet2),  96)
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

test('Invalid bytes', t => {
  t.is(invalidBytes( 7, entropy.charSet64, [1]), true)
  t.is(invalidBytes(13, entropy.charSet64, [1,2]), true)
  t.is(invalidBytes(25, entropy.charSet64, [1,2,3]), true)
  t.is(invalidBytes(31, entropy.charSet64, [1,2,3,4]), true)
  
  t.is(invalidBytes( 6, entropy.charSet32, [1]), true)
  t.is(invalidBytes(16, entropy.charSet32, [1,2]), true)
  t.is(invalidBytes(21, entropy.charSet32, [1,2,3]), true)
  t.is(invalidBytes(31, entropy.charSet32, [1,2,3,4]), true)
  t.is(invalidBytes(41, entropy.charSet32, [1,2,3,4,5]), true)
  t.is(invalidBytes(46, entropy.charSet32, [1,2,3,4,5,6]), true)
  
  t.is(invalidBytes( 9, entropy.charSet16, [1]), true)
  t.is(invalidBytes(17, entropy.charSet16, [1,2]), true)
  
  t.is(invalidBytes( 7, entropy.charSet8,  [1]), true)
  t.is(invalidBytes(16, entropy.charSet8,  [1,2]), true)
  t.is(invalidBytes(25, entropy.charSet8,  [1,2,3]), true)
  t.is(invalidBytes(31, entropy.charSet8,  [1,2,3,4]), true)

  t.is(invalidBytes( 9, entropy.charSet4,  [1]), true)
  t.is(invalidBytes(17, entropy.charSet4,  [1,2]), true)
  
  t.is(invalidBytes( 9, entropy.charSet2,  [1]), true)
  t.is(invalidBytes(17, entropy.charSet2,  [1,2]), true)

  t.is(invalidBytes(32, entropy.charSet32, [250, 200, 150, 100]), true)
})

test('Invalid Char Set', t => {
  try {
    entropy.randomString(5, entropy.charSet6)
    t.fail()
  }
  catch(error) {
    t.pass()
  }
})

test('Custom 64 chars', t => {
  let charSet = entropy.charSet64
  try {
    charSet.use('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ9876543210_-')
    let bytes = new Uint8Array([0x9d, 0x99, 0x4e, 0xa5, 0xd2, 0x3f, 0x8c, 0x86, 0x80])
    let string = entropy.randomString(72, charSet, bytes)
                                               
    t.is(string, 'NzLoPDi-JiAa')
  }
  catch(error) {
    t.fail()
  }

  t.is(invalidChars(charSet, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ab'), true)
  t.is(invalidChars(charSet, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)!@#$%^&*(+=0'), true)
  t.is(invalidChars(charSet, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)!@#$%^&*(+'), true)
})

test('Custom 32 chars', t => {
  let charSet = entropy.charSet32
  try {
    charSet.use('2346789BDFGHJMNPQRTbdfghjlmnpqrt')
    let bytes = new Uint8Array([0xd2, 0xe3, 0xe9, 0xda, 0x19, 0x97, 0x52])
    let string = entropy.randomString(55, charSet, bytes)
    t.is(string, 'mHRrbgQlTqF')
  }
  catch(error) {
    t.fail()
  }

  t.is(invalidChars(charSet, '01234567890123456789012345678901'),  true)
  t.is(invalidChars(charSet, '0123456789abcdefghijklmnopqrstu'),   true)
  t.is(invalidChars(charSet, '0123456789abcdefghijklmnopqrstuvw'), true)
})

test('Custom 16 chars', t => {
  let charSet = entropy.charSet16
  try {
    charSet.use('0123456789ABCDEF')
    let string = entropy.randomString(20, charSet, new Uint8Array([0xc7, 0xc9, 0x00]))
    t.is(string, 'C7C90')
  }
  catch(error) {
    t.fail()
  }

  t.is(invalidChars(charSet, '0123456789abcde0'),  true)
  t.is(invalidChars(charSet, '0123456789abcde'),   true)
  t.is(invalidChars(charSet, '0123456789abcdefg'), true)
})

test('Custom 8 chars', t => {
  let charSet = entropy.charSet8
  try {
    charSet.use('abcdefgh')
    let string = entropy.randomString(30, charSet, new Uint8Array([0xc7, 0xc9, 0x07, 0xc9]))
    t.is(string, 'gbheeeahgc')
  }
  catch(error) {
    t.fail()
  }

  t.is(invalidChars(charSet, 'abcdefga'),  true)
  t.is(invalidChars(charSet, 'abcdefg'),   true)
  t.is(invalidChars(charSet, 'abcdefghi'), true)
})

test('Custom 4 chars', t => {
  let charSet = entropy.charSet4
  try {
    charSet.use('atcg')
    let string = entropy.randomString(16, charSet, new Uint8Array([0x20, 0xf1]))
    t.is(string, 'acaaggat')
  }
  catch(error) {
    t.fail()
  }

  t.is(invalidChars(charSet, 'abcb'),  true)
  t.is(invalidChars(charSet, 'abc'),   true)
  t.is(invalidChars(charSet, 'abcde'), true)
})

test('Custom 2 chars', t => {
  let charSet = entropy.charSet2
  try {
    charSet.use('HT')
    let string = entropy.randomString(16, charSet, new Uint8Array([0xe3, 0xe9]))
    t.is(string, 'TTTHHHTTTTTHTHHT')
  }
  catch(error) {
    t.fail()
  }

  try {
    charSet.use('TT')
    t.fail()
  }
  catch(error) {
    t.pass()
  }

  try {
    charSet.use('T')
    t.fail()
  }
  catch(error) {
    t.pass()
  }
  
  try {
    charSet.use('HT0')
    t.fail()
  }
  catch(error) {
    t.pass()
  }
})

test('No crypto', t => {
  let charSet = entropy.charSet32
  t.is(entropyStringLengthNoCrypto(5, charSet), 1)
  t.is(entropyStringLengthNoCrypto(6, charSet), 2)
})

const entropyString = (bits, charSet, arr) => {
  let bytes = Buffer.from(arr)
  return entropy.randomString(bits, charSet, bytes)
}

const entropyStringLength = (bits, charSet) => {
  return entropy.randomString(bits, charSet).length
}

const entropyStringLengthNoCrypto = (bits, charSet) => {
  return entropy.randomString(bits, charSet, false).length
}

const bitsStringLength = (total, risk, charSet) => {
  return entropyStringLength(entropy.bits(total, risk), charSet)
}

const bitsWithRiskPowerStringLength = (total, rPower, charSet) => {
  return entropyStringLength(entropy.bitsWithRiskPower(total, rPower), charSet)
}

const bitsWithPowersStringLength = (tPower, rPower, charSet) => {
  return entropyStringLength(entropy.bitsWithPowers(tPower, rPower), charSet)
}

const invalidBytes = (bits, charSet, bytes) => {
  try {
    entropyString(bits, charSet, bytes)
    return false
  }
  catch(error) {
    return true
  }
}

const invalidChars = (charSet, chars) => {
  try {
    charSet.use(chars)
    return false
  }
  catch(error) {
    return true
  }
}
