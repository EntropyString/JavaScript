// Custom uppercase hexadecimal characters

import {Random, Entropy} from './entropy-string'
  
const random = new Random('0123456789ABCDEF')
const bits = Entropy.bitsWithPowers(6, 9)

const string = random.string(bits)

console.log('\n  Custom uppercase hexadecimal characters: ' + string + '\n')
