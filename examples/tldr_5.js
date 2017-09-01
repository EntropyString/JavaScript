// OWASP session ID using base32 characters

import {Random} from './entropy-string'
  
const random = new Random()
const string = random.sessionID()

console.log('\n  OWASP session ID using base32 characters: ' + string + '\n')
