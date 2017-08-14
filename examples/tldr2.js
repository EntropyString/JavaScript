import {Random, Entropy} from './entropy-string'
  
let bits = Entropy.bitsWithPowers(6,9)
let random = new Random()
let string = random.string(bits)
console.log('\n  Base32 string with a 1 in a billion chance of repeat in a million strings: ' + string + '\n')
