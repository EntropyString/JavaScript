import {Random} from './entropy-string'

let random = new Random()
let string = random.string(128)
console.log('\n  Base 32 session ID: ' + string + '\n')
