// Custom characters: HT for coin flip

const { Random, charset2 } = require('./entropy-string')

const random = new Random(charset2)
let flips = random.string(10)
console.log(`\n  10 flips: ${flips}`)

random.useChars('HT')
flips = random.string(10)
console.log(`\n  10 flips: ${flips}\n`)
