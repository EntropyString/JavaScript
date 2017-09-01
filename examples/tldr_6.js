// OWASP session ID using RFC 4648 file system and URL safe characters

import {Random, charSet64} from './entropy-string'
  
const random = new Random(charSet64)
const string = random.sessionID()

console.log('\n  OWASP session ID using RFC 4648 file system and URL safe characters: ' + string + '\n')
