// Base 64 character 256 bit token

const { Random } = require('./entropy-string')
const { charset64 } = require('./entropy')

const random = new Random(charset64)
const string = random.token()

console.log(`\n  256 bit token using RFC 4648 URL and file system safe characters: ${string}\n`)
