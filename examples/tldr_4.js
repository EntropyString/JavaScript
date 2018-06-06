// Small ID with 1 in a million chance of repeat for 30 strings

const { Entropy } = require('./entropy-string')

const entropy = new Entropy()
const string = entropy.smallID()

console.log(`\n  Small ID has 1 in a million chance of repeat for 30 strings: ${string}\n`)
