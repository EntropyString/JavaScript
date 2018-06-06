// An efficient replacement to a UUID

const { Entropy } = require('./entropy-string')

const entropy = new Entropy()
const string = entropy.string()

console.log(`\n  An efficient replacement to using a UUID: ${string}\n`)
