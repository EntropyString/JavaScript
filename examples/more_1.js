import {Random, Entropy} from './entropy-string'

let random = new Random()
let bits = Entropy.bits(10000, 1000000)
let string = random.string(bits)
console.log('\n  Base 32 string : ' + string + '\n')

