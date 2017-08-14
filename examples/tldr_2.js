import {Random, charSet64} from './entropy-string'
  
let random = new Random()
let string = random.sessionID(charSet64)
console.log('\n  OWASP session ID using RFC 4648 file system and URL safe characters: ' + string + '\n')
