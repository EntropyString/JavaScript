const random  = require('./entropy-string').random
const entropy = require('./entropy-string').entropy
const CharSet = require('./entropy-string').CharSet

const print = console.log

let bits = 48
print('\n48-bit string using base32 characters')
print('  ' + random.string(bits))

print('\n48-bit string using hex characters')
print('  ' + random.string(bits, CharSet.base16))

print('\n48-bit string using uppercase hex characters')
CharSet.base16.use('1234567890ABCDEF')
print('  ' + random.string(bits, CharSet.base16))

print('\nBase 32 character string with a 1 in a million chance of a repeat in 30 such strings')
bits = entropy.bits(30, 1000000)
print('  ' + random.string(bits, CharSet.base32))

print('\nBase 32 character string with a 1 in a trillion chance of a repeat in 10 million such strings')
bits = entropy.bitsWithPowers(7, 12)
print('  ' + random.string(bits, CharSet.base32))

print('\nAs above, but with "my" base 8 characters')
CharSet.base8.use('dingosky')
print('  ' + random.string(bits, CharSet.base8))

print('\nOWASP session ID using file system and URL safe characters')
print('  ' + random.sessionId())

print('')
