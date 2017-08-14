import {Random, charSet64} from './entropy-string'

let random = new Random(charSet64)
let string = random.sessionID()
console.log('\n  Base 64 session ID: ' + string + '\n')
