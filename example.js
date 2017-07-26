const entropy = require('./entropy-string')
const print = console.log

let bits = 48
print('\n48-bit string using base32 characters')
print('  ' + entropy.string(bits, entropy.charSet32))

print('\n48-bit string using hex characters')
print('  ' + entropy.string(bits, entropy.charSet16))

print('\n48-bit string using uppercase hex characters')
entropy.charSet16.use('1234567890ABCDEF')
print('  ' + entropy.string(bits, entropy.charSet16))

print('\nBase 32 character string with a 1 in a million chance of a repeat in 30 such strings')
bits = entropy.bits(30, 1000000)
print('  ' + entropy.string(bits, entropy.charSet32))

print('\nBase 32 character string with a 1 in a trillion chance of a repeat in 10 million such strings')
bits = entropy.bitsWithPowers(7, 12)
print('  ' + entropy.string(bits, entropy.charSet32))

print('\nAs above, but with "my" characters"')
entropy.charSet8.use('dingosky')
print('  ' + entropy.string(bits, entropy.charSet8))

bits = 128
print('\nOWASP session ID using file system and URL safe characters')
print('  ' + entropy.string(bits, entropy.charSet64))

print('')
