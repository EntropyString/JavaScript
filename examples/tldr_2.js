// Generate a potential of _1 million_ random strings with _1 in a billion_ chance of repeat using
// hexadecimal strings.

import {Random, Entropy, charSet16} from './entropy-string'
  
const random = new Random(charSet16)
const bits = Entropy.bits(1e6, 1e9)

const string = random.string(bits)

console.log('\n  Potential 1 million random strings with 1 in a billion chance of repeat: ' + string  + '\n')
