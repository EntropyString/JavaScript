// Base 16 (hex) and base 4

const {
  Random, charset16, charset4
} = require('./entropy-string')

const { entropyBits } = require('./entropy')

console.log('\n  30 potential strings with 1 in a million risk of repeat: \n')

const random = new Random(charset16)
const bits = entropyBits(30, 100000)
let string = random.string(bits)
console.log(`    Base 16: ${string}\n`)

random.use(charset4)
string = random.string(bits)
console.log(`    Base 4 : ${string}\n`)
