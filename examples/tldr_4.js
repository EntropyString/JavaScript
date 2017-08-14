import {Random} from './entropy-string'
  
let random = new Random('0123456789ABCDEF')
let string = random.string(48)
console.log('\n  48-bit string using hex characters: ' + string + '\n')
