import {Random} from './entropy-string'

try {
  let random = new Random('123456')
}
catch(error) {
  console.log('Error: ' + error.message)
}


try {
  let random = new Random('01233210')
}
catch(error) {
  console.log('Error: ' + error.message)
}
