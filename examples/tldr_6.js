// Base 64 character 256 bit token

const { Entropy, charset64 } = require('./entropy-string')

const entropy = new Entropy({ charset: charset64 })
const string = entropy.token()

console.log(`\n  256 bit token using RFC 4648 URL and file system safe characters: ${string}\n`)
