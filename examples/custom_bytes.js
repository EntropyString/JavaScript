// Custom bytes

import {Random} from './entropy-string'

const random = new Random()
const bytes = Buffer.from([250, 200, 150, 100])
let string = random.stringWithBytes(30, bytes)
console.log('\n  Custom bytes string : ' + string + '\n')

try {
  string = random.stringWithBytes(32, bytes)
}
catch(error) {
  console.log('  Error: ' + error.message + '\n')
}

