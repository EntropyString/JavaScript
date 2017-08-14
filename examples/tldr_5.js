import {Random, Entropy} from './entropy-string'
  
let bits = Entropy.bits(30, 1000000)
let random = new Random()
let string = random.string(bits)
console.log('\n  Base 32 character string with a 1 in a million chance of a repeat in 30 strings: ' + string + '\n')
