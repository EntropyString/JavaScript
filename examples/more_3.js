// Ten billion potential strings with 1 in a trillion risk of repeat

const { Random } = require('./entropy-string')
const { entropyBits } = require('./entropy')

const random = new Random()
const bits = entropyBits(1e10, 1e12)
const string = random.string(bits)

console.log(`\n  Ten billion potential strings with 1 in a trillion risk of repeat: ${string}\n`)
