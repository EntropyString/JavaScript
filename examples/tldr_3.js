// Custom uppercase hexadecimal characters

const { default: Entropy } = require('./entropy')

const bits = Entropy.bits(1e6, 1e9)
const entropy = new Entropy('0123456789ABCDEF')
const string = entropy.string(bits)

console.log(`\n  Custom uppercase hexadecimal characters: ${string}\n`)
