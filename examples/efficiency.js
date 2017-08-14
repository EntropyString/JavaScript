import {Random} from './entropy-string'

let random = new Random()
let string = random.string(80)
console.log('\n  CSPRNG base 32 80-bit string : ' + string)

string = random.stringRandom(80)
console.log('\n  PRNG base 32 80-bit string : ' + string + '\n')

