// Ten thousand potential strings with 1 in a million risk of repeat

const { default: Entropy } = require('./entropy')

const bits = Entropy.bits(10000, 1000000)
const entropy = new Entropy()
const string = entropy.string(bits)

console.log(`\n  Ten thousand potential strings with 1 in a million risk of repeat: ${string}\n`)

