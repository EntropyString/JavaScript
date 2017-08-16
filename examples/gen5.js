import {Random, Entropy, charSet16} from './entropy-string'

let random = new Random(charSet16)
let bits = Entropy.bits(10000, 1000000)
let strings = Array()
for (let i = 0; i < 5; i++) {
  let string = random.string(bits)
  strings.push(string)
}
console.log('\n  5 IDs: ' + strings.join(', ') + '\n')
