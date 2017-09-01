// Small ID with 1 in a million chance of repeat for 30 strings

import {Random} from './entropy-string'
  
const random = new Random()
const string = random.smallID()

console.log('\n  Small ID with 1 in a million chance of repeat for 30 strings: ' + string + '\n')
