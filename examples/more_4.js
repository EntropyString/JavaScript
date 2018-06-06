// 128 bit

const { Entropy } = require('./entropy-string')

const entropy = new Entropy({ bits: 128 })
const string = entropy.string()

console.log(`\n  128-bit entropy string: ${string}\n`)
