// Custom characters: HT for coin flip

const { default: Entropy, charset2 } = require('./entropy')

const entropy = new Entropy(charset2)
let flips = entropy.string(10)
console.log(`\n  10 flips: ${flips}`)

entropy.useChars('HT')
flips = entropy.string(10)
console.log(`\n  10 flips: ${flips}\n`)
