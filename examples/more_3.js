// Ten billion potential strings with 1 in a trillion risk of repeat

const { default: Entropy } = require('./entropy')

const bits = Entropy.bits(1e10, 1e12)
const entropy = new Entropy()
const string = entropy.string(bits)

console.log(`\n  Ten billion potential strings with 1 in a trillion risk of repeat: ${string}\n`)
