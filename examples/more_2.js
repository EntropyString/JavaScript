// Base 16 (hex) and base 4

const {
  default: Entropy,
  entropyBits, charset16, charset4
} = require('./entropy')

console.log('\n  30 potential strings with 1 in a million risk of repeat: \n')

const entropy = new Entropy(charset16)
const bits = entropyBits(30, 100000)
let string = entropy.string(bits)
console.log(`    Base 16: ${string}\n`)

entropy.use(charset4)
string = entropy.string(bits)
console.log(`    Base 4 : ${string}\n`)
