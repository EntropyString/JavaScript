import {Random, Entropy, charSet16, charSet4} from './entropy-string'

let bits = Entropy.bits(30, 100000)
let random = new Random(charSet16)
let string = random.string(bits)
console.log('\n  Base 16 string : ' + string)

random.use(charSet4)
string = random.string(bits)
console.log('\n  Base 4 string : ' + string + '\n')
