// Generate a potential of _1 million_ random strings with _1 in a billion_ chance of repeat using
// hexadecimal strings.

const { Entropy, charset16 } = require('./entropy-string')

const entropy = new Entropy({ total: 1e6, risk: 1e9, charset: charset16 })
const string = entropy.string()

console.log(`\n  Potential 1 million random strings with 1 in a billion chance of repeat: ${string}\n`)
