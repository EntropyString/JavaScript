// Base 64 character 256 bit token

const { Random, charset64 } = require('./entropy-string')

const random = new Random(charset64)

const string = random.token()

console.log(`\n  256 bit token using RFC 4648 URL and file system safe characters: ${string}\n`)
