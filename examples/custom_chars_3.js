// Custom character errors

import {Random} from './entropy-string'

try {
  const random = new Random('123456')
}
catch(error) {
  console.log('\n  Error: ' + error.message)
}

try {
  const random = new Random('01233210')
}
catch(error) {
  console.log('\n  Error: ' + error.message + '\n')
}
