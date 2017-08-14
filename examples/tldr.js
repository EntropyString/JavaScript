import {Random, Entropy, charSet16, charSet32, charSet64} from './entropy-string'

var print = console.log

var random = new Random()

print('\nOWASP session ID using base32 characters: ' + random.sessionID())

print('\nSession ID using file system and URL safe characters: ' + random.sessionID(charSet64))

print('\n192-bit entropy string using base32 characters: ' + random.string(192))

random = new Random(charSet16)
print('\n48-bit entropy string using hex characters: ' + random.string(48))

random.useChars('1234567890ABCDEF')
print('\n48-bit entropy string using uppercase hex characters: ' + random.string(48))

random.use(charSet32)
var bits = Entropy.bits(30, 1000000)
print('\nBase 32 string with a 1 in a million chance of a repeat in 30 strings: ' +
      random.string(bits))

bits = Entropy.bitsWithPowers(8, 12)
print('\nBase 64 string with a 1 in a trillion chance of a repeat in 100 million strings: ' +
      random.string(bits, charSet64))

print('');
