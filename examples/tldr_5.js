// OWASP session ID using base32 characters

const { Entropy } = require('./entropy-string')

const entropy = new Entropy()
const string = entropy.sessionID()

console.log(`\n  OWASP session ID using base32 characters: ${string}\n`)
