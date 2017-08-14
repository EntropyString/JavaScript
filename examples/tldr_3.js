import {Random, charSet16} from './entropy-string'
  
let random = new Random(charSet16)
let string = random.string(48)
console.log('\n  48-bit string using hex characters: ' + string  + '\n')
