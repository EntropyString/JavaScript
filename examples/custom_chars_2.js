// Custom characters: Uppercase hex

const { default: Entropy } = require('./entropy')

const entropy = new Entropy({ charset: '0123456789ABCDEF', bits: 48 })
const string = entropy.string()
console.log(`\n  Uppercase hex: ${string}\n`)
