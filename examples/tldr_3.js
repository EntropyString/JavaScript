// Custom uppercase hexadecimal characters

const { default: Entropy, entropyBits } = require('./entropy')

const entropy = new Entropy('0123456789ABCDEF')
const bits = entropyBits(1e6, 1e9)

const string = entropy.string(bits)

console.log(`\n  Custom uppercase hexadecimal characters: ${string}\n`)
