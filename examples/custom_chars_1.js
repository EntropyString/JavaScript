// Custom characters: HT for coin flip

const { Random } = require('./entropy-string')
const { charset2 } = require('./entropy')

const random = new Random(charset2)
let flips = random.string(10)
console.log(`\n  10 flips: ${flips}`)

random.useChars('HT')
flips = random.string(10)
console.log(`\n  10 flips: ${flips}\n`)
