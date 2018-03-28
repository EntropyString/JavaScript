const { Random, Entropy, charset16 } = require('./entropy-string')

const random = new Random(charset16)
const bits = Entropy.bits(10000, 1000000)
const strings = []
for (let i = 0; i < 5; i += 1) {
  const string = random.string(bits)
  strings.push(string)
}
console.log(`\n  5 IDs: ${strings.join(', ')}\n`)
