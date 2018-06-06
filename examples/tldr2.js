// Base32 string with a 1 in a trillion chance of repeat in 10 million strings

const { Entropy } = require('./entropy-string')

const entropy = new Entropy({ total: 1e7, risk: 1e12 })
const string = entropy.string()

console.log(`\n  Base32 string with a 1 in a trillion chance of repeat in 10 million strings: ${string}\n`)
