// 128 bit

const { default: Entropy } = require('./entropy')

const entropy = new Entropy({ bits: 128 })
const string = entropy.string()

console.log(`\n  128-bit entropy string: ${string}\n`)
