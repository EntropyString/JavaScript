// Base 16 (hex) and base 4

const {
  Entropy,
  charset16, charset4
} = require('./entropy-string')

console.log('\n  30 potential strings with 1 in a million risk of repeat: \n')

const entropy = new Entropy({ total: 30, risk: 100000, charset: charset16 })
let string = entropy.string()
console.log(`    Base 16: ${string}\n`)

entropy.use(charset4)
string = entropy.string()
console.log(`    Base 4 : ${string}\n`)
