// Custom uppercase hexadecimal characters

const { Entropy } = require('./entropy-string')

const entropy = new Entropy({ total: 1e6, risk: 1e9, charset: '0123456789ABCDEF' })
const string = entropy.string()

console.log(`\n  Custom uppercase hexadecimal characters: ${string}\n`)
