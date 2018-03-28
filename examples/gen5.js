const { default: Entropy, charset16 } = require('./entropy')

const bits = Entropy.bits(10000, 1000000)
const entropy = new Entropy(charset16)
const strings = []
for (let i = 0; i < 5; i += 1) {
  const string = entropy.string(bits)
  strings.push(string)
}
console.log(`\n  5 IDs: ${strings.join(', ')}\n`)
