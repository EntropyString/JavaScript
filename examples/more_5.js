// 128 bit

const { Entropy, charset64 } = require('./entropy-string')

const entropy = new Entropy({ charset: charset64 })
const string = entropy.sessionID()

console.log(`\n  128-bit entropy session ID: ${string}\n`)
