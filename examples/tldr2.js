// Base32 string with a 1 in a billion chance of repeat in a million strings

const { default: Entropy, entropyBits } = require('./entropy')

const entropy = new Entropy()
const bits = entropyBits(1e6, 1e9)
const string = entropy.string(bits)

console.log(`\n  Base32 string with a 1 in a billion chance of repeat in a million strings: ${string}\n`)
