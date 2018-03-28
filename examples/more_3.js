// Ten billion potential strings with 1 in a trillion risk of repeat

const { default: Entropy, entropyBits } = require('./entropy')

const entropy = new Entropy()
const bits = entropyBits(1e10, 1e12)
const string = entropy.string(bits)

console.log(`\n  Ten billion potential strings with 1 in a trillion risk of repeat: ${string}\n`)
