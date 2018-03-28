// Custom characters: Uppercase hex

const { Random } = require('./entropy-string')

const random = new Random('0123456789ABCDEF')
const string = random.string(48)
console.log(`\n  Uppercase hex: ${string}\n`)
