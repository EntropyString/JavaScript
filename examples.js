import {Random, Entropy, CharSet} from './entropy-string'

const print = console.log

let random = new Random()

print('\nOWASP session ID using file system and URL safe characters')
print('  ' + random.sessionID())

print('\n48-bit string using base32 characters')
print('  ' + random.string(48))

print('\n48-bit string using hex characters')
random.use(random.charSet16)
print('  ' + random.string(48))

print('\n48-bit string using uppercase hex characters')
random.useChars('1234567890ABCDEF')
print('  ' + random.string(48))

print('\n1 in a million chance of a repeat in 30 base32 strings')
let bits = Entropy.bits(30, 1000000)
random.use(random.charSet32)
print('  ' + random.string(bits))

print('\n1 in a trillion chance of a repeat in 10 million base64 strings')
bits = Entropy.bitsWithPowers(7, 12)
print('  ' + random.string(bits, CharSet.base64))

print('')
