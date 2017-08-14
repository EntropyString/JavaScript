import {Random, Entropy} from './entropy-string'

let bits = Entropy.bits(10000, 1000000)
let random = new Random()
let string = random.string(bits)
console.log('\n  Base 32 string : ' + string + '\n')

