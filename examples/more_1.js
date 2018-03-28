// Ten thousand potential strings with 1 in a million risk of repeat

const { default: Entropy, entropyBits } = require('./entropy')

const entropy = new Entropy()
const bits = entropyBits(10000, 1000000)
const string = entropy.string(bits)

console.log(`\n  Ten thousand potential strings with 1 in a million risk of repeat: ${string}\n`)

