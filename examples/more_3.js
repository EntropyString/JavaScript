import {Random, Entropy} from './entropy-string'

let bits = Entropy.bitsWithPowers(10, 12)
let random = new Random()
let string = random.string(bits)
console.log('\n  Base 32 string : ' + string + '\n')
