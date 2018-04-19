// An efficient replacement to a UUID

const { default: Entropy } = require('./entropy')

const entropy = new Entropy()
const string = entropy.string()

console.log(`\n  An efficient replacement to using a UUID: ${string}\n`)
