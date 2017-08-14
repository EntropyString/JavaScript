import {Random} from './entropy-string'
  
let random = new Random()
let string = random.sessionID()
console.log('\n  OWASP session ID using base32 characters: ' + string + '\n')
