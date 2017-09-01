import {Random, Entropy, charSet16} from './entropy-string'

const random = new Random(charSet16)
const bits = Entropy.bits(10000, 1000000)
const strings = Array()
for (let i = 0; i < 5; i++) {
  const string = random.string(bits)
  strings.push(string)
}
console.log('\n  5 IDs: ' + strings.join(', ') + '\n')
