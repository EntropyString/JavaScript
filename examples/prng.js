// Using PRNG (not default CSPRNG)

const { default: Entropy } = require('./entropy')

const entropy = new Entropy({ bits: 80, prng: true })
const string = entropy.string()
console.log(`\n  PRNG 80-bit string : ${string}\n`)

