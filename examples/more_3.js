import {Random, Entropy} from './entropy-string'

let random = new Random()
let bits = Entropy.bitsWithPowers(10, 12)
let string = random.string(bits)
console.log('\n  Base 32 string : ' + string + '\n')
