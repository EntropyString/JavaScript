// Ten billion potential strings with 1 in a trillion risk of repeat

const { default: Entropy } = require('./entropy')

const entropy = new Entropy({ total: 1e10, risk: 1e12 })
const string = entropy.string()

console.log(`\n  Ten billion potential strings with 1 in a trillion risk of repeat: ${string}\n`)
