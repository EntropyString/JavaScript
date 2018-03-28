const { default: Entropy, entropyBits, charset16 } = require('./entropy')

const entropy = new Entropy(charset16)
const bits = entropyBits(10000, 1000000)
const strings = []
for (let i = 0; i < 5; i += 1) {
  const string = entropy.string(bits)
  strings.push(string)
}
console.log(`\n  5 IDs: ${strings.join(', ')}\n`)
