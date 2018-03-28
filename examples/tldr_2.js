// Generate a potential of _1 million_ random strings with _1 in a billion_ chance of repeat using
// hexadecimal strings.

const { default: Entropy, charset16 } = require('./entropy')

const bits = Entropy.bits(1e6, 1e9)
const entropy = new Entropy(charset16)
const string = entropy.string(bits)

console.log(`\n  Potential 1 million random strings with 1 in a billion chance of repeat: ${string}\n`)
