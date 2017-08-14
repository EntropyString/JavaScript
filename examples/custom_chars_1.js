import {Random, charSet2} from './entropy-string'

let random = new Random(charSet2)
let flips = random.string(10)
console.log('\n  10 flips: ' + flips + '\n')

random.useChars('HT')
flips = random.string(10)
console.log('\n  10 flips: ' + flips + '\n')

