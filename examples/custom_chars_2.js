import {Random} from './entropy-string'

let random = new Random('0123456789ABCDEF')
let string = random.string(48)
console.log('\n  Uppercase hex: ' + string + '\n')
