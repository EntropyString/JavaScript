// Ten thousand potential strings with 1 in a million risk of repeat

const { Random, Entropy } = require('./entropy-string')

const random = new Random()
const bits = Entropy.bits(10000, 1000000)
const string = random.string(bits)

console.log(`\n  Ten thousand potential strings with 1 in a million risk of repeat: ${string}\n`)

