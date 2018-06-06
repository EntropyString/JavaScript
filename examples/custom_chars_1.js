// Custom characters: HT for coin flip

const { Entropy, charset2 } = require('./entropy-string')

const entropy = new Entropy({ charset: charset2, bits: 10 })
let flips = entropy.string()
console.log(`\n  10 flips: ${flips}`)

entropy.useChars('HT')
flips = entropy.string()
console.log(`\n  10 flips: ${flips}\n`)
