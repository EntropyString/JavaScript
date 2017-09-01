// Custom characters: HT for coin flip

import {Random, charSet2} from './entropy-string'

const random = new Random(charSet2)
let flips = random.string(10)
console.log('\n  10 flips: ' + flips)

random.useChars('HT')
flips = random.string(10)
console.log('\n  10 flips: ' + flips + '\n')
