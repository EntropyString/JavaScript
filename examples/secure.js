// Cryptographically strong and not...

const { default: Entropy } = require('./entropy')

const entropy = new Entropy()
let string = entropy.string(80)
console.log(`\n  CSPRNG base 32 80-bit string : ${string}`)

string = entropy.stringRandom(80)
console.log(`\n  PRNG base 32 80-bit string : ${string}\n`)

