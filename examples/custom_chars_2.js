// Custom characters: Uppercase hex

import {Random} from './entropy-string'

const random = new Random('0123456789ABCDEF')
const string = random.string(48)
console.log('\n  Uppercase hex: ' + string + '\n')
