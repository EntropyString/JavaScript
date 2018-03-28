// Custom characters: Uppercase hex

const { default: Entropy } = require('./entropy')

const entropy = new Entropy('0123456789ABCDEF')
const string = entropy.string(48)
console.log(`\n  Uppercase hex: ${string}\n`)
