// Ten thousand potential strings with 1 in a million risk of repeat

const { Entropy } = require('./entropy-string')

const entropy = new Entropy({ total: 10000, risk: 1e6 })
const string = entropy.string()

console.log(`\n  Ten thousand potential strings with 1 in a million risk of repeat: ${string}\n`)
