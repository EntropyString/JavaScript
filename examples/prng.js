// Using PRNG (not default CSPRNG)

const { default: Entropy } = require('./entropy')

let entropy = new Entropy({ bits: 80, prng: true })
let string = entropy.string()
console.log(`\n  PRNG 80-bit string : ${string}\n`)

entropy = new Entropy({ total: 1e5, risk: 1e7, prng: true })
string = entropy.string()
console.log(`\n  10,000 potential strings with 1 in 10 million risk of repeat: ${string}\n`)
