// Ten thousand potential strings with 1 in a million risk of repeat

const { Random, Entropy } = require('./entropy-string')
const { entropyBits } = require('./entropy')

const random = new Random()
const bits = entropyBits(10000, 1000000)
const string = random.string(bits)

console.log(`\n  Ten thousand potential strings with 1 in a million risk of repeat: ${string}\n`)

