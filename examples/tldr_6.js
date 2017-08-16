import {Random, Entropy, charSet64} from './entropy-string'

let random = new Random(charSet64)
let bits = Entropy.bitsWithPowers(7, 12)
let string = random.string(bits)
console.log('\n  Base 64 character string with a 1 in a trillion chance of a repeat in 100 million strings: ' + string + '\n')
