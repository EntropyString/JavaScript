const entropy = require('./entropy-string')

let bits = 48
console.log('\n48-bit string using base32 characters')
console.log('  ' + entropy.randomString(bits, entropy.charSet32))

console.log('\n48-bit string using hex characters')
console.log('  ' + entropy.randomString(bits, entropy.charSet16))

console.log('\n48-bit string using uppercase hex characters')
entropy.charSet16.use('1234567890ABCDEF')
console.log('  ' + entropy.randomString(bits, entropy.charSet16))

console.log('\nBase 32 character string with a 1 in a million chance of a repeat in 30 such strings')
bits = entropy.bits(30, 1000000)
console.log('  ' + entropy.randomString(bits, entropy.charSet32))

console.log('\nBase 32 character string with a 1 in a trillion chance of a repeat in 10 million such strings')
bits = entropy.bitsWithPowers(7, 12)
console.log('  ' + entropy.randomString(bits, entropy.charSet32))

bits = 128
console.log('\nOWASP session ID using file system and URL safe characters')
console.log('  ' + entropy.randomString(bits, entropy.charSet64))

console.log('')
