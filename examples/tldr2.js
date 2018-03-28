// Base32 string with a 1 in a billion chance of repeat in a million strings

const { Random, Entropy } = require('./entropy-string')

const random = new Random()
const bits = Entropy.bits(1e6, 1e9)
const string = random.string(bits)

console.log(`\n  Base32 string with a 1 in a billion chance of repeat in a million strings: ${string}\n`)
