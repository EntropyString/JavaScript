// Cryptographically strong and not...

const { default: Entropy } = require('./entropy')

const entropy = new Entropy({ bits: 80 })
let string = entropy.string()
console.log(`\n  CSPRNG base 32 80-bit string : ${string}`)

string = entropy.stringPRNG()
console.log(`\n  PRNG base 32 80-bit string : ${string}\n`)

