// Custom uppercase hexadecimal characters

const { Random } = require('./entropy-string')
const { entropyBits } = require('./entropy')

const random = new Random('0123456789ABCDEF')
const bits = entropyBits(1e6, 1e9)

const string = random.string(bits)

console.log(`\n  Custom uppercase hexadecimal characters: ${string}\n`)
