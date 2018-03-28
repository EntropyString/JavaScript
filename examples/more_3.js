// Ten billion potential strings with 1 in a trillion risk of repeat

const { Random, Entropy } = require('./entropy-string')

const random = new Random()
const bits = Entropy.bits(1e10, 1e12)
const string = random.string(bits)

console.log(`\n  Ten billion potential strings with 1 in a trillion risk of repeat: ${string}\n`)
