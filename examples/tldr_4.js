// Small ID with 1 in a million chance of repeat for 30 strings

const { Random } = require('./entropy-string')

const random = new Random()
const string = random.smallID()

console.log(`\n  Small ID has 1 in a million chance of repeat for 30 strings: ${string}\n`)
