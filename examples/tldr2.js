// Base32 string with a 1 in a trillion chance of repeat in 10 million strings

const { default: Entropy } = require('./entropy')

const bits = Entropy.bits(1e7, 1e12)
const entropy = new Entropy()
const string = entropy.string(bits)

console.log(`\n  Base32 string with a 1 in a trillion chance of repeat in 10 million strings: ${string}\n`)
