import Entropy from '../lib/entropy'
import Random from '../lib/random'
import {charSet64, charSet32, charSet16, charSet8, charSet4, charSet2} from '../lib/charSet'

import test from 'ava'

const round = Math.round

test('zero entropy', t => {
  t.is(Entropy.bits(0, 10), 0)
})

test('Bits using total, risk', t => {
  t.is(round(Entropy.bits(    10,   1000)),   15)
  t.is(round(Entropy.bits(    10,  10000)),   19)
  t.is(round(Entropy.bits(    10, 100000)),   22)

  t.is(round(Entropy.bits(   100,   1000)),   22)
  t.is(round(Entropy.bits(   100,  10000)),   26)
  t.is(round(Entropy.bits(   100, 100000)),   29)
  
  t.is(round(Entropy.bits(  1000,   1000)),   29)
  t.is(round(Entropy.bits(  1000,  10000)),   32)
  t.is(round(Entropy.bits(  1000, 100000)),   36)

  t.is(round(Entropy.bits( 10000,   1000)),   36)
  t.is(round(Entropy.bits( 10000,  10000)),   39)
  t.is(round(Entropy.bits( 10000, 100000)),   42)
  
  t.is(round(Entropy.bits(100000,   1000)),   42)
  t.is(round(Entropy.bits(100000,  10000)),   46)
  t.is(round(Entropy.bits(100000, 100000)),   49)
})

// CxTBD Remove bitsWithRiskPower in next release
test('Bits using total, risk power', t => {
  t.is(round(Entropy.bitsWithRiskPower(    10, 3)), 15)
  t.is(round(Entropy.bitsWithRiskPower(    10, 4)), 19)
  t.is(round(Entropy.bitsWithRiskPower(    10, 5)), 22)
  
  t.is(round(Entropy.bitsWithRiskPower(   100, 3)), 22)
  t.is(round(Entropy.bitsWithRiskPower(   100, 4)), 26)
  t.is(round(Entropy.bitsWithRiskPower(   100, 5)), 29)
  
  t.is(round(Entropy.bitsWithRiskPower(  1000, 3)), 29)
  t.is(round(Entropy.bitsWithRiskPower(  1000, 4)), 32)
  t.is(round(Entropy.bitsWithRiskPower(  1000, 5)), 36)
  t.is(round(Entropy.bitsWithRiskPower( 10000, 3)), 36)
  t.is(round(Entropy.bitsWithRiskPower( 10000, 4)), 39)
  t.is(round(Entropy.bitsWithRiskPower( 10000, 5)), 42)
  
  t.is(round(Entropy.bitsWithRiskPower(100000, 3)), 42)
  t.is(round(Entropy.bitsWithRiskPower(100000, 4)), 46)
  t.is(round(Entropy.bitsWithRiskPower(100000, 5)), 49)
})

// CxTBD Remove bitsWithPowers in next release
test('Bits using total power, risk power', t => {
  t.is(round(Entropy.bitsWithPowers(1, 3)), 15)
  t.is(round(Entropy.bitsWithPowers(1, 4)), 19)
  t.is(round(Entropy.bitsWithPowers(1, 5)), 22)
  
  t.is(round(Entropy.bitsWithPowers(2, 3)), 22)
  t.is(round(Entropy.bitsWithPowers(2, 4)), 26)
  t.is(round(Entropy.bitsWithPowers(2, 5)), 29)
  
  t.is(round(Entropy.bitsWithPowers(3, 3)), 29)
  t.is(round(Entropy.bitsWithPowers(3, 4)), 32)
  t.is(round(Entropy.bitsWithPowers(3, 5)), 36)
  
  t.is(round(Entropy.bitsWithPowers(4, 3)), 36)
  t.is(round(Entropy.bitsWithPowers(4, 4)), 39)
  t.is(round(Entropy.bitsWithPowers(4, 5)), 42)
  
  t.is(round(Entropy.bitsWithPowers(5, 3)), 42)
  t.is(round(Entropy.bitsWithPowers(5, 4)), 46)
  t.is(round(Entropy.bitsWithPowers(5, 5)), 49)
})

// preshing.com tests come from table at http://preshing.com/20110504/hash-collision-probabilities/
test('preshing.com, 32-bit column', t => {
  t.is(round(Entropy.bits(30084,  10)), 32)
  t.is(round(Entropy.bits( 9292, 100)), 32)
  t.is(round(Entropy.bits( 2932, 1e3)), 32)
  t.is(round(Entropy.bits(  927, 1e4)), 32)
  t.is(round(Entropy.bits(  294, 1e5)), 32)
  t.is(round(Entropy.bits(   93, 1e6)), 32)
  t.is(round(Entropy.bits(   30, 1e7)), 32)
  t.is(round(Entropy.bits(   10, 1e8)), 32)
})

test('preshing.com, 64-bit column', t => {
  t.is(round(Entropy.bits(1.97e9,   10)), 64)
  t.is(round(Entropy.bits(6.09e8,  100)), 64)
  t.is(round(Entropy.bits(1.92e8,  1e3)), 64)
  t.is(round(Entropy.bits(6.07e7,  1e4)), 64)
  t.is(round(Entropy.bits(1.92e7,  1e5)), 64)
  t.is(round(Entropy.bits(6.07e6,  1e6)), 64)
  t.is(round(Entropy.bits(1.92e6,  1e7)), 64)
  t.is(round(Entropy.bits(607401,  1e8)), 64)
  t.is(round(Entropy.bits(192077,  1e9)), 64)
  t.is(round(Entropy.bits( 60704, 1e10)), 64)
  t.is(round(Entropy.bits( 19208, 1e11)), 64)
  t.is(round(Entropy.bits(  6074, 1e12)), 64)
  t.is(round(Entropy.bits(  1921, 1e13)), 64)
  t.is(round(Entropy.bits(   608, 1e14)), 64)
  t.is(round(Entropy.bits(   193, 1e15)), 64)
  t.is(round(Entropy.bits(    61, 1e16)), 64)
  t.is(round(Entropy.bits(    20, 1e17)), 64)
  t.is(round(Entropy.bits(     7, 1e18)), 64)
})

test('preshing.com, 160-bit column, modified and extended', t => {
  t.is(round(Entropy.bits(1e24,   10)), 162)
  t.is(round(Entropy.bits(1e23,   10)), 155)
  t.is(round(Entropy.bits(1e24,  100)), 165)
  t.is(round(Entropy.bits(1e23,  100)), 158)
  t.is(round(Entropy.bits(1e23,  1e3)), 162)
  t.is(round(Entropy.bits(1e22,  1e3)), 155)
  t.is(round(Entropy.bits(1e23,  1e4)), 165)
  t.is(round(Entropy.bits(1e22,  1e4)), 158)
  t.is(round(Entropy.bits(1e22,  1e5)), 162)
  t.is(round(Entropy.bits(1e21,  1e5)), 155)
  t.is(round(Entropy.bits(1e22,  1e6)), 165)
  t.is(round(Entropy.bits(1e21,  1e6)), 158)
  t.is(round(Entropy.bits(1e21,  1e7)), 162)
  t.is(round(Entropy.bits(1e20,  1e7)), 155)
  t.is(round(Entropy.bits(1e21,  1e8)), 165)
  t.is(round(Entropy.bits(1e20,  1e8)), 158)
  t.is(round(Entropy.bits(1e20,  1e9)), 162)
  t.is(round(Entropy.bits(1e19,  1e9)), 155)
  t.is(round(Entropy.bits(1e20, 1e10)), 165)
  t.is(round(Entropy.bits(1e19, 1e10)), 158)
  t.is(round(Entropy.bits(1e19, 1e11)), 162)
  t.is(round(Entropy.bits(1e18, 1e11)), 155)
  t.is(round(Entropy.bits(1e19, 1e12)), 165)
  t.is(round(Entropy.bits(1e18, 1e12)), 158)
  t.is(round(Entropy.bits(1e18, 1e13)), 162)
  t.is(round(Entropy.bits(1e17, 1e13)), 155)
  t.is(round(Entropy.bits(1e18, 1e14)), 165)
  t.is(round(Entropy.bits(1e17, 1e14)), 158)
  t.is(round(Entropy.bits(1e17, 1e15)), 162)
  t.is(round(Entropy.bits(1e16, 1e15)), 155)
  t.is(round(Entropy.bits(1e17, 1e16)), 165)
  t.is(round(Entropy.bits(1e16, 1e16)), 158)
  t.is(round(Entropy.bits(1e16, 1e17)), 162)
  t.is(round(Entropy.bits(1e15, 1e17)), 155)
  t.is(round(Entropy.bits(1e16, 1e18)), 165)
  t.is(round(Entropy.bits(1e15, 1e18)), 158)
  t.is(round(Entropy.bits(1e15, 1e19)), 162)
  t.is(round(Entropy.bits(1e14, 1e19)), 155)
  t.is(round(Entropy.bits(1e15, 1e20)), 165)
  t.is(round(Entropy.bits(1e14, 1e20)), 158)
  t.is(round(Entropy.bits(1e14, 1e21)), 162)
  t.is(round(Entropy.bits(1e13, 1e21)), 155)
  t.is(round(Entropy.bits(1e14, 1e22)), 165)
  t.is(round(Entropy.bits(1e13, 1e22)), 158)
  t.is(round(Entropy.bits(1e13, 1e23)), 162)
  t.is(round(Entropy.bits(1e12, 1e23)), 155)
  t.is(round(Entropy.bits(1e13, 1e24)), 165)
  t.is(round(Entropy.bits(1e12, 1e24)), 158)
  t.is(round(Entropy.bits(1e12, 1e25)), 162)
  t.is(round(Entropy.bits(1e11, 1e25)), 155)
  t.is(round(Entropy.bits(1e12, 1e26)), 165)
  t.is(round(Entropy.bits(1e11, 1e26)), 158)
  t.is(round(Entropy.bits(1e11, 1e27)), 162)
  t.is(round(Entropy.bits(1e10, 1e27)), 155)
  t.is(round(Entropy.bits(1e11, 1e28)), 165)
  t.is(round(Entropy.bits(1e10, 1e28)), 158)
  t.is(round(Entropy.bits(1e10, 1e29)), 162)
  t.is(round(Entropy.bits(1e9,  1e29)), 155)
  t.is(round(Entropy.bits(1e10, 1e30)), 165)
  t.is(round(Entropy.bits(1e9,  1e30)), 158)
})
